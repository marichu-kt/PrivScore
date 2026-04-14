// src/config/env.js
import dotenv from "dotenv";
dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: Number(process.env.PORT ?? 4000),
  MONGO_URI: process.env.MONGO_URI ?? "",
  CORS_ORIGIN: (process.env.CORS_ORIGIN ?? "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean),
};