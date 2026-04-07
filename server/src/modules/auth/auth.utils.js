export function getProfileImagePath(userId, profileImage) {
    if (!userId || !profileImage?.data || !profileImage?.contentType) {
        return "";
    }

    return `/api/profile/${userId}/image`;
}

export function toPublicUser(user) {
    return {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: getProfileImagePath(user._id, user.profileImage),
        role: user.role,
    };
}
