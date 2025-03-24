import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import dynamicRateLimiter from "../middlewares/dynamicRateLimiter.js";
import performCRUDOperation from "../controllers/dynamic/dynmaic.controller.js";

const router = express.Router();

// Perform CRUD dynamically
router
  .route("/:schemaName/:projectName/:id/:documentId?")
  // .all(isAuthenticated) // Apply authentication middleware to all methods
  .post(dynamicRateLimiter, performCRUDOperation) // Apply rate limiter to POST method
  .get(dynamicRateLimiter, performCRUDOperation) // Apply rate limiter to GET method
  .put(dynamicRateLimiter, performCRUDOperation) // Apply rate limiter to PUT method
  .delete(dynamicRateLimiter, performCRUDOperation); // Apply rate limiter to DELETE method

// Additional route example
router.get(
  "/:schemaName/:userId/populate/:refField",
  isAuthenticated,
  performCRUDOperation
);

export default router;
