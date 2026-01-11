# Wall Street Bets Trading Platform - API Endpoints

## Overview
Complete REST API with 14 endpoints supporting user authentication, trading operations, and market data.

---

## Authentication Endpoints (3/3 ✓)

### 1. **User Signup**
- **Route:** `POST /api/auth/signup`
- **Auth:** No
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
- **Response (201):**
  ```json
  {
    "message": "User created successfully",
    "user": {
      "_id": "user_1234567890",
      "name": "John Doe",
      "email": "john@example.com",
      "balance": 100000,
      "role": "user",
      "createdAt": "2024-01-09T12:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
  ```
- **Status:** ✓ Working

### 2. **User Login**
- **Route:** `POST /api/auth/login`
- **Auth:** No
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
- **Response (200):**
  ```json
  {
    "message": "Login successful",
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
  ```
- **Status:** ✓ Working

### 3. **Get Current User**
- **Route:** `GET /api/auth/me`
- **Auth:** Required (Bearer token)
- **Response (200):**
  ```json
  {
    "_id": "user_1234567890",
    "name": "John Doe",
    "email": "john@example.com",
    "balance": 98175,
    "role": "user"
  }
  ```
- **Status:** ✓ Working

---

## Trading Endpoints (5/5 ✓)

### 4. **Buy Asset**
- **Route:** `POST /api/trade/buy`
- **Auth:** Required
- **Request Body:**
  ```json
  {
    "symbol": "AAPL",
    "quantity": 10,
    "pricePerUnit": 182.52,
    "type": "stock"
  }
  ```
- **Response (201):**
  ```json
  {
    "message": "Buy order executed",
    "transaction": {
      "_id": "tx_1234567890",
      "userId": "user_...",
      "symbol": "AAPL",
      "type": "stock",
      "action": "BUY",
      "quantity": 10,
      "price": 182.52,
      "totalAmount": 1825.2,
      "status": "COMPLETED",
      "createdAt": "2024-01-09T12:00:00Z"
    },
    "portfolio": {
      "symbol": "AAPL",
      "quantity": 10,
      "averagePrice": 182.52,
      "currentPrice": 182.52,
      "totalInvested": 1825.2,
      "currentValue": 1825.2,
      "unrealizedPnL": 0
    },
    "remainingBalance": 98174.8
  }
  ```
- **Status:** ✓ Working

### 5. **Sell Asset**
- **Route:** `POST /api/trade/sell`
- **Auth:** Required
- **Request Body:**
  ```json
  {
    "symbol": "AAPL",
    "quantity": 5,
    "pricePerUnit": 185.00,
    "type": "stock"
  }
  ```
- **Response (201):**
  ```json
  {
    "message": "Sell order executed",
    "transaction": { ... },
    "profitLoss": 12.4,
    "remainingBalance": 99187.2
  }
  ```
- **Profit/Loss Calculation:** `(sellPrice - averagePrice) × quantity`
- **Status:** ✓ Working

### 6. **Get Portfolio**
- **Route:** `GET /api/trade/portfolio`
- **Auth:** Required
- **Response (200):**
  ```json
  {
    "user": {
      "name": "John Doe",
      "email": "john@example.com",
      "balance": 99187.2
    },
    "holdings": [
      {
        "symbol": "AAPL",
        "type": "stock",
        "quantity": 5,
        "averagePrice": 182.52,
        "currentPrice": 185.00,
        "totalInvested": 912.6,
        "currentValue": 925.0,
        "unrealizedPnL": 12.4
      }
    ],
    "summary": {
      "totalInvested": 912.6,
      "totalCurrentValue": 925.0,
      "totalUnrealizedPnL": 12.4,
      "totalReturnPercentage": "1.36"
    }
  }
  ```
- **Status:** ✓ Working

### 7. **Get Transactions**
- **Route:** `GET /api/trade/transactions?symbol=AAPL&action=BUY&limit=50&skip=0`
- **Auth:** Required
- **Query Parameters:** Optional filters for symbol, action
- **Response (200):**
  ```json
  {
    "transactions": [
      {
        "_id": "tx_...",
        "symbol": "AAPL",
        "action": "SELL",
        "quantity": 5,
        "price": 185.00,
        "totalAmount": 925.0,
        "profitLoss": 12.4,
        "status": "COMPLETED",
        "createdAt": "2024-01-09T12:05:00Z"
      },
      {
        "_id": "tx_...",
        "symbol": "AAPL",
        "action": "BUY",
        "quantity": 10,
        "price": 182.52,
        "totalAmount": 1825.2,
        "status": "COMPLETED",
        "createdAt": "2024-01-09T12:00:00Z"
      }
    ],
    "pagination": {
      "total": 2,
      "limit": 50,
      "skip": 0,
      "pages": 1
    }
  }
  ```
- **Status:** ✓ Working

### 8. **Get Single Holding**
- **Route:** `GET /api/trade/holding/:symbol`
- **Auth:** Required
- **Example:** `/api/trade/holding/AAPL`
- **Response (200):**
  ```json
  {
    "holding": {
      "symbol": "AAPL",
      "type": "stock",
      "quantity": 5,
      "averagePrice": 182.52,
      "currentPrice": 185.00,
      "totalInvested": 912.6,
      "currentValue": 925.0,
      "unrealizedPnL": 12.4
    },
    "transactions": [...]
  }
  ```
- **Status:** ✓ Working

---

## Market Data Endpoints (6/6 ✓)

### 9. **Get Single Asset Price**
- **Route:** `GET /api/market/price/:symbol`
- **Auth:** No
- **Example:** `/api/market/price/AAPL`
- **Response (200):**
  ```json
  {
    "symbol": "AAPL",
    "name": "Apple Inc",
    "price": 182.52,
    "change": 2.3,
    "trend": "up"
  }
  ```
- **Status:** ✓ Working

### 10. **Get Multiple Asset Prices**
- **Route:** `GET /api/market/prices?symbols=AAPL&symbols=BTC`
- **Auth:** No
- **Response (200):**
  ```json
  {
    "prices": [
      { "symbol": "AAPL", "name": "Apple Inc", "price": 182.52, ... },
      { "symbol": "BTC", "name": "Bitcoin", "price": 43250.5, ... }
    ]
  }
  ```
- **Status:** ✓ Working

### 11. **Get Price History**
- **Route:** `GET /api/market/history/:symbol`
- **Auth:** No
- **Example:** `/api/market/history/AAPL`
- **Response (200):**
  ```json
  {
    "symbol": "AAPL",
    "history": [
      { "date": "2024-01-03", "price": 179.45 },
      { "date": "2024-01-04", "price": 181.23 },
      { "date": "2024-01-05", "price": 178.92 },
      { "date": "2024-01-06", "price": 180.15 },
      { "date": "2024-01-07", "price": 182.52 },
      { "date": "2024-01-08", "price": 183.10 },
      { "date": "2024-01-09", "price": 182.52 }
    ]
  }
  ```
- **Status:** ✓ Working

### 12. **Search Assets**
- **Route:** `GET /api/market/search?q=Apple`
- **Auth:** No
- **Response (200):**
  ```json
  {
    "query": "Apple",
    "results": [
      { "symbol": "AAPL", "name": "Apple Inc", "price": 182.52, ... }
    ]
  }
  ```
- **Status:** ✓ Working

### 13. **Get Trending Assets**
- **Route:** `GET /api/market/trending`
- **Auth:** No
- **Response (200):**
  ```json
  {
    "trending": [
      { "symbol": "BTC", "name": "Bitcoin", "price": 43250.5, "change": 5.2, "trend": "up" },
      { "symbol": "SOL", "name": "Solana", "price": 98.45, "change": 4.3, "trend": "up" },
      { "symbol": "ETH", "name": "Ethereum", "price": 2280.75, "change": 3.8, "trend": "up" },
      { "symbol": "MSFT", "name": "Microsoft", "price": 378.91, "change": 3.1, "trend": "up" },
      { "symbol": "AAPL", "name": "Apple Inc", "price": 182.52, "change": 2.3, "trend": "up" }
    ]
  }
  ```
- **Status:** ✓ Working

### 14. **Get Market Overview**
- **Route:** `GET /api/market/overview?type=stock`
- **Auth:** No
- **Query Parameters:** Optional `type` filter (stock/crypto)
- **Response (200):**
  ```json
  {
    "total": 5,
    "assets": [
      { "symbol": "AAPL", "name": "Apple Inc", "price": 182.52, "type": "stock", ... },
      { "symbol": "GOOGL", "name": "Alphabet Inc", "price": 140.8, "type": "stock", ... },
      { "symbol": "MSFT", "name": "Microsoft", "price": 378.91, "type": "stock", ... },
      { "symbol": "AMZN", "name": "Amazon.com", "price": 187.15, "type": "stock", ... },
      { "symbol": "TSLA", "name": "Tesla Inc", "price": 242.84, "type": "stock", ... }
    ]
  }
  ```
- **Status:** ✓ Working

---

## Supported Assets

### Stocks (5)
- AAPL - Apple Inc ($182.52)
- GOOGL - Alphabet Inc ($140.80)
- MSFT - Microsoft ($378.91)
- AMZN - Amazon.com ($187.15)
- TSLA - Tesla Inc ($242.84)

### Cryptocurrencies (5)
- BTC - Bitcoin ($43,250.50)
- ETH - Ethereum ($2,280.75)
- XRP - Ripple ($0.524)
- ADA - Cardano ($0.98)
- SOL - Solana ($98.45)

---

## Error Handling

All endpoints return appropriate HTTP status codes:

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Server Error |

---

## Authentication

Use JWT Bearer tokens in Authorization header:
```
Authorization: Bearer <token>
```

Tokens are returned on signup/login and expire in 7 days.

---

## Data Models

### User
- `_id`: Unique identifier
- `name`: User's full name
- `email`: Email (unique)
- `balance`: Virtual trading balance (starts at $100,000)
- `role`: user or admin
- `createdAt`: Account creation timestamp

### Portfolio/Holding
- `userId`: Owner user ID
- `symbol`: Asset symbol (e.g., AAPL, BTC)
- `type`: stock or crypto
- `quantity`: Number of units held
- `averagePrice`: Average purchase price per unit
- `currentPrice`: Current market price
- `totalInvested`: Total amount invested
- `currentValue`: Current portfolio value
- `unrealizedPnL`: Unrealized profit/loss
- `createdAt/updatedAt`: Timestamps

### Transaction
- `userId`: User who made the trade
- `symbol`: Asset symbol
- `type`: stock or crypto
- `action`: BUY or SELL
- `quantity`: Amount traded
- `price`: Price per unit at execution
- `totalAmount`: Total transaction value
- `profitLoss`: Profit/loss on SELL (null on BUY)
- `status`: COMPLETED, PENDING, or FAILED
- `createdAt`: Transaction timestamp

---

## Test Results

✓ **All 14 endpoints tested and working:**
- 3/3 Auth endpoints ✓
- 5/5 Trading endpoints ✓
- 6/6 Market endpoints ✓

**Test Run:** `bash test-api.sh`
