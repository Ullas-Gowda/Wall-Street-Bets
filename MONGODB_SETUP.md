# MongoDB Setup Guide - Wall Street Bets Trading Platform

## Overview

This guide will help you set up MongoDB Atlas (free cloud database) for your trading platform. We'll move from in-memory storage to persistent MongoDB storage.

## Step 1: Create MongoDB Atlas Account

### Option A: Using MongoDB Atlas (Recommended - Free)

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Create account with email
4. Verify email
5. Create organization and project

### Option B: Local MongoDB

If you prefer local MongoDB:
```bash
# macOS with Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# MongoDB will run on localhost:27017
```

## Step 2: Create MongoDB Cluster

### For MongoDB Atlas:

1. Click "Create Deployment"
2. Select "Shared" (Free tier)
3. Choose region closest to you
4. Click "Create Cluster" (takes ~3 minutes)

## Step 3: Set Up Database Access

1. Go to "Database Access" in left menu
2. Click "Add New Database User"
3. Create username: `wsb_trader`
4. Create strong password: Copy and save this!
5. Set database user privileges to "Read and write to any database"
6. Click "Add User"

## Step 4: Configure Network Access

1. Go to "Network Access" in left menu
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Click "Confirm"

## Step 5: Get Connection String

1. Go back to "Clusters"
2. Click "Connect" button on your cluster
3. Select "Connect your application"
4. Select "Node.js" and version "4.1 or later"
5. Copy the connection string

**String format**:
```
mongodb+srv://wsb_trader:PASSWORD@cluster.mongodb.net/?retryWrites=true&w=majority&appName=WSBTrader
```

Replace:
- `PASSWORD` with your database user password
- `cluster` with your actual cluster name

## Step 6: Configure Environment Variables

Create/update `.env` file in backend directory:

```env
# Server
PORT=5001
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://wsb_trader:YOUR_PASSWORD@your-cluster.mongodb.net/?retryWrites=true&w=majority&appName=WSBTrader

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# App
APP_NAME=WSB Trading Platform
```

## Step 7: Update Backend Configuration

Your backend is already set up to use MongoDB! Just ensure:

1. `.env` file has MongoDB URI
2. Backend will automatically use MongoDB if `MONGODB_URI` is set
3. Falls back to in-memory storage if MongoDB is unavailable

## Step 8: Install Dependencies (if needed)

```bash
cd backend
npm install mongoose
```

## Step 9: Test MongoDB Connection

```bash
cd backend
npm start
```

Check console logs for:
```
✅ MongoDB connected successfully
```

## Verification Checklist

- [ ] MongoDB Atlas account created
- [ ] Cluster created
- [ ] Database user created (wsb_trader)
- [ ] IP whitelist configured
- [ ] Connection string copied
- [ ] .env file updated with MongoDB URI
- [ ] Backend started successfully
- [ ] No connection errors in logs

## Usage

Once MongoDB is connected:

✅ User data persists across restarts
✅ Portfolios saved permanently
✅ Transaction history permanent
✅ No data loss on server restart

## Switching Back to In-Memory

If you want to use in-memory storage again:
- Remove/comment out `MONGODB_URI` in `.env`
- Restart backend server

## Troubleshooting

### Connection Timeout
- Check IP whitelist includes your IP
- Verify MongoDB URI is correct
- Check internet connection

### Authentication Failed
- Verify username and password in connection string
- Ensure special characters are URL-encoded
- Check user exists in Database Access

### Database Name
The connection string automatically creates a database named "wsb_trading"

### Backup Data
MongoDB Atlas offers automatic backups. Check "Backup" section for snapshots.

## Production Considerations

For production:
1. Use strong, unique passwords
2. Restrict IP whitelist to your server IPs
3. Enable encryption at rest
4. Set up automated backups
5. Use VPC peering for enhanced security

---

**Next**: Your backend will automatically use MongoDB when configured!
