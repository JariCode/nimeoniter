const { getAuth } = require('@clerk/express');

// Protects API routes: allows the request only if a valid Clerk session exists.
// Uses getAuth() (the current approach) and returns a 401 instead of redirecting,
// since this is an API consumed by a separate frontend origin.
function requireAuth(req, res, next) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  // Make the user id available to route handlers
  req.userId = userId;
  next();
}

module.exports = requireAuth;