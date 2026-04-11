import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { PATHS } from "../../../app/Routes";
import { apiClient } from "../../../lib/ApiClient";
import { useAuth } from "../../../lib/AuthContext";

const METRIC_OPTIONS = [
  { value: "signups", label: "Signups" },
  { value: "posts", label: "Posts" },
  { value: "comments", label: "Comments" },
  { value: "reports", label: "Reports" },
];

const RANGE_OPTIONS = [
  { value: "1", label: "Today" },
  { value: "7", label: "Last 7 days" },
  { value: "14", label: "Last 14 days" },
  { value: "30", label: "Last 30 days" },
];

function AdminTopBar() {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border border-gray-400 bg-white px-5 py-4">
      <h1 className="text-2xl font-semibold text-gray-900">Admin Analytics</h1>

      <div className="flex gap-3">
        <Link to={PATHS.ADMIN} className="border border-gray-300 px-4 py-2 text-sm">
          Dashboard
        </Link>
        <Link to={PATHS.ADMIN_ANALYTICS} className="border border-gray-300 px-4 py-2 text-sm">
          Analytics
        </Link>
        <Link to={PATHS.ADMIN_DISABLED_USERS} className="border border-gray-300 px-4 py-2 text-sm">
          Disabled Users
        </Link>
      </div>
    </div>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="border border-gray-300 bg-white p-4 text-center">
      <p className="text-sm font-medium text-gray-600">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
    </div>
  );
}

function SimpleLineChart({ data, metric }) {
  const width = 760;
  const height = 280;
  const padding = { top: 20, right: 44, bottom: 72, left: 42 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const values = data.map((entry) => entry[metric] ?? 0);
  const maxValue = Math.max(...values, 1);
  const stepX = data.length > 1 ? chartWidth / (data.length - 1) : chartWidth;

  const points = data.map((entry, index) => {
    const value = entry[metric] ?? 0;
    const x = padding.left + stepX * index;
    const y = padding.top + chartHeight - (value / maxValue) * chartHeight;

    return {
      ...entry,
      value,
      x,
      y,
    };
  });

  const linePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  const yAxisTicks = Array.from({ length: 5 }, (_, index) => {
    const value = Math.round((maxValue / 4) * (4 - index));
    const y = padding.top + (chartHeight / 4) * index;

    return { value, y };
  });

  return (
    <div className="border border-gray-300 bg-white p-4">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
        {yAxisTicks.map((tick) => (
          <g key={`${tick.value}-${tick.y}`}>
            <line
              x1={padding.left}
              y1={tick.y}
              x2={width - padding.right}
              y2={tick.y}
              stroke="#d1d5db"
              strokeWidth="1"
            />
            <text
              x={padding.left - 8}
              y={tick.y + 4}
              textAnchor="end"
              fontSize="11"
              fill="#6b7280"
            >
              {tick.value}
            </text>
          </g>
        ))}

        <line
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={height - padding.bottom}
          stroke="#374151"
          strokeWidth="1.5"
        />
        <line
          x1={padding.left}
          y1={height - padding.bottom}
          x2={width - padding.right}
          y2={height - padding.bottom}
          stroke="#374151"
          strokeWidth="1.5"
        />

        {points.length > 1 && (
          <path
            d={linePath}
            fill="none"
            stroke="#111827"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}

        {points.map((point, index) => (
          <g key={point.date}>
            <circle cx={point.x} cy={point.y} r="4" fill="#111827" />
            <text
              x={point.x}
              y={point.y - 10}
              textAnchor="middle"
              fontSize="11"
              fill="#4b5563"
            >
              {point.value}
            </text>
            <text
              x={point.x - 2}
              y={height - padding.bottom + 18}
              textAnchor="end"
              fontSize="11"
              fill="#6b7280"
              transform={`rotate(-45 ${point.x - 2} ${height - padding.bottom + 18})`}
            >
              {point.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const { isLoggedIn, logout, user } = useAuth();
  const [range, setRange] = useState("30");
  const [metric, setMetric] = useState("signups");
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAnalytics() {
      if (!isLoggedIn || user?.role !== "admin") {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const data = await apiClient.get(`/admin/analytics?range=${range}`);
        setAnalytics(data);
      } catch (loadError) {
        if (loadError?.status === 401) {
          logout();
          return;
        }

        setError(loadError?.message || "Could not load analytics.");
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [isLoggedIn, logout, range, user]);

  if (!isLoggedIn) {
    return <Navigate to={PATHS.LOGIN} replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to={PATHS.HOME} replace />;
  }

  const summary = analytics?.summary ?? {
    signups: 0,
    posts: 0,
    comments: 0,
    reports: 0,
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <AdminTopBar />

        <section className="border border-gray-400 bg-white p-4">
          <h2 className="border border-gray-400 bg-gray-100 px-3 py-2 text-center text-lg font-semibold text-gray-900">
            Usage Filters
          </h2>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="text-sm text-gray-700">
              <span className="mb-1 block font-medium">Metric</span>
              <select
                value={metric}
                onChange={(event) => setMetric(event.target.value)}
                className="w-full border border-gray-300 px-3 py-2"
              >
                {METRIC_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm text-gray-700">
              <span className="mb-1 block font-medium">Time Period</span>
              <select
                value={range}
                onChange={(event) => setRange(event.target.value)}
                className="w-full border border-gray-300 px-3 py-2"
              >
                {RANGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </section>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        {loading ? (
          <p className="mt-4 text-sm text-gray-600">Loading analytics...</p>
        ) : (
          <>
            <section className="mt-5">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <SummaryCard label="New Signups" value={summary.signups} />
                <SummaryCard label="Posts Created" value={summary.posts} />
                <SummaryCard label="Comments Added" value={summary.comments} />
                <SummaryCard label="Reports Filed" value={summary.reports} />
              </div>
            </section>

            <section className="mt-5 grid gap-5 lg:grid-cols-[1.35fr_1fr]">
              <div className="border border-gray-400 bg-white p-4">
                <h2 className="border border-gray-400 bg-gray-100 px-3 py-2 text-center text-lg font-semibold text-gray-900">
                  Activity Chart
                </h2>
                <p className="mt-4 text-sm text-gray-600">
                  Showing {METRIC_OPTIONS.find((option) => option.value === metric)?.label.toLowerCase()} from{" "}
                  {analytics?.filters?.start} to {analytics?.filters?.end}.
                </p>
                <div className="mt-4">
                  <SimpleLineChart data={analytics?.chartData ?? []} metric={metric} />
                </div>
              </div>

              <div className="space-y-5">
                <section className="border border-gray-400 bg-white p-4">
                  <h2 className="border border-gray-400 bg-gray-100 px-3 py-2 text-center text-lg font-semibold text-gray-900">
                    Report Reasons
                  </h2>

                  <div className="mt-4 space-y-3">
                    {(analytics?.reportReasons ?? []).length === 0 && (
                      <p className="text-sm text-gray-600">No reports in this time period.</p>
                    )}

                    {(analytics?.reportReasons ?? []).map((entry) => (
                      <div key={entry.reason} className="flex items-center justify-between border border-gray-300 px-3 py-2">
                        <span className="text-sm text-gray-700">{entry.reason}</span>
                        <span className="font-semibold text-gray-900">{entry.count}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="border border-gray-400 bg-white p-4">
                  <h2 className="border border-gray-400 bg-gray-100 px-3 py-2 text-center text-lg font-semibold text-gray-900">
                    Most Viewed Posts
                  </h2>

                  <div className="mt-4 space-y-3">
                    {(analytics?.topPosts ?? []).map((post) => (
                      <div key={post._id} className="border border-gray-300 px-3 py-3">
                        <Link to={PATHS.POST(post._id)} className="font-semibold text-gray-900 hover:underline">
                          {post.title}
                        </Link>
                        <p className="mt-1 text-sm text-gray-600">{post.authorUsername}</p>
                        <p className="mt-2 text-sm text-gray-700">
                          Views: <span className="font-semibold">{post.views}</span> | Likes: <span className="font-semibold">{post.likes}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
