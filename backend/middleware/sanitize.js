// NoSQL injection protection for Express 5.
// Recursively strips keys that start with '$' or contain '.', which are the
// operators an attacker could use to manipulate MongoDB queries.
// We only sanitize the request body (Express 5 makes req.query read-only).

function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;

  for (const key of Object.keys(obj)) {
    if (key.startsWith('$') || key.includes('.')) {
      delete obj[key];
      continue;
    }
    // Recurse into nested objects and arrays
    if (obj[key] && typeof obj[key] === 'object') {
      sanitizeObject(obj[key]);
    }
  }
  return obj;
}

function sanitize(req, res, next) {
  if (req.body) {
    sanitizeObject(req.body);
  }
  next();
}

module.exports = sanitize;