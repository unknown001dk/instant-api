import mongoose from "mongoose";
import pino from "pino";

const logger = pino({ timestamp: pino.stdTimeFunctions.isoTime });

const connections = {};

setInterval(() => {
  Object.keys(connections).forEach((uri) => {
    if (connections[uri].readyState !== 1) {
      logger.warn("Disconnected DB connection. Cleaning up.");
      delete connections[uri];
    }
  });
}, 60000);

const getDatabaseConnection = async (userDbURI) => {
  if (!connections[userDbURI]) {
    connections[userDbURI] = mongoose.createConnection(userDbURI);

    await new Promise((resolve, reject) => {
      connections[userDbURI].on("connected", resolve);
      connections[userDbURI].on("error", (error) => {
        logger.error("Database connection error:", error.message);
        delete connections[userDbURI];
        reject(error);
      });
    });
  }
  return connections[userDbURI];
};

export default getDatabaseConnection;
