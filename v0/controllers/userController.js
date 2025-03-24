const mongoose = require('mongoose');
const User = require('../models/userModel');
const SchemaModel = require('../models/schemaModel');
const connectToMongoDBAtlas = require('../config/db');
const { encrypt } = require('../utils/secure.js');
const { ObjectId } = require('mongoose').Types;

exports.registerUser = async (req, res) => {
  try {
    const { name, email, mongoUri } = req.body;
    const user = new User({ name, email, mongoUri });
    await user.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send({ error: 'Failed to register user' });
  }
};

exports.defineSchema = async (req, res) => {
  const { userId, schemaName, fields } = req.body;

  if (!ObjectId.isValid(userId)) {
    return res.status(400).send({ error: 'Invalid user ID format' });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).send({ error: 'User not found' });
  }

  const userConnection = await connectToMongoDBAtlas(user.mongoUri);

  const dynamicSchema = new mongoose.Schema(
    fields.reduce((acc, field) => {
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

  const newSchema = new SchemaModel({ userId, schemaName, fields });
  console.log(newSchema);
  // create a url for the dynamic model

  // encrypt userid and schema name
  // const encryptedUserId = encrypt(userId);
  // console.log(encryptedUserId)
  // const encryptedSchemaName = encrypt(schemaName);
  const encryptedID = encrypt(userId);
  // newSchema.userId = encryptedID;
  // newSchema.schemaName = encryptedSchemaName;

  // newSchema.userId = encryptedUserId;
  // newSchema.schemaName = encryptedSchemaName;
  const url = `http://localhost:8081/api/dynamic/${encryptedID}/${schemaName}`;
  console.log(url)
  
  try {
    await newSchema.save();
    res.status(201).send(newSchema);
  } catch (error) {
    res.status(400).send({ error: 'Failed to define schema' });
  }
};
