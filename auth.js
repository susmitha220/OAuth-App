const express = require('express');
const passport = require('passport');
const { isAuthenticated } = require('../middleware/authMiddleware');
const router = express.Router();

// ─── Google OAuth ────────────────────────────────────────────────────────────
// Step 1: Redirect to Google
router.get('/google', (req, res, next) => {
  if (req.isAuthenticated()) {
    req.logout((err) => {
      if (err) return next(err);
      passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' })(req, res, next);
    });
  } else {
    passport.authenticate('google', { scope: ['profile', 'email'], prompt: 'select_account' })(req, res, next);
  }
});

// Step 2: Google callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/?error=google_failed',
    session: true,
  }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

// ─── GitHub OAuth ────────────────────────────────────────────────────────────
// Step 1: Redirect to GitHub
router.get('/github', (req, res, next) => {
  if (req.isAuthenticated()) {
    req.logout((err) => {
      if (err) return next(err);
      passport.authenticate('github', { scope: ['user:email'] })(req, res, next);
    });
  } else {
    passport.authenticate('github', { scope: ['user:email'] })(req, res, next);
  }
});

// Step 2: GitHub callback
router.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/?error=github_failed',
    session: true,
  }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

// ─── Get Current User ────────────────────────────────────────────────────────
router.get('/me', isAuthenticated, (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      avatar: req.user.avatar,
      provider: req.user.provider,
      githubUsername: req.user.githubUsername,
      createdAt: req.user.createdAt,
      lastLogin: req.user.lastLogin,
    },
  });
});

// ─── Logout ──────────────────────────────────────────────────────────────────
router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.redirect('/');
    });
  });
});

// ─── Check Auth Status ───────────────────────────────────────────────────────
router.get('/status', (req, res) => {
  res.json({
    isAuthenticated: req.isAuthenticated(),
    user: req.isAuthenticated()
      ? {
          id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          avatar: req.user.avatar,
          provider: req.user.provider,
        }
      : null,
  });
});

module.exports = router;
