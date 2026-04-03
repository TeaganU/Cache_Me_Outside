import { findUserProfileImageById } from "./profile.repository.js";

export async function getProfileImageRecord(idParam) {
    const user = await findUserProfileImageById(idParam);

    if (!user || !user.profileImage?.data || !user.profileImage?.contentType) {
        throw new Error("Profile image not found");
    }

    return user.profileImage;
}
