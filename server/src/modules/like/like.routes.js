import express from "express";
import * as likeController from "./like.controller.js";
import { requireAuth } from "../../middleware/requireAuth.js";

const router = express.Router();

router.post("/:postId", requireAuth, likeController.toggleLike);
router.delete("/:postId", requireAuth, likeController.deleteLike);
router.get("/:postId/me", requireAuth, likeController.getMyLikeStatus);

export default router;
