import { registerUser } from "./auth.service.js";

export async function register(req, res) {
    try {
        const result = await registerUser(req.body);

        if (!result.ok) {
            return res.status(result.status).json(result.errors);
        }

        return res.status(result.status).json({
            message: "User created successfully",
            user: result.user,
        });
    } catch (error) {
        console.error("Register error:", error);
        return res.status(500).json({ general: "Server error" });
    }
}