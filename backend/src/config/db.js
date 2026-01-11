import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error("MONGO_URI or MONGODB_URI environment variable not set");
    }
    
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000,
    });
    console.log(`✓ MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};
