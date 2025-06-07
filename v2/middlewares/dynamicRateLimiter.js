import rateLimit from 'express-rate-limit';
import MongoUri from '../models/mongo.model.js';
import { decryption } from '../utils/encrypt.js';

// Rate limiter cache with TTL (Time To Live) to prevent memory leaks
const rateLimiterCache = new Map();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour cache duration

// Clean up old limiters periodically
setInterval(() => {
    const now = Date.now();
    for (const [key, { createdAt }] of rateLimiterCache.entries()) {
        if (now - createdAt > CACHE_TTL) {
            rateLimiterCache.delete(key);
        }
    }
}, 30 * 60 * 1000); // Run every 30 minutes

const createRateLimiter = (userId, maxRequests) => {
    return rateLimit({
        windowMs: 24 * 60 * 60 * 1000, // 24 hours
        max: maxRequests,
        keyGenerator: (req) => userId,
        handler: (req, res) => {
            res.status(429).json({
                success: false,
                message: `You've exceeded your ${maxRequests} requests limit for today.`,
                limit: maxRequests,
                remaining: 0
            });
        },
        standardHeaders: true,
        legacyHeaders: false,
        skipFailedRequests: true,
        skipSuccessfulRequests: false
    });
};

const dynamicRateLimiter = async (req, res, next) => {
    // Skip rate limiting for OPTIONS requests
    if (req.method === 'OPTIONS') return next();

    const { id } = req.params;
    if (!id) {
        console.warn('No ID found in request params - skipping rate limiting');
        return next();
    }

    try {
        const userId = decryption(id);
        if (!userId) {
            console.warn('Failed to decrypt user ID - skipping rate limiting');
            return next();
        }

        // Check cache first
        if (rateLimiterCache.has(userId)) {
            const { limiter, maxRequests, createdAt } = rateLimiterCache.get(userId);
            
            // Refresh cache if about to expire
            if (Date.now() - createdAt > CACHE_TTL * 0.9) {
                rateLimiterCache.delete(userId);
            } else {
                return limiter(req, res, next);
            }
        }

        // Fetch user data
        const user = await MongoUri.findOne({ userId }).lean();
        if (!user) {
            console.warn(`User ${userId} not found - applying default rate limit`);
            const defaultLimiter = createRateLimiter(userId, 1);
            rateLimiterCache.set(userId, { 
                limiter: defaultLimiter, 
                maxRequests: 1, 
                createdAt: Date.now() 
            });
            return defaultLimiter(req, res, next);
        }

        // Determine rate limits based on plan
        const planLimits = {
            free: 100,
            basic: 500,
            premium: 1000,
            enterprise: 5000
        };

        const maxRequests = planLimits[user.plan] || 500;
        console.log(`Applying rate limit of ${maxRequests} requests/day for user ${userId} (${user.plan} plan)`);

        // Create and cache new rate limiter
        const limiter = createRateLimiter(userId, maxRequests);
        rateLimiterCache.set(userId, { 
            limiter, 
            maxRequests, 
            createdAt: Date.now() 
        });

        return limiter(req, res, next);
    } catch (error) {
        console.error('Rate limiting error:', error);
        // Fail open - allow the request through if rate limiting fails
        return next();
    }
};

export default dynamicRateLimiter;