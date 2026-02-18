import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config/config.service.js";

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ message: "Token required" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    req.userId = decoded.userId;

    next();

  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};


export default authMiddleware;

// This middleware checks for the presence of a JWT token in the Authorization header, verifies it, and extracts the user ID to attach to the request object for use in subsequent handlers. If the token is missing or invalid, it responds with a 401 Unauthorized status.