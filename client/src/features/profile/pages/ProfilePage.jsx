import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { PATHS } from "../../../app/Routes";
import { apiClient } from "../../../lib/ApiClient";
import { useAuth } from "../../../lib/AuthContext";
import { getImageUrl } from "../../../lib/getImageUrl";
import EditProfileModal from "../components/EditProfileModal";
import ProfilePosts from "../components/ProfilePosts";

function StatCard({ label, value }) {
  return (
    <div className="border border-gray-400 bg-white px-5 py-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
        {label}
      </p>
      <p className="mt-4 text-3xl font-semibold leading-none text-gray-900">{value}</p>
    </div>
  );
}

function ProfileField({ label, value }) {
  return (
    <div>
      <p className="text-sm font-medium text-gray-800">{label}</p>
      <div className="mt-1 border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-700">
        {value || "-"}
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { isLoggedIn, user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editError, setEditError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError("");

      try {
        const data = await apiClient.get("/profile/me");
        setProfile(data);
      } catch (loadError) {
        setError(loadError?.data?.message || "Could not load profile.");
      } finally {
        setLoading(false);
      }
    }

    if (isLoggedIn) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <Navigate to={PATHS.LOGIN} replace />;
  }

  async function handleSave(nextForm, profileImageFile) {
    setIsSaving(true);
    setEditError("");
    setMessage("");

    const formData = new FormData();
    formData.append("username", nextForm.username);
    formData.append("bio", nextForm.bio);
    formData.append("email", nextForm.email);

    if (profileImageFile) {
      formData.append("profileImage", profileImageFile);
    }

    try {
      const response = await apiClient.patch("/profile/me", formData);
      setProfile(response.profile);
      updateUser({
        id: response.profile.id,
        username: response.profile.username,
        email: response.profile.email,
        bio: response.profile.bio,
        profileImage: response.profile.profileImage,
        role: user?.role || "user",
      });
      setIsEditing(false);
      setMessage("Profile updated.");
    } catch (saveError) {
      setEditError(saveError?.data?.message || "Could not update profile.");
    } finally {
      setIsSaving(false);
    }
  }

  const initials = profile?.username?.slice(0, 2).toUpperCase() || "U";

  if (loading) {
    return <div className="mx-auto max-w-6xl px-6 py-8 text-gray-600">Loading profile...</div>;
  }

  if (error || !profile) {
    return <div className="mx-auto max-w-6xl px-6 py-8 text-red-600">{error || "Profile not found."}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <p className="text-sm text-gray-500">
          <Link to={PATHS.HOME} className="hover:underline">
            Home
          </Link>{" "}
          &gt; Profile
        </p>

        {message && <p className="mt-4 text-sm text-gray-700">{message}</p>}

        <section className="mt-4 border border-gray-400 bg-white p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex gap-4">
              {profile.profileImage ? (
                <img
                  src={getImageUrl(profile.profileImage)}
                  alt={`${profile.username} profile`}
                  className="h-20 w-20 border border-gray-500 object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center border border-gray-500 bg-gray-300 text-3xl font-semibold text-gray-900">
                  {initials}
                </div>
              )}

              <div>
                <h1 className="text-3xl font-semibold text-gray-900">
                  {profile.username}
                </h1>
                <p className="mt-1 max-w-2xl text-sm text-gray-600">
                  {profile.bio || "Add a short bio so people know a little more about you."}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="border border-gray-400 px-3 py-2 text-sm font-medium hover:cursor-pointer"
            >
              Edit Profile
            </button>
          </div>

          <div className="flex flex-col mt-6 gap-4">
            <ProfileField label="Username" value={profile.username} />
            <ProfileField label="Email" value={profile.email} />
            <ProfileField label="Role" value={user.role} />
          </div>
        </section>

        <section className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard label="Posts Created" value={profile.stats?.postsCreated ?? 0} />
          <StatCard label="Comments Given" value={profile.stats?.repliesGiven ?? 0} />
          <StatCard label="Likes Given" value={profile.stats?.likesGiven ?? 0} />
          <StatCard label="Views Received" value={profile.stats?.viewsReceived ?? 0} />
          <StatCard label="Comments Received" value={profile.stats?.commentsReceived ?? 0} />
          <StatCard label="Likes Received" value={profile.stats?.likesReceived ?? 0} />
        </section>

        <section className="flex flex-col mt-6 gap-4">
          <ProfilePosts />
        </section>
      </div>

      {isEditing && (
        <EditProfileModal
          key={[
            profile.id,
            profile.username,
            profile.email,
            profile.bio,
            profile.profileImage,
          ].join("|")}
          isOpen={isEditing}
          profile={profile}
          submitting={isSaving}
          error={editError}
          onClose={() => {
            if (!isSaving) {
              setIsEditing(false);
              setEditError("");
            }
          }}
          onSubmit={handleSave}
        />
      )}
    </div>
  );
}
