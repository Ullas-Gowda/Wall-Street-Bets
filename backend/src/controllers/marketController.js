import { getPrice, getPrices, getPriceHistory as getPriceHistoryData, getTrendingAssets, searchAssets } from "../services/marketService.js";

// GET SINGLE PRICE
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

// GET MULTIPLE PRICES
export const getMarketPrices = async (req, res) => {
  try {
    const { symbols } = req.query;

    if (!symbols) {
      return res.status(400).json({ message: "Symbols query parameter required" });
    }

    const symbolArray = typeof symbols === "string" ? [symbols] : symbols;
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

// GET MARKET OVERVIEW (ALL ASSETS)
export const getMarketOverview = async (req, res) => {
  try {
    const { type } = req.query; // "stock" or "crypto"

    const trending = await getTrendingAssets();
    let assets = trending;

    if (type) {
      assets = assets.filter((a) => a.type === type.toLowerCase());
    }

    res.json({
      total: assets.length,
      assets,
    });
  } catch (error) {
    console.error("Get overview error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
