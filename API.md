# API Documentation

Complete API reference for the Netflix Clone backend.

## Base URL

```
http://localhost:5000/api
```

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

## Response Format

All responses follow this structure:

```json
{
  "success": true,
  "message": "Operation description",
  "data": { ... }
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

---

## Auth Endpoints

### Register User

`POST /api/auth/register`

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "...",
      "email": "john@example.com",
      "name": "John Doe",
      "role": "user",
      "subscriptionStatus": "inactive"
    },
    "accessToken": "..."
  }
}
```

### Login

`POST /api/auth/login`

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** Same as register

### Refresh Token

`POST /api/auth/refresh`

Uses HTTP-only cookie for refresh token.

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "..."
  }
}
```

### Logout

`POST /api/auth/logout`

**Headers:** Requires authentication

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### Get Current User

`GET /api/auth/me`

**Headers:** Requires authentication

---

## Video Endpoints

### Get All Videos

`GET /api/videos`

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `genre` (optional)
- `category` (optional)
- `sort` (default: -createdAt)

**Response:**
```json
{
  "success": true,
  "data": {
    "videos": [...],
    "totalPages": 5,
    "currentPage": 1,
    "totalVideos": 100
  }
}
```

### Get Video by ID

`GET /api/videos/:id`

**Headers:** Requires authentication + active subscription

### Upload Video

`POST /api/videos`

**Headers:** Requires authentication + admin role

**Body:** multipart/form-data
- `video` (file)
- `thumbnail` (file)
- `title` (string)
- `description` (string)
- `duration` (number)
- `genre` (comma-separated or array)
- `category` (string)
- `releaseYear` (number)
- `rating` (string)
- `cast` (comma-separated or array)
- `director` (string)

### Update Video

`PUT /api/videos/:id`

**Headers:** Requires authentication + admin role

**Body:** JSON with fields to update

### Delete Video

`DELETE /api/videos/:id`

**Headers:** Requires authentication + admin role

---

## Subscription Endpoints

### Get Plans

`GET /api/subscription/plans`

**Response:**
```json
{
  "success": true,
  "data": {
    "plans": [
      {
        "_id": "...",
        "name": "Basic",
        "price": 8.99,
        "videoQuality": "480p",
        "simultaneousScreens": 1,
        "features": [...]
      }
    ]
  }
}
```

### Create Subscription

`POST /api/subscription/create`

**Headers:** Requires authentication

**Body:**
```json
{
  "planId": "...",
  "paymentMethodId": "pm_..."
}
```

### Cancel Subscription

`POST /api/subscription/cancel`

**Headers:** Requires authentication

### Get Subscription Status

`GET /api/subscription/status`

**Headers:** Requires authentication

---

## Search Endpoints

### Search Videos

`GET /api/search`

**Headers:** Requires authentication

**Query Parameters:**
- `q` (required) - Search query
- `genre` (optional)
- `category` (optional)
- `releaseYear` (optional)
- `rating` (optional)
- `page` (default: 1)
- `limit` (default: 20)
- `sort` (default: -views)

### Get Suggestions

`GET /api/search/suggestions`

**Query Parameters:**
- `q` (required) - Partial query

### Get Filter Options

`GET /api/search/filters`

Returns available genres, categories, years, and ratings.

---

## User Endpoints

### Get Profile

`GET /api/user/profile`

**Headers:** Requires authentication

### Update Profile

`PUT /api/user/profile`

**Headers:** Requires authentication

**Body:**
```json
{
  "name": "New Name",
  "email": "newemail@example.com",
  "profileImage": "url"
}
```

### Get Watch History

`GET /api/user/history`

**Headers:** Requires authentication + active subscription

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)

### Get Favorites

`GET /api/user/favorites`

**Headers:** Requires authentication + active subscription

### Add to Favorites

`POST /api/user/favorites/:videoId`

**Headers:** Requires authentication + active subscription

### Remove from Favorites

`DELETE /api/user/favorites/:videoId`

**Headers:** Requires authentication + active subscription

---

## Analytics Endpoints

### Track Event

`POST /api/analytics/track`

**Headers:** Requires authentication + active subscription

**Body:**
```json
{
  "videoId": "...",
  "action": "view",
  "watchDuration": 120,
  "deviceType": "desktop",
  "browser": "Chrome",
  "quality": "1080p"
}
```

**Actions:** view, complete, pause, resume, seek, like, unlike

### Update Progress

`POST /api/analytics/progress`

**Headers:** Requires authentication + active subscription

**Body:**
```json
{
  "videoId": "...",
  "progress": 45.5
}
```

### Get User Analytics

`GET /api/analytics/user`

**Headers:** Requires authentication

---

## Admin Endpoints

All admin endpoints require authentication + admin role.

### Get Dashboard Stats

`GET /api/admin/dashboard`

Returns overview statistics and recent activity.

### Get All Users

`GET /api/admin/users`

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 50)
- `status` (optional) - Filter by subscription status
- `search` (optional) - Search by name or email

### Update User Status

`PUT /api/admin/users/:userId/status`

**Body:**
```json
{
  "isActive": false
}
```

### Delete User

`DELETE /api/admin/users/:userId`

### Get All Videos (Admin)

`GET /api/admin/videos`

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 50)
- `status` (optional) - published/unpublished
- `search` (optional)

### Create Plan

`POST /api/admin/plans`

**Body:**
```json
{
  "name": "Basic",
  "price": 8.99,
  "videoQuality": "480p",
  "simultaneousScreens": 1,
  "stripePriceId": "price_...",
  "features": ["Feature 1", "Feature 2"]
}
```

### Update Plan

`PUT /api/admin/plans/:planId`

---

## Error Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

- **Limit:** 100 requests per 15 minutes per IP
- **Scope:** All `/api/*` endpoints
- **Response:** 429 Too Many Requests

## Webhooks

### Stripe Webhook

`POST /api/subscription/webhook`

**Headers:**
- `stripe-signature` (required)

Handles Stripe events:
- customer.subscription.created
- customer.subscription.updated
- customer.subscription.deleted
- invoice.payment_failed
