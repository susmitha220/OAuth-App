// ─── Protect Routes (must be logged in) ─────────────────────────────────────
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({
    success: false,
    message: 'Unauthorized. Please login first.',
  });
};

// ─── Redirect if already logged in ──────────────────────────────────────────
const isNotAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/dashboard');
};

module.exports = { isAuthenticated, isNotAuthenticated };
