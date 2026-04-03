import { useEffect, useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { PATHS } from "../../../app/Routes";
import { apiClient } from "../../../lib/ApiClient";
import { RelativeTime } from "../../../lib/RelativeTime";
import { useAuth } from "../../../lib/AuthContext";

function StatCard({ label, value }) {
  return (
    <div className="border border-gray-400 bg-white px-4 py-5 text-center">
      <p className="text-sm font-semibold text-gray-700">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function ReportReviewModal({ report, onClose, onDismiss, dismissing }) {
  if (!report) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
      <div className="w-full max-w-2xl border border-gray-400 bg-white p-6 shadow-lg">
        <h2 className="text-center text-2xl font-semibold text-gray-900">Report Review</h2>

        <div className="mt-5 border border-gray-400 bg-gray-50 p-5 text-sm text-gray-700">
          <p><span className="font-semibold">Report Type:</span> {report.targetType}</p>
          <p className="mt-2"><span className="font-semibold">Report Reason:</span> {report.reason}</p>
          <p className="mt-2"><span className="font-semibold">Content Title:</span> {report.contentTitle || "No title"}</p>
          <p className="mt-2"><span className="font-semibold">Content Preview:</span> {report.contentPreview}</p>
          <p className="mt-2"><span className="font-semibold">Reported User:</span> {report.reportedUsername}</p>
          <p className="mt-2"><span className="font-semibold">User Who Reported:</span> {report.reporterUsername}</p>
          <p className="mt-2"><span className="font-semibold">Extra Details:</span> {report.details || "None provided"}</p>
        </div>

        <div className="mt-5 flex justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="border border-gray-300 px-4 py-2 text-sm hover:cursor-pointer"
          >
            Return
          </button>
          <button
            type="button"
            onClick={() => onDismiss(report._id)}
            disabled={dismissing}
            className="bg-black px-4 py-2 text-sm text-white disabled:cursor-not-allowed hover:cursor-pointer"
          >
            {dismissing ? "Dismissing..." : "Dismiss"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { isLoggedIn, user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [message, setMessage] = useState("");
  const [busyId, setBusyId] = useState("");

  const reportLookup = useMemo(() => {
    const entries = dashboard?.recentReports?.map((report) => [report._id, report]) ?? [];
    return new Map(entries);
  }, [dashboard]);

  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true);
      setError("");

      try {
        const data = await apiClient.get("/admin/dashboard");
        setDashboard(data);
      } catch (loadError) {
        setError(loadError?.data?.message || "Could not load the admin dashboard.");
      } finally {
        setLoading(false);
      }
    }

    if (isLoggedIn && user?.role === "admin") {
      fetchDashboard();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn, user]);

  if (!isLoggedIn) {
    return <Navigate to={PATHS.LOGIN} replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to={PATHS.HOME} replace />;
  }

  const dismissReport = async (reportId) => {
    setBusyId(reportId);
    setMessage("");

    try {
      await apiClient.patch(`/admin/reports/${reportId}/dismiss`, {});
      setDashboard((current) => {
        if (!current) {
          return current;
        }

        return {
          analytics: {
            ...current.analytics,
            pendingReports: Math.max((current.analytics?.pendingReports ?? 1) - 1, 0),
          },
          recentReports: (current.recentReports ?? []).filter((report) => report._id !== reportId),
          recentPosts: current.recentPosts ?? [],
        };
      });
      setSelectedReport(null);
      setMessage("Report dismissed.");
    } catch (dismissError) {
      setMessage(dismissError?.data?.message || "Could not dismiss report.");
    } finally {
      setBusyId("");
    }
  };

  const deletePost = async (postId) => {
    setBusyId(postId);
    setMessage("");

    try {
      await apiClient.delete(`/posts/${postId}`);
      setDashboard((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          analytics: {
            ...current.analytics,
            totalPosts: Math.max((current.analytics?.totalPosts ?? 1) - 1, 0),
          },
          recentPosts: (current.recentPosts ?? []).filter((post) => post._id !== postId),
        };
      });
      setMessage("Post deleted.");
    } catch (deleteError) {
      setMessage(deleteError?.data?.message || "Could not delete post.");
    } finally {
      setBusyId("");
    }
  };

  if (loading) {
    return <div className="mx-auto max-w-6xl px-6 py-8 text-gray-600">Loading admin dashboard...</div>;
  }

  if (error) {
    return <div className="mx-auto max-w-6xl px-6 py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="border border-gray-400 bg-white px-5 py-4">
          <h1 className="text-center text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
        </div>

        {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.05fr_1fr]">
          <section className="border border-gray-400 bg-white p-4">
            <h2 className="border border-gray-400 bg-gray-100 px-3 py-2 text-center text-lg font-semibold text-gray-900">
              Recent Reports
            </h2>

            <div className="mt-4 space-y-4">
              {(dashboard?.recentReports ?? []).length === 0 && (
                <p className="border border-dashed border-gray-300 px-4 py-6 text-sm text-gray-600">
                  No pending reports right now.
                </p>
              )}

              {(dashboard?.recentReports ?? []).map((report) => (
                <button
                  key={report._id}
                  type="button"
                  onClick={() => setSelectedReport(reportLookup.get(report._id) ?? report)}
                  className="block w-full border border-gray-300 px-4 py-4 text-left hover:cursor-pointer hover:border-gray-500"
                >
                  <p className="text-sm text-gray-800">
                    <span className="font-semibold">Report Reason:</span> {report.reason}
                  </p>
                  <p className="mt-1 text-sm text-gray-700">
                    <span className="font-semibold">Content:</span> {report.contentPreview}
                  </p>
                  <p className="mt-1 text-sm text-gray-700">
                    <span className="font-semibold">User Reported:</span> {report.reportedUsername}
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span className="text-xs text-gray-500">{RelativeTime(report.createdAt)}</span>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setSelectedReport(reportLookup.get(report._id) ?? report);
                        }}
                        className="border border-gray-300 px-3 py-1 text-sm hover:cursor-pointer"
                      >
                        Review
                      </button>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          dismissReport(report._id);
                        }}
                        disabled={busyId === report._id}
                        className="bg-black px-3 py-1 text-sm text-white disabled:cursor-not-allowed hover:cursor-pointer"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <div className="space-y-5">
            <section className="border border-gray-400 bg-white p-4">
              <h2 className="border border-gray-400 bg-gray-100 px-3 py-2 text-center text-lg font-semibold text-gray-900">
                Analytics
              </h2>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <StatCard label="Total Users" value={dashboard?.analytics?.totalUsers ?? 0} />
                <StatCard label="Total Posts" value={dashboard?.analytics?.totalPosts ?? 0} />
                <StatCard label="New Users Today" value={dashboard?.analytics?.newUsersToday ?? 0} />
                <StatCard label="Pending Reports" value={dashboard?.analytics?.pendingReports ?? 0} />
              </div>
            </section>

            <section className="border border-gray-400 bg-white p-4">
              <h2 className="border border-gray-400 bg-gray-100 px-3 py-2 text-center text-lg font-semibold text-gray-900">
                Post Moderation
              </h2>

              <div className="mt-4 space-y-3">
                {(dashboard?.recentPosts ?? []).map((post) => (
                  <div key={post._id} className="border border-gray-300 px-4 py-3">
                    <p className="text-xs text-gray-500">{post.category}</p>
                    <p className="mt-1 font-semibold text-gray-900">{post.title}</p>
                    <p className="mt-1 text-sm text-gray-700">{post.authorUsername}</p>
                    <div className="mt-3 flex flex-wrap justify-end gap-2">
                      <Link
                        to={PATHS.POST(post._id)}
                        className="border border-gray-300 px-3 py-1 text-sm"
                      >
                        View
                      </Link>
                      <button
                        type="button"
                        onClick={() => deletePost(post._id)}
                        disabled={busyId === post._id}
                        className="border border-red-300 px-3 py-1 text-sm text-red-600 disabled:cursor-not-allowed hover:cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}

                {(dashboard?.recentPosts ?? []).length === 0 && (
                  <p className="border border-dashed border-gray-300 px-4 py-6 text-sm text-gray-600">
                    No posts to moderate yet.
                  </p>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

      <ReportReviewModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
        onDismiss={dismissReport}
        dismissing={busyId === selectedReport?._id}
      />
    </div>
  );
}