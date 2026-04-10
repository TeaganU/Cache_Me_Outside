import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { PATHS } from "../../../app/Routes";
import { apiClient } from "../../../lib/ApiClient";
import { useAuth } from "../../../lib/AuthContext";

export default function AdminBannedUsersPage() {
  const { isLoggedIn, logout, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busyId, setBusyId] = useState("");

  useEffect(() => {
    async function fetchDisabledUsers() {
      setLoading(true);
      setError("");

      try {
        const data = await apiClient.get("/admin/disabled-users");
        setUsers(data);
      } catch (loadError) {
        if (loadError?.status === 401) {
          logout();
          return;
        }

        setError(loadError?.message || "Could not load disabled users.");
      } finally {
        setLoading(false);
      }
    }

    if (isLoggedIn && user?.role === "admin") {
      fetchDisabledUsers();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn, logout, user]);

  if (!isLoggedIn) {
    return <Navigate to={PATHS.LOGIN} replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to={PATHS.HOME} replace />;
  }

  async function enableUser(userId) {
    setBusyId(userId);
    setMessage("");

    try {
      const response = await apiClient.patch(`/admin/users/${userId}/enable`, {});
      setUsers((current) => current.filter((entry) => entry._id !== userId));
      setMessage(`User ${response.user.username} enabled.`);
    } catch (enableError) {
      setMessage(enableError?.data?.message || "Could not enable user.");
    } finally {
      setBusyId("");
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border border-gray-400 bg-white px-5 py-4">
          <h1 className="text-2xl font-semibold text-gray-900">Disabled Users</h1>

          <div className="flex gap-3">
            <Link to={PATHS.ADMIN} className="border border-gray-300 px-4 py-2 text-sm">
              Dashboard
            </Link>
            <Link
              to={PATHS.ADMIN_DISABLED_USERS}
              className="border border-gray-300 px-4 py-2 text-sm"
            >
              Disabled Users
            </Link>
          </div>
        </div>

        {message && <p className="mb-4 text-sm text-gray-700">{message}</p>}

        {loading && <p className="text-gray-600">Loading disabled users...</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && users.length === 0 && (
          <div className="border border-dashed border-gray-300 bg-white px-4 py-6 text-sm text-gray-600">
            No disabled users right now.
          </div>
        )}

        {!loading && !error && users.length > 0 && (
          <div className="space-y-4">
            {users.map((entry) => (
              <div key={entry._id} className="border border-gray-300 bg-white p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{entry.username}</p>
                    {entry.fullName && <p className="text-sm text-gray-600">{entry.fullName}</p>}
                    <p className="mt-1 text-sm text-gray-700">{entry.email}</p>
                    <p className="mt-3 text-sm text-gray-700">
                      <span className="font-semibold">Status:</span> Disabled
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => enableUser(entry._id)}
                    disabled={busyId === entry._id}
                    className="border border-gray-300 px-4 py-2 text-sm disabled:cursor-not-allowed hover:cursor-pointer"
                  >
                    {busyId === entry._id ? "Enabling..." : "Enable User"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}