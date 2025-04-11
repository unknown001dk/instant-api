import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import performCRUDOperation from '../controllers/dynamic/dynmaic.controller.js';

const router = express.Router();

// Perform CRUD dynamically
router
  .route("/:schemaName/:userId/:documentId?")
  .post(performCRUDOperation)
  .get(performCRUDOperation)
  .put(performCRUDOperation)
  .delete(performCRUDOperation);

// router.get("/:schemaname/:userid/populate/:reffield", getMingledData);

export default router;
