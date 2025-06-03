import mongoose from "mongoose";
import SchemaModel from "../models/schema.model.js";
import asyncHandler from "express-async-handler";
import { encryption } from "../utils/encrypt.js";
import { encryptPassword } from "./dynamic/utils/secure.js";

// Store model cache
const modelCache = {};

// Build Mongoose Schema from definition
export const buildMongooseSchema = (schemaDefinition) => {
  const fields = {};

  schemaDefinition.forEach((field) => {
    let fieldType;
    const type = field.type.toLowerCase();

    switch (type) {
      case "string":
        fieldType = String;
        break;
      case "number":
        fieldType = Number;
        break;
      case "boolean":
        fieldType = Boolean;
        break;
      case "date":
        fieldType = Date;
        break;
      case "objectid":
        fieldType = mongoose.Schema.Types.ObjectId;
        break;
      default:
        console.warn(`Invalid type '${field.type}' for field '${field.name}'. Using 'String' instead.`);
        fieldType = String;
    }

    if (fields[field.name]) {
      console.warn(`Duplicate field name '${field.name}' detected. Overwriting.`);
    }

    const fieldDef = { type: fieldType };

    if (field.required) {
      fieldDef.required = true;
    }

    if (type === "objectid" && field.ref) {
      fieldDef.ref = field.ref;
    }

    fields[field.name] = fieldDef;
  });

  return new mongoose.Schema(fields, { timestamps: true });
};

// Get or create a dynamic Mongoose model
export const getDynamicModel = async (name, userId, projectName) => {
  const modelKey = `${name}_${userId}_${projectName}`;

  if (modelCache[modelKey]) return modelCache[modelKey];

  const schemaDoc = await SchemaModel.findOne({ name, userId, projectName });
  if (!schemaDoc) throw new Error("Schema not found");

  const schema = buildMongooseSchema(schemaDoc.schemaDefinition);
  const model = mongoose.models[modelKey] || mongoose.model(modelKey, schema);
  modelCache[modelKey] = model;

  return model;
};

// Create Schema
export const createSchema = asyncHandler(async (req, res) => {
  const { name, userId, fields, projectName, realtimeEnabled } = req.body;

  if (!name || !userId || !fields || !projectName) {
    return res.status(400).json({
      message: "Missing required fields",
      success: false,
    });
  }

  const exists = await SchemaModel.findOne({ name, userId, projectName });
  if (exists) {
    return res.status(409).json({
      message: "Schema with this name already exists for the given user",
      success: false,
    });
  }

  const updatedFields = fields.map(field => ({
    name: field.name,
    type: field.type,
    unique: field.unique,
    message: field.message || '',
    match: field.match || '',
    required: field.required,
    secure: field.secure,
    role: field.role,
    enum: field.enum,
    secretKey: field.secretKey ? encryption(field.secretKey) : null
  }));

  const schema = new SchemaModel({
    name,
    userId,
    projectName,
    realtimeEnabled,
    schemaDefinition: updatedFields,
  });

  const encryptedUrl = encryption(userId);
  const url = `http://localhost:8081/api/v1/dynamic/${name}/${projectName}/${encryptedUrl}`;

  await schema.save();

  res.status(201).json({
    message: "Schema created successfully",
    schema,
    url,
    success: true,
  });
});

// Get All Schemas for User
export const getSchemas = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const schemas = await SchemaModel.find({ userId });

  if (!schemas.length) {
    return res.status(404).json({
      message: "No schemas found for this user",
      success: false,
    });
  }

  res.status(200).json({
    message: "Schemas fetched successfully",
    success: true,
    data: schemas,
  });
});

// Get Schema by ID
export const getSchemaById = asyncHandler(async (req, res) => {
  const { schemaId } = req.params;
  const schema = await SchemaModel.findById(schemaId);

  if (!schema) {
    return res.status(404).json({ message: "Schema not found" });
  }

  res.status(200).json({
    message: "Schema fetched successfully",
    schema,
  });
});

// Update Schema
export const updateSchema = asyncHandler(async (req, res) => {
  const { schemaId } = req.params;
  const { schemaDefinition, name } = req.body;

  const schema = await SchemaModel.findById(schemaId);
  if (!schema) {
    return res.status(404).json({ message: "Schema not found" });
  }

  schema.name = name || schema.name;
  schema.schemaDefinition = schemaDefinition || schema.schemaDefinition;
  await schema.save();

  res.status(200).json({ message: "Schema updated successfully", schema });
});

// Delete Schema
export const deleteSchema = asyncHandler(async (req, res) => {
  const { schemaId } = req.params;

  const schema = await SchemaModel.findByIdAndDelete(schemaId);
  if (!schema) {
    return res.status(404).json({ message: "Schema not found" });
  }

  res.status(200).json({ message: "Schema deleted successfully" });
});