import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import tradeRoutes from "./routes/tradeRoutes.js";
import marketRoutes from "./routes/marketRoutes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/trade", tradeRoutes);
app.use("/api/market", marketRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.json({ message: "Wall Street Bets API - Welcome!" });
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "API is running" });
});

export default app;
