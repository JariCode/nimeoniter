require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const { clerkMiddleware } = require('@clerk/express');

const sanitize = require('./middleware/sanitize');
const limiter = require('./middleware/rateLimiter');

const app = express();

// Render is behind a reverse proxy; trust the first proxy so rate limiting works
app.set('trust proxy', 1);

// Security headers, tuned for an API backend that serves no HTML
app.use(helmet({
  // useDefaults: false — Helmet's default directives are meant for HTML pages
  // (they re-add script/style sources and 'unsafe-inline'); a JSON API needs
  // nothing loaded at all
  contentSecurityPolicy: {
    useDefaults: false,
    directives: {
      defaultSrc: ["'none'"],
      baseUri: ["'none'"],
      formAction: ["'none'"],
      frameAncestors: ["'none'"]
    }
  },
  frameguard: { action: 'deny' },
  crossOriginResourcePolicy: { policy: 'same-site' },
  referrerPolicy: { policy: 'no-referrer' }
}));

// Restrict browser features the API doesn't need, and never let browsers or
// proxies cache API responses (they carry per-player data)
app.use((req, res, next) => {
  res.setHeader(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=(), payment=()'
  );
  res.setHeader('Cache-Control', 'no-store');
  next();
});

// Hide the Express fingerprint
app.disable('x-powered-by');

// Read allowed origins from env, split into an array
const allowedOrigins = process.env.ALLOWED_ORIGIN
  ? process.env.ALLOWED_ORIGIN.split(',').map((origin) => origin.trim())
  : [];

// Allow frontend calls (and credentials for Clerk's session token)
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      const err = new Error('CORS: origin not allowed');
      err.status = 403;
      callback(err);
    }
  },
  credentials: true,
}));

// Clerk webhooks — must come BEFORE express.json() because it needs the raw body
app.use('/api/webhooks', require('./routes/webhooks'));

// Cap request body size
app.use(express.json({ limit: '100kb' }));

// NoSQL injection protection
app.use(sanitize);

// Rate limiting
app.use(limiter);

// Clerk: reads the session token and attaches auth info to requests. Only
// tokens issued for our own frontend origin(s) are accepted — the same list
// CORS allows (ALLOWED_ORIGIN) — so a token minted for another site can't be
// replayed against this API.
app.use(clerkMiddleware({ authorizedParties: allowedOrigins }));

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Nimeoniter backend running' });
});

// --- Routes ---
app.use('/api/config', require('./routes/config'));
app.use('/api/state', require('./routes/state'));
app.use('/api/assistant', require('./routes/assistant'));

// Unknown routes: clean 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Central error handler, no stack trace or error message leaked to the client
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: 'Request body too large' });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON' });
  }
  const status = err.status || err.statusCode;
  if (status >= 400 && status <= 499) {
    return res.status(status).json({ error: status === 403 ? 'Forbidden' : 'Bad request' });
  }
  console.error('Unhandled error', err);
  res.status(500).json({ error: 'Server error' });
});

// Database connection from env, then start the server
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed', err);
  });