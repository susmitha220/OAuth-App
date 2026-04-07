require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const passport = require('./config/passport');
const authRoutes = require('./routes/auth');
const { isAuthenticated } = require('./middleware/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Connect to MongoDB ──────────────────────────────────────────────────────
connectDB();

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5000',
    credentials: true,
  })
);

// ─── Session Config ──────────────────────────────────────────────────────────
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'fallback_secret_change_this',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: 'sessions',
      ttl: 7 * 24 * 60 * 60, // 7 days
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    },
  })
);

// ─── Passport Init ───────────────────────────────────────────────────────────
app.use(passport.initialize());
app.use(passport.session());

// ─── Static Files (Frontend) ─────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ─── Auth Routes ─────────────────────────────────────────────────────────────
app.use('/auth', authRoutes);

// ─── Dashboard Route (Protected) ─────────────────────────────────────────────
app.get('/dashboard', isAuthenticated, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// ─── Home Route ───────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/dashboard');
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─── API: Get All Users (admin-only demo) ────────────────────────────────────
const User = require('./models/User');
app.get('/api/users', isAuthenticated, async (req, res) => {
  try {
    const users = await User.find({}).select('-__v').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
});
