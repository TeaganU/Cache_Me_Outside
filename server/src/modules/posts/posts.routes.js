import express from "express";
import {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    incrementPostViews,
    addComment,
    updateComment,
    deleteComment
} from "./posts.controller.js";
import { requireAuth } from "../../middleware/requireAuth.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/:id/view", incrementPostViews);

router.post("/", requireAuth, createPost);
router.patch("/:id", requireAuth, updatePost);
router.delete("/:id", requireAuth, deletePost);
router.post("/:id/comments", requireAuth, addComment);
router.patch("/:id/comments/:commentId", requireAuth, updateComment);
router.delete("/:id/comments/:commentId", requireAuth, deleteComment);

export default router;
