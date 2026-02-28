# Architecture Documentation

This document describes the architecture and design decisions of the Netflix Clone application.

## System Architecture

### High-Level Overview

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Browser   │ ──────▶ │   React App  │ ──────▶ │  Express    │
│  (Client)   │ ◀────── │  (Frontend)  │ ◀────── │   API       │
└─────────────┘         └──────────────┘         └─────────────┘
                                                         │
                                                         │
                    ┌────────────────────────────────────┼────────────┐
                    │                                    │            │
                    ▼                                    ▼            ▼
            ┌───────────────┐                   ┌─────────────┐  ┌──────────┐
            │   MongoDB     │                   │   Stripe    │  │ Cloudinary│
            │   Database    │                   │   Payments  │  │  Storage  │
            └───────────────┘                   └─────────────┘  └──────────┘
```

## Frontend Architecture

### Component Hierarchy

```
App
├── ErrorBoundary
├── Provider (Redux)
├── AuthProvider
└── Router
    ├── Navbar
    ├── Routes
    │   ├── Public Routes
    │   │   ├── Landing
    │   │   ├── Login
    │   │   ├── Register
    │   │   └── Pricing
    │   ├── Protected Routes
    │   │   ├── Browse
    │   │   ├── Watch
    │   │   ├── SearchResults
    │   │   ├── MyList
    │   │   ├── History
    │   │   └── Profile
    │   └── Admin Routes
    │       ├── Dashboard
    │       ├── UploadVideo
    │       ├── ManageVideos
    │       └── ManageUsers
    └── Footer
```

### State Management

**Redux Store:**
- `videos` - Video catalog and current video
- `search` - Search results and suggestions

**Context API:**
- `AuthContext` - User authentication state

**Local State:**
- Component-specific UI state
- Form inputs
- Loading states

### Data Flow

```
Component ──▶ Action Creator ──▶ Async Thunk ──▶ API Service ──▶ Backend
    ▲                                                              │
    │                                                              │
    └──────────── Redux Store ◀──── Reducer ◀──── Response ◀──────┘
```

## Backend Architecture

### Layered Architecture

```
┌─────────────────────────────────────────────┐
│              Routes Layer                    │  ← API endpoints
├─────────────────────────────────────────────┤
│           Middleware Layer                   │  ← Auth, validation
├─────────────────────────────────────────────┤
│          Controllers Layer                   │  ← Business logic
├─────────────────────────────────────────────┤
│            Models Layer                      │  ← Data schemas
├─────────────────────────────────────────────┤
│           Database Layer                     │  ← MongoDB
└─────────────────────────────────────────────┘
```

### Request Flow

```
Request ──▶ Rate Limiter ──▶ Body Parser ──▶ CORS ──▶ Route
                                                        │
                                                        ▼
                                              ┌─────────────────┐
                                              │   Middleware    │
                                              │  - auth         │
                                              │  - validation   │
                                              │  - adminAuth    │
                                              └─────────────────┘
                                                        │
                                                        ▼
                                              ┌─────────────────┐
                                              │   Controller    │
                                              │  - validate     │
                                              │  - process      │
                                              │  - respond      │
                                              └─────────────────┘
                                                        │
                                                        ▼
                                              ┌─────────────────┐
                                              │   Database      │
                                              │  - query        │
                                              │  - update       │
                                              └─────────────────┘
```

## Database Schema

### User Document

```javascript
{
  _id: ObjectId,
  email: String (unique, indexed),
  password: String (hashed),
  name: String,
  role: String (user/admin),
  subscriptionStatus: String,
  subscriptionPlan: ObjectId (ref: Plan),
  subscriptionExpiry: Date,
  stripeCustomerId: String,
  stripeSubscriptionId: String,
  watchHistory: [{
    videoId: ObjectId,
    watchedAt: Date,
    progress: Number,
    completed: Boolean
  }],
  favorites: [ObjectId],
  profileImage: String,
  isActive: Boolean,
  refreshToken: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Video Document

```javascript
{
  _id: ObjectId,
  title: String (text indexed),
  description: String (text indexed),
  thumbnail: String,
  videoUrl: String,
  duration: Number,
  genre: [String] (indexed),
  category: String (indexed),
  releaseYear: Number,
  rating: String,
  views: Number (indexed),
  likes: Number,
  uploadedBy: ObjectId (ref: User),
  isPublished: Boolean,
  cast: [String],
  director: String,
  trailerUrl: String,
  createdAt: Date (indexed),
  updatedAt: Date
}
```

### Relationships

```
User ─────┐
          │
          ├── hasMany ──▶ Analytics
          │
          ├── belongsTo ──▶ Plan
          │
          └── references ──▶ Video (watchHistory, favorites)

Video ────┐
          │
          ├── hasMany ──▶ Analytics
          │
          └── belongsTo ──▶ User (uploadedBy)

Plan ─────┐
          │
          └── hasMany ──▶ User
```

## Authentication Flow

### Registration

```
1. User submits email/password/name
2. Validate input
3. Check if email exists
4. Hash password (bcrypt)
5. Create user document
6. Generate access + refresh tokens
7. Store refresh token in user document
8. Set HTTP-only cookie with refresh token
9. Return access token to client
10. Client stores access token in localStorage
```

### Login

```
1. User submits email/password
2. Find user by email
3. Compare password hash
4. Check if account is active
5. Generate new tokens
6. Update refresh token in database
7. Set cookie and return access token
```

### Token Refresh

```
1. Client detects expired access token (401)
2. Send refresh token from cookie
3. Verify refresh token
4. Check against stored token in database
5. Generate new access token
6. Return to client
7. Retry original request
```

## Video Upload Flow

```
1. Admin selects video and thumbnail files
2. Frontend sends multipart/form-data
3. Multer middleware processes files
4. Validate file types and sizes
5. Upload to Cloudinary
   - Video: Compressed and optimized
   - Thumbnail: Resized to 1280x720
6. Cloudinary returns URLs
7. Create Video document with URLs
8. Return success response
```

## Payment Flow

```
1. User selects subscription plan
2. Frontend collects card details (Stripe Elements)
3. Stripe.js creates payment method
4. Send payment method ID to backend
5. Create/update Stripe customer
6. Create Stripe subscription
7. Store subscription ID in user document
8. Activate user subscription
9. Stripe sends webhooks for events:
   - subscription.created
   - subscription.updated
   - subscription.deleted
   - payment.failed
10. Backend processes webhooks and updates user status
```

## Search Architecture

### Text Search

MongoDB text indexes on:
- `Video.title`
- `Video.description`

Query uses `$text` operator with relevance scoring.

### Filtering

Compound indexes for efficient filtering:
- `genre + category`
- `views` (descending)
- `createdAt` (descending)

### Pagination

- Client sends `page` and `limit`
- Backend calculates skip: `(page - 1) * limit`
- Returns total count for pagination UI

## Analytics System

### Event Tracking

```
User Action ──▶ Frontend ──▶ API ──▶ Analytics Collection
                                       │
                                       ├──▶ Update Video.views
                                       │
                                       └──▶ Update User.watchHistory
```

### Aggregation Queries

Used for:
- Completion rates
- Average watch duration
- Popular genres by user
- Revenue calculations

## Security Architecture

### Defense Layers

1. **Network Level**
   - CORS restrictions
   - Rate limiting
   - HTTPS (production)

2. **Application Level**
   - Input validation
   - Output sanitization
   - Parameterized queries

3. **Authentication Level**
   - JWT verification
   - Token expiry
   - Refresh token rotation

4. **Authorization Level**
   - Role-based access
   - Resource ownership checks
   - Subscription validation

## Scalability Considerations

### Current Capacity

- Supports thousands of concurrent users
- MongoDB handles millions of documents
- Cloudinary CDN for global delivery

### Scaling Strategies

**Horizontal Scaling:**
- Add more Node.js instances
- Use load balancer (Nginx, AWS ALB)
- MongoDB replica sets

**Vertical Scaling:**
- Increase server resources
- Optimize database queries
- Add caching layer (Redis)

**Data Scaling:**
- Partition videos by category
- Archive old analytics
- Use CDN for static assets

## Performance Optimizations

### Backend

- Database indexing
- Query optimization
- Response caching
- Compression (gzip)
- Connection pooling

### Frontend

- Code splitting
- Lazy loading
- Image optimization
- Debouncing/throttling
- Memoization (React.memo, useMemo)
- Virtual scrolling (for large lists)

### Video Delivery

- CDN distribution
- Adaptive bitrate streaming
- Thumbnail optimization
- Lazy loading images

## Monitoring & Logging

### Logged Events

- Authentication attempts
- API errors
- Payment events
- Video uploads
- Database operations

### Metrics to Monitor

- API response times
- Error rates
- Active users
- Video playback quality
- Subscription conversions
- Server resources

## Deployment Architecture

### Production Setup

```
┌──────────┐
│   CDN    │ ◀── Static Assets
└──────────┘
     │
┌──────────────────────────────────────┐
│         Load Balancer                │
└──────────────────────────────────────┘
     │
     ├─────────┬─────────┬─────────┐
     ▼         ▼         ▼         ▼
┌────────┐┌────────┐┌────────┐┌────────┐
│ Node 1 ││ Node 2 ││ Node 3 ││ Node N │
└────────┘└────────┘└────────┘└────────┘
     │
     ├─────────────────────┐
     ▼                     ▼
┌──────────────┐    ┌──────────────┐
│   MongoDB    │    │   Redis      │
│  Replica Set │    │   Cache      │
└──────────────┘    └──────────────┘
```

## API Design Principles

1. **RESTful conventions**
   - Use HTTP methods appropriately
   - Proper status codes
   - Resource-based URLs

2. **Consistent responses**
   - Standard JSON structure
   - Error handling
   - Metadata in responses

3. **Versioning**
   - Ready for `/api/v1/` prefix
   - Backward compatibility

4. **Security first**
   - Authentication required
   - Rate limiting
   - Input validation

5. **Performance**
   - Pagination
   - Field selection
   - Efficient queries

## Technology Choices

### Why MERN Stack?

- **JavaScript everywhere** - Same language frontend/backend
- **JSON native** - Seamless data flow
- **Large ecosystem** - Extensive libraries
- **Community support** - Active communities
- **Rapid development** - Quick prototyping

### Why MongoDB?

- **Flexible schema** - Easy to iterate
- **Horizontal scaling** - Sharding support
- **Rich queries** - Text search, aggregation
- **JSON documents** - Natural data modeling

### Why React?

- **Component-based** - Reusable UI
- **Virtual DOM** - Fast updates
- **Hooks** - Clean state management
- **Ecosystem** - Redux, Router, etc.

### Why Stripe?

- **Developer-friendly** - Great API/docs
- **Secure** - PCI compliant
- **Features** - Subscriptions, webhooks
- **Global** - Multi-currency support

## Design Patterns

### Backend Patterns

- **MVC** - Separation of concerns
- **Repository** - Data access abstraction
- **Middleware** - Cross-cutting concerns
- **Factory** - Token generation

### Frontend Patterns

- **Container/Presentational** - Logic separation
- **Higher-Order Components** - ProtectedRoute
- **Custom Hooks** - Reusable logic
- **Context** - Global state

## Error Handling Strategy

### Backend

1. Try-catch in async functions
2. Custom ErrorResponse class
3. Global error handler middleware
4. Appropriate status codes
5. Detailed logging

### Frontend

1. Error boundaries for React errors
2. Axios interceptors for API errors
3. User-friendly error messages
4. Retry mechanisms
5. Fallback UI

## Testing Strategy

### Unit Tests

- Individual functions
- Redux reducers
- Utility functions
- API services

### Integration Tests

- API endpoints
- Database operations
- Authentication flow
- Payment processing

### E2E Tests (Future)

- Critical user flows
- Registration to playback
- Admin operations

## Conclusion

This architecture provides:
- **Scalability** - Can handle growth
- **Maintainability** - Clean code organization
- **Security** - Multiple defense layers
- **Performance** - Optimized at each layer
- **Extensibility** - Easy to add features
