
import { Router } from "express";
import healthRoutes from "./health.js";
import servicesRoutes from "./services.routes.js";

const router = Router();
router.use("/health", healthRoutes);
router.use("/services", servicesRoutes);

export default router;
