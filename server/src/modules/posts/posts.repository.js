import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const POSTS_FILE = path.resolve(__dirname, "../../data/posts.json");

function readPosts() {
  const fileContents = fs.readFileSync(POSTS_FILE, "utf-8");
  return JSON.parse(fileContents);
}

function writePosts(posts) {
  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2));
}

export function findAll() {
  return readPosts();
}

export function findById(id) {
  return readPosts().find(post => post.id === id);
}

export function save(post) {
  const posts = readPosts();
  const index = posts.findIndex(existingPost => existingPost.id === post.id);

  if (index >= 0) {
    posts[index] = post;
  } else {
    posts.push(post);
  }

  writePosts(posts);
  return post;
}

export function remove(id) {
  const posts = readPosts().filter(post => post.id !== id);
  writePosts(posts);
}

export function getAllPosts() {
  return findAll();
}

export function addPost(newPost) {
  const posts = readPosts();
  posts.push(newPost);
  writePosts(posts);
  return newPost;
}
