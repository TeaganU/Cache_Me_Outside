import { useState } from "react";

export default function EditProfileModal({
  isOpen,
  profile,
  submitting,
  error,
  onClose,
  onSubmit,
}) {
  const [form, setForm] = useState(() => ({
    fullName: profile?.fullName || "",
    username: profile?.username || "",
    bio: profile?.bio || "",
    gender: profile?.gender || "",
    country: profile?.country || "",
    email: profile?.email || "",
    phoneNumber: profile?.phoneNumber || "",
  }));
  const [profileImageFile, setProfileImageFile] = useState(null);

  if (!isOpen || !profile) {
    return null;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(form, profileImageFile);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
      <div className="w-full max-w-2xl border border-gray-300 bg-white p-5 shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
            <p className="mt-1 text-sm text-gray-600">
              Update the information shown on your profile page.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="text-sm text-gray-500 hover:text-gray-800 hover:cursor-pointer"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm text-gray-700">
              <span className="mb-1 block font-medium">Full Name</span>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2"
              />
            </label>

            <label className="block text-sm text-gray-700">
              <span className="mb-1 block font-medium">Username</span>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2"
              />
            </label>

            <label className="block text-sm text-gray-700">
              <span className="mb-1 block font-medium">Gender</span>
              <input
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2"
              />
            </label>

            <label className="block text-sm text-gray-700">
              <span className="mb-1 block font-medium">Country</span>
              <input
                name="country"
                value={form.country}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2"
              />
            </label>

            <label className="block text-sm text-gray-700">
              <span className="mb-1 block font-medium">Email</span>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2"
              />
            </label>

            <label className="block text-sm text-gray-700">
              <span className="mb-1 block font-medium">Phone Number</span>
              <input
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2"
              />
            </label>
          </div>

          <label className="block text-sm text-gray-700">
            <span className="mb-1 block font-medium">Bio</span>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={4}
              className="w-full resize-none border border-gray-300 px-3 py-2"
            />
          </label>

          <label className="block text-sm text-gray-700">
            <span className="mb-1 block font-medium">Profile Image</span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={(event) => setProfileImageFile(event.target.files?.[0] ?? null)}
              className="w-full border border-gray-300 px-3 py-2"
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="border border-gray-300 px-3 py-2 text-sm hover:cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-black px-3 py-2 text-sm text-white disabled:cursor-not-allowed hover:cursor-pointer"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
