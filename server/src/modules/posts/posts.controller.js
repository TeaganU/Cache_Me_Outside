import {
  createPostRecord,
  searchPosts,
  updatePostRecord,
  deletePostRecord
} from "./posts.service.js";

export async function getPosts(req, res) {
  const { search, category, type } = req.query;

  try {
    const results = await searchPosts({ search, category, type });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: "Error fetching posts" });
  }
}

export async function createPost(req, res) {
  try {
    const newPost = await createPostRecord(req.body);

    res.status(201).json({
      message: "Post successfully created",
      post: newPost
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function updatePost(req, res) {
  try {
    const updated = await updatePostRecord(req.params.id, req.body);

    res.json({
      message: "Post successfully updated",
      post: updated
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function deletePost(req, res) {
  try {
    await deletePostRecord(req.params.id);

    res.json({
      message: "Post successfully deleted"
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}