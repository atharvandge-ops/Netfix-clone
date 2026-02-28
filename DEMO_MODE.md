# 🎭 Demo Mode - No API Keys Required!

This Netflix Clone includes a **Demo Mode** that lets you test the entire application without requiring Stripe or Cloudinary accounts!

## ✨ What is Demo Mode?

Demo Mode automatically activates when:
- `DEMO_MODE=true` in `server/.env`, OR
- Stripe/Cloudinary API keys are not configured

In Demo Mode:
- ✅ **No Stripe account needed** - Subscriptions activate instantly
- ✅ **No Cloudinary account needed** - Uses sample videos/images
- ✅ **Full functionality** - Everything works for testing
- ✅ **Zero configuration** - Just run and test!

## 🚀 Quick Start (3 Steps)

### Step 1: Ensure Demo Mode is Enabled

Open `server/.env` and verify:

```env
DEMO_MODE=true
```

### Step 2: Set Up MongoDB

**Option A: MongoDB Atlas (5 minutes, no install)**
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create free cluster
3. Get connection string
4. Update `MONGODB_URI` in `server/.env`

**Option B: Install MongoDB Locally**
1. Download from https://www.mongodb.com/try/download/community
2. Install and start MongoDB
3. Keep `MONGODB_URI=mongodb://localhost:27017/netflix-clone`

See `MONGODB_ATLAS_SETUP.md` for detailed MongoDB setup.

### Step 3: Run the Application

```bash
# Seed database
cd C:\work\netflix-clone\server
node utils/seedData.js

# Start application
cd ..
npm run dev
```

**Access:** http://localhost:3000

## 🎯 Testing in Demo Mode

### Subscribe Without Payment

1. Register a new account
2. Go to Pricing page
3. Select any plan
4. Click "Activate Subscription (Demo)"
5. ✅ Instant activation - no card required!

### Upload Videos Without Cloudinary

1. Login as admin: `admin@streamflix.com` / `admin123`
2. Go to Admin > Upload Video
3. Select any video file and thumbnail
4. Fill in details and upload
5. ✅ Demo video URLs are used automatically

## 🔄 Demo Mode Features

| Feature | Demo Mode | Real Mode |
|---------|-----------|-----------|
| User Registration | ✅ Works | ✅ Works |
| Login/Logout | ✅ Works | ✅ Works |
| Subscription | ✅ Instant activation | 💳 Requires Stripe |
| Video Upload | ✅ Sample videos | ☁️ Requires Cloudinary |
| Video Playback | ✅ Works | ✅ Works |
| Search & Filter | ✅ Works | ✅ Works |
| Watch History | ✅ Works | ✅ Works |
| Favorites | ✅ Works | ✅ Works |
| Admin Dashboard | ✅ Works | ✅ Works |
| Analytics | ✅ Works | ✅ Works |

## 📝 What Happens in Demo Mode?

### Subscriptions
- No Stripe API calls
- Subscription activates immediately
- 30-day expiry set automatically
- All subscription features work normally

### Video Uploads
- Sample video URL used: Big Buck Bunny (open source)
- Random placeholder thumbnail from Picsum
- All metadata saved normally
- Videos play perfectly

## 🎬 Sample Content

Demo mode uses these free resources:
- **Video:** Big Buck Bunny (open source test video)
- **Thumbnails:** Picsum Photos (random placeholder images)

You can still upload real files - they just won't be stored in cloud.

## 🔧 Switching to Production Mode

When ready for real payments and uploads:

1. **Disable Demo Mode:**
   ```env
   DEMO_MODE=false
   ```

2. **Configure Stripe:**
   - Get API keys from https://stripe.com
   - Update `server/.env`:
     ```env
     STRIPE_SECRET_KEY=sk_test_your_actual_key
     STRIPE_WEBHOOK_SECRET=whsec_your_actual_secret
     ```
   - Update `client/.env`:
     ```env
     REACT_APP_STRIPE_PUBLIC_KEY=pk_test_your_actual_key
     ```

3. **Configure Cloudinary:**
   - Get credentials from https://cloudinary.com
   - Update `server/.env`:
     ```env
     CLOUDINARY_CLOUD_NAME=your_actual_cloud_name
     CLOUDINARY_API_KEY=your_actual_api_key
     CLOUDINARY_API_SECRET=your_actual_api_secret
     ```

4. **Restart servers**

## 💡 Recommended for Testing

**Use Demo Mode when:**
- ✅ Learning the codebase
- ✅ Testing functionality
- ✅ Demonstrating features
- ✅ Development without dependencies
- ✅ Quick prototyping

**Use Real APIs when:**
- 📱 Deploying to production
- 💳 Processing real payments
- ☁️ Storing actual video content
- 📊 Tracking real metrics

## 🎮 Demo Mode Indicator

The UI shows a blue banner when demo mode is active:

```
🎭 Demo Mode: No payment required for testing
```

This helps you know the current mode.

## ⚡ Zero-Config Testing

With Demo Mode, you only need:
1. ✅ MongoDB connection (Atlas is free)
2. ✅ Node.js installed
3. ✅ npm dependencies

That's it! No API keys, no payment setup, no cloud storage accounts.

## 🎯 Perfect for Proof of Concept

This demo mode makes the Netflix Clone perfect for:
- Portfolio projects
- Learning exercises
- Technical demonstrations
- Proof of concepts
- Educational purposes
- Quick prototypes

## 📊 Full Feature Testing

Even in demo mode, you can test:
- Complete authentication flow
- Subscription management
- Video catalog browsing
- Search and filtering
- Video playback
- Watch history
- Favorites lists
- Admin operations
- User management
- Analytics dashboard

## 🔐 Security Note

Demo mode is for development/testing only. For production:
- Always use real Stripe for payments
- Always use cloud storage for videos
- Always set `DEMO_MODE=false`
- Always use HTTPS
- Always secure your API keys

---

**Enjoy testing your Netflix Clone without any setup hassle! 🎬🍿**

Need to add real payments later? Just update the API keys and set `DEMO_MODE=false`.
