export function getProfileImagePath(userId, profileImage, version = "") {
    if (!userId || !profileImage?.data || !profileImage?.contentType) {
        return "";
    }

    const versionToken =
        version instanceof Date
            ? version.getTime()
            : typeof version === "string" || typeof version === "number"
                ? version
                : "";

    return versionToken
        ? `/api/profile/${userId}/image?v=${encodeURIComponent(String(versionToken))}`
        : `/api/profile/${userId}/image`;
}

export function getDisabledAccountDetails(user) {
    if (!user?.isDisabled) {
        return null;
    }

    return {
        message: "This account has been disabled by an administrator.",
    };
}

export async function normalizeDisabledState(user) {
    return user;
}

export function toPublicUser(user) {
    return {
        id: user._id,
        username: user.username,
        email: user.email,
        bio: user.bio || "",
        profileImage: getProfileImagePath(user._id, user.profileImage, user.updatedAt),
        role: user.role,
    };
}
