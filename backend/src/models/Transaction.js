import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
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
      enum: ["BUY", "SELL"],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    totalValue: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["COMPLETED", "PENDING", "FAILED"],
      default: "COMPLETED",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for faster queries
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ symbol: 1 });

export default mongoose.model("Transaction", transactionSchema);
