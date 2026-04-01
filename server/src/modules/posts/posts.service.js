import {
  addPost,
  findPosts,
  updatePostById,
  deletePostById
} from "./posts.repository.js";

function requireString(value, fieldName) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${fieldName} is required`);
  }
  return value.trim();
}

export async function searchPosts({ search, category, type }) {
  return await findPosts({ search, category, type });
}

export async function createPostRecord(body) {
  const type = requireString(body.type, "type");
  const category = requireString(body.category, "category");
  const title = requireString(body.title, "title");
  const content = requireString(body.content, "content");

  return await addPost({
    type,
    category,
    title,
    content
  });
}

export async function updatePostRecord(idParam, body) {
  const id = Number(idParam);
  if (!Number.isFinite(id)) throw new Error("Invalid post id");

  const updates = {};

  if (body.type !== undefined) updates.type = requireString(body.type, "type");
  if (body.category !== undefined) updates.category = requireString(body.category, "category");
  if (body.title !== undefined) updates.title = requireString(body.title, "title");
  if (body.content !== undefined) updates.content = requireString(body.content, "content");

  if (Object.keys(updates).length === 0) {
    throw new Error("No valid fields provided to update");
  }

  const updated = await updatePostById(id, updates);
  if (!updated) throw new Error("Post not found");

  return updated;
}

export async function deletePostRecord(idParam) {
  const id = Number(idParam);
  if (!Number.isFinite(id)) throw new Error("Invalid post id");

  const deleted = await deletePostById(id);
  if (!deleted) throw new Error("Post not found");
}