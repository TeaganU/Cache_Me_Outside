import { registerUser, loginUser } from "./auth.service.js";

export async function register(req, res) {
    try {
        const result = await registerUser({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            profileImage: req.file
                ? {
                    contentType: req.file.mimetype,
                    data: req.file.buffer,
                }
                : null,
        });

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

export async function login(req, res) {
    try {
        const result = await loginUser(req.body);

        if (!result.ok) {
            return res.status(result.status).json(result.errors);
        }

        return res.status(result.status).json({
            message: "Login successful",
            token: result.token,
            user: result.user,
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ general: "Server error" });
    }
}
