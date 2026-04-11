import express from "express";
import uploadProfileImage from "../../config/multer.js";
import { requireAuth } from "../../middleware/requireAuth.js";
import {
    getMyProfile,
    getProfileImage,
    updateMyProfile,
    getMyPosts,
    getMyComments,
} from "./profile.controller.js";

const router = express.Router();

router.get("/me", requireAuth, getMyProfile);
router.patch("/me", requireAuth, uploadProfileImage.single("profileImage"), updateMyProfile);
router.get("/:id/image", getProfileImage);
router.get("/me/posts", requireAuth, getMyPosts);
router.get("/me/comments", requireAuth, getMyComments);

export default router;