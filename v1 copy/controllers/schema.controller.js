import mongoose from "mongoose";
import Schema from "../models/schema.model.js";
import asyncHandler from "express-async-handler";
import MongoURI from "../models/mongo.model.js";
import { Types } from "mongoose";

class APIController {
  // Create a new schema dynamically
  createSchema = asyncHandler(async (req, res) => {
    const { name, userId, fields } = req.body;
  
    try {
      // Validate input
      if (!name || !userId || !fields) {
        return res.status(400).json({
          message: "Missing required fields",
          success: false,
        });
      }
  
      // Check if schema with the same name and userId already exists
      const schemaExists = await Schema.findOne({ name, userId });
      if (schemaExists) {
        return res.status(409).json({
          message: "Schema with this name already exists for the given user",
          success: false,
        });
      }
  
      // Create a new schema model
      const schema = new Schema({
        name,
        userId,
        schemaDefinition: fields,
      });
  
      // Generate the dynamic URL
      const url = `http://localhost:8081/api/v1/dynamic/${schema.name}/${schema.userId}`;
  
      // Save the schema to the database
      await schema.save();
  
      res.status(201).json({ 
        message: "Schema created successfully", 
        schema, 
        url,
        success: true 
      });
    } catch (error) {
      res.status(500).json({ 
        message: `Server error: ${error.message}`, 
        success: false 
      });
    }
  });
  

  // Fetch schemas for the authenticated user
  getSchemas = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    try {
      // Fetch schemas associated with the user (userId is now available through req.user from the middleware)
      const schemas = await Schema.find({ userId });
      console.log(schemas);
      // If no schemas are found, send a message
      if (!schemas || schemas.length === 0) {
        return res.status(404).json({
          message: "No schemas found for this user.",
          success: false,
        });
      }

      // Send the found schemas back as a response
      return res.status(200).json({
        message: "Schemas fetched successfully",
        success: true,
        data: schemas,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Server error while fetching schemas",
        success: false,
      });
    }
  });

  // get schema by id
  getSchemaById = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    console.log(userId)

    try {
      const schema = await Schema.findById(userId);
      console.log(schema)
      if (!schema) {
        return res.status(404).json({ message: "Schema not found" });
      }
      res.json({ message: "Schema fetched successfully", schema });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error while fetching schema" });
    }
  });

  // Get all schemas for the authenticated user
  getSchemas = asyncHandler(async (req, res) => {
    try {
      const schemas = await Schema.find({ userId: req.user._id });
      res.json(schemas);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Update schema
  updateSchema = asyncHandler(async (req, res) => {
    const { schemaId } = req.params;
    const { schemaDefinition, name } = req.body;

    try {
      const schema = await Schema.findById(schemaId);
      if (!schema) {
        return res.status(404).json({ message: "Schema not found" });
      }

      schema.name = name || schema.name;
      schema.schemaDefinition = schemaDefinition || schema.schemaDefinition;

      await schema.save();
      res.status(200).json({ message: "Schema updated successfully", schema });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // Delete schema
  deleteSchema = asyncHandler(async (req, res) => {
    const { schemaId } = req.params;

    try {
      const schema = await Schema.findByIdAndDelete(schemaId);
      if (!schema) {
        return res.status(404).json({ message: "Schema not found" });
      }

      res.status(200).json({ message: "Schema deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  // performCRUDOperation = asyncHandler(async (req, res) => {
  //   try {
  //     const { schemaName, documentId } = req.params;
  //     const { method, body } = req;
  //     console.log(body);

  //     console.log(req.user)

  //     // Find the schema definition for the given name
  //     const schemaData = await Schema.findOne({ name: schemaName });

  //     if (!schemaData || !Array.isArray(schemaData.schemaDefinition)) {
  //       return res.status(400).json({ message: "Invalid schema definition" });
  //     }

  //     // Convert array format to Mongoose schema format
  //     const schemaObject = {};
  //     schemaData.schemaDefinition.forEach((field) => {
  //       if (field.name && field.type) {
  //         schemaObject[field.name] = {
  //           type: mongoose.Schema.Types[field.type], // Convert type string to Mongoose Schema Type
  //           required: field.required || false,
  //           unique: field.unique || false,
  //         };
  //       }
  //     });

  //     if (Object.keys(schemaObject).length === 0) {
  //       return res
  //         .status(400)
  //         .json({ message: "Schema definition is empty or invalid" });
  //     }

  //     // Dynamically create or retrieve the Mongoose model
  //     const modelName = schemaName;
  //     const DynamicModel =
  //       mongoose.models[modelName] ||
  //       mongoose.model(modelName, new mongoose.Schema(schemaObject));

  //     let result;
  //     console.log(DynamicModel)

  //     // Perform the requested operation
  //     switch (method.toLowerCase()) {
  //       case "post":
  //         // Check if a document with the same unique field already exists
  //         const existingUser = await DynamicModel.findOne({
  //           username: body.username,
  //         });
  //         if (existingUser) {
  //           return res
  //             .status(400)
  //             .json({
  //               message:
  //                 "Username already exists. Please choose a different one.",
  //             });
  //         }

  //         result = await DynamicModel.create(body);
  //         break;

  //       case "get":
  //         result = documentId
  //           ? await DynamicModel.findById(documentId)
  //           : await DynamicModel.find();
  //         break;
  //       case "put":
  //         result = await DynamicModel.findByIdAndUpdate(documentId, body, {
  //           new: true,
  //         });
  //         if (!result) {
  //           return res.status(404).json({ message: "Document not found" });
  //         }
  //         break;
  //       case "delete":
  //         result = await DynamicModel.findByIdAndDelete(documentId);
  //         if (!result) {
  //           return res.status(404).json({ message: "Document not found" });
  //         }
  //         break;
  //       default:
  //         return res.status(400).json({ message: "Invalid operation" });
  //     }

  //     res.json({ success: true, result });
  //   } catch (error) {
  //     console.error("Error in CRUD operation:", error);
  //     res.status(500).json({ message: error.message });
  //   }
  // });

  performCRUDOperation = asyncHandler(async (req, res) => {
    const { schemaName, userId, documentId } = req.params;

    const getDatabaseConnection = async (userDbURI) => {
      if (!mongoose.connections[userDbURI]) {
        mongoose.connections[userDbURI] = await mongoose.createConnection(
          userDbURI
        );
      }
      return mongoose.connections[userDbURI];
    };

    try {
      // Fetch the user's MongoDB URI from the database
      const userMongoURI = await MongoURI.findOne({ userId });
      if (!userMongoURI) {
        return res
          .status(404)
          .json({ message: "MongoDB URI not found for this user." });
      }

      const userDb = await getDatabaseConnection(userMongoURI.localURI);
      console.log(userDb._connectionString)

      // Fetch schema and dynamically create a model
      const schemaData = await Schema.findOne({ name: schemaName });
      console.log(schemaData)
      if (!schemaData) {
        return res.status(404).json({ message: "Schema not found" });
      }
      console.log("enter")
      console.log(userDb.models)
      const modelu = userDb.model(
        schemaName,
        new mongoose.Schema(schemaData.schemaDefinition)
      );
      console.log(modelu)
      const DynamicModel =
        userDb.models[schemaName] ||
        userDb.model(
          schemaName,
          new mongoose.Schema(schemaData.schemaDefinition)
        );
      console.log("exit")

      console.log(DynamicModel)

      const method = req.method.toLowerCase();
      let result;

      switch (method) {
        case "post":
          result = await DynamicModel.create(req.body);
          break;
        case "read":
          result = documentId
            ? await DynamicModel.findById(documentId)
            : await DynamicModel.find();
          break;
        case "update":
          result = await DynamicModel.findByIdAndUpdate(documentId, req.body, {
            new: true,
          });
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
}

export default new APIController();
