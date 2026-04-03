import mongoose from "mongoose";
import Post from "../../models/Post.js";
import Report from "../../models/Report.js";

export async function findPostDocumentById(postId) {
  if (!mongoose.Types.ObjectId.isValid(postId)) {
    return null;
  }

  return await Post.findById(postId);
}

export async function createReport(reportData) {
  const report = new Report(reportData);
  return await report.save();
}