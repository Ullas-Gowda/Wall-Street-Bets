import User from "../models/User.js";
import Portfolio from "../models/Portfolio.js";
import Transaction from "../models/Transaction.js";
import { generateToken } from "../utils/jwt.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      balance: 100000,
    });

    await user.save();
    const token = generateToken(user._id.toString());

    res.status(201).json({
      message: "User created successfully",
      user: user.toJSON(),
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // Find user in database
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id.toString());

    res.json({
      message: "Login successful",
      user: user.toJSON(),
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id || req.user.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({
      message: "User found",
      data: user.toJSON(),
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
