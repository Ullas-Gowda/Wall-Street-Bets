import axios from "axios";

// Cache for API responses to avoid rate limiting (5 minute TTL)
const cache = new Map();
const CACHE_TTL = 300000; // 5 minutes

// CoinGecko API configuration
const COINGECKO_BASE_URL = "https://api.coingecko.com/api/v3";

// Helper to add API key header if available (for Pro tier)
const getCoinGeckoHeaders = () => {
  const apiKey = process.env.COINGECKO_API_KEY;
  if (apiKey) {
    return { "x-cg-pro-api-key": apiKey };
  }
  return {};
};

// Fallback mock data for when APIs fail
const FALLBACK_CRYPTO = {
  bitcoin: { id: "bitcoin", symbol: "BTC", name: "Bitcoin", current_price: 90617, price_change_percentage_24h: -0.6, market_cap: 1800000000000, image: "https://assets.coingecko.com/coins/images/1/small/bitcoin.png", type: "crypto" },
  ethereum: { id: "ethereum", symbol: "ETH", name: "Ethereum", current_price: 3094.17, price_change_percentage_24h: -0.44, market_cap: 370000000000, image: "https://assets.coingecko.com/coins/images/279/small/ethereum.png", type: "crypto" },
  ripple: { id: "ripple", symbol: "XRP", name: "XRP", current_price: 2.09, price_change_percentage_24h: -0.64, market_cap: 120000000000, image: "https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png", type: "crypto" },
  cardano: { id: "cardano", symbol: "ADA", name: "Cardano", current_price: 0.39, price_change_percentage_24h: -1.35, market_cap: 14000000000, image: "https://assets.coingecko.com/coins/images/975/small/cardano.png", type: "crypto" },
  solana: { id: "solana", symbol: "SOL", name: "Solana", current_price: 136.41, price_change_percentage_24h: -1.9, market_cap: 65000000000, image: "https://assets.coingecko.com/coins/images/4128/small/solana.png", type: "crypto" },
  dogecoin: { id: "dogecoin", symbol: "DOGE", name: "Dogecoin", current_price: 0.14, price_change_percentage_24h: -1.88, market_cap: 21000000000, image: "https://assets.coingecko.com/coins/images/5/small/dogecoin.png", type: "crypto" },
  litecoin: { id: "litecoin", symbol: "LTC", name: "Litecoin", current_price: 152.30, price_change_percentage_24h: 0.5, market_cap: 11000000000, image: "https://assets.coingecko.com/coins/images/2/small/litecoin.png", type: "crypto" },
};

// Fetch crypto markets from CoinGecko with retry logic
const fetchCryptoMarkets = async (vsCurrency = "usd", perPage = 50, page = 1, retryCount = 0) => {
  try {
    const cacheKey = `crypto_markets_${vsCurrency}_${perPage}_${page}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    const response = await axios.get(
      `${COINGECKO_BASE_URL}/coins/markets`,
      {
        params: {
          vs_currency: vsCurrency,
          order: "market_cap_desc",
          per_page: perPage,
          page: page,
          sparkline: false,
          price_change_percentage: "24h",
        },
        headers: getCoinGeckoHeaders(),
        timeout: 5000,
      }
    );

    const markets = response.data.map((coin) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      image: coin.image,
      current_price: coin.current_price,
      market_cap: coin.market_cap,
      market_cap_rank: coin.market_cap_rank,
      price_change_percentage_24h: coin.price_change_percentage_24h || 0,
      total_volume: coin.total_volume,
      circulating_supply: coin.circulating_supply,
      type: "crypto",
    }));

    cache.set(cacheKey, { data: markets, timestamp: Date.now() });
    return markets;
  } catch (error) {
    console.warn("CoinGecko markets API error (attempt", retryCount + 1, "):", error.message);

    // Retry once more if it failed
    if (retryCount < 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return fetchCryptoMarkets(vsCurrency, perPage, page, retryCount + 1);
    }

    console.warn("Using fallback crypto market data");
    return Object.values(FALLBACK_CRYPTO);
  }
};

// Fetch specific coin prices from CoinGecko
const fetchCoinPrices = async (coinIds, vsCurrencies = ["usd", "inr"], retryCount = 0) => {
  try {
    const cacheKey = `coin_prices_${coinIds.join(",")}_${vsCurrencies.join(",")}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    const response = await axios.get(
      `${COINGECKO_BASE_URL}/simple/price`,
      {
        params: {
          ids: coinIds.join(","),
          vs_currencies: vsCurrencies.join(","),
          include_24hr_change: true,
          include_market_cap: true,
        },
        headers: getCoinGeckoHeaders(),
        timeout: 5000,
      }
    );

    cache.set(cacheKey, { data: response.data, timestamp: Date.now() });
    return response.data;
  } catch (error) {
    console.warn("CoinGecko price API error (attempt", retryCount + 1, "):", error.message);

    if (retryCount < 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return fetchCoinPrices(coinIds, vsCurrencies, retryCount + 1);
    }

    console.warn("Using fallback price data");
    const fallback = {};
    coinIds.forEach(id => {
      if (FALLBACK_CRYPTO[id]) {
        fallback[id] = {
          usd: FALLBACK_CRYPTO[id].current_price,
          inr: FALLBACK_CRYPTO[id].current_price * 83,
          usd_24h_change: FALLBACK_CRYPTO[id].price_change_percentage_24h,
          inr_24h_change: FALLBACK_CRYPTO[id].price_change_percentage_24h,
        };
      }
    });
    return fallback;
  }
};

// Search coins on CoinGecko
const searchCoins = async (query, retryCount = 0) => {
  try {
    const cacheKey = `coin_search_${query}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }

    const response = await axios.get(
      `${COINGECKO_BASE_URL}/search`,
      {
        params: { query },
        headers: getCoinGeckoHeaders(),
        timeout: 5000,
      }
    );

    const results = response.data.coins.slice(0, 10).map(coin => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      image: coin.large || coin.thumb,
      market_cap_rank: coin.market_cap_rank,
      country: "Crypto",
      type: "crypto"
    }));

    cache.set(cacheKey, { data: results, timestamp: Date.now() });
    return results;
  } catch (error) {
    console.warn("CoinGecko search API error (attempt", retryCount + 1, "):", error.message);

    if (retryCount < 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
      return searchCoins(query, retryCount + 1);
    }

    return [];
  }
};

// Cache for all markets data
let allMarketsCache = null;

// Pre-cache market data on startup
const initializeMarkets = async () => {
  try {
    console.log("⏳ Pre-loading crypto market data...");
    // Fetch USD by default for cache
    allMarketsCache = await fetchCryptoMarkets("usd", 100, 1);
    console.log("✓ Market data loaded:", allMarketsCache.length, "cryptocurrencies");
  } catch (error) {
    console.error("Failed to initialize markets:", error.message);
    allMarketsCache = Object.values(FALLBACK_CRYPTO);
  }
};

// Initialize markets asynchronously
setImmediate(() => initializeMarkets().catch(err => console.error("Init error:", err.message)));

// Refresh markets every 5 minutes
setInterval(() => {
  initializeMarkets().catch(err => console.error("Background refresh failed:", err.message));
}, 300000);

// Get all markets (Crypto only)
export const getAllMarkets = async (vsCurrency = "usd", perPage = 50, page = 1, assetType = "all") => {
  let cryptoMarkets = [];

  // Use cache if requesting default params (USD, page 1)
  if (vsCurrency === "usd" && page === 1 && allMarketsCache && perPage === 100) {
    // If cache matches request
    cryptoMarkets = allMarketsCache.slice(0, perPage);
  } else if (vsCurrency === "usd" && page === 1 && allMarketsCache) {
    cryptoMarkets = allMarketsCache.slice(0, perPage);
  } else {
    cryptoMarkets = await fetchCryptoMarkets(vsCurrency, perPage, page);
  }

  // Inject currency field for UI
  return cryptoMarkets.map(c => ({
    ...c,
    currency: vsCurrency.toUpperCase(),
    market: "Crypto",
    type: "crypto"
  }));
};

// Get price for a single asset by symbol (Crypto only)
export const getPrice = async (symbol) => {
  if (!allMarketsCache) {
    await initializeMarkets();
  }

  const upperSymbol = symbol.toUpperCase();

  // Search in crypto cache (O(n) but n is small ~100)
  let asset = allMarketsCache.find(
    (coin) => coin.symbol.toUpperCase() === upperSymbol
  );

  // If not found in cache, we could try searching CoinGecko API specifically?
  // But standard flow is to use cached top 100 or search results.
  // We'll stick to cache for speed and simplicity. 
  // If use searches 'DOGE' and it's in top 100, we find it.

  if (!asset) {
    // Optional: Deep search if needed, but keeping it simple for now as per "simple project" request
    // Only cache is authoritative for "Buy" price to ensure consistency
    // Actually, let's allow searching API for price if missing
    try {
      const searchRes = await searchCoins(symbol);
      const match = searchRes.find(s => s.symbol === upperSymbol);
      if (match) {
        // We need PRICE, search results don't have price.
        // Fetch price via simple/price
        const prices = await fetchCoinPrices([match.id], ["usd"]);
        if (prices[match.id]) {
          return {
            id: match.id,
            symbol: match.symbol,
            name: match.name,
            current_price: prices[match.id].usd,
            type: "crypto",
            currency: "USD"
          };
        }
      }
    } catch (e) {
      console.warn("Deep search for price failed:", e.message);
    }
  }

  return asset ? { ...asset, currency: "USD" } : null;
};

// Get prices for multiple assets by symbols
export const getPrices = async (symbols) => {
  const promises = symbols.map(s => getPrice(s));
  const results = await Promise.all(promises);
  return results.filter(Boolean);
};

// Get specific coin prices with multiple currencies
export const getCoinPrices = async (coinIds, vsCurrencies = ["usd", "inr"]) => {
  return await fetchCoinPrices(coinIds, vsCurrencies);
};

// Get price history
export const getPriceHistory = async (symbol) => {
  const price = await getPrice(symbol);
  if (!price) return null;

  // Generate realistic history
  const history = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const variation = (Math.random() - 0.5) * price.current_price * 0.05;
    history.push({
      date: date.toISOString().split("T")[0],
      price: parseFloat((price.current_price + variation).toFixed(2)),
    });
  }
  return history;
};

// Get trending assets
export const getTrendingAssets = async () => {
  if (!allMarketsCache) {
    await initializeMarkets();
  }

  return [...allMarketsCache]
    .sort((a, b) => Math.abs(b.price_change_percentage_24h) - Math.abs(a.price_change_percentage_24h))
    .slice(0, 10);
};

// Search assets (Crypto only)
export const searchAssets = async (query) => {
  if (!query || query.trim().length < 2) {
    return [];
  }
  return await searchCoins(query);
};
