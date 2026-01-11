# WSB Trading Platform - Frontend Setup Guide

## Quick Start

Your complete React frontend for the Wall Street Bets trading platform is ready!

### Running the Frontend

```bash
cd frontend
npm run dev
```

The app will start on **http://localhost:5173**

### Required: Backend Running

Make sure your backend is running on port 5001:

```bash
cd backend
npm start
```

## What's Included

### 6 Full Pages

1. **Login** - Email/password authentication
2. **Signup** - User registration
3. **Dashboard** - Portfolio overview with stats
4. **Market** - Browse and search all assets
5. **Trade** - Buy/sell interface
6. **Portfolio** - Holdings and transaction history

### Components

- **Navbar** - Navigation with user menu
- **AuthContext** - Global authentication state
- **API Service** - Axios client with token injection

### Styling

- **Tailwind CSS** - Utility-first CSS framework
- **Dark Theme** - Professional dark UI
- **Responsive** - Mobile, tablet, desktop

## Demo Credentials

After the backend generates test user:

```
Email: test@example.com
Password: password123
```

Or create your own account via signup.

## Features

✅ JWT authentication with localStorage  
✅ Protected routes and private pages  
✅ Real-time API integration  
✅ Form validation and error handling  
✅ Loading states and spinners  
✅ Success/error message display  
✅ Responsive mobile-first design  
✅ Dark theme with gradients  
✅ Icon library (Lucide React)  

## Project Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── Login.jsx       - Authentication
│   │   ├── Signup.jsx      - Registration
│   │   ├── Dashboard.jsx   - Home/overview
│   │   ├── Market.jsx      - Asset browser
│   │   ├── Trade.jsx       - Buy/sell form
│   │   └── Portfolio.jsx   - Holdings & history
│   ├── components/
│   │   └── Navbar.jsx      - Header navigation
│   ├── App.jsx             - Router setup
│   ├── AuthContext.jsx     - Auth state
│   ├── api.js              - API client
│   └── index.css           - Global styles
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## Available Scripts

```bash
npm run dev      # Start dev server (port 5173)
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Supported Assets

**Stocks**: AAPL, GOOGL, MSFT, AMZN, TSLA  
**Crypto**: BTC, ETH, XRP, ADA, SOL  

## Architecture

```
Browser (http://localhost:5173)
    ↓
React App (Vite)
    ↓
Axios API Client
    ↓
Vite Proxy (/api)
    ↓
Express Backend (http://localhost:5001)
```

The Vite dev server automatically proxies `/api` to the backend.

## Customization

### Change Theme Colors

Edit `tailwind.config.js`:
```javascript
colors: {
  slate: {
    900: '#0f1419',  // Background
    800: '#1a1f2e',  // Cards
  }
}
```

### Add New Pages

1. Create `src/pages/NewPage.jsx`
2. Add route in `App.jsx`
3. Add navbar link in `Navbar.jsx`

### Add API Calls

Use the API service in `src/api.js`:

```javascript
import { tradingAPI, marketAPI } from '../api';

// In your component
const res = await tradingAPI.getPortfolio();
const price = await marketAPI.getPrice('AAPL');
```

## Testing

Login with demo credentials and try:

1. **Dashboard**: View portfolio and balance
2. **Market**: Browse and search assets
3. **Trade**: Buy some shares
4. **Portfolio**: See holdings and P/L
5. **Logout**: Test authentication flow

## Deployment

### Build Production Bundle

```bash
npm run build
```

Creates optimized `dist/` folder.

### Host on Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Host on GitHub Pages

See Vite deployment docs for configuration.

## Troubleshooting

### "Cannot find module" errors
```bash
rm -rf node_modules package-lock.json
npm install
```

### Backend connection fails
- Check backend running on port 5001
- Check browser console for CORS errors
- Restart dev server: `npm run dev`

### Tailwind styles not showing
- Clear cache: Cmd+Shift+R (Mac) / Ctrl+Shift+R (Windows)
- Restart dev server

### Login not working
- Ensure backend test user exists
- Check email/password in database
- Look at Network tab for API errors

## Next Steps

1. ✅ Frontend running on port 5173
2. ✅ Backend running on port 5001
3. Test login with demo credentials
4. Create a trading account
5. Start trading and building portfolio!

## Support & Issues

Check backend README for API endpoint documentation.

---

**Frontend Ready!** 🚀
