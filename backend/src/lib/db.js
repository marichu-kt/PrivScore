// src/lib/db.js
import mongoose from "mongoose";
import { env } from "../config/env.js";

export async function connectDB() {
  const uri = env.MONGO_URI;

  if (!uri) {
    console.warn("⚠️  MONGO_URI no está definido. No se conecta a MongoDB.");
    return;
  }

  try {
    mongoose.set("strictQuery", true);

    // Opcional: logs en desarrollo
    if (env.NODE_ENV === "development") {
      mongoose.set("debug", false);
    }

    await mongoose.connect(uri);

    console.log("✅ MongoDB connected");

    // Logs útiles
    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️  MongoDB disconnected");
    });
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    // Fallar rápido al arrancar si no conecta (recomendado)
    process.exit(1);
  }
}

export async function disconnectDB() {
  try {
    await mongoose.disconnect();
    console.log("🛑 MongoDB disconnected");
  } catch (err) {
    console.error("❌ Error disconnecting MongoDB:", err);
  }
}