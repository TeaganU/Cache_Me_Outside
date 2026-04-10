import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PATHS } from "../../../app/Routes";
import { apiClient } from "../../../lib/ApiClient";

const initialForm = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
};

const emailRegex = /^(.+)@([^.].*)\.([a-z]{2,})$/i;
const usernameRegex = /^[a-zA-Z0-9_]+$/;

export default function SignupPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState(initialForm);
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    function handleChange(event) {
        const { name, value } = event.target;
        setForm((current) => ({ ...current, [name]: value }));
        setErrors((current) => ({
            ...current,
            [name]: undefined,
        }));

        setGeneralError("");
    }

    function handleFileChange(event) {
        const file = event.target.files?.[0] ?? null;
        const imageError = validateImage(file);

        setErrors((current) => ({
            ...current,
            profileImage: imageError || undefined,
        }));

        if (imageError) {
            setProfileImageFile(null);
            setPreviewUrl("");
            return;
        }

        setProfileImageFile(file);

        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setPreviewUrl("");
        }
    }

    function validateImage(file) {
        const MAX_IMAGE_SIZE = 1 * 1024 * 1024;
        const ALLOWED_IMAGE_TYPES = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
        ];

        let error = ""

        if (file) {
            if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
                error = "Only JPG, PNG, WEBP, and GIF images are allowed";
            } else if (file.size > MAX_IMAGE_SIZE) {
                error = "Image must be 1 MB or smaller";
            }
        }

        return error
    }

    function validateForm() {
        const errors = {};
        const cleanUsername = form.username.trim();
        const cleanEmail = form.email.trim().toLowerCase();

        if (!cleanUsername) {
            errors.username = "Username is required";
        } else if (cleanUsername.length < 3 || cleanUsername.length > 16) {
            errors.username = "Username must be 3 to 16 characters";
        } else if (!usernameRegex.test(cleanUsername)) {
            errors.username = "Username can only contain letters, numbers, and underscores";
        }

        if (!cleanEmail) {
            errors.email = "Email is required";
        } else if (!emailRegex.test(cleanEmail)) {
            errors.email = "Enter a valid email";
        }

        const imgError = validateImage(profileImageFile);
        if (imgError) {
            errors.profileImage = imgError;
        }

        if (!form.password) errors.password = "Password is required";
        if (form.password && form.password.length < 8) {
            errors.password = "Password must be at least 8 characters";
        }
        if (form.confirmPassword !== form.password) {
            errors.confirmPassword = "Passwords do not match";
        }

        return errors;
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setGeneralError("");

        const validationErrors = validateForm();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) return;

        const formData = new FormData();
        formData.append("username", form.username);
        formData.append("email", form.email);
        formData.append("password", form.password);

        if (profileImageFile) {
            formData.append("profileImage", profileImageFile);
        }

        setIsSubmitting(true);

        try {
            await apiClient.post("/auth/signup", formData);
            navigate(PATHS.LOGIN);
        } catch (error) {
            const data = error?.data ?? {};
            setErrors(data);
            setGeneralError(data.general ?? "Could not create account");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section className="mx-auto max-w-md px-4 py-10">
            <div className="rounded-2xl bg-white p-8 shadow">
                <h1 className="mb-6 text-2xl font-bold">Create Account</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium">Username</label>
                        <input
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                        />
                        {errors.username && (
                            <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">Email</label>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">Profile Image</label>
                        <label
                            htmlFor="profileImage"
                            className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700"
                        >
                            <span className="truncate">
                                {profileImageFile ? profileImageFile.name : "Choose an image"}
                            </span>
                            <span className="ml-3 rounded bg-black px-3 py-1 text-white">
                                Browse
                            </span>
                        </label>
                        <input
                            id="profileImage"
                            name="profileImage"
                            type="file"
                            accept="image/png,image/jpeg,image/webp,image/gif"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        {errors.profileImage && (
                            <p className="mt-1 text-sm text-red-600">{errors.profileImage}</p>
                        )}
                    </div>

                    {previewUrl && (
                        <img
                            src={previewUrl}
                            alt="Profile preview"
                            className="h-20 w-20 rounded-full border object-cover"
                        />
                    )}

                    <div>
                        <label className="mb-1 block text-sm font-medium">Password</label>
                        <input
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                        )}
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">Confirm Password</label>
                        <input
                            name="confirmPassword"
                            type="password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2"
                        />
                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                        )}
                    </div>

                    {generalError && (
                        <p className="text-sm text-red-600">{generalError}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full rounded-lg bg-gray-900 py-2 text-white transition hover:bg-gray-800 hover:cursor-pointer"
                    >
                        {isSubmitting ? "Creating Account..." : "Sign Up"}
                    </button>
                </form>

                <p className="mt-4 text-sm">
                    Already have an account?{" "}
                    <Link to={PATHS.LOGIN} className="font-semibold hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </section>
    );
}
