# MongoDB Setup - Quick Reference

## 30-Second Start

```bash
# Terminal 1: Start MongoDB
brew services start mongodb-community

# Terminal 2: Start Backend
cd backend && npm start

# Terminal 3: Start Frontend
cd frontend && npm run dev

# Open http://localhost:5173
```

---

## Installation (One-Time)

### Install MongoDB
```bash
brew tap mongodb/brew
brew install mongodb-community
```

### Start Service
```bash
brew services start mongodb-community
```

### Verify Running
```bash
mongosh
# Type: exit
```

---

## Environment Setup

File: `backend/.env`

```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/wall_street_bets
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRE=7d
```

---

## Running the App

```bash
# Terminal 1: MongoDB
brew services start mongodb-community

# Terminal 2: Backend
cd backend
npm install  # First time only
npm start

# Terminal 3: Frontend
cd frontend
npm install  # First time only
npm run dev
```

---

## Quick Test

```bash
# Create account
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"pass123"}'

# Get token from response, then:
TOKEN="<paste-token>"

# Buy asset
curl -X POST http://localhost:5001/api/trade/buy \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"symbol":"AAPL","quantity":10,"pricePerUnit":150,"type":"stock"}'

# Check portfolio
curl -X GET http://localhost:5001/api/trade/portfolio \
  -H "Authorization: Bearer $TOKEN"
```

---

## View Data in MongoDB

```bash
mongosh
use wall_street_bets
db.users.find().pretty()
db.portfolios.find().pretty()
db.transactions.find().pretty()
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "MongoDB connection failed" | Run: `brew services start mongodb-community` |
| "ECONNREFUSED" | MongoDB not running. Start it first |
| "Duplicate key error" | Clear DB: `db.users.deleteMany({})` |
| "User not found" after login | Create new account first |

---

## MongoDB Atlas (Cloud Alternative)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Update `.env`: `MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/wall_street_bets`
5. Restart backend

---

## Commands Reference

```bash
# MongoDB Management
brew services list                      # Check if running
brew services start mongodb-community   # Start
brew services stop mongodb-community    # Stop
brew services restart mongodb-community # Restart

# MongoDB Shell
mongosh                        # Connect to local MongoDB
mongosh "mongodb+srv://..."   # Connect to Atlas

# Inside mongosh
use wall_street_bets          # Switch database
show collections              # List all collections
db.users.find()               # View all users
db.portfolios.find()          # View all portfolios
db.transactions.find()        # View all transactions
db.users.deleteMany({})       # Clear users (be careful!)
exit                          # Exit mongosh
```

---

## File Changes Made

### authController.js
- Uses `User.findOne()` instead of in-memory Map
- Uses `User.save()` instead of Map.set()

### tradeController.js
- Uses `Portfolio.find()` instead of in-memory Map
- Uses `Transaction.insertOne()` instead of Array.push()

### authenticate.js
- Uses `User.findById()` instead of looping through Map

### db.js
- Enhanced to handle both `MONGO_URI` and `MONGODB_URI`

---

## All Features Working ✅

- ✅ Create account (saved to DB)
- ✅ Login (verified against DB)
- ✅ Buy assets (portfolio saved to DB)
- ✅ Sell assets (transaction saved to DB)
- ✅ View portfolio (from DB)
- ✅ View transactions (from DB)
- ✅ Data persists after restart

---

## Next Steps

1. Start MongoDB: `brew services start mongodb-community`
2. Start backend: `cd backend && npm start`
3. Start frontend: `cd frontend && npm run dev`
4. Open http://localhost:5173
5. Create account and test trading!

---

**Everything is ready! Start MongoDB and run the app.** 🚀
