import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import SearchBar from "./SearchBar";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Avatar key for re-render
  const [avatarKey, setAvatarKey] = useState(Date.now());

  // Update key when user avatar changes
  useEffect(() => {
    if (user?.avatar) {
      setAvatarKey(Date.now());
    }
  }, [user?.avatar]);

  // Dark mode state
  const [dark, setDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      return savedTheme === "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Mobile menu state
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate("/login");
    setShowMobileMenu(false);
  };

  return (
    <nav className="sticky top-0 z-50 transition-colors duration-300">
      <div className=" bg-white shadow-slate-600/40 shadow-md px-6 backdrop-blur-md">
        <div className="flex justify-between items-center h-15">
          <div className="flex justify-between items-center h-15">
            {/* Logo */}
            <Link to="/" className="font-bold text-xl">
              <span className="text-stone-800">
                MCT's <span className="text-stone-800">Portfolio</span>
              </span>
            </Link>

            <div>
              <Link to="/">
                <span className="font-semibold text-sm text-stone-800 hover:text-white  hover:border-stone-800/75 hover:bg-stone-800 ml-6 px-2 py-2 rounded-sm duration-200">
                  Explore
                </span>
              </Link>

              {/* 🆕 Image Converter Link */}
              <Link to="/imageConverter">
                <span className="font-semibold text-sm text-stone-800 hover:text-white  hover:border-stone-800/75 hover:bg-stone-800 ml-3 px-2 py-2 rounded-sm duration-200">
                  Image Converter
                </span>
              </Link>

              {/* Profiles */}
              <Link to="/profiles">
                <span className="font-semibold text-sm text-stone-800 hover:text-white  hover:border-stone-800/75 hover:bg-stone-800 ml-3 px-2 py-2 rounded-sm duration-200">
                  Profiles
                </span>
              </Link>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:block flex-1 max-w-xl mx-8">
            <SearchBar />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {/* Notification Bell */}
                <NotificationBell />

                {/* Upload Button */}
                <Link to="/upload">
                  <span className="font-bold text-stone-800 hover:text-white border-1 hover:border-stone-800/75 hover:bg-stone-800 px-2 py-2 rounded-sm duration-200">
                    Upload
                  </span>
                </Link>

                {/* User Profile Dropdown */}
                <div className="relative group">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 hover:bg-stone-800 px-3 py-1 rounded-sm transition-all duration-200"
                  >
                    {user.avatar ? (
                      <img
                        key={avatarKey}
                        src={`${user.avatar}?t=${avatarKey}`}
                        alt={user.username}
                        className="w-9 h-9 rounded-sm object-cover border-2 border-white shadow-md"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-sm bg-gray-800 flex items-center justify-center text-white font-bold border-2 border-white shadow-md">
                        {user.username?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="font-bold text-stone-800 hover:text-white">
                      {user.username}
                    </span>
                  </Link>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-42 bg-stone-900 rounded-sm shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-slate-700">
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 hover:bg-stone-700/40 transition-colors"
                      >
                        <div className="text-stone-300 hover:text-stone-50">
                          My Profile
                        </div>
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 hover:bg-stone-700/40 transition-colors"
                      >
                        <div className="text-stone-300 hover:text-stone-50">
                          Settings
                        </div>
                      </Link>
                      {user.role === "admin" && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 hover:bg-stone-700/40 transition-colors font-semibold"
                        >
                          <div className="text-stone-400 hover:text-stone-50">
                            Admin Panel
                          </div>
                        </Link>
                      )}
                      <hr className="my-2 border-gray-200 dark:border-gray-700" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-stone-700/40 transition-colors !font-bold"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <span className="font-bold text-gray-800 hover:text-stone-100 hover:bg-stone-800 px-4 py-2 rounded-sm duration-200">
                    Login
                  </span>
                </Link>
                <Link
                  to="/register"
                  className="bg-stone-800 !text-stone-100 hover:!text-stone-800 px-4 py-2 rounded-sm hover:!bg-white transition-all duration-200 font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 text-white hover:text-gray-800 hover:bg-white/20 rounded-sm transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {showMobileMenu ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <SearchBar />
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className=" bg-stone-800 border-t border-stone-700">
          <div className="px-4 py-3 space-y-2">
            {user ? (
              <>
                {/* User Info */}
                <div className="flex items-center gap-3 px-4 py-2 bg-stone-900  rounded-sm">
                  {user.avatar ? (
                    <img
                      src={`${user.avatar}?t=${avatarKey}`}
                      alt={user.username}
                      className="w-10 h-10 rounded-sm object-cover border-2 border-stone-500 shadow-md"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-sm bg-stone-900 flex items-center justify-center text-white font-bold border-2 border-stone-500 shadow-md">
                      {user.username?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="font-bold text-stone-800 dark:text-white">
                    {user.username}
                  </span>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-2 text-slate-200 hover:bg-amber-200 dark:hover:bg-gray-700 rounded-sm transition-colors font-medium"
                >
                  My Profile
                </Link>

                {/* 🆕 Image Converter Link - Mobile */}
                <Link
                  to="/image-converter"
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-2 text-gray-800 dark:text-gray-300 hover:bg-amber-200 dark:hover:bg-gray-700 rounded-sm transition-colors font-medium"
                >
                  Image Converter
                </Link>

                <Link
                  to="/upload"
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-2 bg-white dark:bg-blue-600 text-gray-800 dark:text-white text-center rounded-sm font-bold hover:bg-gray-800 hover:text-white dark:hover:bg-blue-700 transition-colors"
                >
                  Upload Project
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-2 text-gray-800 dark:text-gray-300 hover:bg-amber-200 dark:hover:bg-gray-700 rounded-sm transition-colors font-medium"
                >
                  Settings
                </Link>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    onClick={() => setShowMobileMenu(false)}
                    className="block px-4 py-2 bg-amber-500 dark:bg-amber-600 text-white hover:bg-amber-600 dark:hover:bg-amber-700 rounded-sm font-bold transition-colors"
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-900 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-sm transition-colors font-bold"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* 🆕 Image Converter Link - Mobile (Non-logged users) */}
                <Link
                  to="/image-converter"
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-2 text-gray-800 dark:text-gray-300 hover:bg-amber-200 dark:hover:bg-gray-700 rounded-sm transition-colors font-medium"
                >
                  🖼️ Image Converter
                </Link>

                <Link
                  to="/login"
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-2 text-gray-800 dark:text-gray-300 hover:bg-amber-200 dark:hover:bg-gray-700 rounded-sm transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-2 bg-white dark:bg-blue-600 text-gray-800 dark:text-white text-center rounded-sm font-bold hover:bg-gray-800 hover:text-white dark:hover:bg-blue-700 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
