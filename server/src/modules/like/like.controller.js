import * as likeService from "./like.service.js";

export async function createLike(req, res) {
    try {
        const result = await likeService.createLike(req.user, req.params.postId);

        res.status(201).json({
            message: "Like successfully added",
            like: result.like,
            liked: result.liked,
            likesCount: result.likesCount
        });
    } catch (error) {
        let status = 400;

        if (error.message === "Authentication required") status = 401;
        if (error.message === "Post not found") status = 404;
        if (error.message === "Post already liked") status = 409;

        res.status(status).json({ message: error.message });
    }
}

export async function toggleLike(req, res) {
    try {
        const result = await likeService.toggleLike(req.user, req.params.postId);

        res.json({
            message: result.liked ? "Like successfully added" : "Like successfully removed",
            like: result.like ?? null,
            liked: result.liked,
            likesCount: result.likesCount
        });
    } catch (error) {
        let status = 400;

        if (error.message === "Authentication required") status = 401;
        if (error.message === "Post not found") status = 404;

        res.status(status).json({ message: error.message });
    }
}

export async function deleteLike(req, res) {
    try {
        const result = await likeService.deleteLike(req.user, req.params.postId);

        res.json({
            message: "Like successfully removed",
            liked: result.liked,
            likesCount: result.likesCount
        });
    } catch (error) {
        let status = 400;

        if (error.message === "Authentication required") status = 401;
        if (error.message === "Post not found") status = 404;

        res.status(status).json({ message: error.message });
    }
}

export async function getMyLikeStatus(req, res) {
    try {
        const result = await likeService.getMyLikeStatus(req.user, req.params.postId);

        res.json(result);
    } catch (error) {
        let status = 400;

        if (error.message === "Authentication required") status = 401;
        if (error.message === "Post not found") status = 404;

        res.status(status).json({ message: error.message });
    }
}
