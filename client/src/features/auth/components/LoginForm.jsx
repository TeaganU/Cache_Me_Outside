export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Login
        </h2>
        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">
              Email
            </label>
            <input type="email" placeholder="you@example.com" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"/>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Password
            </label>
            <input type="password" placeholder="••••••••" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-900"/>
          </div>
          <button type="submit" className="w-full bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition">
            Login
          </button>
        </form>
        <div className="mt-6 text-center text-sm">
          <p>
            Don't have an account?
            <a href="#" className="text-gray-900 font-semibold hover:underline">
              Sign Up
            </a>
          </p>
          <p className="mt-2">
            <a href="#" className="hover:underline">
              Forgot Password?
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
