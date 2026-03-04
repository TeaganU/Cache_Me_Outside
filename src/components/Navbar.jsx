import Searchbar from "./Searchbar";

function Navbar() {
  return (
    <nav className="bg-white border-b px-8 py-4 flex justify-between items-center">
      <div className="font-bold text-lg flex gap-6">
        Outdoor Skill Sharing
        <Searchbar />
      </div>

      <div className="flex gap-6">
        <button>Home</button>
        <button>Skills</button>
        <button>Login</button>
        <button className="bg-black text-white px-4 py-1 rounded">
          Sign Up
        </button>
      </div>
    </nav>
  );
}

export default Navbar;