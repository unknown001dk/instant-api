import rateLimit from "express-rate-limit"; // Importing the rate limiting middleware
import MongoUri from "../models/mongo.model.js"; // Importing the database model
import { decryption } from "../utils/encrypt.js"; // Utility for decrypting user IDs

const dynamicRateLimiter = async (req, res, next) => {
  const { id } = req.params; // Get encrypted user ID from request parameters

  try {
    // Decrypt the user ID
    const userId = decryption(id);

    // Fetch user information from the database using the decrypted ID
    const user = await MongoUri.findOne({ userId });

    if (!user) {
      // Handle case where user is not found
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Set maximum requests dynamically based on the user's subscription plan
    let maxRequests;
    switch (user.plan) {
      case "free":
        maxRequests = 100;
        break;
      case "basic":
        maxRequests = 500;
        break;
      case "advanced":
        maxRequests = 1000;
        break;
      default:
        maxRequests = 1; // Default limit for unsupported plans
    }

    // Configure the rate limiter
    const limiterConfig = {
      windowMs: 24 * 60 * 60 * 1000, // 24 hours
      max: maxRequests, // Maximum requests allowed in the time window
      keyGenerator: (req) => userId, // Ensure tracking by user ID
      handler: (req, res) => {
        res.status(429).json({
          success: false,
          message: `You have exceeded your daily limit of ${maxRequests} requests.`,
        });
      },
      standardHeaders: true, // Add rate limit headers in the response
      legacyHeaders: false, // Disable deprecated `X-RateLimit-*` headers
    };

    const limiter = rateLimit(limiterConfig); // Create rate limiter instance

    // Apply the rate limiter middleware
    limiter(req, res, next);
  } catch (error) {
    console.error("Error in dynamicRateLimiter:", error); // Log the error
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export default dynamicRateLimiter; // Export the middleware
