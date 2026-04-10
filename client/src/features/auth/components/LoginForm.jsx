import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PATHS } from "../../../app/Routes";
import { apiClient } from "../../../lib/ApiClient";
import { useAuth } from "../../../lib/AuthContext";

export default function LoginForm() {
  const navigate = useNavigate();
  const { clearBanNotice, login, rememberBan } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrors({});
    setGeneralError("");
    setIsSubmitting(true);
    clearBanNotice();

    try {
      const response = await apiClient.post("/auth/login", form);
      login(response.token, response.user);
      navigate(PATHS.HOME);
    } catch (error) {
      const data = error?.data ?? {};
      if (error?.status === 403 && data?.code === "ACCOUNT_BANNED") {
        rememberBan(data.ban ?? null);
        navigate(PATHS.BANNED);
        return;
      }

      setErrors(data);
      setGeneralError(data.general ?? "Could not log in");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
      <h2 className="mb-6 text-center text-2xl font-bold">Login</h2>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="w-full rounded-lg border border-gray-300 px-3 py-2"
          />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
        </div>

        {generalError && <p className="text-sm text-red-600">{generalError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-gray-900 py-2 text-white transition hover:bg-gray-800 hover:cursor-pointer"
        >
          {isSubmitting ? "Logging In..." : "Login"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm">
        <p>
          Don&apos;t have an account?{" "}
          <Link to={PATHS.SIGNUP} className="font-semibold text-gray-900 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}