import express from "express";
import {
    getPosts,
    createPost,
    updatePost,
    deletePost
} from "./posts.controller.js";

const router = express.Router();

// READ + SEARCH (query params)
router.get("/", getPosts);

// CREATE
router.post("/", createPost);

// UPDATE
router.put("/:id", updatePost);

// DELETE
router.delete("/:id", deletePost);

export default router;