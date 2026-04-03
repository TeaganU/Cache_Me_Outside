import { Link } from "react-router-dom";
import Searchbar from "../../features/search/components/SearchBar.jsx";
import { PATHS } from "../../app/Routes";
import { useAuth } from "../../lib/AuthContext";
import { getImageUrl } from "../../lib/getImageUrl";

export default function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();

  const initials = user?.username?.slice(0, 2).toUpperCase() ?? "U";

  return (
    <nav className="flex items-center justify-between border-b bg-white px-8 py-4">
      <div className="flex items-center gap-6 text-lg font-bold">
        Outdoor Skill Sharing
        <Searchbar />
      </div>

      <div className="flex items-center gap-6">
        <Link to={PATHS.HOME}>Home</Link>
        <Link to={PATHS.SKILLS}>Skills</Link>
        {user?.role === "admin" && <Link to={PATHS.ADMIN}>Admin</Link>}

        {isLoggedIn ? (
          <>
            <Link to={PATHS.PROFILE}>
              {user?.profileImage ? (
                <img
                  src={getImageUrl(user.profileImage)}
                  alt={`${user.username} profile`}
                  className="h-10 w-10 rounded-full border object-cover"
                />
              ) : (
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">
                  {initials}
                </div>
              )}
            </Link>

            <button
              type="button"
              onClick={logout}
              className="rounded bg-black px-4 py-1 text-white hover:cursor-pointer"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to={PATHS.LOGIN}>Login</Link>
            <Link to={PATHS.SIGNUP} className="rounded bg-black px-4 py-1 text-white">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}