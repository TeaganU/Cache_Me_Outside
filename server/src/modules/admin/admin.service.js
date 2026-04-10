import {
  updateUserById,
  countNewUsersSince,
  countPendingReports,
  countPosts,
  countUsers,
  dismissReportById,
  findDisabledUsers,
  findReportsCreatedBetween,
  findTopPostsByViews,
  findUserById,
  findUsersCreatedBetween,
  findPostsCreatedBetween,
  findRecentPendingReports,
  findRecentPosts,
  findRecentPostsPage,
  searchUsersForAdmin,
} from "./admin.repository.js";

function getStartOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function endOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

function formatDayKey(date) {
  return new Date(date).toISOString().slice(0, 10);
}

function parseAnalyticsFilters(query = {}) {
  const range = String(query.range ?? "7");
  const now = new Date();
  let startDate = startOfDay(new Date(now));
  let endDate = endOfDay(new Date(now));

  const days = Number(range);

  if (![1, 7, 14, 30].includes(days)) {
    throw new Error("Invalid analytics range");
  }

  startDate = startOfDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - (days - 1)));

  if (startDate.getTime() > endDate.getTime()) {
    throw new Error("Start date must be before end date");
  }

  return {
    range,
    startDate,
    endDate,
  };
}

function buildEmptySeries(startDate, endDate) {
  const points = [];
  const cursor = startOfDay(new Date(startDate));
  const finalDay = startOfDay(new Date(endDate));

  while (cursor.getTime() <= finalDay.getTime()) {
    points.push({
      date: formatDayKey(cursor),
      label: cursor.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      signups: 0,
      posts: 0,
      comments: 0,
      reports: 0,
    });

    cursor.setDate(cursor.getDate() + 1);
  }

  return points;
}

function incrementPoint(pointsMap, dateValue, key) {
  const dayKey = formatDayKey(dateValue);
  const point = pointsMap.get(dayKey);

  if (point) {
    point[key] += 1;
  }
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

export async function getAdminAnalyticsRecord(query) {
  const { range, startDate, endDate } = parseAnalyticsFilters(query);

  const [users, posts, reports, topPosts] = await Promise.all([
    findUsersCreatedBetween(startDate, endDate),
    findPostsCreatedBetween(startDate, endDate),
    findReportsCreatedBetween(startDate, endDate),
    findTopPostsByViews(),
  ]);

  const chartData = buildEmptySeries(startDate, endDate);
  const pointsMap = new Map(chartData.map((entry) => [entry.date, entry]));
  const reportReasonMap = new Map();
  let totalComments = 0;

  for (const user of users) {
    incrementPoint(pointsMap, user.createdAt, "signups");
  }

  for (const post of posts) {
    incrementPoint(pointsMap, post.createdAt, "posts");

    for (const comment of post.comments ?? []) {
      if (!comment?.createdAt) {
        continue;
      }

      const commentDate = new Date(comment.createdAt);

      if (commentDate.getTime() < startDate.getTime() || commentDate.getTime() > endDate.getTime()) {
        continue;
      }

      totalComments += 1;
      incrementPoint(pointsMap, commentDate, "comments");
    }
  }

  for (const report of reports) {
    incrementPoint(pointsMap, report.createdAt, "reports");
    reportReasonMap.set(report.reason, (reportReasonMap.get(report.reason) ?? 0) + 1);
  }

  const reportReasons = [...reportReasonMap.entries()]
    .map(([reason, count]) => ({ reason, count }))
    .sort((left, right) => right.count - left.count)
    .slice(0, 5);

  return {
    filters: {
      range,
      start: formatDayKey(startDate),
      end: formatDayKey(endDate),
    },
    summary: {
      signups: users.length,
      posts: posts.length,
      comments: totalComments,
      reports: reports.length,
    },
    chartData,
    reportReasons,
    topPosts: topPosts.map((post) => ({
      _id: post._id,
      title: post.title,
      authorUsername: post.authorUsername,
      views: post.views ?? 0,
      likes: post.likes ?? 0,
    })),
  };
}
