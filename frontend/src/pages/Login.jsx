// import { useState } from "react";
// import { API } from "../api/api";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function Login() {
//   const [form, setForm] = useState({ email: "", password: "" });
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const res = await API.post("/users/login", form);
//     login(res.data);
//     navigate("/");
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-screen">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md w-80"
//       >
//         <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
//         <input
//           type="email"
//           placeholder="Email"
//           className="w-full p-2 mb-2 border rounded"
//           onChange={(e) => setForm({ ...form, email: e.target.value })}
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           className="w-full p-2 mb-2 border rounded"
//           onChange={(e) => setForm({ ...form, password: e.target.value })}
//         />
//         <button className="bg-blue-500 text-white px-4 py-2 rounded w-full">
//           Login
//         </button>
//       </form>
//     </div>
//   );
// }



import { useState, useEffect } from "react";
import { API } from "../api/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, user } = useAuth(); // user state টাও নিয়ে নেওয়া
  const navigate = useNavigate();

  // 🔥 যদি user already login থাকে, তাহলে profile page এ redirect করা
  useEffect(() => {
    if (user) {
      navigate("/profile"); // অথবা navigate("/") home page এ নিতে চাইলে
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // আগের error clear করা
    setLoading(true); // Loading শুরু

    try {
      const res = await API.post("/users/login", form);
      login(res.data); // AuthContext এ user data save করা
      navigate("/profile"); // Login successful হলে profile page এ redirect
    } catch (err) {
      // Error handling - API call fail হলে
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false); // Loading শেষ
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-80"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
        
        {/* Error message দেখানোর জন্য */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          disabled={loading}
        />
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}