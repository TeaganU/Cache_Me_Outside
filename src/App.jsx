import { Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Login from "./pages/Login";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<div className="p-8">Home page</div>} />
        <Route path="/skills" element={<div className="p-8">Skills</div>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<div className="p-8">Signup page</div>} />
      </Routes>
    </div>
  );
}

export default App;