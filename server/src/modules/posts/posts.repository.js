import posts from "../../data/posts.json" with { type: "json" };

export function getAllPosts() {
  return posts;
}
