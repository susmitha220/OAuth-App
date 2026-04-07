# 🔐 AuthFlow — OAuth App (Google + GitHub)

Full-stack OAuth authentication app built with:
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js + Express
- **Database**: MongoDB + Mongoose
- **Auth**: Passport.js (Google OAuth 2.0 + GitHub OAuth)

---

## 📁 Project Structure

```
oauth-app/
├── config/
│   ├── db.js              # MongoDB connection
│   └── passport.js        # OAuth strategies
├── middleware/
│   └── authMiddleware.js  # Route protection
├── models/
│   └── User.js            # User schema
├── routes/
│   └── auth.js            # Auth routes
├── public/
│   ├── index.html         # Login page
│   └── dashboard.html     # Dashboard page
├── server.js              # Main server
├── package.json
├── .env.example
└── README.md
```

---

## ⚙️ Setup Instructions

### Step 1: Install Dependencies
```bash
cd oauth-app
npm install
```

### Step 2: Setup Environment Variables
```bash
cp .env.example .env
```
Then fill in your credentials in `.env`

### Step 3: Get Google OAuth Credentials
1. Go to https://console.cloud.google.com/
2. Create a new project
3. Go to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client ID**
5. Set Authorized redirect URI: `http://localhost:5000/auth/google/callback`
6. Copy **Client ID** and **Client Secret** → paste in `.env`

### Step 4: Get GitHub OAuth Credentials
1. Go to https://github.com/settings/developers
2. Click **New OAuth App**
3. Set Homepage URL: `http://localhost:5000`
4. Set Authorization callback URL: `http://localhost:5000/auth/github/callback`
5. Copy **Client ID** and **Client Secret** → paste in `.env`

### Step 5: Start MongoDB
```bash
# Local MongoDB
mongod

# OR use MongoDB Atlas (cloud) - just update MONGO_URI in .env
```

### Step 6: Run the App
```bash
# Development (auto-restart)
npm run dev

# Production
npm start
```

Open: http://localhost:5000

---

## 🔗 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/auth/google` | Start Google OAuth |
| GET | `/auth/google/callback` | Google OAuth callback |
| GET | `/auth/github` | Start GitHub OAuth |
| GET | `/auth/github/callback` | GitHub OAuth callback |
| GET | `/auth/me` | Get current user (protected) |
| GET | `/auth/status` | Check auth status |
| GET | `/auth/logout` | Logout user |
| GET | `/api/users` | Get all users (protected) |
| GET | `/dashboard` | Dashboard page (protected) |

---

## 🛡️ Security Features
- Sessions stored in MongoDB (not memory)
- HTTP-only cookies
- CORS protection
- Route-level authentication middleware
- Secure cookies in production

---

## 🚀 Deploy to Production
1. Set `NODE_ENV=production` in `.env`
2. Update `APP_URL` and `CLIENT_URL` to your domain
3. Update OAuth callback URLs in Google & GitHub consoles
4. Use MongoDB Atlas for cloud database
