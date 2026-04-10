import express from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import { requireAdmin } from "../../middleware/requireAdmin.js";
import {
  disableUser,
  dismissReport,
  getAdminDashboard,
  getDisabledUsers,
  getRecentAdminPosts,
  searchUsers,
  enableUser,
} from "./admin.controller.js";

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get("/dashboard", getAdminDashboard);
router.get("/users/search", searchUsers);
router.get("/disabled-users", getDisabledUsers);
router.get("/posts/recent", getRecentAdminPosts);
router.post("/users/:userId/disable", disableUser);
router.patch("/users/:userId/enable", enableUser);
router.patch("/reports/:reportId/dismiss", dismissReport);

export default router;