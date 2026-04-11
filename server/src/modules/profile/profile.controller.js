import {
    getCurrentProfile,
    getProfileImageRecord,
    updateCurrentProfile,
    getCurrentUserPosts,
    getCurrentUserComments,
} from "./profile.service.js";

export async function getProfileImage(req, res) {
    try {
        const profileImage = await getProfileImageRecord(req.params.id);

        res.set("Content-Type", profileImage.contentType);
        res.set("Cache-Control", "public, max-age=86400");
        res.send(profileImage.data);
    } catch (error) {
        const status = error.message === "Profile image not found" ? 404 : 500;
        res.status(status).json({ message: error.message });
    }
}

export async function getMyProfile(req, res) {
    try {
        const profile = await getCurrentProfile(req.user);
        res.json(profile);
    } catch (error) {
        const status =
            error.message === "Authentication required" ? 401 :
                error.message === "User not found" ? 404 :
                    400;

        res.status(status).json({ message: error.message });
    }
}

export async function updateMyProfile(req, res) {
    try {
        const profile = await updateCurrentProfile(req.user, req.body, req.file);

        res.json({
            message: "Profile updated successfully",
            profile,
        });
    } catch (error) {
        const status =
            error.message === "Authentication required" ? 401 :
                error.message === "User not found" ? 404 :
                    error.message === "Username already taken" || error.message === "Email already in use" ? 409 :
                        400;

        res.status(status).json({ message: error.message });
    }
}

export async function getMyPosts(req, res) {
    try {
        const posts = await getCurrentUserPosts(req.user);

        res.json({
            message: "Posts loaded successfully",
            posts,
        });
    } catch (error) {
        const status =
            error.message === "Authentication required" ? 401 :
                error.message === "User not found" ? 404 :
                    400;

        res.status(status).json({ message: error.message });
    }
}

export async function getMyComments(req, res) {
    try {
        const comments = await getCurrentUserComments(req.user);

        res.json({
            message: "Comments loaded successfully",
            comments,
        });
    } catch (error) {
        const status =
            error.message === "Authentication required" ? 401 :
                error.message === "User not found" ? 404 :
                    400;

        res.status(status).json({ message: error.message });
    }
}