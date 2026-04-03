import mongoose from "mongoose";
import { createReport, findPostDocumentById } from "./reports.repository.js";

function requireAuthenticatedUser(user) {
  if (!user || !user._id) {
    throw new Error("Authentication required");
  }
}

function requireString(value, fieldName) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${fieldName} is required`);
  }

  return value.trim();
}

function trimOptionalString(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function buildPreview(text) {
  const cleanText = String(text ?? "").trim();
  return cleanText.length > 180 ? `${cleanText.slice(0, 177)}...` : cleanText;
}

export async function createPostReportRecord(postId, body, user) {
  requireAuthenticatedUser(user);

  const post = await findPostDocumentById(postId);
  if (!post) {
    throw new Error("Post not found");
  }

  const reason = requireString(body.reason, "reason");
  const details = trimOptionalString(body.details);

  return await createReport({
    targetType: "post",
    targetPostId: post._id,
    reporterId: user._id,
    reporterUsername: user.username,
    reportedUserId: post.authorId && mongoose.Types.ObjectId.isValid(post.authorId)
      ? post.authorId
      : null,
    reportedUsername: post.authorUsername || "Unknown",
    reason,
    details,
    contentTitle: post.title,
    contentPreview: buildPreview(post.content),
  });
}

export async function createCommentReportRecord(postId, commentId, body, user) {
  requireAuthenticatedUser(user);

  const post = await findPostDocumentById(postId);
  if (!post) {
    throw new Error("Post not found");
  }

  const comment = post.comments.id(commentId);
  if (!comment) {
    throw new Error("Comment not found");
  }

  const reason = requireString(body.reason, "reason");
  const details = trimOptionalString(body.details);

  return await createReport({
    targetType: "comment",
    targetPostId: post._id,
    targetCommentId: comment._id,
    reporterId: user._id,
    reporterUsername: user.username,
    reportedUserId: comment.authorId ?? null,
    reportedUsername: comment.authorUsername || "Unknown",
    reason,
    details,
    contentTitle: post.title,
    contentPreview: buildPreview(comment.text),
  });
}