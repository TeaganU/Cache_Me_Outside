import {
  disableUserRecord,
  dismissReportRecord,
  getAdminDashboardRecord,
  getDisabledUsersRecord,
  getRecentAdminPostsRecord,
  searchAdminUsersRecord,
  enableUserRecord,
} from "./admin.service.js";

export async function getAdminDashboard(req, res) {
  try {
    const dashboard = await getAdminDashboardRecord();
    res.json(dashboard);
  } catch {
    res.status(500).json({ message: "Could not load admin dashboard" });
  }
}

export async function dismissReport(req, res) {
  try {
    const report = await dismissReportRecord(req.params.reportId, req.user);

    res.json({
      message: "Report dismissed",
      report,
    });
  } catch (error) {
    const status = error.message === "Report not found" ? 404 : 400;
    res.status(status).json({ message: error.message });
  }
}

export async function searchUsers(req, res) {
  try {
    const users = await searchAdminUsersRecord(req.query.q);
    res.json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export async function disableUser(req, res) {
  try {
    const user = await disableUserRecord(req.params.userId, req.user);

    res.json({
      message: "User disabled",
      user,
    });
  } catch (error) {
    const status =
      error.message === "User not found" ? 404 :
      error.message === "You cannot disable your own account" ? 403 :
      400;

    res.status(status).json({ message: error.message });
  }
}

export async function getDisabledUsers(req, res) {
  try {
    const users = await getDisabledUsersRecord();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message || "Could not load disabled users" });
  }
}

export async function enableUser(req, res) {
  try {
    const user = await enableUserRecord(req.params.userId);

    res.json({
      message: "User enabled",
      user,
    });
  } catch (error) {
    const status = error.message === "User not found" ? 404 : 400;
    res.status(status).json({ message: error.message });
  }
}

export async function getRecentAdminPosts(req, res) {
  try {
    const posts = await getRecentAdminPostsRecord(req.query.page, req.query.limit);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message || "Could not load recent posts" });
  }
}