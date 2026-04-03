import { Routes, Route } from 'react-router-dom';
import HomePage from '../features/home/pages/HomePage';
import Navbar from "../components/ui/Navbar";
import Login from "../features/auth/pages/LoginPage";
import Footer from "../components/ui/Footer";
import SkillsPage from '../features/skills/pages/SkillsPage';
import CreatePostPage from "../features/posts/pages/CreatePostPage";
import PostPage from "../features/posts/pages/PostPage";
import AdminPage from "../features/admin/pages/AdminPage";
import { PATHS } from "./Routes"
import SignupPage from '../features/auth/pages/SignUpPage';

//note: for lab 7, temporarily added a create post button on home page, to be changed later

function App() {
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
        <Route path={PATHS.PROFILE} element={<div className="p-8">Profile page</div>} />
        <Route path={PATHS.ADMIN} element={<AdminPage />} />
      </Routes>
      <Footer />
    </div>

  );
}

export default App;
