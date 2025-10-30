import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import toast from "react-hot-toast"; // 🔥 Import

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // 🔥 Initial dark mode check করা - localStorage এবং system preference থেকে
  const [dark, setDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // 🔥 Component mount হওয়ার সময় dark class apply করা
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  // 🔥 Toggle function - state এবং DOM উভয় update করা
  const toggleDark = () => {
    setDark(!dark); // সহজভাবে toggle করা
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 flex justify-between items-center p-4 bg-white shadow-md z-50 transition-colors duration-300">
      <Link 
        to="/" 
        className="font-bold text-xl px-4 py-2 rounded-lg  dark:bg-blue-200 text-black dark:text-white hover:bg-amber-200 dark:hover:bg-amber-700 transition-all duration-200"
      >
        MCT-Portfolio-Hub
      </Link>
      
      <div className="flex items-center gap-6">
        {/* 🔥 Dark mode toggle button with smooth animation */}
        <button
          onClick={toggleDark}
          className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 text-xl shadow-sm hover:shadow-md transform hover:scale-110"
          aria-label="Toggle dark mode"
          title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {dark ? "☀️" : "🌙"}
        </button>
        
        {user ? (
          <>
            <Link 
              to="/upload"
              className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
            >
              Upload
            </Link>
            <Link 
              to="/profile"
              className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
            >
              {user.username}
            </Link>
            <button 
              onClick={handleLogout} 
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200 font-medium"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link 
              to="/login"
              className="text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
            >
              Login
            </Link>
            <Link 
              to="/register"
              className="bg-blue-500 dark:bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}


