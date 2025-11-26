import React, { useState } from "react";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const BASE_URL =
    import.meta.env.VITE_BASE_URL ||
    "https://hrms-backend-9qzj.onrender.com/api";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("⚠ Passwords do not match.");
      setSuccess("");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const email = new URLSearchParams(window.location.search).get("email");
      const token = new URLSearchParams(window.location.search).get("token");

      const response = await fetch(
        `${BASE_URL}/api/reset-password/update-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, token, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess("✅ Password updated successfully. You can now log in.");
        setPassword("");
        setConfirmPassword("");
      } else {
        setError(data.message || "Something went wrong. Try again.");
      }
    } catch (err) {
      setError("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#4e54c8] to-[#8f94fb] p-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md animate-fadeIn">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Reset Your Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              New Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition text-sm"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Confirm Password:
            </label>
            <input
              type="password"
              id="confirmPassword"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition text-sm"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white font-semibold rounded-lg transition-all ${
              loading
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-500 to-indigo-400 hover:shadow-lg hover:-translate-y-0.5"
            }`}
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-xs mt-4">
          Please make sure your new password is strong and unique.
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
