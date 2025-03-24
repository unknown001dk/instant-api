import express from "express";
import APIController from "../controllers/schema.controller.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create a new schema
router.post("/create", (req, res) => APIController.createSchema(req, res));

// Route to fetch all schemas for the authenticated user
router.get("/schemas", authMiddleware, APIController.getSchemas);

router.get('/:userId', APIController.getSchemaById)

// Update a schema
router.put("/update/:schemaId", (req, res) =>
  APIController.updateSchema(req, res)
);

// Delete a schema
router.delete("/delete/:schemaId", (req, res) =>
  APIController.deleteSchema(req, res)
);



export default router;
