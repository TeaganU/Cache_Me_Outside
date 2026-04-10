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

function getReportDestination(report) {
  if (!report?.targetPostId) {
    return null;
  }

  if (report.targetType === "comment" && report.targetCommentId) {
    return `${PATHS.POST(report.targetPostId)}?commentId=${report.targetCommentId}`;
  }

  return PATHS.POST(report.targetPostId);
}

function AdminTopBar() {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border border-gray-400 bg-white px-5 py-4">
      <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>

      <div className="flex gap-3">
        <Link to={PATHS.ADMIN} className="border border-gray-300 px-4 py-2 text-sm">
          Dashboard
        </Link>
        <Link
          to={PATHS.ADMIN_ANALYTICS}
          className="border border-gray-300 px-4 py-2 text-sm"
        >
          Analytics
        </Link>
        <Link
          to={PATHS.ADMIN_DISABLED_USERS}
          className="border border-gray-300 px-4 py-2 text-sm"
        >
          Disabled Users
        </Link>
      </div>
    </div>
  );
}

function DisableUserModal({ user, submitting, onClose, onSubmit }) {
  if (!user) {
    return null;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    await onSubmit();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
      <div className="w-full max-w-lg border border-gray-400 bg-white p-6 shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Disable User</h2>
            <p className="mt-1 text-sm text-gray-600">
              This will disable <span className="font-semibold">{user.username}</span>'s account until an admin enables it again.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-sm text-gray-500 hover:cursor-pointer"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <p className="text-sm text-gray-700">
            Disabled accounts cannot sign in until they are re-enabled from the admin panel.
          </p>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="border border-gray-300 px-4 py-2 text-sm hover:cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-black px-4 py-2 text-sm text-white disabled:cursor-not-allowed hover:cursor-pointer"
            >
              {submitting ? "Saving..." : "Disable User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ReportReviewModal({ report, onClose, onDismiss, onOpenDisable, dismissing }) {
  if (!report) {
    return null;
  }

  const destination = getReportDestination(report);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
      <div className="w-full max-w-2xl border border-gray-400 bg-white p-6 shadow-lg">
        <h2 className="text-center text-2xl font-semibold text-gray-900">Report Review</h2>

        <div className="mt-5 border border-gray-400 bg-gray-50 p-5 text-sm text-gray-700">
          <p><span className="font-semibold">Report Type:</span> {report.targetType}</p>
          <p className="mt-2"><span className="font-semibold">Report Reason:</span> {report.reason}</p>
          <p className="mt-2"><span className="font-semibold">Post Title:</span> {report.contentTitle || "No title"}</p>
          <p className="mt-2"><span className="font-semibold">Content Preview:</span> {report.contentPreview}</p>
          <p className="mt-2"><span className="font-semibold">Reported User:</span> {report.reportedUsername}</p>
          <p className="mt-2"><span className="font-semibold">User Who Reported:</span> {report.reporterUsername}</p>
          <p className="mt-2"><span className="font-semibold">Extra Details:</span> {report.details || "None provided"}</p>
        </div>

        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="border border-gray-300 px-4 py-2 text-sm hover:cursor-pointer"
          >
            Return
          </button>

          {destination && (
            <Link
              to={destination}
              onClick={onClose}
              className="border border-gray-300 px-4 py-2 text-sm"
            >
              {report.targetType === "comment" ? "View Comment" : "View Post"}
            </Link>
          )}

          {report.reportedUserId && (
            <button
              type="button"
              onClick={() => onOpenDisable({
                _id: report.reportedUserId,
                username: report.reportedUsername,
                email: "",
              })}
              className="border border-red-300 px-4 py-2 text-sm text-red-700 hover:cursor-pointer"
            >
              Disable User
            </button>
          )}

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
  const { isLoggedIn, logout, user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedReport, setSelectedReport] = useState(null);
  const [message, setMessage] = useState("");
  const [busyId, setBusyId] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [disableTarget, setDisableTarget] = useState(null);
  const [disableSubmitting, setDisableSubmitting] = useState(false);
  const [recentPosts, setRecentPosts] = useState([]);
  const [postsPagination, setPostsPagination] = useState({
    page: 1,
    limit: 6,
    totalItems: 0,
    totalPages: 1,
  });
  const [postsLoading, setPostsLoading] = useState(true);

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
        if (loadError?.status === 401) {
          logout();
          return;
        }

        setError(loadError?.message || "Could not load the admin dashboard.");
      } finally {
        setLoading(false);
      }
    }

    if (isLoggedIn && user?.role === "admin") {
      fetchDashboard();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn, logout, user]);

  useEffect(() => {
    async function fetchRecentPosts() {
      if (!isLoggedIn || user?.role !== "admin") {
        setPostsLoading(false);
        return;
      }

      setPostsLoading(true);

      try {
        const data = await apiClient.get(
          `/admin/posts/recent?page=${postsPagination.page}&limit=${postsPagination.limit}`
        );
        setRecentPosts(data.posts ?? []);
        setPostsPagination((current) => ({
          ...current,
          ...(data.pagination ?? {}),
        }));
      } catch (loadError) {
        setMessage(loadError?.message || "Could not load recent posts.");
      } finally {
        setPostsLoading(false);
      }
    }

    fetchRecentPosts();
  }, [isLoggedIn, postsPagination.limit, postsPagination.page, user]);

  if (!isLoggedIn) {
    return <Navigate to={PATHS.LOGIN} replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to={PATHS.HOME} replace />;
  }

  async function dismissReport(reportId) {
    setBusyId(reportId);
    setMessage("");

    try {
      await apiClient.patch(`/admin/reports/${reportId}/dismiss`, {});
      setDashboard((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          analytics: {
            ...current.analytics,
            pendingReports: Math.max((current.analytics?.pendingReports ?? 1) - 1, 0),
          },
          recentReports: (current.recentReports ?? []).filter((report) => report._id !== reportId),
        };
      });
      setSelectedReport(null);
      setMessage("Report dismissed.");
    } catch (dismissError) {
      setMessage(dismissError?.data?.message || "Could not dismiss report.");
    } finally {
      setBusyId("");
    }
  }

  async function deletePost(postId) {
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
        };
      });
      setRecentPosts((current) => current.filter((post) => post._id !== postId));
      setPostsPagination((current) => ({
        ...current,
        totalItems: Math.max((current.totalItems ?? 1) - 1, 0),
        totalPages: Math.max(Math.ceil(Math.max((current.totalItems ?? 1) - 1, 0) / current.limit), 1),
      }));
      setMessage("Post deleted.");
    } catch (deleteError) {
      setMessage(deleteError?.data?.message || "Could not delete post.");
    } finally {
      setBusyId("");
    }
  }

  async function handleSearchSubmit(event) {
    event.preventDefault();
    setSearchLoading(true);
    setSearchError("");
    setHasSearched(true);

    try {
      const query = encodeURIComponent(searchInput.trim());
      const data = await apiClient.get(`/admin/users/search?q=${query}`);
      setSearchResults(data);
    } catch (searchRequestError) {
      setSearchResults([]);
      setSearchError(searchRequestError?.message || "Could not search users.");
    } finally {
      setSearchLoading(false);
    }
  }

  async function handleDisableSubmit() {
    if (!disableTarget?._id) {
      return;
    }

    setDisableSubmitting(true);
    setMessage("");

    try {
      const response = await apiClient.post(`/admin/users/${disableTarget._id}/disable`, {});

      setSearchResults((current) =>
        current.map((result) =>
          result._id === disableTarget._id
            ? {
                ...result,
                ...response.user,
              }
            : result
        )
      );

      setDashboard((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          recentReports: (current.recentReports ?? []).filter(
            (report) => String(report.reportedUserId) !== String(disableTarget._id)
          ),
        };
      });

      if (selectedReport?.reportedUserId === disableTarget._id) {
        setSelectedReport(null);
      }

      setDisableTarget(null);
      setMessage(`User ${response.user.username} disabled successfully.`);
    } catch (disableError) {
      setMessage(disableError?.data?.message || "Could not disable user.");
    } finally {
      setDisableSubmitting(false);
    }
  }

  if (loading) {
    return <div className="mx-auto max-w-6xl px-6 py-8 text-gray-600">Loading admin dashboard...</div>;
  }

  if (error) {
    return <div className="mx-auto max-w-6xl px-6 py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <AdminTopBar />

        {message && <p className="mb-4 text-sm text-gray-700">{message}</p>}

        <section className="mb-5 border border-gray-400 bg-white p-4">
          <h2 className="border border-gray-400 bg-gray-100 px-3 py-2 text-center text-lg font-semibold text-gray-900">
            Admin User Search
          </h2>

          <form onSubmit={handleSearchSubmit} className="mt-4 flex flex-col gap-3 md:flex-row">
            <input
              type="text"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by username, email, or post text"
              className="flex-1 border border-gray-300 px-3 py-2"
            />
            <button
              type="submit"
              disabled={searchLoading}
              className="bg-black px-4 py-2 text-sm text-white disabled:cursor-not-allowed hover:cursor-pointer"
            >
              {searchLoading ? "Searching..." : "Search"}
            </button>
          </form>

          {searchError && <p className="mt-3 text-sm text-red-600">{searchError}</p>}

          {hasSearched && !searchLoading && searchResults.length === 0 && !searchError && (
            <p className="mt-4 text-sm text-gray-600">No users matched that search.</p>
          )}

          {searchResults.length > 0 && (
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {searchResults.map((result) => (
                <div key={result._id} className="border border-gray-300 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-900">{result.username}</p>
                      <p className="text-sm text-gray-700">{result.email}</p>
                    </div>

                    <span className="border border-gray-300 px-2 py-1 text-xs text-gray-700">
                      {result.isDisabled ? "Disabled" : "Active"}
                    </span>
                  </div>

                  {result.matchedPosts?.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-semibold text-gray-800">Matching Posts</p>
                      <div className="mt-2 space-y-2">
                        {result.matchedPosts.map((post) => (
                          <Link
                            key={post._id}
                            to={PATHS.POST(post._id)}
                            className="block border border-gray-200 px-3 py-2 text-sm text-gray-700"
                          >
                            {post.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.isDisabled && (
                    <p className="mt-3 text-sm text-red-700">
                      This account is currently disabled.
                    </p>
                  )}

                  {!result.isDisabled && (
                    <div className="mt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setDisableTarget(result)}
                        className="border border-red-300 px-4 py-2 text-sm text-red-700 hover:cursor-pointer"
                      >
                        Disable User
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <div className="grid gap-5 lg:grid-cols-[1.05fr_1fr]">
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
                <div
                  key={report._id}
                  className="w-full border border-gray-300 px-4 py-4 text-left hover:border-gray-500"
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
                        onClick={() => setSelectedReport(reportLookup.get(report._id) ?? report)}
                        className="border border-gray-300 px-3 py-1 text-sm hover:cursor-pointer"
                      >
                        Review
                      </button>

                      {getReportDestination(report) && (
                        <Link
                          to={getReportDestination(report)}
                          className="border border-gray-300 px-3 py-1 text-sm"
                        >
                          {report.targetType === "comment" ? "View Comment" : "View Post"}
                        </Link>
                      )}

                      <button
                        type="button"
                        onClick={() => dismissReport(report._id)}
                        disabled={busyId === report._id}
                        className="bg-black px-3 py-1 text-sm text-white disabled:cursor-not-allowed hover:cursor-pointer"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
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
                {recentPosts.map((post) => (
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

                {postsLoading && (
                  <p className="border border-dashed border-gray-300 px-4 py-6 text-sm text-gray-600">
                    Loading posts...
                  </p>
                )}

                {!postsLoading && recentPosts.length === 0 && (
                  <p className="border border-dashed border-gray-300 px-4 py-6 text-sm text-gray-600">
                    No posts to moderate yet.
                  </p>
                )}

                {!postsLoading && recentPosts.length > 0 && (
                  <div className="flex items-center justify-between border border-gray-300 px-4 py-3 text-sm text-gray-700">
                    <span>
                      Page {postsPagination.page} of {postsPagination.totalPages}
                    </span>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setPostsPagination((current) => ({
                            ...current,
                            page: Math.max(current.page - 1, 1),
                          }))
                        }
                        disabled={postsPagination.page <= 1}
                        className="border border-gray-300 px-3 py-1 disabled:cursor-not-allowed hover:cursor-pointer"
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setPostsPagination((current) => ({
                            ...current,
                            page: Math.min(current.page + 1, current.totalPages),
                          }))
                        }
                        disabled={postsPagination.page >= postsPagination.totalPages}
                        className="border border-gray-300 px-3 py-1 disabled:cursor-not-allowed hover:cursor-pointer"
                      >
                        Next
                      </button>
                    </div>
                  </div>
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
        onOpenDisable={setDisableTarget}
        dismissing={busyId === selectedReport?._id}
      />

      <DisableUserModal
        key={disableTarget?._id ?? "no-disable-target"}
        user={disableTarget}
        submitting={disableSubmitting}
        onClose={() => {
          if (!disableSubmitting) {
            setDisableTarget(null);
          }
        }}
        onSubmit={handleDisableSubmit}
      />
    </div>
  );
}
