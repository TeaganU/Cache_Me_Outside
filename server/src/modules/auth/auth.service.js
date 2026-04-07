import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
    findUserByEmail,
    findUserByUsername,
    createUser,
} from "./auth.repository.js";
import { toPublicUser } from "./auth.utils.js";

const emailRegex = /^(.+)@([^\.].*)\.([a-z]{2,})$/i;
const usernameRegex = /^[a-zA-Z0-9_]+$/;

export async function registerUser({ username, email, password, profileImage }) {
    const errors = {};

    const cleanUsername = username?.trim();
    const cleanEmail = email?.trim().toLowerCase();

    if (!cleanUsername) {
        errors.username = "Username is required";
    } else if (cleanUsername.length < 3 || cleanUsername.length > 16) {
        errors.username = "Username must be 3 to 16 characters";
    } else if (!usernameRegex.test(cleanUsername)) {
        errors.username = "Username can only contain letters, numbers, and underscores";
    }

    if (!cleanEmail) {
        errors.email = "Email is required";
    } else if (!emailRegex.test(cleanEmail)) {
        errors.email = "Enter a valid email";
    }

    if (!password) {
        errors.password = "Password is required";
    } else if (password.length < 8) {
        errors.password = "Password must be at least 8 characters";
    }

    if (Object.keys(errors).length > 0) {
        return { ok: false, status: 400, errors };
    }

    const existingEmail = await findUserByEmail(cleanEmail);
    if (existingEmail) {
        return {
            ok: false,
            status: 409,
            errors: { email: "Email already in use" },
        };
    }

    const existingUsername = await findUserByUsername(cleanUsername);
    if (existingUsername) {
        return {
            ok: false,
            status: 409,
            errors: { username: "Username already taken" },
        };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await createUser({
        username: cleanUsername,
        email: cleanEmail,
        passwordHash,
        profileImage: profileImage ?? undefined,
    });

    return {
        ok: true,
        status: 201,
        user: toPublicUser(user),
    };
}

export async function loginUser({ email, password }) {
    const errors = {};

    const cleanEmail = email?.trim().toLowerCase();

    if (!cleanEmail) {
        errors.email = "Email is required";
    }

    if (!password) {
        errors.password = "Password is required";
    }

    if (Object.keys(errors).length > 0) {
        return { ok: false, status: 400, errors };
    }

    const user = await findUserByEmail(cleanEmail);

    if (!user) {
        return {
            ok: false,
            status: 401,
            errors: { general: "Invalid email or password" },
        };
    }

    if (user.isDisabled) {
        return {
            ok: false,
            status: 403,
            errors: { general: "This account has been disabled" },
        };
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatches) {
        return {
            ok: false,
            status: 401,
            errors: { general: "Invalid email or password" },
        };
    }

    const token = jwt.sign(
        {
            sub: user._id.toString(),
            role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    return {
        ok: true,
        status: 200,
        token,
        user: toPublicUser(user),
    };
}
