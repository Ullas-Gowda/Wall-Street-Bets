# Wall Street Bets Backend

A complete REST API for a paper trading platform supporting stocks and cryptocurrencies.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation

```bash
cd backend
npm install
```

### Running the Server

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server will start on `http://localhost:5001`

### Testing

Run the complete test suite:
```bash
bash test-api.sh
```

This tests all 14 API endpoints including:
- Authentication (signup, login, me)
- Trading (buy, sell, portfolio, transactions, holding)
- Market data (price, prices, history, search, trending, overview)

## 📊 API Overview

**Base URL:** `http://localhost:5001/api`

### Endpoints Summary

| Category | Count | Status |
|----------|-------|--------|
| Authentication | 3 | ✓ Complete |
| Trading | 5 | ✓ Complete |
| Market Data | 6 | ✓ Complete |
| **Total** | **14** | **✓ All Working** |

### Quick Examples

**Sign Up**
```bash
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Get Market Price**
```bash
curl http://localhost:5001/api/market/price/AAPL
```

**Buy Asset** (requires authentication)
```bash
curl -X POST http://localhost:5001/api/trade/buy \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "symbol": "AAPL",
    "quantity": 10,
    "pricePerUnit": 182.52,
    "type": "stock"
  }'
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── app.js                    # Express app setup
│   ├── server.js                 # Server entry point
│   ├── config/
│   │   ├── db.js                 # MongoDB connection
│   │   └── memory.js             # In-memory data store
│   ├── controllers/
│   │   ├── authController.js     # Auth logic
│   │   ├── tradeController.js    # Trading logic
│   │   └── marketController.js   # Market data logic
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Portfolio.js          # Holdings schema
│   │   └── Transaction.js        # Trade history schema
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   ├── tradeRoutes.js        # Trading endpoints
│   │   └── marketRoutes.js       # Market endpoints
│   ├── middleware/
│   │   └── authenticate.js       # JWT verification
│   ├── services/
│   │   └── marketService.js      # Market data service
│   └── utils/
│       └── jwt.js                # JWT utilities
├── .env                          # Environment variables
├── package.json                  # Dependencies
├── test-api.sh                   # Test suite
└── API_ENDPOINTS.md              # Detailed API docs
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

1. **Sign up or login** to get a token
2. **Include the token** in request headers: `Authorization: Bearer <token>`
3. **Token expires** in 7 days

Protected endpoints:
- `POST /api/trade/buy`
- `POST /api/trade/sell`
- `GET /api/trade/portfolio`
- `GET /api/trade/transactions`
- `GET /api/trade/holding/:symbol`
- `GET /api/auth/me`

Public endpoints:
- All market endpoints
- `/api/auth/signup`
- `/api/auth/login`

## 💳 Virtual Trading

Every new user starts with **$100,000** in virtual balance for paper trading.

### How Trading Works

**Buy**
- Deducts from balance
- Creates/updates portfolio holding
- Records transaction
- Calculates average price for multiple purchases

**Sell**
- Adds to balance
- Calculates profit/loss: `(sellPrice - averagePrice) × quantity`
- Updates portfolio (removes if quantity = 0)
- Records transaction with P&L

**Portfolio**
- Shows all current holdings
- Tracks unrealized P&L
- Calculates total return percentage

## 📊 Supported Assets

### Stocks (5)
- AAPL - Apple Inc
- GOOGL - Alphabet Inc
- MSFT - Microsoft
- AMZN - Amazon.com
- TSLA - Tesla Inc

### Cryptocurrencies (5)
- BTC - Bitcoin
- ETH - Ethereum
- XRP - Ripple
- ADA - Cardano
- SOL - Solana

## 🛠️ Development

### Current Architecture
- **Framework:** Express.js (Node.js)
- **Database:** MongoDB (with in-memory fallback)
- **Authentication:** JWT + bcryptjs
- **Security:** Helmet, CORS enabled
- **Logging:** Morgan

### Environment Variables
Create a `.env` file with:
```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/wall_street_bets
JWT_SECRET=your_super_secret_key_change_this_in_production
JWT_EXPIRE=7d
```

### Database

The app uses in-memory storage for development (no database required).

For production:
- Install MongoDB
- Update `MONGO_URI` in `.env`
- Models are ready for Mongoose integration

## 🧪 Testing

Run the test suite:
```bash
bash test-api.sh
```

**Test Coverage:**
- ✓ User signup and login
- ✓ Authentication token generation
- ✓ Buy asset with balance check
- ✓ Sell asset with profit/loss calculation
- ✓ Portfolio retrieval and calculations
- ✓ Transaction history with filtering
- ✓ Single holding details
- ✓ All market data endpoints

## 📈 API Response Format

All endpoints return JSON with this structure:

**Success (2xx)**
```json
{
  "message": "Operation successful",
  "data": { ... }
}
```

**Error (4xx/5xx)**
```json
{
  "message": "Error description"
}
```

## 🚨 Error Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing/invalid token |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error - Internal error |

## 🔄 Workflow Example

1. **Sign up**
   ```bash
   POST /api/auth/signup
   → Get token, $100,000 balance
   ```

2. **Check market prices**
   ```bash
   GET /api/market/price/AAPL
   → See current price
   ```

3. **Buy stocks**
   ```bash
   POST /api/trade/buy
   → Purchase AAPL, balance decreases
   ```

4. **View portfolio**
   ```bash
   GET /api/trade/portfolio
   → See holdings, P&L, balance
   ```

5. **Sell and realize profit**
   ```bash
   POST /api/trade/sell
   → Sell at profit, balance increases
   ```

6. **View transaction history**
   ```bash
   GET /api/trade/transactions
   → See all buy/sell history
   ```

## 📚 Documentation

Detailed API documentation: [API_ENDPOINTS.md](API_ENDPOINTS.md)

## 🎯 Features

- ✓ User authentication with JWT
- ✓ Paper trading (no real money)
- ✓ Buy/sell stocks and crypto
- ✓ Portfolio tracking with P&L
- ✓ Transaction history
- ✓ Market price data
- ✓ Asset search and trending
- ✓ Real-time balance updates
- ✓ Average price calculation for multiple purchases
- ✓ Complete test coverage

## 🚀 Next Steps

1. **Set up MongoDB** for persistent storage
2. **Integrate real market APIs** (Alpha Vantage, CoinGecko)
3. **Add user profile management**
4. **Implement watchlist feature**
5. **Add order status tracking** (PENDING → COMPLETED)
6. **Build frontend** with React/Vue

## 📝 Notes

- Data persists in memory during server runtime
- Restart server to clear all data
- For production, use MongoDB for persistence
- Update JWT_SECRET in production
- Enable HTTPS for secure authentication

## 🤝 Support

For API issues or questions, check `API_ENDPOINTS.md` for detailed endpoint documentation.

---

**Status:** ✓ All 14 endpoints fully functional and tested
**Last Updated:** January 9, 2024
