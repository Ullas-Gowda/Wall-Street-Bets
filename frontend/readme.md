# WSB Trading Platform - Frontend

A modern React-based trading platform frontend for stocks and cryptocurrency trading.

## Features

- **Authentication**: User signup and login with JWT tokens
- **Dashboard**: Real-time portfolio overview with balance and P/L tracking
- **Market Browser**: Browse all available stocks and crypto assets
- **Trading Interface**: Buy and sell assets with real-time price updates
- **Portfolio Management**: Track holdings, transactions, and performance
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Theme**: Professional dark UI with Tailwind CSS

## Tech Stack

- **Frontend Framework**: React 18.2.0
- **Build Tool**: Vite 5.0.0
- **Styling**: Tailwind CSS 3.3.6
- **HTTP Client**: Axios 1.6.2
- **Routing**: React Router DOM 6.20.0
- **Icons**: Lucide React 0.344.0

## Project Structure

```
frontend/
├── src/
│   ├── pages/           # Page components
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Market.jsx
│   │   ├── Trade.jsx
│   │   └── Portfolio.jsx
│   ├── components/      # Reusable components
│   │   └── Navbar.jsx
│   ├── App.jsx          # Main app with routing
│   ├── AuthContext.jsx  # Authentication context
│   ├── api.js           # API service layer
│   ├── main.jsx         # React entry point
│   └── index.css        # Global styles
├── index.html           # HTML entry point
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS configuration
└── package.json         # Dependencies
```

## Setup & Installation

### Prerequisites
- Node.js 16+ and npm 7+
- Backend API running on `http://localhost:5001`

### Installation

1. **Install dependencies**:
```bash
cd frontend
npm install
```

2. **Start development server**:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Configuration

### API Proxy

The Vite dev server proxies `/api` requests to `http://localhost:5001` (backend). This is configured in `vite.config.js`:

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:5001',
    changeOrigin: true,
  }
}
```

### Tailwind CSS

Tailwind is configured in `tailwind.config.js` with custom colors for the dark theme:
- Primary colors: Blue and Purple gradients
- Dark background: `#0f1419`
- Slate palette for components

## Pages Overview

### 1. **Login** (`/login`)
- Email and password authentication
- Demo credentials display
- Error handling and loading states
- Link to signup page

### 2. **Signup** (`/signup`)
- User registration with name, email, password
- Password confirmation validation
- Input validation (min 6 characters)
- Error messages

### 3. **Dashboard** (`/dashboard`)
- Portfolio overview cards:
  - Total balance
  - Portfolio value
  - Cash balance
  - Total P/L
- Market overview with trending assets
- Recent transactions table
- Auto-refresh on mount

### 4. **Market** (`/market`)
- Browse all 10 available assets
- Search by symbol
- Filter by type (all, stocks, crypto)
- Asset cards showing:
  - Current price
  - Price change percentage
  - Trending indicator

### 5. **Trade** (`/trade`)
- Buy/sell trading interface
- Asset selection dropdown
- Real-time price display
- Quantity input with total value calculation
- Account balance and max shares display
- Trading tips sidebar
- Success/error message feedback

### 6. **Portfolio** (`/portfolio`)
- Holdings table with:
  - Quantity and average price
  - Current price and value
  - Gain/loss and return percentage
- Transactions history with:
  - Date, symbol, type, quantity, price
  - Color-coded buy/sell transactions
- Portfolio statistics

## Authentication Flow

1. User signs up/logs in
2. Backend returns JWT token
3. Token stored in `localStorage`
4. Axios interceptor automatically adds token to all API requests as `Bearer {token}`
5. Protected routes check authentication before rendering

## API Integration

The frontend communicates with the backend through the API service layer (`src/api.js`):

### Auth API
- `signup(name, email, password)`
- `login(email, password)`
- `getCurrentUser()`

### Trading API
- `buyAsset(symbol, quantity)`
- `sellAsset(symbol, quantity)`
- `getPortfolio()`
- `getTransactions()`
- `getHolding(symbol)`

### Market API
- `getPrice(symbol)`
- `getPrices()`
- `getPriceHistory(symbol)`
- `searchAssets(query)`
- `getTrending()`
- `getOverview()`

## Styling

### Custom Classes (in `index.css`)

```css
.btn-primary    /* Blue-to-purple gradient button */
.btn-secondary  /* Slate button */
.btn-danger     /* Red button */
.input-field    /* Styled input field */
.card           /* Component card with hover effect */
.glass          /* Glassmorphism effect */
.gradient-text  /* Blue-to-purple gradient text */
```

### Responsive Design

- Mobile-first approach using Tailwind breakpoints
- Responsive grid layouts (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Mobile navbar with hamburger menu
- Tablet and desktop optimized views

## Development

### Hot Module Replacement (HMR)
- Changes to files are instantly reflected in the browser
- Component state is preserved

### Console & Debugging
- React DevTools browser extension recommended
- Network tab shows all API calls to backend
- Application tab shows localStorage tokens

## Performance

- Lazy loading of components with React Router
- Optimized re-renders with hooks
- API calls batched where possible (Portfolio, Dashboard)
- CSS-in-JS via Tailwind for minimal bundle size

## Known Limitations

- In-memory backend storage (resets on restart)
- No real-time price updates (static prices)
- 10 assets supported (5 stocks + 5 crypto)
- No chart visualization (yet)

## Future Enhancements

- Real-time price WebSockets
- Interactive price charts (Chart.js / Recharts)
- Portfolio analytics and insights
- Advanced order types (limit, stop-loss)
- Paper trading competitions
- Social features (follow traders, share portfolios)
- Mobile app (React Native)

## Troubleshooting

### Frontend not connecting to backend
- Ensure backend is running on port 5001
- Check browser console for CORS errors
- Verify `/api` proxy in `vite.config.js`

### Login fails
- Verify backend is running
- Check demo credentials: test@example.com / password123
- Look at network tab to see API response

### Styles not loading
- Clear browser cache (Cmd+Shift+R on Mac)
- Restart dev server: `npm run dev`
- Check Tailwind CSS is building classes

### Build errors
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again
- Check Node.js version (16+)

## Support

For issues or questions, refer to the backend README for API endpoint details.

---

Built with React + Vite + Tailwind CSS
