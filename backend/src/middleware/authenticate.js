import { verifyToken } from "../utils/jwt.js";
import User from "../models/User.js";

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Find user in MongoDB
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach user to request
    req.user = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      balance: user.balance,
      role: user.role,
    };

    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};

export default authenticate;
