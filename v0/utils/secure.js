require("dotenv").config(); // Load environment variables from .env
const crypto = require("crypto");

// Encryption setup from environment variables
const algorithm = process.env.ALGORITHM; // AES algorithm from .env
const key = Buffer.from(process.env.ENCRYPTION_KEY, "hex"); // 32-byte key from .env
const iv = Buffer.from(process.env.IV, "hex"); // 16-byte IV from .env

// Ensure the key and IV are correct lengths
if (key.length !== 32) throw new Error("Encryption key must be 32 bytes.");
if (iv.length !== 16)
  throw new Error("Initialization vector (IV) must be 16 bytes.");

// Function to encrypt the userId
exports.encrypt = (text) => {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted; // Append IV with encrypted text
}

// Function to decrypt the encrypted text
exports.decrypt = (text) => {
  const textParts = text.split(":"); // Split the IV and encrypted text
  const iv = Buffer.from(textParts[0], "hex"); // Extract IV from the text
  const encryptedText = Buffer.from(textParts[1], "hex"); // Extract encrypted text
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}
