import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../api/api";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        handleSearch();
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = async () => {
    setIsSearching(true);
    try {
      const res = await API.get(`/projects/search/projects?q=${searchQuery}`);
      setSearchResults(res.data);
      setShowResults(true);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleResultClick = (projectId) => {
    setShowResults(false);
    setSearchQuery("");
    navigate(`/project/${projectId}`);
  };

  return (
    <div className="relative w-full max-w-md">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-2 py-1 pl-10 pr-4 border-gray-300 dark:border-gray-700 rounded-sm border-b-2 hover:border-b-stone-900 text-stone-900 focus:outline-none focus:border-stone-900 transition-all duration-200"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-800"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {isSearching && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-amber-400"></div>
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {showResults && searchResults.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-slate-50 rounded-sm shadow-2xl max-h-96 overflow-y-auto border border-stone-700">
          {searchResults.map((project) => (
            <div
              key={project._id}
              onClick={() => handleResultClick(project._id)}
              className="flex items-center gap-3 px-3 py-1 hover:bg-slate-200 cursor-pointer transition-colors border-b border-stone-700 last:border-b-0"
            >
              <img
                src={project.thumbnail}
                alt={project.title}
                className="w-13 h-13 object-cover rounded-sm"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-stone-900 line-clamp-1 m-0 p-0">
                  {project.title}
                </h4>
                <p className="text-sm text-stone-700">
                  by {project.userId?.username}
                </p>
                <div className="flex items-center gap-3 text-xs text-stone-600 mt-1">
                  <span>👁️ {project.views || 0}</span>
                  <span>❤️ {project.likes || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Results */}
      {showResults && searchQuery.length >= 2 && searchResults.length === 0 && !isSearching && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 rounded-sm shadow-xl p-4 text-center border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400">No projects found</p>
        </div>
      )}

      {/* Click outside to close */}
      {showResults && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowResults(false)}
        ></div>
      )}
    </div>
  );
}