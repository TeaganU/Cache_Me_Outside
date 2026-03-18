export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-10">
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">
            Navigation
          </h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition">Home</a></li>
            <li><a href="#" className="hover:text-white transition">Skills</a></li>
            <li><a href="#" className="hover:text-white transition">Login</a></li>
            <li><a href="#" className="hover:text-white transition">Sign Up</a></li>
            <li><a href="#" className="hover:text-white transition">About Us</a></li>
            <li><a href="#" className="hover:text-white transition">Faqs</a></li>
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
