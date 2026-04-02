import {
  addPost,
  findPostById,
  findPosts,
  updatePostById,
  deletePostById,
  incrementPostViews
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

export async function getPostRecord(idParam) {
  const post = await findPostById(idParam);
  if (!post) throw new Error("Post not found");

  return post;
}

export async function createPostRecord(body, user = null) {
  const type = requireString(body.type, "type");
  const category = requireString(body.category, "category");
  const title = requireString(body.title, "title");
  const content = requireString(body.content, "content");

  return await addPost({
    type,
    category,
    title,
    content,
    authorId: user?._id ?? null,
    authorUsername: user?.username ?? "Guest",
  });
}

export async function updatePostRecord(idParam, body) {
  const updates = {};

  if (body.type !== undefined) updates.type = requireString(body.type, "type");
  if (body.category !== undefined) updates.category = requireString(body.category, "category");
  if (body.title !== undefined) updates.title = requireString(body.title, "title");
  if (body.content !== undefined) updates.content = requireString(body.content, "content");

  if (body.likes !== undefined) {
    if (!Number.isInteger(body.likes) || body.likes < 0) {
      throw new Error("likes must be a non-negative integer");
    }
    updates.likes = body.likes;
  }

  if (body.views !== undefined) {
    if (!Number.isInteger(body.views) || body.views < 0) {
      throw new Error("views must be a non-negative integer");
    }
    updates.views = body.views;
  }

  if (body.comments !== undefined) {
    if (!Array.isArray(body.comments)) {
      throw new Error("comments must be an array");
    }

    updates.comments = body.comments.map((comment) => ({
      text: requireString(comment?.text, "comment text"),
      authorId: comment?.authorId ?? null,
      authorUsername:
        typeof comment?.authorUsername === "string" && comment.authorUsername.trim()
          ? comment.authorUsername.trim()
          : "Guest",
    }));
  }

  if (Object.keys(updates).length === 0) {
    throw new Error("No valid fields provided to update");
  }

  const updated = await updatePostById(idParam, updates);
  if (!updated) throw new Error("Post not found");

  return updated;
}

export async function incrementPostViewsRecord(idParam) {
  const updated = await incrementPostViews(idParam);
  if (!updated) throw new Error("Post not found");

  return updated;
}

export async function deletePostRecord(idParam) {
  const deleted = await deletePostById(idParam);
  if (!deleted) throw new Error("Post not found");
}