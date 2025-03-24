const mongoose = require('mongoose');

const connections = {}; // Store connections for user MongoDB Atlas URIs

// Function to connect to MongoDB Atlas using user-provided URI
const connectToMongoDBAtlas = async (uri) => {
  if (!connections[uri]) { 
    connections[uri] = await mongoose.createConnection(uri);
    console.log(`Connected to MongoDB Atlas: ${uri}`);
  }
  return connections[uri];
};

module.exports = connectToMongoDBAtlas;
