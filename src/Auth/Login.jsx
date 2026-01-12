import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAttendance } from "../Zustand/PersonalAttendance";


export default function Login() {

  const { setUser } = useAttendance();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "EMPLOYEE",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("hrmsAuthToken");
    if (token) {
      navigate("/dashboard/", { replace: true });
    }
  }, []);

  function handleForgat() {
    navigate("forgot-password");
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Email: formData.email,
          Password: formData.password,
          Role: formData.role,
        }),
      });

      const data = await res.json();



      if (!res.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }
      setUser(data.user, data.accessToken);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Side - Background Image */}
      <div className="hidden md:flex md:w-1/2 relative">
        <img
          draggable={false}
          src="https://images.pexels.com/photos/4391612/pexels-photo-4391612.jpeg"
          // draggable={false}
          alt="Office workspace"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">
            Welcome Back!
          </h1>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full md:w-1/2 items-center justify-center p-6">
        <form
          onSubmit={handleLogin}
          className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md border border-gray-200"
        >
          <img
            draggable={false}
            src="https://res.cloudinary.com/dt4ohfuwc/image/upload/v1754378902/DevNexus_logo-2_gtgade.png"
            alt=""
            className="h-20 w-20"
          />

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}

          {/* Role Dropdown */}
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Role
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full mb-4 px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring"
          >
            <option value="HR">HR</option>
            <option value="ADMIN">Admin</option>
            <option value="TL">Team Lead</option>
            <option value="EMPLOYEE">Employee</option>
          </select>

          {/* Email Input */}
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="w-full mb-4 px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring"
            required
          />

          {/* Password Input */}
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative w-full mb-6">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring"
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
            className={`w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-200 shadow-md ${loading ? "cursor-not-allowed opacity-70" : ""
              }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Forgot Password */}
          <div
            className="text-center cursor-pointer mt-4"
            onClick={() => handleForgat()}
          >
            <span className="text-sm text-blue-600 hover:underline hover:text-blue-800">
              Forgot Password?
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
