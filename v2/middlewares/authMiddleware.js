import User from "../models/user.model.js";

export const isAuthenticated = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if the Authorization header is present and correctly formatted
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Not authorized, token is required" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user information to the request after fetching from the database
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    // Handle invalid or expired token errors
    return res
      .status(401)
      .json({ message: "Not authorized, token is invalid. Please try again!" });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === "admin") {
    next();
  } else {
    res.status(403).json({
      message: "Forbidden",
    });
  }
};

import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user to request object
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};

export default authMiddleware;

