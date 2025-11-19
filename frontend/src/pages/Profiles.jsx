import { useState, useEffect } from "react";
import { API } from "../api/api";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function Profiles() {
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all"); // all, teacher, student

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const response = await API.get("/users/all");
      setAllUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load profiles");
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search and role
  useEffect(() => {
    let filtered = [...allUsers];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (user) =>
          user.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.designation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.department?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Role filter
    if (filterRole !== "all") {
      filtered = filtered.filter((user) => user.role === filterRole);
    }

    setFilteredUsers(filtered);
  }, [searchQuery, filterRole, allUsers]);

  // Separate teachers and students
  const teachers = filteredUsers.filter((user) => user.role === "teacher");
  const students = filteredUsers.filter((user) => user.role !== "teacher");

  const UserCard = ({ user }) => (
    <Link
      to={`/user/${user._id}`}
      className="bg-white dark:bg-stone-900 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
    >
      {/* Avatar */}
      <div className="relative h-48 bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.username}
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-stone-800 border-4 border-white shadow-lg flex items-center justify-center text-white text-4xl font-bold group-hover:scale-110 transition-transform duration-300">
            {user.username?.charAt(0).toUpperCase()}
          </div>
        )}

        {/* Role Badge */}
        {user.role === "teacher" && (
          <div className="absolute top-3 right-3 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
            👨‍🏫 Teacher
          </div>
        )}

        {/* Role Badge */}
        {user.role !== "teacher" && (
          <div className="absolute top-3 right-3 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
            🎓 Student
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5">
        {/* Name */}
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-amber-500 transition-colors">
          {user.username}
        </h3>

        {/* Designation */}
        {user.designation && (
          <p className="text-sm text-amber-600 dark:text-amber-400 font-semibold mb-2">
            {user.designation}
          </p>
        )}

        {/* Department */}
        {user.department && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            📚 {user.department}
          </p>
        )}

        {/* Student Info */}
        {user.role !== "teacher" && (
          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            {user.batch && (
              <span className="flex items-center gap-1">
                <span>🎓</span>
                Batch {user.batch}
              </span>
            )}
            {user.studentId && (
              <span className="flex items-center gap-1">
                <span>🆔</span>
                {user.studentId}
              </span>
            )}
          </div>
        )}

        {/* Bio Preview */}
        {user.bio && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 line-clamp-2">
            {user.bio}
          </p>
        )}

        {/* View Profile Link */}
        <div className="mt-4 text-amber-500 dark:text-amber-400 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
          View Profile
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-200/20 via-indigo-300/20 to-slate-50">
      {/* Hero Section */}
      <div className="py-16 px-6 text-center">
        <h1 className="text-5xl font-extrabold mb-4 text-stone-800">
          👥 MCT Community
        </h1>
        <p className="text-xl max-w-2xl mx-auto text-blue-800">
          Meet our talented teachers and creative students
        </p>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        <div className="bg-white dark:bg-stone-900 rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
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
                </div>
                <input
                  type="text"
                  placeholder="Search by name, designation, or department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                />
              </div>
            </div>

            {/* Role Filter */}
            <div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full md:w-48 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                <option value="teacher">👨‍🏫 Teachers</option>
                <option value="student">🎓 Students</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredUsers.length} of {allUsers.length} profiles
          </div>
        </div>

        {/* Teachers Section */}
        {teachers.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                👨‍🏫 Teachers & Instructors
              </h2>
              <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {teachers.length}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {teachers.map((teacher) => (
                <UserCard key={teacher._id} user={teacher} />
              ))}
            </div>
          </div>
        )}

        {/* Students Section */}
        {students.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                🎓 Students
              </h2>
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {students.length}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {students.map((student) => (
                <UserCard key={student._id} user={student} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No profiles found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}