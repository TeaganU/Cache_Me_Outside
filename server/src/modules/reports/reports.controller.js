import {
  createPostReportRecord,
  createCommentReportRecord,
} from "./reports.service.js";

export async function createPostReport(req, res) {
  try {
    const report = await createPostReportRecord(req.params.postId, req.body, req.user);

    res.status(201).json({
      message: "Report submitted",
      report,
    });
  } catch (error) {
    const status =
      error.message === "Authentication required" ? 401 :
      error.message === "Post not found" ? 404 :
      400;

    res.status(status).json({ message: error.message });
  }
}

export async function createCommentReport(req, res) {
  try {
    const report = await createCommentReportRecord(
      req.params.postId,
      req.params.commentId,
      req.body,
      req.user
    );

    res.status(201).json({
      message: "Report submitted",
      report,
    });
  } catch (error) {
    const status =
      error.message === "Authentication required" ? 401 :
      error.message === "Post not found" || error.message === "Comment not found" ? 404 :
      400;

    res.status(status).json({ message: error.message });
  }
}