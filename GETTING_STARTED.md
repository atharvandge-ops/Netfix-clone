# Getting Started with Netflix Clone

This is the simplest guide to get you up and running. If you encounter issues, see `QUICKSTART.md` for detailed troubleshooting.

## Prerequisites

Install these first:
1. **Node.js** - https://nodejs.org/ (version 16+)
2. **MongoDB** - https://www.mongodb.com/try/download/community OR use MongoDB Atlas (cloud)

## Quick Setup (5 Steps)

### Step 1: Install Everything

Open terminal in `C:\work\netflix-clone`:

```bash
npm run install-all
```

⏱️ This takes 2-3 minutes.

### Step 2: Get Free API Keys

**A) Stripe (Payment Processing):**
1. Sign up at https://stripe.com
2. Go to Developers > API keys
3. Copy your test keys (they start with `sk_test_` and `pk_test_`)

**B) Cloudinary (Video Storage):**
1. Sign up at https://cloudinary.com (free tier)
2. Go to Dashboard
3. Copy: Cloud Name, API Key, API Secret

### Step 3: Configure Environment

**Backend:**

Create `server/.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/netflix-clone
JWT_SECRET=any-random-string-here
JWT_REFRESH_SECRET=another-random-string-here
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:3000
```

**Frontend:**

Create `client/.env` file:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_YOUR_KEY_HERE
```

### Step 4: Initialize Database

```bash
cd server
node utils/seedData.js
cd ..
```

✅ This creates subscription plans and admin account.

### Step 5: Start the App

```bash
npm run dev
```

✅ Frontend: http://localhost:3000
✅ Backend: http://localhost:5000

## First Login

**Admin Account:**
- Email: `admin@streamflix.com`
- Password: `admin123`

**Test Payment:**
- Card: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits

## What to Do First

1. **Visit** http://localhost:3000
2. **Create account** (Sign Up button)
3. **Subscribe** to a plan with test card
4. **Browse** videos (empty at first)
5. **Login as admin** to upload content
6. **Upload** a test video
7. **Browse** and watch as regular user

## File Locations

- **Project root:** `C:\work\netflix-clone`
- **Backend:** `C:\work\netflix-clone\server`
- **Frontend:** `C:\work\netflix-clone\client`

## Common Commands

```bash
# Install everything
npm run install-all

# Start both servers
npm run dev

# Start backend only
npm run server

# Start frontend only
npm run client

# Seed database
cd server && node utils/seedData.js

# Stop servers
Ctrl+C in terminal
```

## Troubleshooting

**MongoDB not connecting?**
- Start MongoDB: Open Command Prompt as Admin, run `mongod`
- Or use MongoDB Atlas (cloud) and update connection string

**Port already in use?**
```bash
npx kill-port 3000
npx kill-port 5000
```

**npm install fails?**
```bash
npm cache clean --force
rm -rf node_modules
npm install
```

## What You Get

✅ Working streaming platform
✅ User authentication
✅ Payment processing
✅ Video uploads
✅ Search functionality
✅ Admin dashboard
✅ Analytics tracking
✅ Responsive design

## Need More Help?

- **Quick Start:** See `QUICKSTART.md`
- **API Docs:** See `API.md`
- **Features:** See `FEATURES.md`
- **Deployment:** See `DEPLOYMENT.md`
- **Architecture:** See `ARCHITECTURE.md`

## Important Notes

- Use Stripe **test mode** for development
- Test card will not charge real money
- Videos are stored in Cloudinary
- MongoDB can be local or cloud (Atlas)
- Change admin password in production!

---

That's it! You're ready to stream. 🎬

Enjoy building your streaming platform!
