// connectMongoAtlas.js

const mongoose = require('mongoose');
const connections = {}; // Store connections for user MongoDB Atlas URIs

/**
 * Connect to MongoDB Atlas using user-provided URI
 * @param {String} uri - The MongoDB Atlas connection URI
 * @returns {Object} - The Mongoose connection object
 */
async function connectToMongoDBAtlas(uri) {
  if (!connections[uri]) { 
    try {
      // Create a new connection if it doesn't exist
      connections[uri] = await mongoose.createConnection(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log(`Connected to MongoDB Atlas: ${uri}`);
    } catch (error) {
      console.error(`Failed to connect to MongoDB Atlas at ${uri}:`, error);
      throw new Error('MongoDB Atlas connection failed');
    }
  }
  return connections[uri]; // Return the existing connection if already connected
}

module.exports = connectToMongoDBAtlas;
