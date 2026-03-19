import { createPostRecord, searchPosts } from "./posts.service.js";

export async function getPosts(req, res) {
  const { search, category, type } = req.query;

  const results = await searchPosts({ search, category, type });

  res.json(results);
}

export function createPost(req, res) {
  try {
    const newPost = createPostRecord(req.body);

    res.status(201).json({
      message: "Post successfully created",
      post: newPost
    });
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
}
