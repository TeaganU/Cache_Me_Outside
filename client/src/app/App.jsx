import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import HomePage from '../features/home/pages/HomePage';
import Navbar from "../components/ui/Navbar";
import Login from "../features/auth/pages/LoginPage";
import Footer from "../components/ui/Footer";
import SkillsPage from '../features/skills/pages/SkillsPage';
import CreatePostPage from "../features/posts/pages/CreatePostPage";
import PostPage from "../features/posts/pages/PostPage";
import AdminPage from "../features/admin/pages/AdminPage";
import ProfilePage from "../features/profile/pages/ProfilePage";
import { PATHS } from "./Routes"
import SignupPage from "../features/auth/pages/SignupPage";
import { useAuth } from "../lib/AuthContext";
import AdminBannedUsersPage from "../features/admin/pages/AdminBannedUsersPage";
import BannedPage from "../features/auth/pages/BannedPage";

//note: for lab 7, temporarily added a create post button on home page, to be changed later

function AppLayout() {
  const location = useLocation();
  const { banNotice, isLoggedIn } = useAuth();

  if (banNotice && isLoggedIn && location.pathname !== PATHS.BANNED) {
    return <Navigate to={PATHS.BANNED} replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path={PATHS.HOME} element={<HomePage />} />
        <Route path={PATHS.SKILLS} element={<SkillsPage />} />
        <Route path={"/posts/:id"} element={<PostPage />} />
        <Route path={PATHS.CREATEPOST} element={<CreatePostPage />} />
        <Route path={PATHS.LOGIN} element={<Login />} />
        <Route path={PATHS.SIGNUP} element={<SignupPage />} />
        <Route path={PATHS.BANNED} element={<BannedPage />} />
        <Route path={PATHS.PROFILE} element={<ProfilePage />} />
        <Route path={PATHS.ADMIN} element={<AdminPage />} />
        <Route path={PATHS.ADMIN_DISABLED_USERS} element={<AdminBannedUsersPage />} />
      </Routes>
      <Footer />
    </div>

  );
}

function App() {
  return <AppLayout />;
}

export default App;
