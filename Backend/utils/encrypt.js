// backend/utils/crypto.js
import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";

// Load key from env (accepts hex (64 chars) or base64)
if (!process.env.AES_SECRET_KEY) {
  throw new Error("AES_SECRET_KEY not set in environment");
}

let KEY;
const rawKey = process.env.AES_SECRET_KEY.trim();

if (/^[0-9a-fA-F]{64}$/.test(rawKey)) {
  KEY = Buffer.from(rawKey, "hex");
} else {
  // try base64
  KEY = Buffer.from(rawKey, "base64");
}

if (KEY.length !== 32) {
  throw new Error("AES_SECRET_KEY must be 32 bytes (use 64 hex chars or base64 of 32 bytes)");
}

export function encryptText(plain) {
  const iv = crypto.randomBytes(12); // 96-bit for GCM
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  const encrypted = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    content: encrypted.toString("base64"),
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
  };
}

export function decryptText({ content, iv, tag }) {
  if (!content || !iv || !tag) return "";
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, Buffer.from(iv, "base64"));
  decipher.setAuthTag(Buffer.from(tag, "base64"));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(content, "base64")), decipher.final()]);
  return decrypted.toString("utf8");
}


