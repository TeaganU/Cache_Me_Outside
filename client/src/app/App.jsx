import { Routes, Route, Link } from 'react-router-dom';
import Navbar from "../components/ui/Navbar";
import Login from "../features/auth/pages/LoginPage";
import Footer from "../components/ui/Footer";
import SkillsPage from '../features/skills/pages/SkillsPage';
import CreatePostPage from "../features/posts/pages/CreatePostPage";

//note: for lab 7, temporarily added a create post button on home page, to be changed later

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<div className="p-8">Home page</div>} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<div className="p-8">Signup page</div>} />
        <Route path="/profile" element={<div className="p-8">Profile page</div>} />
        <Route path="/create-post" element={<CreatePostPage />} />
      </Routes>
      <main className="flex-1">
        <Link to="/create-post" className="bg-black text-white px-4 py-2 rounded">
          Create Post
        </Link>
      </main>
      <Footer />
    </div>

  );
}

export default App;