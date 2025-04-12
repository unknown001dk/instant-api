import Logs from "../models/log.js";
import { decryption } from "../utils/encrypt.js";

export async function logUserActivity(req, res, next) {
  res.on('finish', async () => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip;
    const userId = decryption(req.params.id);
    
    if (req) {
      await Logs.create({
        userId,
        endpoint: req.originalUrl,
        method: req.method,
        status: res.statusCode,
        ip: ip
      });
      console.log("Log saved...")
    }
  });
  next();
}
