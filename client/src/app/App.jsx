import { Routes, Route } from 'react-router-dom';
import Navbar from "../components/ui/Navbar";
import Login from "../features/auth/pages/LoginPage";
import Footer from "../components/ui/Footer";
import SkillsPage from '../features/skills/pages/SkillsPage';
import CreatePostPage from "../features/posts/pages/CreatePostPage";
import { PATHS } from "./Routes"

//note: for lab 7, temporarily added a create post button on home page, to be changed later

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path={PATHS.HOME} element={<div className="p-8">Home page</div>} />
        <Route path={PATHS.SKILLS} element={<SkillsPage />} />
        <Route path={PATHS.CREATEPOST} element={<CreatePostPage />} />
        <Route path={PATHS.LOGIN} element={<Login />} />
        <Route path={PATHS.SIGNUP} element={<div className="p-8">Signup page</div>} />
        <Route path={PATHS.PROFILE} element={<div className="p-8">Profile page</div>} />
      </Routes>
      <Footer />
    </div>

  );
}

export default App;
