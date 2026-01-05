// ForgotPass.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
export default function ForgotPass() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(""); 
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setLoading(true);

    try {
      const res = await fetch(
        console.log(import.meta.env.VITE_BASE_URL)
        `${import.meta.env.VITE_BASE_URL}/forgotpassword`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Email: email }),
        }
      );
      let data;
      data = await res.json();
      console.log(data);
      try {
      } catch {
        data = { message: "Invalid response from server" };
      }

      if (!res.ok) {
        setStatus(data.message || "Failed to send reset link");
      } else {
        setStatus("success");
        setEmail("");
      }
    } catch (err) {
      console.error(err);
      setStatus("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md border border-gray-200"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Forgot Password
        </h2>

        <p className="text-sm text-gray-600 mb-6 text-center">
          Enter your registered email and we’ll send you a password reset link.
        </p>

        {/* Email Input */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-3 py-2 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring"
          required
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition duration-200 shadow-md ${
            loading ? "cursor-not-allowed opacity-70" : ""
          }`}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {/* Status Messages */}
        {status === "success" && (
          <p className="text-green-600 text-sm mt-4 text-center">
            ✅ Reset link sent! Please check your email.
          </p>
        )}
        {status && status !== "success" && (
          <p className="text-red-500 text-sm mt-4 text-center">{status}</p>
        )}

        {/* Back to Login */}
        <div className="text-center mt-6">
          <a
            onClick={() => navigate("/")}
            className="text-sm text-blue-600 cursor-pointer hover:underline hover:text-blue-800"
          >
            Back to Login
          </a>
        </div>
      </form>
    </div>
  );
}
