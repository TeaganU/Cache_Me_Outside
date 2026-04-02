import express from "express";
import {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    incrementPostViews
} from "./posts.controller.js";

const router = express.Router();

router.post("/", createPost);
router.get("/", getPosts);
router.get("/:id", getPost);
router.patch("/:id", updatePost);
router.delete("/:id", deletePost);
router.post("/:id/view", incrementPostViews);

export default router;