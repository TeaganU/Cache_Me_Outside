import { Link } from 'react-router-dom';
import Searchbar from "./Searchbar";

export default function Navbar() {
  return (
    <nav className="bg-white border-b  px-8 py-4 flex justify-between items-center">
      <div className="font-bold text-lg flex gap-6">
        Outdoor Skill Sharing
        <Searchbar />
      </div>

      <div className="flex gap-6">
        <Link to="/">Home</Link>
        <Link to="/skills">Skills</Link>
        <Link to="/login">Login</Link>
        <Link to="/signup" className="bg-black text-white px-4 py-1 rounded">
          Sign Up
        </Link>
      </div>
    </nav>
  );
}