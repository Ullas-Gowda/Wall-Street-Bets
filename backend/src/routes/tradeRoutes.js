import express from "express";
import { buyAsset, sellAsset, getPortfolio, getTransactions, getHolding } from "../controllers/tradeController.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

// All trade routes require authentication
router.post("/buy", authenticate, buyAsset);
router.post("/sell", authenticate, sellAsset);
router.get("/portfolio", authenticate, getPortfolio);
router.get("/transactions", authenticate, getTransactions);
router.get("/holding/:symbol", authenticate, getHolding);

export default router;
