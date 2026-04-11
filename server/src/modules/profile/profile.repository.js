import mongoose from "mongoose";
import User from "../../models/User.js";
import Post from "../../models/Post.js";
import Like from "../../models/Likes.js";
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

export async function countLikesByUser(userId) {
    return await Like.countDocuments({ userId });
}

export async function countLikesOnAuthorPosts(authorId) {
    const authoredPosts = await Post.find({ authorId }, { _id: 1 }).lean();
    const postIds = authoredPosts.map((post) => post._id);

    if (postIds.length === 0) {
        return 0;
    }

    return await Like.countDocuments({ postId: { $in: postIds } });
}

export async function sumViewsOnAuthorPosts(authorId) {
    const result = await Post.aggregate([
        { $match: { authorId: new mongoose.Types.ObjectId(String(authorId)) } },
        {
            $group: {
                _id: null,
                total: { $sum: "$views" },
            },
        },
    ]);

    return result[0]?.total ?? 0;
}

export async function countCommentsOnAuthorPosts(authorId) {
    const result = await Post.aggregate([
        { $match: { authorId: new mongoose.Types.ObjectId(String(authorId)) } },
        {
            $project: {
                commentCount: { $size: { $ifNull: ["$comments", []] } },
            },
        },
        {
            $group: {
                _id: null,
                total: { $sum: "$commentCount" },
            },
        },
    ]);

    return result[0]?.total ?? 0;
}

export async function updateUserById(id, updates) {
    return await User.findByIdAndUpdate(id, { $set: updates }, { new: true });
}

export async function syncUserProfileOnPosts(user) {
    const authorProfileImage = getProfileImagePath(user._id, user.profileImage, user.updatedAt);

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

export async function findPostsByAuthorId(authorId) {
    return await Post.find({ authorId }).sort({ createdAt: -1 }).lean();
}

export async function findCommentsByAuthorId(authorId) {
    return await Post.aggregate([
        { $unwind: "$comments" },
        { $match: { "comments.authorId": new mongoose.Types.ObjectId(String(authorId)) } },
        {
            $project: {
                _id: "$comments._id",
                text: "$comments.text",
                createdAt: "$comments.createdAt",
                postId: "$_id",
                postTitle: "$title",
                postCategory: "$category",
                postType: "$type",
            },
        },
        { $sort: { createdAt: -1 } },
    ]);
}
