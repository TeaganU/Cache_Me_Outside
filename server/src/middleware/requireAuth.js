import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { getDisabledAccountDetails, normalizeDisabledState } from "../modules/auth/auth.utils.js";

export async function requireAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ general: "Authentication required" });
        }

        const token = authHeader.split(" ")[1];

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not set");
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(payload.sub).select("-passwordHash");

        if (!user) {
            return res.status(401).json({ general: "User not found" });
        }

        await normalizeDisabledState(user);

        if (user.isDisabled) {
            return res.status(403).json({
                general: "This account has been disabled",
                code: "ACCOUNT_BANNED",
                ban: getDisabledAccountDetails(user),
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ general: "Invalid or expired token" });
    }
}