import {
  createPostRecord,
  getPostRecord,
  searchPosts,
  updatePostRecord,
  deletePostRecord,
  incrementPostViewsRecord,
  addCommentRecord,
  updateCommentRecord,
  deleteCommentRecord
} from "./posts.service.js";

export async function getPosts(req, res) {
  const { search, category, type, sort } = req.query;

  try {
    const results = await searchPosts({ search, category, type, sort });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Error fetching posts" });
  }
}

export async function getPost(req, res) {
  try {
    const post = await getPostRecord(req.params.id);
    res.json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

export async function createPost(req, res) {
  try {
    const newPost = await createPostRecord(req.body, req.user);

    res.status(201).json({
      message: "Post successfully created",
      post: newPost
    });
  } catch (error) {
    const status =
      error.message === "Authentication required" ? 401 : 400;

    res.status(status).json({ message: error.message });
  }
}

export async function updatePost(req, res) {
  try {
    const updated = await updatePostRecord(req.params.id, req.body, req.user);

    res.json({
      message: "Post successfully updated",
      post: updated
    });
  } catch (error) {
    const status =
      error.message === "Authentication required" ? 401 :
        error.message === "Post not found" ? 404 :
          error.message === "Not allowed to edit this post" ? 403 :
            400;

    res.status(status).json({ message: error.message });
  }
}

export async function addComment(req, res) {
  try {
    const comment = await addCommentRecord(req.params.id, req.body, req.user);

    res.status(201).json({
      message: "Comment successfully added",
      comment
    });
  } catch (error) {
    const status =
      error.message === "Authentication required" ? 401 :
        error.message === "Post not found" ? 404 :
          400;

    res.status(status).json({ message: error.message });
  }
}

export async function updateComment(req, res) {
  try {
    const comment = await updateCommentRecord(req.params.id, req.params.commentId, req.body, req.user);

    res.json({
      message: "Comment successfully updated",
      comment
    });
  } catch (error) {
    const status =
      error.message === "Authentication required" ? 401 :
        error.message === "Post not found" ? 404 :
          error.message === "Comment not found" ? 404 :
            error.message === "Not allowed to edit this comment" ? 403 :
              400;

    res.status(status).json({ message: error.message });
  }
}

export async function deleteComment(req, res) {
  try {
    await deleteCommentRecord(req.params.id, req.params.commentId, req.user);

    res.json({
      message: "Comment successfully deleted"
    });
  } catch (error) {
    const status =
      error.message === "Authentication required" ? 401 :
        error.message === "Post not found" ? 404 :
          error.message === "Comment not found" ? 404 :
            error.message === "Not allowed to delete this comment" ? 403 :
              400;

    res.status(status).json({ message: error.message });
  }
}

export async function incrementPostViews(req, res) {
  try {
    const updated = await incrementPostViewsRecord(req.params.id);

    res.json({
      message: "Post view count updated",
      post: updated
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function deletePost(req, res) {
  try {
    await deletePostRecord(req.params.id, req.user);

    res.json({
      message: "Post successfully deleted"
    });
  } catch (error) {
    const status =
      error.message === "Authentication required" ? 401 :
        error.message === "Post not found" ? 404 :
          error.message === "Not allowed to delete this post" ? 403 :
            400;

    res.status(status).json({ message: error.message });
  }
}
