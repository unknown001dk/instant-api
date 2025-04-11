import mongoose from "mongoose";
import pino from "pino";
import asyncHandler from "express-async-handler";
import Schema from "../../models/schema.model.js";
import MongoUri from "../../models/mongo.model.js";
import { decryption } from "../../utils/encrypt.js";
import { handleGetRequest } from "./handlers/handleGetRequest.js";
import { validateSchemaDefinition } from "./utils/validateSchemaDefnition.js";
import { handlePostRequest } from "./handlers/handlePostRequest.js";
import { handlePutRequest } from "./handlers/handlePutRequest.js";
import { handleDeleteRequest } from "./handlers/handleDeleteRequest.js";
import getDatabaseConnection from "./db/getDatabaseConnection.js";
import { handlePatchRequest } from "./handlers/handlePatchRequest.js";

const logger = pino({ timestamp: pino.stdTimeFunctions.isoTime });

const performCRUDOperation = asyncHandler(async (req, res) => {
  const { schemaName, id, documentId, projectName } = req.params;
  const userId = decryption(id);
  if (!userId) {
    return res.status(401).json({ message: "User ID is Empty!." });
  }
  // Validate userId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      message:
        "Invalid User ID. Please provide a valid MongoDB ObjectId (or) url modified.",
    });
  }

  const userMongoURL = await MongoUri.findOne({ userId });
  if (!userMongoURL) {
    return res
      .status(404)
      .json({ message: "MongoDB URI not found for this user." });
  }

  try {
    const userMongoURI = await MongoUri.find({ projectName });
    logger.info("MongoDB URI found:", { localURI: userMongoURI.localURI });

    if (!userMongoURI[0] || !userMongoURI[0].localURI) {
      return res
        .status(404)
        .json({ message: "MongoDB URI not found for this user." });
    }

    const userDb = await getDatabaseConnection(userMongoURI[0].localURI);
    // logger.info("MongoDB URI found:", { localURI: userMongoURI[0].localURI });
    console.log("MongoDB Connected to", { localURI: userMongoURI[0].localURI });

    if (!userDb) {
      return res
        .status(500)
        .json({ message: "Failed to establish database connection." });
    }

    // Fetch the schema details
    const schemaData = await Schema.findOne({ userId, name: schemaName });

    if (!schemaData) {
      return res
        .status(404)
        .json({ message: "Schema not found. Please define the schema first." });
    }

    // Validate and fix schema types before creating the model
    const validSchemaDefinition = validateSchemaDefinition(
      schemaData.schemaDefinition
    );

    //  Enforce strict validation to throw an error for undefined fields
    const schemaOptions = { timestamps: true, strict: "throw" };

    // Create or retrieve the dynamic model
    const DynamicModel =
      userDb.models[schemaName] ||
      userDb.model(
        schemaName,
        new mongoose.Schema(validSchemaDefinition, schemaOptions)
      );

    // Validate request body against schema fields
    const allowedFields = Object.keys(validSchemaDefinition);
    const invalidFields = Object.keys(req.body).filter(
      (field) => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
      return res.status(400).json({
        message: `Invalid fields: ${invalidFields.join(
          ", "
        )}. Allowed fields: ${allowedFields.join(", ")}`,
      });
    }

    let result;
    switch (req.method.toLowerCase()) {
      case "post":
        return await handlePostRequest({ req, res, DynamicModel, schemaData });
      case "get":
        return await handleGetRequest({ req, res, DynamicModel, documentId });
      case "put":
        return await handlePutRequest({ req, res, DynamicModel, documentId });
      case "patch":
        return await handlePatchRequest({ req, res, DynamicModel, documentId });
      case "delete":
        return await handleDeleteRequest({ res, DynamicModel, documentId });
      default:
        return res.status(400).json({ message: "Invalid operation" });
    }

    // res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default performCRUDOperation;
