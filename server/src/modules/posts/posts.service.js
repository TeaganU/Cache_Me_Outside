import { addPost, getAllPosts } from "./posts.repository.js";

export async function searchPosts({ search, category, type }) {
  let posts = await getAllPosts();

  if (search) {
    const normalizedSearch = search.toLowerCase();

    posts = posts.filter(post =>
      post.title.toLowerCase().includes(normalizedSearch) ||
      post.content.toLowerCase().includes(normalizedSearch) ||
      post.author.toLowerCase().includes(normalizedSearch) ||
      post.category.toLowerCase().includes(normalizedSearch) ||
      post.type.toLowerCase().includes(normalizedSearch)
    );
  }

  if (category && category !== "All") {
    posts = posts.filter(post => post.category === category);
  }

  if (type && type !== "All") {
    posts = posts.filter(post => post.type === type);
  }

  return posts;
}

export function createPostRecord({ type, category, title, content }) {
  if (!title || !content) {
    throw new Error("Missing required fields");
  }

  const newPost = {
    id: Date.now(),
    type,
    category,
    title,
    content
  };

  return addPost(newPost);
}
