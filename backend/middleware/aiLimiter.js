const rateLimit = require('express-rate-limit');
const { ipKeyGenerator } = require('express-rate-limit');

// Separate, stricter limit for the AI route so OpenAI costs can't run away.
// Keyed by the Clerk userId (set in requireAuth), falling back to IP.
// IPv6 is normalized with the ipKeyGenerator helper, as express-rate-limit v8
// requires, so a whole IPv6 block isn't treated as a single user.
const aiLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  max: 20,                  // 20 AI requests / 10 min / user
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.userId || ipKeyGenerator(req.ip),
  message: { error: 'Assistant is resting. Try again in a little while.' },
});

module.exports = aiLimiter;