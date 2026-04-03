import {
  countNewUsersSince,
  countPendingReports,
  countPosts,
  countUsers,
  dismissReportById,
  findRecentPendingReports,
  findRecentPosts,
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