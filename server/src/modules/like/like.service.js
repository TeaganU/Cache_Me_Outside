import * as likeRepo from "./like.repository.js";
import { findPostById, setPostLikesById } from "../posts/posts.repository.js";

function requireAuthenticatedUser(user) {
    if (!user || !user._id) {
        throw new Error("Authentication required");
    }
}

export async function createLike(user, postId) {
    requireAuthenticatedUser(user);

    const post = await findPostById(postId);
    if (!post) {
        throw new Error("Post not found");
    }

    try {
        const like = await likeRepo.createLike(user._id, postId);
        const likesCount = await likeRepo.countLikesByPost(postId);
        await setPostLikesById(postId, likesCount);

        return {
            liked: true,
            like,
            likesCount,
        };
    } catch (error) {
        if (error?.code === 11000) {
            throw new Error("Post already liked");
        }

        throw error;
    }
}

export async function toggleLike(user, postId) {
    requireAuthenticatedUser(user);

    const post = await findPostById(postId);
    if (!post) {
        throw new Error("Post not found");
    }

    const existingLike = await likeRepo.findLikeByUserAndPost(user._id, postId);

    if (existingLike) {
        await likeRepo.deleteLike(user._id, postId);
        const likesCount = await likeRepo.countLikesByPost(postId);
        await setPostLikesById(postId, likesCount);

        return {
            liked: false,
            likesCount,
        };
    }

    const like = await likeRepo.createLike(user._id, postId);
    const likesCount = await likeRepo.countLikesByPost(postId);
    await setPostLikesById(postId, likesCount);

    return {
        liked: true,
        like,
        likesCount,
    };
}

export async function deleteLike(user, postId) {
    requireAuthenticatedUser(user);

    const post = await findPostById(postId);
    if (!post) {
        throw new Error("Post not found");
    }

    await likeRepo.deleteLike(user._id, postId);
    const likesCount = await likeRepo.countLikesByPost(postId);
    await setPostLikesById(postId, likesCount);

    return {
        liked: false,
        likesCount,
    };
}

export async function getMyLikeStatus(user, postId) {
    requireAuthenticatedUser(user);

    const post = await findPostById(postId);
    if (!post) {
        throw new Error("Post not found");
    }

    const like = await likeRepo.findLikeByUserAndPost(user._id, postId);
    const likesCount = await likeRepo.countLikesByPost(postId);

    return {
        liked: !!like,
        likesCount,
    };
}
