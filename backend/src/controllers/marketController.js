import {
  getPrice,
  getPrices,
  getPriceHistory as getPriceHistoryData,
  getTrendingAssets,
  searchAssets,
  getAllMarkets,
  getCoinPrices
} from "../services/marketService.js";

// GET ALL MARKETS (with pagination and currency support)
export const getMarkets = async (req, res) => {
  try {
    const { vs_currency = "usd", per_page = 50, page = 1, asset_type = "all" } = req.query;
    const markets = await getAllMarkets(vs_currency, parseInt(per_page), parseInt(page), asset_type);

    res.json({
      total: markets.length,
      markets,
      currency: vs_currency,
      page: parseInt(page),
      per_page: parseInt(per_page),
    });
  } catch (error) {
    console.error("Get markets error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET COIN PRICES (multi-currency support)
export const getCoinPricesEndpoint = async (req, res) => {
  try {
    const { ids, vs_currencies = "usd,inr" } = req.query;

    if (!ids) {
      return res.status(400).json({ message: "Coin IDs required (ids parameter)" });
    }

    const coinIds = typeof ids === "string" ? ids.split(",") : ids;
    const currencies = typeof vs_currencies === "string" ? vs_currencies.split(",") : vs_currencies;

    const prices = await getCoinPrices(coinIds, currencies);

    res.json(prices);
  } catch (error) {
    console.error("Get coin prices error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET SINGLE PRICE (by symbol)
export const getMarketPrice = async (req, res) => {
  try {
    const { symbol } = req.params;
    const price = await getPrice(symbol);

    if (!price) {
      return res.status(404).json({ message: "Asset not found" });
    }

    res.json(price);
  } catch (error) {
    console.error("Get price error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET MULTIPLE PRICES (by symbols)
export const getMarketPrices = async (req, res) => {
  try {
    const { symbols } = req.query;

    if (!symbols) {
      return res.status(400).json({ message: "Symbols query parameter required" });
    }

    const symbolArray = typeof symbols === "string" ? symbols.split(",") : symbols;
    const prices = await getPrices(symbolArray);

    res.json({ prices });
  } catch (error) {
    console.error("Get prices error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET PRICE HISTORY
export const getPriceHistory = async (req, res) => {
  try {
    const { symbol } = req.params;
    const history = await getPriceHistoryData(symbol);

    if (!history) {
      return res.status(404).json({ message: "Asset not found" });
    }

    res.json({
      symbol,
      history,
    });
  } catch (error) {
    console.error("Get history error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// SEARCH ASSETS
export const searchMarketAssets = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: "Search query required" });
    }

    const results = await searchAssets(q);

    res.json({ query: q, results });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET TRENDING
export const getTrendingMarketAssets = async (req, res) => {
  try {
    const trending = await getTrendingAssets();
    res.json({ trending });
  } catch (error) {
    console.error("Get trending error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET MARKET OVERVIEW
export const getMarketOverview = async (req, res) => {
  try {
    const { vs_currency = "usd" } = req.query;
    const markets = await getAllMarkets(vs_currency, 10, 1);

    res.json({
      total: markets.length,
      assets: markets,
      currency: vs_currency,
    });
  } catch (error) {
    console.error("Get overview error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
