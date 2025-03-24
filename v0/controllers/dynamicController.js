const mongoose = require('mongoose');
const User = require('../models/userModel');
const SchemaModel = require('../models/schemaModel');
const connectToMongoDBAtlas = require('../config/db');
const { decrypt } = require('dotenv');
const { ObjectId } = require('mongoose').Types;

exports.dynamicCrudOperations = async (req, res, next) => {
  console.log(req.params)
  const { userId, schemaName, id } = req.params;
  console.log(userId)
  const decryptUSerID = decrypt(userId)
  console.log(decryptUSerID)

  if (!ObjectId.isValid(userId)) {
    return res.status(400).send({ error: 'Invalid user ID format' });
  }

  const user = await User.findById(decryptUSerID);
  const schema = await SchemaModel.findOne({ decryptUSerID, schemaName });

  if (!user || !schema) {
    return res.status(404).send({ error: 'User or schema not found' });
  }

  const userConnection = await connectToMongoDBAtlas(user.mongoUri);

  const dynamicSchema = new mongoose.Schema(
    schema.fields.reduce((acc, field) => {
      acc[field.name] = field.type;
      return acc;
    }, {})
  );

  const DynamicModelName = schemaName.charAt(0).toUpperCase() + schemaName.slice(1);

  let DynamicModel;
  try {
    DynamicModel = userConnection.model(DynamicModelName);
  } catch (error) {
    DynamicModel = userConnection.model(DynamicModelName, dynamicSchema);
  }

  // Handle CRUD
  // Route to handle dynamic schema with userId, schemaName, and optionally document ID

  // Handle CRUD operations based on request method
  if (req.method === 'POST') {
    // Create operation
    try {
      const document = new DynamicModel(req.body);
      // console.log(document);
      await document.save();
      return res.status(201).json({
        message: `${schemaName} created successfully`,
        success: true,
        status: res.statusCode,
        document,
      });
    } catch (error) {
      return res.json({
        message: 'Failed to create document',
        success: false,
        status: res.statusCode,
        error,
      })
    }
  } else if (req.method === 'GET') {
    // Read operation (All documents or single document if ID is provided)
    if (id) {
      const document = await DynamicModel.findById(id);
      if (!document) {
        return res.status(404).json({
          message: `${schemaName} not found`,
          success: false,
          status: res.statusCode,
        });
      }
      return res.status(200).json({
        message: `${schemaName} retrieved successfully`,
        success: true,
        status: res.statusCode,
        document,
      });
    } else {
      const documents = await DynamicModel.find();
      return res.status(200).json({
        message: `${schemaName} retrieved successfully`,
        success: true,
        status: res.statusCode,
        documents,
      });
    }
  } else if (req.method === 'PUT') {
    // Update operation
    if (!id) {
      return res.status(400).json({
        message: `${schemaName} ID is required for update`,
        success: false,
        status: res.statusCode,
      });
    }

    const updatedDocument = await DynamicModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedDocument) {
      return res.status(404).json({
        message: `${schemaName} not found`,
        success: false,
        status: res.statusCode,
      });
    }
    return res.status(200).json({
      message: `${schemaName} updated successfully`,
      success: true,
      status: res.statusCode,
      document: updatedDocument,
    });
  } else if (req.method === 'DELETE') {
    // Delete operation
    try {
      if (!id) {
        return res.status(400).json({
          message: `${schemaName} ID is required for deletion`,
          success: false,
          status: res.statusCode,
        });
      }
  
      const deletedDocument = await DynamicModel.findByIdAndDelete(id);
      if (!deletedDocument) {
        return res.status(404).json({
          message: `${schemaName} not found`,
          success: false,
          status: res.statusCode,
        });
      }
      return res.status(200).json({
        message: `${schemaName} deleted successfully`,
        success: true,
        status: res.statusCode,
      });
    } catch (error) {
      return res.json({
        message: 'Failed to delete document',
        success: false,
        status: res.statusCode,
        error,
      })
    }
  }
};
