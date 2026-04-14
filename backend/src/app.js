
import express from "express";
import cors from "cors";
import apiRoutes from "./routes/index.js";
import { env } from "./config/env.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: (origin, cb) => {
        if (!origin) return cb(null, true);
        if (!env.CORS_ORIGIN?.length) return cb(null, true);
        return cb(null, env.CORS_ORIGIN.includes(origin));
      },
    })
  );

  app.use(express.json());

  app.get("/", (_req, res) => {
    res.json({ ok: true, name: "PrivScore Backend", mode: env.MONGO_URI ? "mongo-or-demo" : "demo" });
  });

  app.use("/api", apiRoutes);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
