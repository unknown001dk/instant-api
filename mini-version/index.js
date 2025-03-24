// server.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const { ObjectId } = mongoose.Types; // Import ObjectId
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;
const LOCAL_MONGO_URI = process.env.LOCAL_MONGO_URI; // Local MongoDB URI
const connections = {}; // Store connections for user MongoDB Atlas URIs

// Function to connect to MongoDB Atlas using user-provided URI
async function connectToMongoDBAtlas(uri) {
  if (!connections[uri]) {
    // Check if already connected to this URI
    connections[uri] = await mongoose.createConnection(uri, {
      // Removed deprecated options
    });
    console.log(`Connected to MongoDB Atlas: ${uri}`);
  }
  return connections[uri];
}

// User Model for local MongoDB
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mongoUri: { type: String, required: true }, // Store user-provided MongoDB Atlas URI
});

const User = mongoose.model("User", UserSchema);

// Schema Model for local MongoDB
const SchemaDefinition = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  schemaName: { type: String, required: true },
  fields: { type: Array, required: true }, // Store fields as an array of objects
});

const SchemaModel = mongoose.model("Schema", SchemaDefinition);

// Create a new user (Registration)
app.post("/register", async (req, res) => {
  try {
    const { name, email, mongoUri } = req.body;
    const user = new User({ name, email, mongoUri });
    await user.save();
    res.status(201).json({
      message: "register sucecessfully",
      data: user
    });
  } catch (error) {
    res.status(400).send({ error: "Failed to register user" });
  }
});

// Define a new schema for a user
app.post("/define-schema", async (req, res) => {
  const { userId, schemaName, fields } = req.body; // User provides schema details

  // Validate ObjectId format
  if (!ObjectId.isValid(userId)) {
    return res.status(400).send({ error: "Invalid user ID format" });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).send({ error: "User not found" });
  }

  // Connect to the user's MongoDB Atlas database
  const userConnection = await connectToMongoDBAtlas(user.mongoUri); // Connect using the user-provided URI

  // Define the schema dynamically based on user input
  const dynamicSchema = new mongoose.Schema(
    fields.reduce((acc, field) => {
      acc[field.name] = field.type; // Create dynamic fields
      return acc;
    }, {})
  );

  const DynamicModelName =
    schemaName.charAt(0).toUpperCase() + schemaName.slice(1); // Capitalize schema name

  // Check if the model already exists
  let DynamicModel;
  try {
    DynamicModel = userConnection.model(DynamicModelName);
  } catch (error) {
    // If it doesn't exist, create it
    DynamicModel = userConnection.model(DynamicModelName, dynamicSchema);
  }

  // Save the schema definition in local MongoDB
  const newSchema = new SchemaModel({ userId, schemaName, fields });

  try {
    const schema = await newSchema.save();
    const schemaId = schema._id.toString()
    const data = `http://localhost:5000/api/${userId}/${schemaName}/${schemaId}`
    res.status(201).json({
      message: "Schema created successfully",
      schema: schema,
      data: data
    });
  } catch (error) {
    res.status(400).send({ error: "Failed to define schema" });
  }
});

// Dynamic CRUD Operations
// app.use('/api/:userId/:schemaName', async (req, res, next) => {
//   const { userId, schemaName } = req.params;

//   // Validate ObjectId format
//   if (!ObjectId.isValid(userId)) {
//     return res.status(400).send({ error: 'Invalid user ID format' });
//   }

//   // Retrieve the user and schema details
//   const user = await User.findById(userId);
//   const schema = await SchemaModel.findOne({ userId, schemaName });

//   if (!user || !schema) {
//     return res.status(404).send({ error: 'User or schema not found' });
//   }

//   // Connect to the user's MongoDB Atlas database
//   const userConnection = await connectToMongoDBAtlas(user.mongoUri); // Connect using the user-provided URI

//   // Define the model based on user-defined schema
//   const dynamicSchema = new mongoose.Schema(
//     schema.fields.reduce((acc, field) => {
//       acc[field.name] = field.type; // Dynamic schema creation
//       return acc;
//     }, {})
//   );

//   const DynamicModelName = schemaName.charAt(0).toUpperCase() + schemaName.slice(1); // Capitalize schema name

//   // Check if the model already exists
//   let DynamicModel;
//   try {
//     DynamicModel = userConnection.model(DynamicModelName);
//   } catch (error) {
//     // If it doesn't exist, create it
//     DynamicModel = userConnection.model(DynamicModelName, dynamicSchema);
//   }

//   // Handle CRUD operations based on request method
//   if (req.method === 'POST') {
//     const document = new DynamicModel(req.body);
//     await document.save();
//     return res.status(201).send(document);
//   } else if (req.method === 'GET') {
//     const documents = await DynamicModel.find();
//     return res.status(200).send(documents);
//   } else if (req.method === 'PUT') {
//     console.log(req.body);
//     console.log(req.params.id);
//     const document = await DynamicModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     return res.status(200).send(document);
//   } else if (req.method === 'DELETE') {
//     await DynamicModel.findByIdAndDelete(req.params.id);
//     return res.status(200).send({ message: 'Document deleted' });
//   }

//   next();
// });

// Route to handle dynamic schema with userId, schemaName, and optionally document ID
app.use("/api/:userId/:schemaName/:id?", async (req, res, next) => {
  const { userId, schemaName, id } = req.params; // Extract id from params

  // Validate ObjectId format
  if (!ObjectId.isValid(userId)) {
    return res.status(400).send({ error: "Invalid user ID format" });
  }

  // Retrieve the user and schema details
  const user = await User.findById(userId);
  const schema = await SchemaModel.findOne({ userId, schemaName });

  if (!user || !schema) {
    return res.status(404).send({ error: "User or schema not found" });
  }

  // Connect to the user's MongoDB Atlas database
  const userConnection = await connectToMongoDBAtlas(user.mongoUri); // Connect using the user-provided URI

  // Define the model based on the user-defined schema
  const dynamicSchema = new mongoose.Schema(
    schema.fields.reduce((acc, field) => {
      acc[field.name] = field.type; // Dynamic schema creation
      return acc;
    }, {})
  );

  const DynamicModelName =
    schemaName.charAt(0).toUpperCase() + schemaName.slice(1); // Capitalize schema name

  // Check if the model already exists
  let DynamicModel;
  try {
    DynamicModel = userConnection.model(DynamicModelName);
  } catch (error) {
    // If it doesn't exist, create it
    DynamicModel = userConnection.model(DynamicModelName, dynamicSchema);
  }

  // Handle CRUD operations based on request method
  if (req.method === "POST") {
    // Create operation
    try {
      const document = new DynamicModel(req.body);
      await document.save();
      return res.status(201).json({
        message: `${schemaName} successfully created`,
        success: true,
        status: res.statusCode,
        document: document,
      });
    } catch (error) {
      res.status(404).json({
        message: `Failed to create ${schemaName}`,
        success: false,
        status: res.statusCode,
        error: error.message,
      });
    }
  } else if (req.method === "GET") {
    // Read operation (All documents or single document if ID is provided)
    if (id) {
      const document = await DynamicModel.findById(id);
      if (!document) {
        return res.status(404).json({
          message: `Failed to find ${schemaName} with ID ${id}`,
          success: false,
          status: res.statusCode,
        });
      }
      return res.status(200).json({
        message: `${schemaName} successfully fetched`,
        success: true,
        status: res.statusCode,
        document: document,
      });
    } else {
      const documents = await DynamicModel.find();
      return res.status(200).json({
        message: `${schemaName} successfully fetched`,
        success: true,
        status: res.statusCode,
        documents: documents,
      });
    }
  } else if (req.method === "PUT") {
    // Update operation
    if (!id) {
      return res.status(400).json({
        message: `${schemaName}ID is required for updating `,
        success: false,
        status: res.statusCode,
      });
    }

    const updatedDocument = await DynamicModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updatedDocument) {
      return res.status(404).json({
        message: `Failed to find ${schemaName} with ID ${id}`,
        success: false,
        status: res.statusCode,
      });
    }
    return res.status(200).json({
      message: `${schemaName} successfully updated`,
      success: true,
      status: res.statusCode,
      document: updatedDocument,
    });
  } else if (req.method === "DELETE") {
    // Delete operation
    if (!id) {
      return res.status(400).json({
        message: `${schemaName} ID is required for deleting`,
        success: false,
        status: res.statusCode,
      });
    }

    const deletedDocument = await DynamicModel.findByIdAndDelete(id);
    if (!deletedDocument) {
      return res.status(404).json({
        message: `Failed to find ${schemaName} with ID ${id}`,
        success: false,
        status: res.statusCode,
      });
    }
    return res.status(200).json({
      message: `${schemaName} successfully deleted`,
      success: true,
      status: res.statusCode,
    });
  }

  next();
});

// Start the local MongoDB connection
mongoose
  .connect(LOCAL_MONGO_URI, {
    // Removed deprecated options
  })
  .then(() => {
    console.log("Connected to local MongoDB");
  })
  .catch((err) => console.log(err));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
