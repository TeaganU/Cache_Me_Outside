export function getProfileImagePath(userId, profileImage) {
    if (!userId || !profileImage?.data || !profileImage?.contentType) {
        return "";
    }

    return `/api/profile/${userId}/image`;
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
        fullName: user.fullName || "",
        email: user.email,
        bio: user.bio || "",
        gender: user.gender || "",
        country: user.country || "",
        phoneNumber: user.phoneNumber || "",
        helpfulVotes: user.helpfulVotes ?? 0,
        connections: user.connections ?? 0,
        profileImage: getProfileImagePath(user._id, user.profileImage),
        role: user.role,
    };
}
