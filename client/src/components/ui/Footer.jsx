import { PATHS } from "../../app/Routes";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-10">
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">
            Navigation
          </h3>
          <ul className="space-y-2">
            <li><Link className="hover:text-white transition" to={PATHS.HOME}>Home</Link></li>
            <li><Link className="hover:text-white transition" to={PATHS.SKILLS}>Skills</Link></li>
            <li><Link className="hover:text-white transition" to={PATHS.LOGIN}>Login</Link></li>
            <li><Link className="hover:text-white transition" to={PATHS.SIGNUP}>Sign Up</Link></li>
            <li><a href="#" className="hover:text-white transition">About Us</a></li>
            <li><a href="#" className="hover:text-white transition">FAQs</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">
            Contact
          </h3>
          <p>Email: info@example.com</p>
          <p>Phone: (250) 444-5555</p>
          <p>Location: Kelowna, BC</p>
        </div>
      </div>
    </footer>
  );
}
