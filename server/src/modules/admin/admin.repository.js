import mongoose from "mongoose";
import Post from "../../models/Post.js";
import Report from "../../models/Report.js";
import User from "../../models/User.js";

export async function countUsers() {
  return await User.countDocuments();
}

export async function findUsersCreatedBetween(startDate, endDate) {
  return await User.find(
    {
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    },
    {
      _id: 1,
      createdAt: 1,
    }
  ).lean();
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

export async function findPostsCreatedBetween(startDate, endDate) {
  return await Post.find(
    {
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    },
    {
      _id: 1,
      title: 1,
      views: 1,
      likes: 1,
      createdAt: 1,
      comments: 1,
    }
  ).lean();
}

export async function findRecentPostsPage(page = 1, limit = 6) {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.max(Number(limit) || 6, 1);
  const skip = (safePage - 1) * safeLimit;

  const [posts, totalPosts] = await Promise.all([
    Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .lean(),
    Post.countDocuments(),
  ]);

  return {
    posts,
    pagination: {
      page: safePage,
      limit: safeLimit,
      totalItems: totalPosts,
      totalPages: Math.max(Math.ceil(totalPosts / safeLimit), 1),
    },
  };
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

export async function findReportsCreatedBetween(startDate, endDate) {
  return await Report.find(
    {
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    },
    {
      _id: 1,
      reason: 1,
      createdAt: 1,
    }
  ).lean();
}

export async function searchUsersForAdmin(query, limit = 12) {
  const normalizedQuery = String(query ?? "").trim();

  if (!normalizedQuery) {
    return [];
  }

  const regex = new RegExp(normalizedQuery, "i");

  const matchingPosts = await Post.find(
    {
      $or: [
        { title: regex },
        { content: regex },
      ],
    },
    {
      _id: 1,
      title: 1,
      authorId: 1,
      authorUsername: 1,
    }
  )
    .sort({ createdAt: -1 })
    .limit(25)
    .lean();

  const matchedAuthorIds = [
    ...new Set(
      matchingPosts
        .map((post) => post.authorId?.toString())
        .filter(Boolean)
    ),
  ].map((id) => new mongoose.Types.ObjectId(id));

  const userQuery = {
    $or: [
      { username: regex },
      { email: regex },
      ...(matchedAuthorIds.length > 0 ? [{ _id: { $in: matchedAuthorIds } }] : []),
    ],
  };

  const users = await User.find(userQuery)
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return users.map((user) => {
    const userId = user._id.toString();
    const matchedUserPosts = matchingPosts
      .filter((post) => post.authorId?.toString() === userId)
      .slice(0, 3)
      .map((post) => ({
        _id: post._id,
        title: post.title,
      }));

    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      isDisabled: Boolean(user.isDisabled),
      matchedPosts: matchedUserPosts,
    };
  });
}

export async function updateUserById(userId, updates) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return null;
  }

  return await User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true }
  ).lean();
}

export async function findUserById(userId) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return null;
  }

  return await User.findById(userId);
}

export async function findDisabledUsers(limit = 100) {
  return await User.find({ isDisabled: true })
    .sort({ updatedAt: -1, createdAt: -1 })
    .limit(limit)
    .lean();
}

export async function findTopPostsByViews(limit = 5) {
  return await Post.find(
    {},
    {
      _id: 1,
      title: 1,
      views: 1,
      likes: 1,
      authorUsername: 1,
    }
  )
    .sort({ views: -1, likes: -1, createdAt: -1 })
    .limit(limit)
    .lean();
}
