import {
  updateUserById,
  countNewUsersSince,
  countPendingReports,
  countPosts,
  countUsers,
  dismissReportById,
  findDisabledUsers,
  findUserById,
  findRecentPendingReports,
  findRecentPosts,
  findRecentPostsPage,
  searchUsersForAdmin,
} from "./admin.repository.js";

function getStartOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export async function getAdminDashboardRecord() {
  const todayStart = getStartOfToday();

  const [totalUsers, totalPosts, newUsersToday, pendingReports, recentReports, recentPosts] =
    await Promise.all([
      countUsers(),
      countPosts(),
      countNewUsersSince(todayStart),
      countPendingReports(),
      findRecentPendingReports(),
      findRecentPosts(),
    ]);

  return {
    analytics: {
      totalUsers,
      totalPosts,
      newUsersToday,
      pendingReports,
    },
    recentReports,
    recentPosts,
  };
}

export async function dismissReportRecord(reportId, user) {
  const updatedReport = await dismissReportById(reportId, user);

  if (!updatedReport) {
    throw new Error("Report not found");
  }

  return updatedReport;
}

export async function searchAdminUsersRecord(query) {
  return await searchUsersForAdmin(query);
}

export async function disableUserRecord(userId, adminUser) {
  const user = await findUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (user._id.toString() === adminUser._id.toString()) {
    throw new Error("You cannot disable your own account");
  }

  const updatedUser = await updateUserById(userId, {
    isDisabled: true,
  });

  return {
    _id: updatedUser._id,
    username: updatedUser.username,
    email: updatedUser.email,
    isDisabled: Boolean(updatedUser.isDisabled),
  };
}

export async function getDisabledUsersRecord() {
  const users = await findDisabledUsers();

  return users.map((user) => ({
    _id: user._id,
    username: user.username,
    fullName: user.fullName || "",
    email: user.email,
    isDisabled: Boolean(user.isDisabled),
  }));
}

export async function enableUserRecord(userId) {
  const user = await findUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const updatedUser = await updateUserById(userId, {
    isDisabled: false,
  });

  return {
    _id: updatedUser._id,
    username: updatedUser.username,
    email: updatedUser.email,
    isDisabled: Boolean(updatedUser.isDisabled),
  };
}

export async function getRecentAdminPostsRecord(page, limit) {
  return await findRecentPostsPage(page, limit);
}