# Deployment Guide

This guide covers deploying the Netflix Clone application to production.

## Prerequisites

- Node.js 16+ installed
- MongoDB instance (local or Atlas)
- Stripe account with API keys
- Cloud storage (AWS S3 or Cloudinary)
- Domain name (optional)

## Local Development

### 1. Environment Setup

**Server (.env):**
```bash
cd server
cp .env.example .env
```

Edit `server/.env` with your actual values:
- MongoDB connection string
- JWT secrets (use strong random strings)
- Stripe API keys
- Cloud storage credentials
- SMTP settings

**Client (.env):**
```bash
cd client
cp .env.example .env
```

Edit `client/.env` with:
- Backend API URL
- Stripe publishable key

### 2. Install Dependencies

```bash
npm run install-all
```

### 3. Seed Database

```bash
cd server
node utils/seedData.js
```

This creates:
- Three subscription plans (Basic, Standard, Premium)
- Admin user (admin@streamflix.com / admin123)

### 4. Start Development Servers

```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Docker Deployment

### Build and Run with Docker Compose

```bash
docker-compose up -d
```

This starts:
- MongoDB container on port 27017
- Backend server on port 5000
- Frontend (nginx) on port 3000

### Stop Services

```bash
docker-compose down
```

## Production Deployment Options

### Option 1: Separate Hosting (Recommended)

**Frontend:**
- Deploy to Vercel, Netlify, or AWS S3 + CloudFront
- Update `REACT_APP_API_URL` to production backend URL

**Backend:**
- Deploy to Heroku, Railway, DigitalOcean, or AWS EC2
- Set all environment variables in hosting platform
- Enable HTTPS

**Database:**
- Use MongoDB Atlas (managed service)
- Configure IP whitelist and connection string

### Option 2: VPS (DigitalOcean, AWS EC2)

1. SSH into server
2. Install Node.js, MongoDB, Nginx
3. Clone repository
4. Set up environment variables
5. Configure Nginx as reverse proxy
6. Set up PM2 for process management
7. Enable HTTPS with Let's Encrypt

### Option 3: Heroku

**Backend:**
```bash
cd server
heroku create netflix-clone-api
heroku addons:create mongolab
heroku config:set JWT_SECRET=your-secret
git push heroku main
```

**Frontend:**
```bash
cd client
npm run build
# Deploy build folder to Netlify or Vercel
```

## Post-Deployment Steps

### 1. Configure Stripe Webhooks

1. Go to Stripe Dashboard > Developers > Webhooks
2. Add endpoint: `https://your-domain.com/api/subscription/webhook`
3. Select events:
   - customer.subscription.created
   - customer.subscription.updated
   - customer.subscription.deleted
   - invoice.payment_failed
4. Copy webhook secret to `STRIPE_WEBHOOK_SECRET`

### 2. Set Up Stripe Products

1. Create products in Stripe Dashboard
2. Create prices for each plan (Basic, Standard, Premium)
3. Copy price IDs to environment variables
4. Update Plan documents in MongoDB with Stripe price IDs

### 3. Configure CORS

Update `CLIENT_URL` in server environment to match frontend domain.

### 4. Enable HTTPS

- Use Let's Encrypt for free SSL certificates
- Or use hosting platform's SSL (Heroku, Vercel, etc.)

### 5. Monitor and Scale

- Set up error logging (Sentry, LogRocket)
- Monitor performance (New Relic, DataDog)
- Set up backup strategy for MongoDB
- Configure CDN for video delivery
- Implement rate limiting and DDoS protection

## Security Checklist

- [ ] Strong JWT secrets configured
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] File upload restrictions in place
- [ ] MongoDB authentication enabled
- [ ] Stripe webhook signature verification
- [ ] Environment variables secured
- [ ] Admin routes protected

## Performance Optimization

1. Enable Redis caching for frequently accessed data
2. Use CDN for static assets and videos
3. Implement database indexing (already configured)
4. Enable gzip compression (nginx)
5. Optimize video encoding for streaming
6. Implement lazy loading on frontend
7. Use pagination for large datasets

## Monitoring

Set up monitoring for:
- Server uptime
- API response times
- Database performance
- Error rates
- User activity
- Subscription metrics

## Backup Strategy

1. Daily MongoDB backups
2. Store backups in S3 or similar
3. Test restoration process regularly
4. Version control for code
5. Document recovery procedures
