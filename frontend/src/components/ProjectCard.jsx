
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { API } from "../api/api";
import { useAuth } from "../context/AuthContext"; // 🔥 Import করা

export default function ProjectCard({ project }) {
  const [likes, setLikes] = useState(project.likes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth(); // 🔥 Current user check করা

  // 🔥 Component mount হলে check করা user like দিয়েছে কিনা
  useEffect(() => {
    if (user) {
      checkLikeStatus();
    }
  }, [user, project._id]);

  // 🔥 Like status check করা
  const checkLikeStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get(`/projects/${project._id}/like-status`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      setIsLiked(res.data.isLiked);
      setLikes(res.data.likes);
    } catch (err) {
      console.error("Error checking like status:", err);
    }
  };

  // 🔥 Like/Unlike handle করা
  const handleLike = async (e) => {
    e.preventDefault(); // Link navigation prevent করা
    
    // 🔥 Login check
    if (!user) {
      alert("Please login to like projects");
      return;
    }

    if (loading) return; // Prevent multiple clicks

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await API.post(
        `/projects/${project._id}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setLikes(res.data.likes);
      setIsLiked(res.data.isLiked);
    } catch (err) {
      console.error("Error liking project:", err);
      if (err.response?.status === 401) {
        alert("Please login to like projects");
      } else {
        alert(err.response?.data?.message || "Failed to like project");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link to={`/project/${project._id}`} className="block group">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
        {/* Image Section */}
        <div className="relative overflow-hidden bg-gray-200 dark:bg-gray-700">
          {project.thumbnail && !imageError ? (
            <>
              <img
                src={project.thumbnail}
                alt={project.title}
                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
                onError={() => setImageError(true)}
              />
              
              {/* 🔥 Image count badge */}
              {project.images && project.images.length > 1 && (
                <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                  <span>📷</span>
                  <span>{project.images.length}</span>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-64 flex flex-col items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
              <p className="text-sm text-gray-500 dark:text-gray-400">No Image</p>
            </div>
          )}
          
          <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
        </div>

        {/* Content Section */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
            {project.title}
          </h3>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
            {project.description}
          </p>

          {/* 🔥 Footer with category and like button */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full">
              {project.category}
            </span>

            {/* 🔥 Like Button - improved styling */}
            <button
              onClick={handleLike}
              disabled={loading}
              className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-all ${
                isLiked
                  ? "bg-red-100 dark:bg-red-900/30 text-red-500"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500"
              } ${loading ? "opacity-50 cursor-not-allowed" : ""} ${!user ? "cursor-not-allowed opacity-70" : ""}`}
              title={!user ? "Login to like" : isLiked ? "Unlike" : "Like"}
            >
              <span className={`text-base transition-transform ${isLiked ? "scale-110" : ""}`}>
                {isLiked ? "❤️" : "🤍"}
              </span>
              <span>{likes}</span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}