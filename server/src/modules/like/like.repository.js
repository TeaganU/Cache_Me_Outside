import mongoose from "mongoose";
import Like from "../../models/Likes.js";

export async function createLike(userId, postId) {
    if (
        !mongoose.Types.ObjectId.isValid(userId) ||
        !mongoose.Types.ObjectId.isValid(postId)
    ) {
        return null;
    }

    const like = await Like.create({ userId, postId });
    return like.toObject();
}

export async function deleteLike(userId, postId) {
    if (
        !mongoose.Types.ObjectId.isValid(userId) ||
        !mongoose.Types.ObjectId.isValid(postId)
    ) {
        return null;
    }

    return await Like.findOneAndDelete({ userId, postId }).lean();
}

export async function findLikeByUserAndPost(userId, postId) {
    if (
        !mongoose.Types.ObjectId.isValid(userId) ||
        !mongoose.Types.ObjectId.isValid(postId)
    ) {
        return null;
    }

    return await Like.findOne({ userId, postId }).lean();
}

export async function countLikesByPost(postId) {
    if (!mongoose.Types.ObjectId.isValid(postId)) {
        return 0;
    }

    return await Like.countDocuments({ postId });
}
