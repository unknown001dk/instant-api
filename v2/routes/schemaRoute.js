import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  createSchema,
  getSchemaById,
  getSchemas,
  updateSchema,
  deleteSchema
} from "../controllers/schema.controller.js";

const router = express.Router();

// Create a new schema
router.post("/create", createSchema);

// Route to fetch all schemas for the authenticated user
router.get("/schemas", authMiddleware, getSchemas);

router.get("/:userId", getSchemaById);

// Update a schema
router.put("/update/:schemaId", updateSchema);

// Delete a schema
router.delete("/delete/:schemaId", deleteSchema);

export default router;
