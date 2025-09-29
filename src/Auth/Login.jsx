// Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "EMPLOYEE",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔹 Remember last email & role for faster login next time
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("lastLogin"));
    if (saved) setFormData((prev) => ({ ...prev, ...saved }));
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "lastLogin",
      JSON.stringify({ email: formData.email, role: formData.role })
    );
  }, [formData.email, formData.role]);

  // 🔹 Reusable fetch with retry
  async function loginWithRetry(body, retries = 1) {
    try {
      const res = await fetch(
        "https://hrms-backend-9qzj.onrender.com/api/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
        }
      );
      if (!res.ok) throw new Error("Server error");
      return res.json();
    } catch (err) {
      if (retries > 0) return loginWithRetry(body, retries - 1);
      throw err;
    }
  }

  // 🔹 Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const body = JSON.stringify({
      Email: formData.email,
      Password: formData.password,
      Role: formData.role,
    });

    try {
      // preload dashboard bundle while logging in
      const [data] = await Promise.all([
        loginWithRetry(body, 1),
        // import("/Dashboard"),
      ]);

      localStorage.setItem("authUser", JSON.stringify(data));
      toast.success("✅ Login successful!");
      setTimeout(() => navigate("/dashboard", { replace: true }), 1000);
    } catch (err) {
      console.error(err);
      toast.error("❌ Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Image */}
      <div className="hidden md:flex md:w-1/2 relative">
        <img
          src="https://images.pexels.com/photos/4391612/pexels-photo-4391612.jpeg"
          alt="Office workspace"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">
            Welcome Back!
          </h1>
        </div>
      </div>

      {/* Right Form */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-6">
        <form
          onSubmit={handleLogin}
          className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md border border-gray-200"
        >
          <div className="flex justify-center mb-4">
            <img
              src="https://res.cloudinary.com/dt4ohfuwc/image/upload/v1754378902/DevNexus_logo-2_gtgade.png"
              alt="Logo"
              className="h-20 w-20"
            />
          </div>

          {/* Role */}
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Role
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, role: e.target.value }))
            }
            className="w-full mb-4 px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="HR">HR</option>
            <option value="ADMIN">Admin</option>
            <option value="TL">Team Lead</option>
            <option value="EMPLOYEE">Employee</option>
          </select>

          {/* Email */}
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
            className="w-full mb-4 px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {/* Password */}
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative w-full mb-6">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, password: e.target.value }))
              }
              className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800 text-sm"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-200 shadow-md ${
              loading ? "cursor-not-allowed opacity-70" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Forgot Password */}
          <div
            className="text-center cursor-pointer mt-4"
            onClick={() => navigate("/forgot-password")}
          >
            <span className="text-sm text-blue-600 hover:underline hover:text-blue-800">
              Forgot Password?
            </span>
          </div>
        </form>
      </div>

      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </div>
  );
}
