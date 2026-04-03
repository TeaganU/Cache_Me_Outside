import mongoose from "mongoose";
import Post from "../../models/Post.js";
import Report from "../../models/Report.js";
import User from "../../models/User.js";

export async function countUsers() {
  return await User.countDocuments();
}

export async function countPosts() {
  return await Post.countDocuments();
}

export async function countNewUsersSince(date) {
  return await User.countDocuments({
    createdAt: { $gte: date },
  });
}

export async function countPendingReports() {
  return await Report.countDocuments({ status: "pending" });
}

export async function findRecentPendingReports(limit = 8) {
  return await Report.find({ status: "pending" })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
}

export async function findRecentPosts(limit = 6) {
  return await Post.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
}

export async function dismissReportById(reportId, adminUser) {
  if (!mongoose.Types.ObjectId.isValid(reportId)) {
    return null;
  }

  return await Report.findByIdAndUpdate(
    reportId,
    {
      $set: {
        status: "dismissed",
        resolvedById: adminUser._id,
        resolvedByUsername: adminUser.username,
        resolvedAt: new Date(),
      },
    },
    { new: true }
  ).lean();
}