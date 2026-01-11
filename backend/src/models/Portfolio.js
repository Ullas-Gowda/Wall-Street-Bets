import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  symbol: {
    type: String,
    required: true,
    uppercase: true,
  },
  type: {
    type: String,
    enum: ["stock", "crypto"],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  averagePrice: {
    type: Number,
    required: true,
  },
  currentPrice: {
    type: Number,
    required: true,
  },
  totalInvested: {
    type: Number,
    required: true,
  },
  currentValue: {
    type: Number,
    required: true,
  },
  unrealizedPnL: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Unique index on userId and symbol
portfolioSchema.index({ userId: 1, symbol: 1 }, { unique: true });

const Portfolio = mongoose.model("Portfolio", portfolioSchema);
export default Portfolio;
