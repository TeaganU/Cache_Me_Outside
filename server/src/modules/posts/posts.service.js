import {
  addPost,
  findPostById,
  findPostDocumentById,
  findPosts,
  updatePostById,
  deletePostById,
  incrementPostViews
} from "./posts.repository.js";
import { getProfileImagePath } from "../auth/auth.utils.js";

function requireString(value, fieldName) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${fieldName} is required`);
  }
  return value.trim();
}

function requireAuthenticatedUser(user) {
  if (!user || !user._id) {
    throw new Error("Authentication required");
  }
}

function canModifyPost(post, user) {
  if (!post.authorId || !user?._id) return false;
  return (
    post.authorId.toString() === user._id.toString() ||
    user.role === "admin"
  );
}

function canModifyComment(comment, user) {
  if (!comment?.authorId || !user?._id) {
    return user?.role === "admin";
  }

  return (
    comment.authorId.toString() === user._id.toString() ||
    user.role === "admin"
  );
}

export async function searchPosts({ search, category, type, sort }) {
  return await findPosts({ search, category, type, sort });
}

export async function getPostRecord(idParam) {
  const post = await findPostById(idParam);
  if (!post) throw new Error("Post not found");

  return post;
}

export async function createPostRecord(body, user) {
  requireAuthenticatedUser(user);

  const type = requireString(body.type, "type");
  const category = requireString(body.category, "category");
  const title = requireString(body.title, "title");
  const content = requireString(body.content, "content");

  return await addPost({
    type,
    category,
    title,
    content,
    authorId: user._id,
    authorUsername: user.username,
    authorProfileImage: getProfileImagePath(user._id, user.profileImage, user.updatedAt),
  });
}

export async function updatePostRecord(idParam, body, user) {
  requireAuthenticatedUser(user);

  const existingPost = await findPostById(idParam);
  if (!existingPost) throw new Error("Post not found");

  if (!canModifyPost(existingPost, user)) {
    throw new Error("Not allowed to edit this post");
  }

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
    throw new Error("Comments cannot be updated through this route");
  }

  if (Object.keys(updates).length === 0) {
    throw new Error("No valid fields provided to update");
  }

  const updated = await updatePostById(idParam, updates);
  if (!updated) throw new Error("Post not found");

  return updated;
}

export async function addCommentRecord(idParam, body, user) {
  requireAuthenticatedUser(user);

  const post = await findPostDocumentById(idParam);
  if (!post) throw new Error("Post not found");

  const text = requireString(body.text, "comment text");

  post.comments.push({
    text,
    authorId: user._id,
    authorUsername: user.username,
    authorProfileImage: getProfileImagePath(user._id, user.profileImage, user.updatedAt),
  });

  await post.save();

  return post.comments[post.comments.length - 1];
}

export async function updateCommentRecord(idParam, commentId, body, user) {
  requireAuthenticatedUser(user);

  const post = await findPostDocumentById(idParam);
  if (!post) throw new Error("Post not found");

  const comment = post.comments.id(commentId);
  if (!comment) throw new Error("Comment not found");

  if (!canModifyComment(comment, user)) {
    throw new Error("Not allowed to edit this comment");
  }

  comment.text = requireString(body.text, "comment text");
  await post.save();

  return comment;
}

export async function deleteCommentRecord(idParam, commentId, user) {
  requireAuthenticatedUser(user);

  const post = await findPostDocumentById(idParam);
  if (!post) throw new Error("Post not found");

  const comment = post.comments.id(commentId);
  if (!comment) throw new Error("Comment not found");

  if (!canModifyComment(comment, user)) {
    throw new Error("Not allowed to delete this comment");
  }

  comment.deleteOne();
  await post.save();
}

export async function incrementPostViewsRecord(idParam) {
  const updated = await incrementPostViews(idParam);
  if (!updated) throw new Error("Post not found");

  return updated;
}

export async function deletePostRecord(idParam, user) {
  requireAuthenticatedUser(user);

  const existingPost = await findPostById(idParam);
  if (!existingPost) throw new Error("Post not found");

  if (!canModifyPost(existingPost, user)) {
    throw new Error("Not allowed to delete this post");
  }

  const deleted = await deletePostById(idParam);
  if (!deleted) throw new Error("Post not found");
}
