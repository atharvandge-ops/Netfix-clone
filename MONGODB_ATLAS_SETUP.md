# MongoDB Atlas Setup Guide

MongoDB is not installed locally. Follow these steps to use MongoDB Atlas (free cloud database).

## Step-by-Step Setup (5 minutes)

### 1. Create Free Account

Go to: https://www.mongodb.com/cloud/atlas/register

- Sign up with email or Google
- Choose FREE tier (M0 Sandbox)
- Select a cloud provider (AWS recommended)
- Choose region closest to you

### 2. Create Cluster

- Click "Build a Database"
- Select "FREE" tier (M0)
- Click "Create Cluster"
- Wait 3-5 minutes for cluster to deploy

### 3. Create Database User

- Click "Database Access" (left sidebar)
- Click "Add New Database User"
- Choose "Password" authentication
- Username: `netflixadmin`
- Password: Create a strong password (save it!)
- Database User Privileges: "Atlas admin"
- Click "Add User"

### 4. Whitelist Your IP

- Click "Network Access" (left sidebar)
- Click "Add IP Address"
- Click "Allow Access from Anywhere" (for development)
- Click "Confirm"

### 5. Get Connection String

- Click "Database" (left sidebar)
- Click "Connect" on your cluster
- Click "Connect your application"
- Copy the connection string (looks like):
  ```
  mongodb+srv://netflixadmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
  ```
- Replace `<password>` with your actual password
- Add database name at the end: `...mongodb.net/netflix-clone?retryWrites=true&w=majority`

### 6. Update .env File

Edit `C:\work\netflix-clone\server\.env`:

Replace this line:
```
MONGODB_URI=mongodb://localhost:27017/netflix-clone
```

With your Atlas connection string:
```
MONGODB_URI=mongodb+srv://netflixadmin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/netflix-clone?retryWrites=true&w=majority
```

### 7. Run Seed Script

```bash
cd C:\work\netflix-clone\server
node utils/seedData.js
```

You should see:
```
Connected to MongoDB
Plans seeded successfully
Admin user created: admin@streamflix.com / admin123
Database seeding completed
```

## ✅ Done!

Now start your application:

```bash
cd C:\work\netflix-clone
npm run dev
```

## Alternative: Install MongoDB Locally

If you prefer local installation:

1. Download: https://www.mongodb.com/try/download/community
2. Install MongoDB Community Server
3. Keep default settings
4. Start MongoDB service
5. Connection string: `mongodb://localhost:27017/netflix-clone`

## Troubleshooting

**Connection timeout?**
- Check if IP is whitelisted
- Verify password is correct (no special characters causing issues)
- Ensure connection string is properly formatted

**Authentication failed?**
- Verify username and password
- Check database user has proper privileges
- Try resetting password in Atlas

**Still having issues?**
- Use connection string without options first
- Check Atlas cluster is running
- Verify network connectivity
