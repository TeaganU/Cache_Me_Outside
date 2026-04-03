import express from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import { createCommentReport, createPostReport } from "./reports.controller.js";

const router = express.Router();

router.post("/posts/:postId", requireAuth, createPostReport);
router.post("/posts/:postId/comments/:commentId", requireAuth, createCommentReport);

export default router;