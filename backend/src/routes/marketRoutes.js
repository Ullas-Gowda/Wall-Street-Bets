import express from "express";
import {
  getMarketPrice,
  getMarketPrices,
  getPriceHistory,
  searchMarketAssets,
  getTrendingMarketAssets,
  getMarketOverview,
} from "../controllers/marketController.js";

const router = express.Router();

// Market routes (public, no authentication required)
router.get("/price/:symbol", getMarketPrice);
router.get("/prices", getMarketPrices);
router.get("/history/:symbol", getPriceHistory);
router.get("/search", searchMarketAssets);
router.get("/trending", getTrendingMarketAssets);
router.get("/overview", getMarketOverview);

export default router;
