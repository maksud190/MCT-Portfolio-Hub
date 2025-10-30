

import { useEffect, useState } from "react";
import { API } from "../api/api";
import { useAuth } from "../context/AuthContext";
import ProjectCard from "../components/ProjectCard";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"; // 🔥 Import

export default function Profile() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?._id) {
      fetchProjects();
    }
  }, [user]);

  // 🔥 Projects fetch করার function
  const fetchProjects = () => {
    API.get(`/projects/user/${user._id}`)
      .then((res) => {
        console.log("Fetched projects:", res.data);
        setProjects(res.data);
      })
      .catch((err) => console.error("Error fetching user projects:", err));
  };

  // 🔥 Delete confirmation এবং delete করা
  // 🔥 Delete with toast
  const handleDelete = async (projectId, projectTitle) => {
    const isConfirmed = window.confirm(
      `⚠️ Delete Project?\n\n"${projectTitle}"\n\nThis action cannot be undone. Are you sure?`
    );

    if (!isConfirmed) return;

    // 🔥 Loading toast
    const loadingToast = toast.loading("Deleting project...");

    try {
      await API.delete(`/projects/${projectId}`);
      
      // 🔥 Success toast
      toast.success("Project deleted successfully!", {
        id: loadingToast,
      });
      
      setProjects(projects.filter((p) => p._id !== projectId));
    } catch (err) {
      console.error("Error deleting project:", err);
      
      // 🔥 Error toast
      toast.error(
        err.response?.data?.message || "Failed to delete project",
        { id: loadingToast }
      );
    }
  };

  // 🔥 Edit page এ navigate করা
  const handleEdit = (projectId) => {
    navigate(`/edit/${projectId}`);
  };

  return (
    <div className="p-6">
      {/* User Info */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
          {user.username}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
        <p className="text-gray-500 dark:text-gray-500 mt-2">
          {user.bio || "No bio yet."}
        </p>
      </div>

      <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
        Your Projects ({projects.length})
      </h3>

      {projects.length > 0 ? (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
          {projects.map((p) => (
            <div key={p._id} className="break-inside-avoid mb-4">
              {/* 🔥 ProjectCard with edit/delete buttons */}
              <div className="relative group">
                <ProjectCard project={p} />
                
                {/* 🔥 Edit/Delete buttons - hover করলে দেখাবে */}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                  {/* Edit Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleEdit(p._id);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg shadow-lg transition-all"
                    title="Edit project"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleDelete(p._id, p.title);
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg shadow-lg transition-all"
                    title="Delete project"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center">
          You haven't uploaded any projects yet.
        </p>
      )}
    </div>
  );
}


