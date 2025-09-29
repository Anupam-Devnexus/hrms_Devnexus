import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaImage, FaTimes, FaCheckCircle, FaBookOpen } from "react-icons/fa";

const DailyUpdates = () => {
  const user = JSON.parse(localStorage.getItem("authUser")) || {};
  const token = user?.accessToken;
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Handle file selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreview(files.map((file) => URL.createObjectURL(file)));
  };

  // Show confirmation modal
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!title || !description) {
      alert("⚠️ Title and Description are required!");
      return;
    }
    setShowConfirm(true);
  };

  // API submit
  const confirmSubmit = async () => {
    setSubmitting(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    images.forEach((img) => formData.append("img", img));

    try {
      const res = await fetch(
        "https://hrms-backend-9qzj.onrender.com/api/daily-updates/",
        {
          headers: { Authorization: `Bearer ${token}` },
          method: "POST",
          body: formData,
        }
      );

      if (res.ok) {
        alert("✅ Update posted successfully!");
        setTitle("");
        setDescription("");
        setImages([]);
        setPreview([]);
        setShowConfirm(false);
      } else {
        alert("❌ Failed to post update.");
      }
    } catch (error) {
      console.error(error);
      alert("⚠️ Error posting update.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 ">
      {/* Header */}
      <div className="max-w-5xl mb-4 flex items-center justify-between mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-800 flex items-center gap-2">
          📌 Daily Updates
        </h2>
        <p className="text-gray-600 mt-1">
          Logged in as{" "}
          <span className="font-semibold text-blue-700">
            {user?.user?.FirstName || "User"}
          </span>{" "}
          ({user?.user?.Role || "Guest"})
        </p>
        {/* View All Button */}
      <div className="flex justify-center ">
        <button
          onClick={() => navigate("/dashboard/allupdates")}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-800 transition"
        >
          <FaBookOpen /> View All Updates
        </button>
      </div>
      </div>

      {/* Main Card */}
      <div className="p-4 max-w-5xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200">
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter update title..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 
                         shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows="5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write your update details..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 
                         shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
              required
            ></textarea>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Upload Images (optional)
            </label>
            <label className="flex flex-col items-center justify-center w-full h-32 px-4 py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-100 transition">
              <FaImage className="text-blue-600 text-3xl mb-2" />
              <span className="text-sm text-gray-500">
                Click or drag & drop images
              </span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Preview */}
          {preview.length > 0 && (
            <div className="flex gap-3 mt-3 flex-wrap">
              {preview.map((src, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={src}
                    alt="preview"
                    className="w-28 h-28 object-cover rounded-lg border shadow"
                  />
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600"
                    onClick={() => {
                      setPreview(preview.filter((_, i) => i !== idx));
                      setImages(images.filter((_, i) => i !== idx));
                    }}
                  >
                    <FaTimes size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50"
          >
            {submitting ? "Posting..." : "🚀 Post Update"}
          </button>
        </form>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FaCheckCircle className="text-green-500" /> Confirm Your Update
            </h3>
            <p className="mb-2">
              <strong>Title:</strong> {title}
            </p>
            <p className="mb-4">
              <strong>Description:</strong> {description}
            </p>
            {preview.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-4">
                {preview.map((src, idx) => (
                  <img
                    key={idx}
                    src={src}
                    alt="preview"
                    className="w-16 h-16 object-cover rounded-lg border"
                  />
                ))}
              </div>
            )}

            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                onClick={() => setShowConfirm(false)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                onClick={confirmSubmit}
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Confirm & Submit"}
              </button>
            </div>
          </div>
        </div>
      )}

      
    </div>
  );
};

export default DailyUpdates;
