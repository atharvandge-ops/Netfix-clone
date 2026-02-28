# Netflix Clone - Video Streaming Platform

A full-stack subscription-based video streaming platform built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- 🔐 **User Authentication** - JWT-based auth with refresh tokens
- 💳 **Subscription Management** - Stripe integration for payments
- 🎬 **Video Streaming** - HLS adaptive streaming with progress tracking
- 👤 **User Profiles** - Personalized watchlists and viewing history
- 🔍 **Search & Filter** - Full-text search with genre/category filtering
- 📊 **Analytics** - Track views, completion rates, and user engagement
- 👨‍💼 **Admin Dashboard** - Content and user management
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

## Tech Stack

**Frontend:**
- React 18+ with React Router
- Redux Toolkit for state management
- TailwindCSS for styling
- React Player for video playback
- Axios for API calls
- Stripe React for payments

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- bcrypt for password hashing
- Stripe API for payments
- Cloudinary/AWS S3 for video storage
- Multer for file uploads

## Quick Start

### 1. Install Dependencies

```bash
npm run install-all
```

### 2. Configure Environment Variables

**Backend (`server/.env`):**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/netflix-clone
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
STRIPE_SECRET_KEY=sk_test_...
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:3000
```

**Frontend (`client/.env`):**
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_...
```

See `.env.example` files for complete configuration.

### 3. Seed Database

```bash
cd server
node utils/seedData.js
```

Creates:
- 3 subscription plans (Basic, Standard, Premium)
- Admin account: `admin@streamflix.com` / `admin123`

### 4. Start Development Servers

```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Project Structure

```
netflix-clone/
├── client/                      # React Frontend
│   ├── public/                  # Static files
│   ├── src/
│   │   ├── components/          # Reusable components
│   │   │   ├── Navbar.js
│   │   │   ├── VideoCard.js
│   │   │   ├── VideoPlayer.js
│   │   │   ├── SearchBar.js
│   │   │   ├── FilterSidebar.js
│   │   │   └── ...
│   │   ├── pages/               # Page components
│   │   │   ├── Landing.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Browse.js
│   │   │   ├── Watch.js
│   │   │   ├── Pricing.js
│   │   │   ├── Profile.js
│   │   │   ├── History.js
│   │   │   ├── MyList.js
│   │   │   └── Admin/
│   │   ├── services/            # API service layer
│   │   ├── store/               # Redux store & slices
│   │   ├── contexts/            # React contexts
│   │   ├── hooks/               # Custom hooks
│   │   └── utils/               # Helper functions
│   └── package.json
│
├── server/                      # Node.js Backend
│   ├── config/                  # Configuration files
│   │   ├── db.js
│   │   ├── stripe.js
│   │   └── cloudinary.js
│   ├── controllers/             # Route controllers
│   │   ├── authController.js
│   │   ├── videoController.js
│   │   ├── subscriptionController.js
│   │   ├── userController.js
│   │   ├── searchController.js
│   │   ├── analyticsController.js
│   │   └── adminController.js
│   ├── models/                  # MongoDB models
│   │   ├── User.js
│   │   ├── Video.js
│   │   ├── Plan.js
│   │   └── Analytics.js
│   ├── routes/                  # API routes
│   │   ├── auth.js
│   │   ├── video.js
│   │   ├── subscription.js
│   │   ├── user.js
│   │   ├── search.js
│   │   ├── analytics.js
│   │   └── admin.js
│   ├── middleware/              # Custom middleware
│   │   ├── auth.js
│   │   ├── adminAuth.js
│   │   └── validator.js
│   ├── utils/                   # Helper functions
│   │   ├── jwt.js
│   │   ├── uploadConfig.js
│   │   ├── cloudinaryUpload.js
│   │   ├── errorHandler.js
│   │   └── seedData.js
│   ├── __tests__/               # Test files
│   └── server.js                # Entry point
│
├── package.json                 # Root package
├── docker-compose.yml           # Docker configuration
├── QUICKSTART.md               # This file
├── DEPLOYMENT.md               # Deployment guide
└── README.md                   # Project overview
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Videos
- `GET /api/videos` - Get all videos (paginated)
- `GET /api/videos/:id` - Get video by ID
- `POST /api/videos` - Upload video (admin)
- `PUT /api/videos/:id` - Update video (admin)
- `DELETE /api/videos/:id` - Delete video (admin)
- `POST /api/videos/:id/view` - Increment views
- `POST /api/videos/:id/like` - Toggle like

### Subscription
- `GET /api/subscription/plans` - Get all plans
- `POST /api/subscription/create` - Create subscription
- `POST /api/subscription/cancel` - Cancel subscription
- `GET /api/subscription/status` - Get subscription status
- `POST /api/subscription/webhook` - Stripe webhook

### User
- `GET /api/user/profile` - Get profile
- `PUT /api/user/profile` - Update profile
- `GET /api/user/history` - Get watch history
- `GET /api/user/favorites` - Get favorites
- `POST /api/user/favorites/:videoId` - Add to favorites
- `DELETE /api/user/favorites/:videoId` - Remove from favorites

### Search
- `GET /api/search?q={query}` - Search videos
- `GET /api/search/suggestions?q={query}` - Get suggestions
- `GET /api/search/filters` - Get filter options

### Analytics
- `POST /api/analytics/track` - Track video event
- `POST /api/analytics/progress` - Update watch progress
- `GET /api/analytics/user` - Get user analytics

### Admin
- `GET /api/admin/dashboard` - Get dashboard stats
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:userId/status` - Update user status
- `DELETE /api/admin/users/:userId` - Delete user
- `GET /api/admin/videos` - Get all videos
- `POST /api/admin/plans` - Create plan
- `PUT /api/admin/plans/:planId` - Update plan

## Development Commands

```bash
# Install all dependencies
npm run install-all

# Start both frontend and backend
npm run dev

# Start backend only
npm run server

# Start frontend only
npm run client

# Seed database
cd server && node utils/seedData.js

# Run backend tests
cd server && npm test

# Run frontend tests
cd client && npm test

# Build frontend for production
cd client && npm run build
```

## Docker Deployment

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild containers
docker-compose up -d --build
```

## Testing

### Backend Tests

```bash
cd server
npm test
```

### Frontend Tests

```bash
cd client
npm test
```

### Manual Testing with Stripe

Use Stripe test cards:
- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- Use any future expiry date and CVC

## Security Features

- Password hashing with bcrypt (12 salt rounds)
- JWT access tokens (7 days) and refresh tokens (30 days)
- HTTP-only cookies for refresh tokens
- CORS protection
- Rate limiting (100 requests per 15 minutes)
- Input validation and sanitization
- Protected admin routes
- Secure file upload validation

## Performance Optimizations

- MongoDB indexing for fast queries
- React lazy loading and code splitting
- Video CDN delivery
- Pagination for large datasets
- Debounced search input
- Redis caching (can be added)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

This is a proof-of-concept project. Feel free to extend and customize as needed.

## Troubleshooting

See `QUICKSTART.md` for common issues and solutions.

## License

MIT

---

Built with ❤️ using MERN Stack
