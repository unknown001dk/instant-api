import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import Schema from "../../models/schema.model.js";
import MongoUri from "../../models/mongo.model.js";

const connections = {}; // Cache connections to avoid multiple DB connections

const getDatabaseConnection = async (userDbURI) => {
  if (!connections[userDbURI]) {
    connections[userDbURI] = mongoose.createConnection(userDbURI);

    await new Promise((resolve, reject) => {
      connections[userDbURI].on("connected", resolve);
      connections[userDbURI].on("error", reject);
    });
  }
  return connections[userDbURI];
};

// Function to validate and convert schema array into Mongoose Schema
const validateSchemaDefinition = (schemaArray) => {
  const validTypes = ["String", "Number", "Boolean", "Date", "Array", "Object", "Mixed"];
  const schemaObject = {};

  schemaArray.forEach((field) => {
    let fieldType = field.type.charAt(0).toUpperCase() + field.type.slice(1); // Capitalize first letter

    if (!validTypes.includes(fieldType)) {
      console.error(`Invalid type '${field.type}' for field '${field.name}'. Using 'String' instead.`);
      fieldType = "String"; // Default to String
    }

    schemaObject[field.name] = {
      type: mongoose.Schema.Types[fieldType],
      required: field.required || false,
      unique: field.unique || false,
    };
  });

  return schemaObject;
};

const performCRUDOperation = asyncHandler(async (req, res) => {
  const { schemaName, userId, documentId } = req.params;
  console.log(req.params);

  try {
    // Fetch the user's MongoDB URI from the database
    const userMongoURI = await MongoUri.findOne({ userId });

    if (!userMongoURI || !userMongoURI.localURI) {
      return res.status(404).json({ message: "MongoDB URI not found for this user." });
    }

    const userDb = await getDatabaseConnection(userMongoURI.localURI);

    if (!userDb) {
      return res.status(500).json({ message: "Failed to establish database connection." });
    }

    // Fetch the schema details
    const schemaData = await Schema.findOne({ userId, name: schemaName });

    if (!schemaData) {
      return res.status(404).json({ message: "Schema not found. Please define the schema first." });
    }

    // Validate and fix schema types before creating the model
    const validSchemaDefinition = validateSchemaDefinition(schemaData.schemaDefinition);

    //  Enforce strict validation to throw an error for undefined fields
    const schemaOptions = { timestamps: true, strict: "throw" };

    // Create or retrieve the dynamic model
    const DynamicModel =
      userDb.models[schemaName] ||
      userDb.model(schemaName, new mongoose.Schema(validSchemaDefinition, schemaOptions));

    // Validate request body against schema fields
    const allowedFields = Object.keys(validSchemaDefinition);
    const invalidFields = Object.keys(req.body).filter((field) => !allowedFields.includes(field));

    if (invalidFields.length > 0) {
      return res.status(400).json({
        message: `Invalid fields: ${invalidFields.join(", ")}. Allowed fields: ${allowedFields.join(", ")}`,
      });
    }

    let result;
    switch (req.method.toLowerCase()) {
      case "post":
        result = await DynamicModel.create(req.body);
        break;
      case "get":
        result = documentId ? await DynamicModel.findById(documentId) : await DynamicModel.find();
        break;
      case "put":
        result = await DynamicModel.findByIdAndUpdate(documentId, req.body, { new: true });
        break;
      case "delete":
        result = await DynamicModel.findByIdAndDelete(documentId);
        break;
      default:
        return res.status(400).json({ message: "Invalid operation" });
    }

    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default performCRUDOperation;