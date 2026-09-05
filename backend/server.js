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
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'none'"],
      frameAncestors: ["'none'"]
    }
  },
  crossOriginResourcePolicy: { policy: 'same-site' },
  referrerPolicy: { policy: 'no-referrer' }
}));

// Restrict browser features the API doesn't need
app.use((req, res, next) => {
  res.setHeader(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=(), payment=()'
  );
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
      callback(new Error('CORS: origin not allowed'));
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

// Clerk: reads the session token and attaches auth info to requests
app.use(clerkMiddleware());

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Nimeoniter backend running' });
});

// --- Routes ---
app.use('/api/config', require('./routes/config'));
app.use('/api/state', require('./routes/state'));

// Unknown routes: clean 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Central error handler, no stack trace leaked to the client
app.use((err, req, res, next) => {
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