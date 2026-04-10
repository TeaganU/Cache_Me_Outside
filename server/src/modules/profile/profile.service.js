import { toPublicUser } from "../auth/auth.utils.js";
import {
    countCommentsByAuthor,
    countPostsByAuthor,
    findUserByEmail,
    findUserById,
    findUserByUsername,
    findUserProfileImageById,
    syncUserProfileOnPosts,
    updateUserById,
} from "./profile.repository.js";

const emailRegex = /^(.+)@([^\.].*)\.([a-z]{2,})$/i;
const usernameRegex = /^[a-zA-Z0-9_]+$/;

export async function getProfileImageRecord(idParam) {
    const user = await findUserProfileImageById(idParam);

    if (!user || !user.profileImage?.data || !user.profileImage?.contentType) {
        throw new Error("Profile image not found");
    }

    return user.profileImage;
}

function requireAuthenticatedUser(user) {
    if (!user || !user._id) {
        throw new Error("Authentication required");
    }
}

function optionalString(value, maxLength, fieldName) {
    if (value === undefined) {
        return undefined;
    }

    if (typeof value !== "string") {
        throw new Error(`${fieldName} must be a string`);
    }

    const trimmed = value.trim();

    if (trimmed.length > maxLength) {
        throw new Error(`${fieldName} must be ${maxLength} characters or fewer`);
    }

    return trimmed;
}

async function buildProfilePayload(user) {
    const [postsCreated, repliesGiven] = await Promise.all([
        countPostsByAuthor(user._id),
        countCommentsByAuthor(user._id),
    ]);

    return {
        ...toPublicUser(user),
        stats: {
            postsCreated,
            repliesGiven,
            helpfulVotes: user.helpfulVotes ?? 0,
            connections: user.connections ?? 0,
        },
    };
}

export async function getCurrentProfile(user) {
    requireAuthenticatedUser(user);

    const freshUser = await findUserById(user._id);

    if (!freshUser) {
        throw new Error("User not found");
    }

    return await buildProfilePayload(freshUser);
}

export async function updateCurrentProfile(user, body, file) {
    requireAuthenticatedUser(user);

    const existingUser = await findUserById(user._id);

    if (!existingUser) {
        throw new Error("User not found");
    }

    const updates = {};

    if (body.fullName !== undefined) {
        updates.fullName = optionalString(body.fullName, 60, "fullName");
    }

    if (body.bio !== undefined) {
        updates.bio = optionalString(body.bio, 280, "bio");
    }

    if (body.gender !== undefined) {
        updates.gender = optionalString(body.gender, 30, "gender");
    }

    if (body.country !== undefined) {
        updates.country = optionalString(body.country, 60, "country");
    }

    if (body.phoneNumber !== undefined) {
        updates.phoneNumber = optionalString(body.phoneNumber, 30, "phoneNumber");
    }

    if (body.username !== undefined) {
        if (typeof body.username !== "string") {
            throw new Error("username must be a string");
        }

        const username = body.username.trim();

        if (!username) {
            throw new Error("Username is required");
        }

        if (username.length < 3 || username.length > 16) {
            throw new Error("Username must be 3 to 16 characters");
        }

        if (!usernameRegex.test(username)) {
            throw new Error("Username can only contain letters, numbers, and underscores");
        }

        const existingUsername = await findUserByUsername(username);

        if (existingUsername && existingUsername._id.toString() !== existingUser._id.toString()) {
            throw new Error("Username already taken");
        }

        updates.username = username;
    }

    if (body.email !== undefined) {
        if (typeof body.email !== "string") {
            throw new Error("email must be a string");
        }

        const email = body.email.trim().toLowerCase();

        if (!email) {
            throw new Error("Email is required");
        }

        if (!emailRegex.test(email)) {
            throw new Error("Enter a valid email");
        }

        const existingEmail = await findUserByEmail(email);

        if (existingEmail && existingEmail._id.toString() !== existingUser._id.toString()) {
            throw new Error("Email already in use");
        }

        updates.email = email;
    }

    if (file) {
        updates.profileImage = {
            contentType: file.mimetype,
            data: file.buffer,
        };
    }

    const updatedUser = await updateUserById(existingUser._id, updates);

    await syncUserProfileOnPosts(updatedUser);

    return await buildProfilePayload(updatedUser);
}