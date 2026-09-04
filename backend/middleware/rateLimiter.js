const rateLimit = require('express-rate-limit');

// Cap requests per IP to protect the API
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = limiter;