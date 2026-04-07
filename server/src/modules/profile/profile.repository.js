import User from "../../models/User.js";

export async function findUserProfileImageById(id) {
    return await User.findById(id).select("profileImage");
}
