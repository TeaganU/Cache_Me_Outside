import express from "express";
import { getProfileImage } from "./profile.controller.js";

const router = express.Router();

router.get("/:id/image", getProfileImage);

export default router;
