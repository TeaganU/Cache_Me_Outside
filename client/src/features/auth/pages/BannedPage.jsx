import { Link } from "react-router-dom";
import { PATHS } from "../../../app/Routes";
import { useAuth } from "../../../lib/AuthContext";

export default function BannedPage() {
  const { banNotice } = useAuth();

  return (
    <section className="mx-auto min-h-[70vh] max-w-2xl px-6 py-12">
      <div className="border border-red-300 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-gray-900">Account Disabled</h1>

        {banNotice ? (
          <p className="mt-4 text-lg text-gray-700">
            {banNotice.message || "This account has been disabled by an administrator."}
          </p>
        ) : (
          <p className="mt-4 text-gray-700">
            There is no active disabled-account notice saved for this browser right now.
          </p>
        )}

        <div className="mt-6">
          <Link
            to={PATHS.LOGIN}
            className="inline-flex border border-gray-300 px-4 py-2 text-sm text-gray-800"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </section>
  );
}