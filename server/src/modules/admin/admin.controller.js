import { dismissReportRecord, getAdminDashboardRecord } from "./admin.service.js";

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