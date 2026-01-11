import axios from "axios";

// Cache for API responses to avoid rate limiting (5 minute TTL)
const cache = new Map();
const CACHE_TTL = 300000; // 5 minutes

// Fallback mock data for when APIs fail
const FALLBACK_STOCKS = {
  AAPL: { symbol: "AAPL", name: "Apple Inc", price: 182.52, change: 2.3, trend: "up", type: "stock" },
  GOOGL: { symbol: "GOOGL", name: "Alphabet Inc", price: 140.8, change: -1.2, trend: "down", type: "stock" },
  MSFT: { symbol: "MSFT", name: "Microsoft", price: 378.91, change: 3.1, trend: "up", type: "stock" },
  AMZN: { symbol: "AMZN", name: "Amazon.com", price: 187.15, change: 1.8, trend: "up", type: "stock" },
  TSLA: { symbol: "TSLA", name: "Tesla Inc", price: 242.84, change: -2.5, trend: "down", type: "stock" },
  NFLX: { symbol: "NFLX", name: "Netflix", price: 287.50, change: 1.5, trend: "up", type: "stock" },
  META: { symbol: "META", name: "Meta", price: 568.20, change: 0.8, trend: "up", type: "stock" },
  NVIDIA: { symbol: "NVIDIA", name: "NVIDIA", price: 142.05, change: 2.1, trend: "up", type: "stock" },
};

const FALLBACK_CRYPTO = {
  BTC: { symbol: "BTC", name: "Bitcoin", price: 90617, change: -0.6, trend: "down", type: "crypto" },
  ETH: { symbol: "ETH", name: "Ethereum", price: 3094.17, change: -0.44, trend: "down", type: "crypto" },
  XRP: { symbol: "XRP", name: "Ripple", price: 2.09, change: -0.64, trend: "down", type: "crypto" },
  ADA: { symbol: "ADA", name: "Cardano", price: 0.39, change: -1.35, trend: "down", type: "crypto" },
  SOL: { symbol: "SOL", name: "Solana", price: 136.41, change: -1.9, trend: "down", type: "crypto" },
  DOGE: { symbol: "DOGE", name: "Dogecoin", price: 0.14, change: -1.88, trend: "down", type: "crypto" },
  LTC: { symbol: "LTC", name: "Litecoin", price: 152.30, change: 0.5, trend: "up", type: "crypto" },
};

const CRYPTO_IDS = {
  BTC: "bitcoin",
  ETH: "ethereum",
  XRP: "ripple",
  ADA: "cardano",
  SOL: "solana",
  DOGE: "dogecoin",
  LTC: "litecoin",
};

let allPricesCache = null;

// Fetch crypto prices from CoinGecko with retry logic
const fetchCryptoPrices = async (retryCount = 0) => {
  try {
    const cacheKey = "crypto_prices";
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    const ids = Object.values(CRYPTO_IDS).join(",");
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`,
      { timeout: 3000 }
    );

    const cryptoPrices = {};
    for (const [symbol, cryptoId] of Object.entries(CRYPTO_IDS)) {
      const data = response.data[cryptoId];
      if (data) {
        const change = data.usd_24h_change || 0;
        cryptoPrices[symbol] = {
          symbol,
          name: cryptoId.charAt(0).toUpperCase() + cryptoId.slice(1),
          price: parseFloat(data.usd.toFixed(2)),
          change: parseFloat(change.toFixed(2)),
          trend: change >= 0 ? "up" : "down",
          type: "crypto",
        };
      }
    }

    cache.set(cacheKey, { data: cryptoPrices, timestamp: Date.now() });
    return cryptoPrices;
  } catch (error) {
    console.warn("CoinGecko API error (attempt", retryCount + 1, "):", error.message);
    
    // Retry once more if it failed
    if (retryCount < 1) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms before retry
      return fetchCryptoPrices(retryCount + 1);
    }
    
    console.warn("Using fallback crypto data");
    return FALLBACK_CRYPTO;
  }
};

// Use fallback data for stocks (Alpha Vantage has strict rate limits on free tier)
const getStockPrices = () => {
  return FALLBACK_STOCKS;
};

// Pre-cache prices on startup (non-blocking)
const initializePrices = async () => {
  try {
    console.log("⏳ Pre-loading market data...");
    const [cryptoPrices, stockPrices] = await Promise.all([
      fetchCryptoPrices(),
      Promise.resolve(getStockPrices()),
    ]);
    allPricesCache = { ...stockPrices, ...cryptoPrices };
    console.log("✓ Market data loaded:", Object.keys(allPricesCache).length, "assets");
  } catch (error) {
    console.error("Failed to initialize prices:", error.message);
    allPricesCache = { ...getStockPrices(), ...FALLBACK_CRYPTO };
  }
};

// Initialize prices asynchronously without blocking startup
setImmediate(() => initializePrices().catch(err => console.error("Init error:", err.message)));

// Refresh prices every 5 minutes
setInterval(() => {
  initializePrices().catch(err => console.error("Background refresh failed:", err.message));
}, 300000);

// Get all prices (stocks + crypto)
const getAllPrices = async () => {
  // Return cached data if available
  if (allPricesCache && Object.keys(allPricesCache).length > 0) {
    return allPricesCache;
  }

  // Otherwise fetch fresh data
  const [cryptoPrices, stockPrices] = await Promise.all([
    fetchCryptoPrices(),
    Promise.resolve(getStockPrices()),
  ]);
  return { ...stockPrices, ...cryptoPrices };
};

export const getPrice = async (symbol) => {
  const allPrices = await getAllPrices();
  return allPrices[symbol.toUpperCase()] || null;
};

export const getPrices = async (symbols) => {
  const allPrices = await getAllPrices();
  return symbols.map((s) => allPrices[s.toUpperCase()]).filter(Boolean);
};

export const getPriceHistory = async (symbol) => {
  const price = await getPrice(symbol);
  if (!price) return null;

  // Generate realistic history for last 7 days
  const history = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const variation = (Math.random() - 0.5) * price.price * 0.05;
    history.push({
      date: date.toISOString().split("T")[0],
      price: parseFloat((price.price + variation).toFixed(2)),
    });
  }
  return history;
};

export const getTrendingAssets = async () => {
  const allPrices = await getAllPrices();
  const allAssets = Object.values(allPrices);
  return allAssets.sort((a, b) => Math.abs(b.change) - Math.abs(a.change)).slice(0, 10);
};

export const searchAssets = async (query) => {
  const search = query.toLowerCase();
  const allPrices = await getAllPrices();
  return Object.values(allPrices).filter(
    (asset) => asset.symbol.toLowerCase().includes(search) || asset.name.toLowerCase().includes(search)
  );
};
