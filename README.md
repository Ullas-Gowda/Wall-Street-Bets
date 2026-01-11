# Wall Street Bets - Trading Platform

A full-stack web application for trading stocks and cryptocurrencies with real-time market data, portfolio management, and secure user authentication.

**Status**: ✅ Complete and Production Ready

---

## 🎯 Features

### Core Trading Features
- ✅ **User Authentication** - Secure signup/login with JWT tokens
- ✅ **Buy/Sell Assets** - Trade stocks and cryptocurrencies
- ✅ **Portfolio Management** - Track holdings and performance
- ✅ **Transaction History** - Complete trade records with timestamps
- ✅ **Real-time Market Data** - Live stock and crypto prices
- ✅ **Balance Management** - Account balance tracking and updates
- ✅ **Watchlist** - Add/remove favorite assets

### Technical Features
- ✅ **Responsive Design** - Works on desktop, tablet, and mobile
- ✅ **MongoDB Integration** - Optional persistent data storage
- ✅ **JWT Authentication** - Secure API endpoints
- ✅ **Error Handling** - Comprehensive error messages
- ✅ **CORS Support** - Cross-origin requests enabled

---

## 🛠️ Tech Stack

### Backend
| Component | Technology | Version |
|-----------|-----------|---------|
| Runtime | Node.js | v24.3.0+ |
| Framework | Express.js | 5.2.1+ |
| Database | MongoDB | (Optional) |
| Authentication | JWT + bcryptjs | 9.0.3 / 3.0.3 |
| Security | Helmet | 8.1.0 |
| Logging | Morgan | 1.10.1 |

### Frontend
| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | React | 18.2.0+ |
| Build Tool | Vite | 5.0.0+ |
| Styling | Tailwind CSS | 3.3.6+ |
| HTTP Client | Axios | 1.6.2+ |
| Routing | React Router | 6.20.0+ |
| Icons | Lucide React | 0.344.0+ |

---

## 📋 Prerequisites

Before you begin, ensure you have installed:
- **Node.js** v24.3.0 or higher ([Download](https://nodejs.org/))
- **npm** v10.0.0 or higher (comes with Node.js)
- **Git** (optional, for version control)

### Optional
- **MongoDB** ([Download](https://www.mongodb.com/try/download/community)) - for persistent data storage
- **Postman** ([Download](https://www.postman.com/)) - for API testing

---

## 🚀 Quick Start

### 1. Clone/Navigate to Project
```bash
cd Wall-Street-Bets
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### 4. Start Backend Server (Terminal 1)
```bash
cd backend
npm start
# Server runs on http://localhost:5001
```

### 5. Start Frontend Development Server (Terminal 2)
```bash
cd frontend
npm run dev
# App runs on http://localhost:5173
```

### 6. Access the Application
- **URL**: [http://localhost:5173](http://localhost:5173)
- **Demo Credentials**:
  - Email: `test@example.com`
  - Password: `password123`

---

## 📁 Project Structure

```
Wall-Street-Bets/
├── backend/                          # Node.js/Express API
│   ├── src/
│   │   ├── app.js                   # Express app configuration
│   │   ├── server.js                # Server entry point
│   │   ├── config/
│   │   │   ├── db.js                # MongoDB configuration
│   │   │   └── memory.js            # In-memory storage config
│   │   ├── controllers/              # Business logic
│   │   │   ├── authController.js    # Authentication logic
│   │   │   ├── marketController.js  # Market data logic
│   │   │   └── tradeController.js   # Trading operations
│   │   ├── models/                   # Database schemas
│   │   │   ├── User.js              # User schema
│   │   │   ├── Portfolio.js         # Portfolio schema
│   │   │   └── Transaction.js       # Transaction schema
│   │   ├── routes/                   # API routes
│   │   │   ├── authRoutes.js        # Auth endpoints
│   │   │   ├── marketRoutes.js      # Market endpoints
│   │   │   └── tradeRoutes.js       # Trading endpoints
│   │   ├── middleware/
│   │   │   └── authenticate.js      # JWT verification
│   │   ├── services/
│   │   │   └── marketService.js     # External API calls
│   │   └── utils/
│   │       └── jwt.js               # JWT utilities
│   ├── package.json
│   └── README.md
│
├── frontend/                         # React + Vite application
│   ├── src/
│   │   ├── main.jsx                 # Entry point
│   │   ├── App.jsx                  # Root component
│   │   ├── AuthContext.jsx          # Auth state management
│   │   ├── api.js                   # API client setup
│   │   ├── index.css                # Global styles
│   │   ├── components/
│   │   │   └── Navbar.jsx           # Navigation component
│   │   └── pages/                   # Page components
│   │       ├── Dashboard.jsx        # Main dashboard
│   │       ├── Login.jsx            # Login page
│   │       ├── Signup.jsx           # Registration page
│   │       ├── Market.jsx           # Market view
│   │       ├── Portfolio.jsx        # Portfolio view
│   │       └── Trade.jsx            # Trading interface
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── README.md
│
├── README.md                         # This file
├── PROJECT_SUMMARY.md               # Project overview
├── COMPLETE_DOCUMENTATION.md        # Full documentation
├── API_ENDPOINTS.md                 # API reference
└── QUICK_START_MONGODB.md          # MongoDB setup guide

```

---

## 🔐 API Endpoints

### Authentication (3 endpoints)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| POST | `/api/auth/signup` | Create new user account | No |
| POST | `/api/auth/login` | User login | No |
| GET | `/api/auth/me` | Get current user info | Yes |

### Trading (5 endpoints)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| POST | `/api/trade/buy` | Buy stocks/crypto | Yes |
| POST | `/api/trade/sell` | Sell stocks/crypto | Yes |
| GET | `/api/trade/history` | Get transaction history | Yes |
| GET | `/api/trade/portfolio` | Get user portfolio | Yes |
| DELETE | `/api/trade/portfolio/:id` | Remove from portfolio | Yes |

### Market (6 endpoints)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---|
| GET | `/api/market/stocks` | Get stock prices | No |
| GET | `/api/market/crypto` | Get crypto prices | No |
| GET | `/api/market/search` | Search assets | No |
| POST | `/api/market/watchlist` | Add to watchlist | Yes |
| DELETE | `/api/market/watchlist/:symbol` | Remove from watchlist | Yes |
| GET | `/api/market/watchlist` | Get watchlist | Yes |

For complete API documentation with request/response examples, see [API_ENDPOINTS.md](backend/API_ENDPOINTS.md).

---

## 🔌 Environment Variables

### Backend Configuration
Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5001

# MongoDB (Optional - for persistent storage)
MONGODB_URI=mongodb://localhost:27017/wall-street-bets
USE_MONGODB=false

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=24h

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# External APIs
ALPHA_VANTAGE_API_KEY=your_api_key_here
COINGECKO_API_KEY=your_api_key_here
```

### Frontend Configuration
Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5001
```

---

## 📊 Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  balance: Number (default: 100000),
  role: String (default: "user"),
  watchlist: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Portfolio Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  symbol: String,
  type: String ("stock" | "crypto"),
  quantity: Number,
  averagePrice: Number,
  totalValue: Number,
  lastUpdated: Date
}
```

### Transaction Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  symbol: String,
  type: String ("stock" | "crypto"),
  action: String ("BUY" | "SELL"),
  quantity: Number,
  price: Number,
  total: Number,
  timestamp: Date,
  status: String ("completed" | "pending" | "failed")
}
```

---

## 🧪 Testing the API

### Using cURL
```bash
# Signup
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'

# Get current user (replace TOKEN with actual JWT)
curl -X GET http://localhost:5001/api/auth/me \
  -H "Authorization: Bearer TOKEN"
```

### Using Postman
1. Import the API endpoints from [API_ENDPOINTS.md](backend/API_ENDPOINTS.md)
2. Set up a Bearer token in the Authorization tab
3. Test each endpoint with provided request bodies

### Using the Test Script
```bash
cd backend
bash test-api.sh
```

---

## 🔄 Data Storage Options

### In-Memory Storage (Default)
- ✅ No setup required
- ✅ Fast for development
- ✅ Data lost on server restart
- Good for: Testing and development

### MongoDB (Optional)
- ✅ Persistent data storage
- ✅ Production-ready
- ✅ Scalable to millions of records

**Setup MongoDB:**
See [QUICK_START_MONGODB.md](QUICK_START_MONGODB.md) for complete MongoDB setup instructions.

---

## 🛠️ Development Workflow

### Backend Development
```bash
cd backend

# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Start production server
npm start
```

### Frontend Development
```bash
cd frontend

# Install dependencies
npm install

# Start development server with HMR
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 🐛 Troubleshooting

### Backend Issues

**Error: Port 5001 already in use**
```bash
# Find process using port 5001 (macOS/Linux)
lsof -i :5001

# Kill the process
kill -9 <PID>

# Or change port in backend/.env
PORT=5002
```

**Error: Cannot find module**
```bash
# Reinstall dependencies
cd backend
rm -rf node_modules package-lock.json
npm install
```

**MongoDB Connection Error**
- Check if MongoDB is running: `mongod --version`
- Verify `MONGODB_URI` in `.env` file
- Ensure MongoDB service is started

### Frontend Issues

**Error: Vite failed to resolve**
```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json .vite
npm install
```

**CORS Error in Console**
- Ensure backend is running on port 5001
- Check `CORS_ORIGIN` in backend `.env`
- Verify frontend URL in `VITE_API_URL`

**Blank page or component not rendering**
- Clear browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)
- Check browser console for errors (F12)
- Ensure all dependencies installed: `npm install`

---

## 📈 Performance Tips

### Backend Optimization
- Enable caching for market data API calls
- Use pagination for portfolio and transaction endpoints
- Implement database indexing on frequently queried fields
- Use connection pooling for MongoDB

### Frontend Optimization
- Lazy load components using React.lazy()
- Implement code splitting in Vite
- Use production build: `npm run build`
- Enable gzip compression in server

---

## 🔒 Security Best Practices

### Implemented
- ✅ Password hashing with bcryptjs
- ✅ JWT token authentication
- ✅ CORS validation
- ✅ Input validation and sanitization
- ✅ Helmet.js security headers

### Recommendations
- ⚠️ Change JWT_SECRET in production
- ⚠️ Use HTTPS in production
- ⚠️ Set secure cookie flags
- ⚠️ Implement rate limiting
- ⚠️ Add two-factor authentication
- ⚠️ Audit third-party API keys

---

## 📚 Additional Documentation

- [Backend README](backend/README.md) - Backend setup and details
- [Frontend README](frontend/README.md) - Frontend setup and details
- [API Endpoints](backend/API_ENDPOINTS.md) - Complete API reference
- [Complete Documentation](COMPLETE_DOCUMENTATION.md) - Full technical docs
- [Project Summary](PROJECT_SUMMARY.md) - Project overview
- [MongoDB Setup](QUICK_START_MONGODB.md) - Database configuration

---

## 🤝 Contributing

### Reporting Issues
1. Check existing issues in your version
2. Provide detailed reproduction steps
3. Include error messages and logs
4. Specify Node.js and npm versions

### Code Contributions
1. Create a new branch for your feature
2. Follow existing code style and conventions
3. Test your changes thoroughly
4. Submit a pull request with clear description

### Code Style Guide
- Use ES6+ syntax
- Follow airbnb/eslint conventions
- Add comments for complex logic
- Keep functions small and focused
- Use meaningful variable names

---

## 📄 License

This project is licensed under the ISC License - see LICENSE file for details.

---

## 👨‍💻 Support

For help and support:
1. Check the troubleshooting section above
2. Review [COMPLETE_DOCUMENTATION.md](COMPLETE_DOCUMENTATION.md)
3. Check API endpoints in [API_ENDPOINTS.md](backend/API_ENDPOINTS.md)
4. Review browser console for error messages

---

## 🎉 Getting Help

### Common Questions

**Q: How do I reset my password?**
A: Currently not implemented. Delete your account and create a new one.

**Q: Can I trade real money?**
A: No, this is a demo application with virtual trading accounts.

**Q: How often is market data updated?**
A: Every time you refresh the market page (real-time API calls).

**Q: Can I export my trading history?**
A: Currently not implemented, but you can view it in the app.

**Q: Is my data secure?**
A: Yes, passwords are hashed and API calls use JWT tokens. However, do not store real credentials.

---

**Last Updated**: January 2026  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
