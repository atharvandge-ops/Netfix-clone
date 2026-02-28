# Netflix Clone - Quick Start Guide

Welcome to the Netflix Clone project! This guide will help you get the application running locally in minutes.

## What You're Building

A full-featured video streaming platform with:
- User authentication and profiles
- Subscription-based access (Stripe payments)
- Video streaming with progress tracking
- Search and filtering
- Admin dashboard for content management
- Analytics and viewing history

## Prerequisites

Before you begin, ensure you have:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - [Download here](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier)
- **Git** - [Download here](https://git-scm.com/)

## Step-by-Step Setup

### 1. Verify Prerequisites

```bash
node --version    # Should be v16 or higher
npm --version     # Should be 8 or higher
```

### 2. Navigate to Project Directory

The project is already created at:
```
C:\work\netflix-clone
```

### 3. Install Dependencies

Open terminal in the project root and run:

```bash
npm run install-all
```

This installs dependencies for both frontend and backend (takes 2-3 minutes).

### 4. Set Up Environment Variables

**Backend Configuration:**

```bash
cd server
copy .env.example .env
```

Edit `server\.env` with a text editor and update these required values:

```env
# Use local MongoDB (or paste MongoDB Atlas connection string)
MONGODB_URI=mongodb://localhost:27017/netflix-clone

# Generate random secrets (use any random string)
JWT_SECRET=mysupersecretkey123456789
JWT_REFRESH_SECRET=myrefreshsecretkey987654321

# For testing, you can use Stripe test keys (get from https://stripe.com)
STRIPE_SECRET_KEY=sk_test_your_test_key_here
STRIPE_WEBHOOK_SECRET=whsec_test_webhook_secret

# For testing, use Cloudinary (free tier - sign up at https://cloudinary.com)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Frontend Configuration:**

```bash
cd ..\client
copy .env.example .env
```

Edit `client\.env`:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_your_publishable_key_here
```

### 5. Seed the Database

This creates subscription plans and an admin user:

```bash
cd ..\server
node utils\seedData.js
```

You should see:
```
Connected to MongoDB
Plans seeded successfully
Admin user created: admin@streamflix.com / admin123
Database seeding completed
```

### 6. Start the Application

**Option A: Start Both Servers Together (Recommended)**

From project root:
```bash
npm run dev
```

**Option B: Start Servers Separately**

Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client
npm start
```

### 7. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Health Check:** http://localhost:5000/health

## First Steps

### Create Your First Account

1. Go to http://localhost:3000
2. Click "Get Started" or "Sign Up"
3. Create an account with your email

### Access Admin Panel

Login with the seeded admin account:
- **Email:** admin@streamflix.com
- **Password:** admin123

Then navigate to: http://localhost:3000/admin

### Upload Your First Video

1. Login as admin
2. Go to Admin Dashboard
3. Click "Upload New Video"
4. Fill in video details
5. Upload a video file and thumbnail

**Note:** For testing, use small video files (under 50MB) to avoid long upload times.

## Common Issues & Solutions

### Issue: MongoDB Connection Failed

**Solution:**
- Ensure MongoDB is running: `mongod` (or MongoDB service is started)
- Check connection string in `server/.env`
- For Atlas, ensure IP is whitelisted

### Issue: Port Already in Use

**Solution:**
```bash
# Kill process on port 5000 (backend)
npx kill-port 5000

# Kill process on port 3000 (frontend)
npx kill-port 3000
```

### Issue: Module Not Found

**Solution:**
```bash
# Reinstall dependencies
cd server
rm -rf node_modules
npm install

cd ../client
rm -rf node_modules
npm install
```

### Issue: Stripe Payment Fails

**Solution:**
- Verify Stripe API keys in environment files
- Use Stripe test card: 4242 4242 4242 4242
- Any future expiry date, any CVC

### Issue: Video Upload Fails

**Solution:**
- Verify Cloudinary credentials in `server/.env`
- Check file size (max 500MB)
- Ensure file format is supported (MP4, MOV, WebM)

## Test Accounts

After seeding, you have:

**Admin Account:**
- Email: admin@streamflix.com
- Password: admin123
- Access: Full admin privileges

**Test User:**
- Create via registration page
- No subscription by default
- Subscribe via Pricing page

## Project Structure

```
netflix-clone/
├── client/              # React frontend (port 3000)
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API calls
│   │   ├── store/       # Redux state management
│   │   ├── contexts/    # React contexts
│   │   └── hooks/       # Custom hooks
│   └── package.json
│
├── server/              # Node.js backend (port 5000)
│   ├── controllers/     # Business logic
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── utils/           # Helper functions
│   └── package.json
│
└── package.json         # Root scripts
```

## Key Features to Test

1. **Authentication Flow**
   - Register new account
   - Login/logout
   - Protected routes

2. **Subscription**
   - View plans
   - Subscribe with test card
   - Access premium content

3. **Video Browsing**
   - Browse catalog
   - Search videos
   - Filter by genre/category

4. **Video Playback**
   - Play videos
   - Progress tracking
   - Add to favorites

5. **Admin Functions**
   - Upload videos
   - Manage content
   - View analytics

## Next Steps

- Configure Stripe products and webhooks
- Add real video content
- Customize UI/branding
- Set up email notifications
- Deploy to production

## Development Tips

- Backend changes require server restart (use `npm run dev` with nodemon for auto-restart)
- Frontend hot-reloads automatically
- Check browser console and server terminal for errors
- Use MongoDB Compass to view database contents
- Test with Stripe test mode before going live

## Getting Help

- Check `DEPLOYMENT.md` for production deployment
- Review `README.md` for project overview
- Consult API endpoints in the plan file

## Stopping the Application

Press `Ctrl+C` in the terminal(s) running the servers.

---

Happy coding! 🎬
