import mongoose from "mongoose";
// Function to connect to a user's specific database
const getDatabaseConnection = async (userDbURI) => {
  if (!mongoose.connections[userDbURI]) {
      mongoose.connections[userDbURI] = await mongoose.createConnection(userDbURI);
  }
  return mongoose.connections[userDbURI];
};

export default getDatabaseConnection;