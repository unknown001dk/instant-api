import Logs from "../models/log.js";
import mongoose from "mongoose";
import { decryption } from "../utils/encrypt.js";

export async function logUserActivity(req, res, next) {
  res.on("finish", async () => {
    try {
      const ip =
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        req.ip;
      const decryptedId = decryption(req.params.id);
      const userId = mongoose.Types.ObjectId.isValid(decryptedId)
        ? new mongoose.Types.ObjectId(decryptedId)
        : decryptedId;

      // Save new log
      Logs.create({
        userId,
        endpoint: req.originalUrl,
        method: req.method,
        status: res.statusCode,
        ip,
      });

      console.log("Log saved...");
    } catch (err) {
      console.error("Error in logUserActivity:", err);
    }
  });
  next();
}
