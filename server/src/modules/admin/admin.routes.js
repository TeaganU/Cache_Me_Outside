import express from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import { requireAdmin } from "../../middleware/requireAdmin.js";
import { dismissReport, getAdminDashboard } from "./admin.controller.js";

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get("/dashboard", getAdminDashboard);
router.patch("/reports/:reportId/dismiss", dismissReport);

export default router;