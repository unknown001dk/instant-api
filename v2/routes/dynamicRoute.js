import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import dynamicRateLimiter from "../middlewares/dynamicRateLimiter.js";
import performCRUDOperation from "../controllers/dynamic/dynmaic.controller.js";
import { logUserActivity } from "../middlewares/log.js";

const router = express.Router();

router
  .route("/:schemaName/:projectName/:id/:documentId?")
  // .all(isAuthenticated) 
  .post(dynamicRateLimiter, logUserActivity, performCRUDOperation) 
  .get(dynamicRateLimiter, logUserActivity, performCRUDOperation) 
  .put(dynamicRateLimiter, logUserActivity, performCRUDOperation) 
  .delete(dynamicRateLimiter, logUserActivity, performCRUDOperation); 


export default router;
