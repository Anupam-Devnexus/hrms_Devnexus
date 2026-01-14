import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaImage, FaTimes, FaCheckCircle, FaBookOpen } from "react-icons/fa";
import { TextInput, TextArea } from "../Component/Form/Inputs";
import { useAttendance } from "../Zustand/PersonalAttendance";
import { useTaskStore } from "../Zustand/GetTask";

const DailyUpdates = () => {

  const { user } = useAttendance();

  const { fetchTaskList, tasks, loading, error } = useTaskStore()



  const imgRef = React.useRef(null);
  const token = localStorage.getItem("hrmsAuthToken");
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  // const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const [taskId, setTaskId] = useState("");
  const [progress, setProgress] = useState("");
  const [statusAfterUpdate, setStatusAfterUpdate] = useState("IN_PROGRESS");


  const TITLE_MAX = 120;
  const DESC_MAX = 800;
  const DESC_MIN = 10;
  const MAX_IMAGES = 6;
  const MAX_IMAGE_SIZE_MB = 5;

  useEffect(() => {
    fetchTaskList()
  }, [])

  const validateForm = () => {
    const newErrors = {};
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle) {
      newErrors.title = "Title is required.";
    } else if (trimmedTitle.length < 3) {
      newErrors.title = "Title must be at least 3 characters.";
    } else if (trimmedTitle.length > TITLE_MAX) {
      newErrors.title = `Title must be under ${TITLE_MAX} characters.`;
    }

    if (!trimmedDescription) {
      newErrors.description = "Description is required.";
    } else if (trimmedDescription.length < DESC_MIN) {
      newErrors.description = `Description must be at least ${DESC_MIN} characters.`;
    } else if (trimmedDescription.length > DESC_MAX) {
      newErrors.description = `Description must be under ${DESC_MAX} characters.`;
    }

    if (images.length > MAX_IMAGES) {
      newErrors.images = `You can upload maximum ${MAX_IMAGES} images.`;
    }

    if (!token) {
      newErrors.submit =
        "Authentication token is missing. Please log in again.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const valid = [];
    const previews = [];
    const imgErrors = [];

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        imgErrors.push(`${file.name}: invalid file type.`);
        return;
      }

      const sizeMb = file.size / (1024 * 1024);
      if (sizeMb > MAX_IMAGE_SIZE_MB) {
        imgErrors.push(`${file.name}: exceeds ${MAX_IMAGE_SIZE_MB} MB.`);
        return;
      }

      valid.push(file);
      previews.push(URL.createObjectURL(file));
    });

    const combined = [...images, ...valid];
    const combinedPrev = [...preview, ...previews];

    if (combined.length > MAX_IMAGES) {
      imgErrors.push(`Maximum allowed images is ${MAX_IMAGES}.`);
    }

    setImages(combined.slice(0, MAX_IMAGES));
    setPreview(combinedPrev.slice(0, MAX_IMAGES));

    setErrors((prev) => ({
      ...prev,
      images: imgErrors.length ? imgErrors.join(" ") : undefined,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!validateForm()) return;

    // setShowConfirm(true);
    confirmSubmit()
  };

  const confirmSubmit = async () => {
    setSubmitting(true);
    setErrors((prev) => ({ ...prev, submit: undefined }));
    setSuccessMessage("");

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    images.forEach((file) => formData.append("img", file));

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/daily-updates/`,
        {
          headers: { Authorization: `Bearer ${token}` },
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to post update.");
      }

      setTitle("");
      setDescription("");
      setImages([]);
      setPreview([]);

      setErrors({});
      setSuccessMessage("Update posted successfully.");
      imgRef.current.value = null; // reset file input
    } catch (error) {
      console.error(error);
      setErrors((prev) => ({
        ...prev,
        submit: error.message || "Error posting update.",
      }));
    } finally {
      setSubmitting(false);
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreview((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800">
              Daily updates
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Logged in as{" "}
              <span className="font-semibold text-blue-700">
                {user?.FirstName || "User"}
              </span>{" "}
              ({user?.Role || "Guest"})
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard/allupdates")}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-700 text-white rounded-lg shadow-lg hover:from-indigo-700 hover:to-purple-800 text-sm"
          >
            <FaBookOpen size={16} />
            <span>View all updates</span>
          </button>
        </div>

        {/* Errors */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg">
            {errors.submit}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm p-3 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* Form Card */}
        <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-xl border border-gray-200">
          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Title */}
            <TextInput
              label="Project Title"
              required
              maxLength={TITLE_MAX}
              showCounter
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={errors.title}
              disabled={submitting}
              placeholder="Enter update title"
            />

            {/* Description */}
            <TextArea
              label="Write your update"
              required
              maxLength={DESC_MAX}
              showCounter
              name="description"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              error={errors.description}
              disabled={submitting}
              placeholder="Write your update details"
            />

            {/* Task Selection */}
            <div className="flex gap-1 " >

              <div className="flex-1" >
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Task
                </label>
                <select
                  value={taskId}
                  onChange={(e) => setTaskId(e.target.value)}
                  disabled={submitting}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">{loading ? "loading..." : '-- Select Task --'}</option>
                  {!loading ? tasks?.map((task) => (
                    <option key={task._id} value={task._id}>
                      {task.title} ({task.progress}%)
                    </option>
                  )
                  )
                    :
                    <option value="">Loading tasks</option>
                  }
                </select>
                {errors.task && (
                  <p className="text-xs text-red-600 mt-1">{errors.task}</p>
                )}
              </div>
              {/* Progress */}
              <div className="flex-1" >
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Progress Added (%)
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(e.target.value)}
                  disabled={submitting}
                  className="w-full p-3 border rounded-lg"
                  placeholder="e.g. 10"
                />
                {errors.progress && (
                  <p className="text-xs text-red-600 mt-1">{errors.progress}</p>
                )}
              </div>
              {/* Status */}
              <div className="flex-1" >

                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status After Update
                </label>
                <select
                  value={statusAfterUpdate}
                  onChange={(e) => setStatusAfterUpdate(e.target.value)}
                  disabled={submitting}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="BLOCKED">Blocked</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>

            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload images (optional)
              </label>
              <label className="flex flex-col items-center justify-center w-full h-32 px-4 py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-100 transition">
                <FaImage className="text-blue-600 text-3xl mb-2" />
                <span className="text-sm text-gray-500">
                  Click to select images
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  Max {MAX_IMAGES} images, up to {MAX_IMAGE_SIZE_MB} MB each
                </span>
                <input
                  type="file"
                  ref={imgRef}
                  accept="image/*"
                  multiple
                  disabled={submitting}
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
              {errors.images && (
                <p className="mt-1 text-xs text-red-600">{errors.images}</p>
              )}
            </div>

            {/* Preview */}
            {preview.length > 0 && (
              <div className="flex gap-3 flex-wrap">
                {preview.map((src, idx) => (
                  <div key={idx} className="relative">
                    <img
                      draggable={false}
                      src={src}
                      className="w-28 h-28 object-cover rounded-lg border shadow"
                      alt="preview"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      disabled={submitting}
                    >
                      <FaTimes size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50"
            >
              {submitting ? "Posting..." : "Post update"}
            </button>
          </form>
        </div>

        {/* Confirmation */}
        {/* {showConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <FaCheckCircle className="text-green-500" />
                Confirm your update
              </h3>

              <p className="mb-2">
                <strong>Title:</strong> {title}
              </p>
              <p className="mb-4">
                <strong>Description:</strong> {description}
              </p>

              {preview.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {preview.map((src, idx) => (
                    <img
                      draggable={false}
                      key={idx}
                      src={src}
                      className="w-16 h-16 object-cover rounded-lg border"
                      alt="preview"
                    />
                  ))}
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  onClick={() => setShowConfirm(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSubmit}
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Confirm and submit"}
                </button>
              </div>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default DailyUpdates;
