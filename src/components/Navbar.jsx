import { Link } from 'react-router-dom';
import Searchbar from "./Searchbar";
import { PATHS } from "../Routes";

export default function Navbar() {
  const isLoggedIn = false; // placeholder
  return (
    <nav className="bg-white border-b  px-8 py-4 flex justify-between items-center ">
      <div className="font-bold text-lg flex gap-6 items-center">
        Outdoor Skill Sharing
        <Searchbar />
      </div>

      <div className="flex gap-6 items-center">
        <Link to={PATHS.HOME}>Home</Link>
        <Link to={PATHS.SKILLS}>Skills</Link>
        
        {isLoggedIn ? (
          <Link
            to={PATHS.PROFILE}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black text-white"
          >
            JD
          </Link>
        ) : (
          <>
            <Link 
              to={PATHS.LOGIN}
            >
              Login
            </Link>

            <Link 
              to={PATHS.SIGNUP}
              className="bg-black text-white px-4 py-1 rounded"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
