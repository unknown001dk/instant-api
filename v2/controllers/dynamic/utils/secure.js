import crypto from "crypto";

const algorithm = 'aes-256-ctr';

export const encryptPassword = (text, secretKey) => {
  // const secret = secretKey || process.env.DEFAULT_SECRET_KEY;
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, crypto.createHash("sha256").update(secretKey).digest(), iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
};

export const decryptPassword = (encryptedData, secretKey) => {
  try {
    if (!encryptedData || !encryptedData.includes(":")) {
      throw new Error("Invalid encryptedData format. Expected 'IV:EncryptedText'.");
    }

    const [ivHex, encryptedHex] = encryptedData.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const encryptedText = Buffer.from(encryptedHex, "hex");

    const decipher = crypto.createDecipheriv(
      algorithm,
      crypto.createHash("sha256").update(secretKey).digest(),
      iv
    );

    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
    return decrypted.toString("utf8");
  } catch (error) {
    console.error("Decryption failed:", error.message);
    throw new Error("Invalid decryption process. Check your inputs.");
  }
};