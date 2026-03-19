import { searchPosts } from "./posts.service.js";

export function getPosts(req, res) {
  const { search, category, type } = req.query;

  const results = searchPosts({ search, category, type });

  res.json(results);
}