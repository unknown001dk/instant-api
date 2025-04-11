import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import dynamicRateLimiter from "../middlewares/dynamicRateLimiter.js";
import performCRUDOperation from "../controllers/dynamic/dynmaic.controller.js";

const router = express.Router();

router
  .route("/:schemaName/:projectName/:id/:documentId?")
  // .all(isAuthenticated) 
  .post(dynamicRateLimiter, performCRUDOperation) 
  .get(dynamicRateLimiter, performCRUDOperation) 
  .put(dynamicRateLimiter, performCRUDOperation) 
  .delete(dynamicRateLimiter, performCRUDOperation); 


export default router;
