# Setup Checklist

Follow this checklist to get your Netflix Clone up and running.

## Prerequisites ✓

- [ ] Node.js v16+ installed
- [ ] MongoDB installed (or MongoDB Atlas account)
- [ ] Git installed
- [ ] Stripe account created (test mode is fine)
- [ ] Cloudinary account created (free tier is fine)

## Installation Steps

### 1. Project Setup

- [x] Project structure created
- [x] Dependencies configured
- [ ] Dependencies installed (`npm run install-all`)

### 2. Environment Configuration

**Backend Configuration:**

- [ ] Copy `server/.env.example` to `server/.env`
- [ ] Set `MONGODB_URI` (MongoDB connection string)
- [ ] Set `JWT_SECRET` (random string, 32+ characters)
- [ ] Set `JWT_REFRESH_SECRET` (different random string)
- [ ] Set `STRIPE_SECRET_KEY` (from Stripe dashboard)
- [ ] Set `STRIPE_WEBHOOK_SECRET` (after creating webhook)
- [ ] Set Cloudinary credentials:
  - [ ] `CLOUDINARY_CLOUD_NAME`
  - [ ] `CLOUDINARY_API_KEY`
  - [ ] `CLOUDINARY_API_SECRET`

**Frontend Configuration:**

- [ ] Copy `client/.env.example` to `client/.env`
- [ ] Set `REACT_APP_API_URL=http://localhost:5000`
- [ ] Set `REACT_APP_STRIPE_PUBLIC_KEY` (from Stripe dashboard)

### 3. Third-Party Service Setup

**Stripe Setup:**

- [ ] Login to Stripe Dashboard
- [ ] Go to Developers > API keys
- [ ] Copy Publishable key (starts with `pk_test_`)
- [ ] Copy Secret key (starts with `sk_test_`)
- [ ] Create three products:
  - [ ] Basic Plan ($8.99/month)
  - [ ] Standard Plan ($12.99/month)
  - [ ] Premium Plan ($17.99/month)
- [ ] Copy each price ID (starts with `price_`)
- [ ] Update `.env` with price IDs

**Cloudinary Setup:**

- [ ] Sign up at cloudinary.com
- [ ] Go to Dashboard
- [ ] Copy Cloud Name, API Key, and API Secret
- [ ] Update `server/.env`

**MongoDB Setup:**

- [ ] Start MongoDB locally, OR
- [ ] Create MongoDB Atlas cluster
- [ ] Get connection string
- [ ] Update `MONGODB_URI` in `server/.env`

### 4. Database Initialization

- [ ] Run: `cd server && node utils/seedData.js`
- [ ] Verify output shows:
  - [ ] "Plans seeded successfully"
  - [ ] "Admin user created"
- [ ] Note admin credentials: `admin@streamflix.com` / `admin123`

### 5. Start Application

- [ ] Run: `npm run dev` (from project root)
- [ ] Verify backend starts on port 5000
- [ ] Verify frontend starts on port 3000
- [ ] Check http://localhost:5000/health returns OK
- [ ] Check http://localhost:3000 loads landing page

## Testing the Application

### Basic User Flow

- [ ] Navigate to http://localhost:3000
- [ ] Click "Get Started"
- [ ] Create a new account
- [ ] View pricing plans
- [ ] Select a plan
- [ ] Enter Stripe test card: `4242 4242 4242 4242`
  - Expiry: Any future date
  - CVC: Any 3 digits
- [ ] Complete subscription
- [ ] Browse video catalog
- [ ] Search for videos
- [ ] Filter by genre

### Admin Flow

- [ ] Logout if logged in
- [ ] Login as admin: `admin@streamflix.com` / `admin123`
- [ ] Navigate to http://localhost:3000/admin
- [ ] View dashboard statistics
- [ ] Click "Upload New Video"
- [ ] Upload a sample video (use small file for testing)
- [ ] Fill in video metadata
- [ ] Submit upload
- [ ] Verify video appears in "Manage Videos"
- [ ] Publish the video
- [ ] Logout and login as regular user
- [ ] Verify video appears in browse page

### Video Playback

- [ ] Click on a video card
- [ ] Video player loads
- [ ] Play button works
- [ ] Progress bar updates
- [ ] Volume control works
- [ ] Add to favorites works
- [ ] Navigate back to browse

## Troubleshooting

### Issue: npm install fails

- [ ] Clear npm cache: `npm cache clean --force`
- [ ] Delete node_modules
- [ ] Try again

### Issue: MongoDB connection fails

- [ ] Verify MongoDB is running: `mongod` command
- [ ] Check connection string format
- [ ] For Atlas: Whitelist your IP

### Issue: Stripe payment fails

- [ ] Verify API keys are correct
- [ ] Use test card number exactly: 4242 4242 4242 4242
- [ ] Check Stripe Dashboard > Logs for errors

### Issue: Video upload fails

- [ ] Verify Cloudinary credentials
- [ ] Check file size (max 500MB)
- [ ] Try with smaller test file
- [ ] Check server logs for errors

### Issue: Port already in use

```bash
# Windows
npx kill-port 3000
npx kill-port 5000

# Or find and kill process manually
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

## Optional Enhancements

- [ ] Set up email service (Nodemailer with Gmail)
- [ ] Configure SMTP settings in `server/.env`
- [ ] Enable email notifications
- [ ] Add custom domain
- [ ] Deploy to production (see DEPLOYMENT.md)

## Security Reminders

- [ ] Never commit `.env` files
- [ ] Use strong JWT secrets in production
- [ ] Enable HTTPS in production
- [ ] Change admin password
- [ ] Whitelist IPs in MongoDB Atlas
- [ ] Set up Stripe webhooks
- [ ] Enable rate limiting

## Performance Checklist

- [ ] MongoDB indexes created (automatic via models)
- [ ] Images optimized
- [ ] Videos compressed
- [ ] Pagination implemented
- [ ] Lazy loading enabled

## Production Readiness

- [ ] All tests passing
- [ ] Environment variables secured
- [ ] Stripe in live mode
- [ ] Domain configured
- [ ] SSL certificate installed
- [ ] Monitoring set up
- [ ] Backup strategy implemented
- [ ] Error tracking enabled (Sentry)
- [ ] Analytics configured

## Getting Help

- Check `QUICKSTART.md` for quick start guide
- Review `DEPLOYMENT.md` for production deployment
- See `API.md` for API documentation
- Read `ARCHITECTURE.md` for system design

## Next Steps After Setup

1. Customize branding (logo, colors, copy)
2. Add real content (videos)
3. Configure email templates
4. Set up monitoring and alerts
5. Plan marketing strategy
6. Deploy to production

---

Congratulations on setting up your Netflix Clone! 🎉
