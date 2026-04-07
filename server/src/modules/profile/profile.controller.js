import { getProfileImageRecord } from "./profile.service.js";

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
