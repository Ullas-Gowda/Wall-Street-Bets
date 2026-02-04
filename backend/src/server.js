import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  try {
    // Try to connect to MongoDB but don't fail if it's not available
    try {
      await connectDB();
    } catch (dbError) {
      console.warn("MongoDB unavailable - running in memory mode");
      console.warn(`Error: ${dbError.message}`);
      console.warn("Note: Data will not be persisted");
    }

    app.listen(PORT, () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ API available at http://localhost:${PORT}`);
      console.log(`✓ Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
