import crypto from "crypto";

// Ensure secret key is 32 bytes
const getKey = (key) => {
  return crypto.createHash("sha256").update(String(key)).digest("base64").substr(0, 32);
};

const secretKey = getKey(process.env.SECRET_KEY || "your-very-secret-key");
const algorithm = "aes-256-ctr"; // Encryption algorithm

// Encryption function
export const encryption = (url) => {
  const iv = crypto.randomBytes(16); // Generate a random initialization vector
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(url, "utf8", "hex");
  encrypted += cipher.final("hex");

  // Combine IV with the encrypted data
  return `${iv.toString("hex")}:${encrypted}`;
};

// Decryption function
export const decryption = (encryptedUrl) => {
  const [ivHex, encrypted] = encryptedUrl.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

// // Example usage
// const url = "http://localhost:8081/api/v1/dynamic/schema-name/user-id";
// const encryptedUrl = encryption(url);
// const decryptedUrl = decryption(encryptedUrl);

// console.log("Original URL:", url);
// console.log("Encrypted URL:", encryptedUrl);
// console.log("Decrypted URL:", decryptedUrl);
