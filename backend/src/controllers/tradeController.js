import User from "../models/User.js";
import Portfolio from "../models/Portfolio.js";
import Transaction from "../models/Transaction.js";
import { getPrice, getPrices } from "../services/marketService.js";

// BUY ASSET
export const buyAsset = async (req, res) => {
  try {
    const userId = req.user._id;
    const { symbol, quantity, type } = req.body; // Removed pricePerUnit from body

    if (!symbol || !quantity || !type) {
      return res.status(400).json({ message: "All fields required" });
    }

    // Get user from database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch LIVE price from backend (USD)
    // This ensures we always trade at the real market price, not what frontend sends
    const asset = await getPrice(symbol);
    if (!asset) {
      return res.status(400).json({ message: "Asset price unavailable" });
    }
    const pricePerUnit = asset.current_price;

    const totalCost = quantity * pricePerUnit;

    if (user.balance < totalCost) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Deduct from balance
    user.balance -= totalCost;
    await user.save();

    // Update or create portfolio holding
    let portfolio = await Portfolio.findOne({
      userId,
      symbol: symbol.toUpperCase(),
    });

    if (portfolio) {
      // Update existing
      const newQuantity = portfolio.quantity + quantity;
      const newAveragePrice =
        (portfolio.averagePrice * portfolio.quantity + totalCost) / newQuantity;

      portfolio.quantity = newQuantity;
      portfolio.averagePrice = newAveragePrice;
      portfolio.totalInvested += totalCost;
      portfolio.currentPrice = pricePerUnit;
      portfolio.currentValue = newQuantity * pricePerUnit;
      portfolio.unrealizedPnL = portfolio.currentValue - portfolio.totalInvested;
      await portfolio.save();
    } else {
      // Create new portfolio entry
      portfolio = new Portfolio({
        userId,
        symbol: symbol.toUpperCase(),
        type,
        quantity,
        averagePrice: pricePerUnit,
        currentPrice: pricePerUnit,
        totalInvested: totalCost,
        currentValue: totalCost,
        unrealizedPnL: 0,
      });
      await portfolio.save();
    }

    // Record transaction
    const transaction = new Transaction({
      userId,
      symbol: symbol.toUpperCase(),
      type: "BUY",
      quantity,
      price: pricePerUnit,
      totalValue: totalCost,
      status: "COMPLETED",
    });
    await transaction.save();

    res.status(201).json({
      message: "Buy order executed",
      transaction,
      portfolio,
      remainingBalance: user.balance,
      price: pricePerUnit // Return the actual executed price
    });
  } catch (error) {
    console.error("Buy error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// SELL ASSET
export const sellAsset = async (req, res) => {
  try {
    const userId = req.user._id;
    const { symbol, quantity, type } = req.body;

    if (!symbol || !quantity || !type) {
      return res.status(400).json({ message: "All fields required" });
    }

    // Get user from database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch LIVE price from backend (USD)
    const asset = await getPrice(symbol);
    if (!asset) {
      return res.status(400).json({ message: "Asset price unavailable" });
    }
    const pricePerUnit = asset.current_price;

    // Get portfolio holding
    const portfolio = await Portfolio.findOne({
      userId,
      symbol: symbol.toUpperCase(),
    });

    if (!portfolio || portfolio.quantity < quantity) {
      return res.status(400).json({ message: "Insufficient quantity" });
    }

    const sellValue = quantity * pricePerUnit;
    const costOfSold = quantity * portfolio.averagePrice;
    const profitLoss = sellValue - costOfSold;

    // Update balance
    user.balance += sellValue;
    await user.save();

    // Update portfolio
    portfolio.quantity -= quantity;
    portfolio.totalInvested -= costOfSold;
    portfolio.currentPrice = pricePerUnit;

    if (portfolio.quantity === 0) {
      // Delete portfolio if no quantity left
      await Portfolio.deleteOne({ _id: portfolio._id });
    } else {
      portfolio.currentValue = portfolio.quantity * pricePerUnit;
      portfolio.unrealizedPnL = portfolio.currentValue - portfolio.totalInvested;
      await portfolio.save();
    }

    // Record transaction
    const transaction = new Transaction({
      userId,
      symbol: symbol.toUpperCase(),
      type: "SELL",
      quantity,
      price: pricePerUnit,
      totalValue: sellValue,
      status: "COMPLETED",
    });
    await transaction.save();

    res.status(201).json({
      message: "Sell order executed",
      transaction,
      profitLoss,
      remainingBalance: user.balance,
      price: pricePerUnit
    });
  } catch (error) {
    console.error("Sell error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET PORTFOLIO
export const getPortfolio = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user from database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get all holdings for user
    let holdings = await Portfolio.find({ userId });

    // FETCH LIVE PRICES & RECALCULATE P&L
    // This ensures "Profit/Loss on reload" is always fresh
    const symbols = holdings.map(h => h.symbol);
    const livePrices = await getPrices(symbols);

    const priceMap = {};
    livePrices.forEach(p => {
      if (p && p.symbol) priceMap[p.symbol.toUpperCase()] = p.current_price;
    });

    // Update holdings in memory (and optionally DB, but memory is enough for read)
    holdings = holdings.map(h => {
      const sym = h.symbol.toUpperCase();

      // Note: h is a Mongoose document. usage of toObject() or modifying directly?
      // We'll calculate derived values.

      const livePrice = priceMap[sym] || h.currentPrice; // Fallback to last known

      const currentVal = h.quantity * livePrice;
      const pnl = currentVal - h.totalInvested;

      // We return a plain object with updated values
      return {
        ...h.toObject(),
        currentPrice: livePrice,
        currentValue: currentVal,
        unrealizedPnL: pnl,
        returnPercentage: h.totalInvested > 0 ? ((pnl / h.totalInvested) * 100).toFixed(2) : 0
      };
    });

    const totalInvested = holdings.reduce((sum, h) => sum + h.totalInvested, 0);
    const totalCurrentValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
    const totalUnrealizedPnL = totalCurrentValue - totalInvested;

    res.json({
      user: {
        name: user.name,
        email: user.email,
        balance: user.balance,
      },
      holdings,
      summary: {
        totalInvested,
        totalCurrentValue,
        totalUnrealizedPnL,
        totalReturnPercentage: totalInvested > 0 ? ((totalUnrealizedPnL / totalInvested) * 100).toFixed(2) : 0,
      },
    });
  } catch (error) {
    console.error("Get portfolio error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET TRANSACTIONS
export const getTransactions = async (req, res) => {
  try {
    const userId = req.user._id;
    const { symbol, type, limit = 50, skip = 0 } = req.query;

    // Build filter
    const filter = { userId };

    if (symbol) {
      filter.symbol = symbol.toUpperCase();
    }

    if (type) {
      filter.type = type.toUpperCase();
    }

    // Get transactions from database with pagination
    const total = await Transaction.countDocuments(filter);
    const transactions = await Transaction.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    res.json({
      transactions,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get transactions error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET SINGLE HOLDING
export const getHolding = async (req, res) => {
  try {
    const userId = req.user._id;
    const { symbol } = req.params;

    // Get holding from database
    const holding = await Portfolio.findOne({
      userId,
      symbol: symbol.toUpperCase(),
    });

    if (!holding) {
      return res.status(404).json({ message: "Holding not found" });
    }

    // Get all transactions for this holding
    const holdingTransactions = await Transaction.find({
      userId,
      symbol: symbol.toUpperCase(),
    }).sort({ createdAt: -1 });

    res.json({ holding, transactions: holdingTransactions });
  } catch (error) {
    console.error("Get holding error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
