import mongoose from "mongoose";
import User from "../../models/User.js";
import Post from "../../models/Post.js";
import { getProfileImagePath } from "../auth/auth.utils.js";

export async function findUserProfileImageById(id) {
    return await User.findById(id).select("profileImage");
}

export async function findUserById(id) {
    return await User.findById(id);
}

export async function findUserByUsername(username) {
    return await User.findOne({ username });
}

export async function findUserByEmail(email) {
    return await User.findOne({ email });
}

export async function countPostsByAuthor(authorId) {
    return await Post.countDocuments({ authorId });
}

export async function countCommentsByAuthor(authorId) {
    const result = await Post.aggregate([
        { $unwind: "$comments" },
        { $match: { "comments.authorId": new mongoose.Types.ObjectId(String(authorId)) } },
        { $count: "total" },
    ]);

    return result[0]?.total ?? 0;
}

export async function updateUserById(id, updates) {
    return await User.findByIdAndUpdate(id, { $set: updates }, { new: true });
}

export async function syncUserProfileOnPosts(user) {
    const authorProfileImage = getProfileImagePath(user._id, user.profileImage);

    await Post.updateMany(
        { authorId: user._id },
        {
            $set: {
                authorUsername: user.username,
                authorProfileImage,
            },
        }
    );

    await Post.updateMany(
        { "comments.authorId": user._id },
        {
            $set: {
                "comments.$[comment].authorUsername": user.username,
                "comments.$[comment].authorProfileImage": authorProfileImage,
            },
        },
        {
            arrayFilters: [{ "comment.authorId": user._id }],
        }
    );
}