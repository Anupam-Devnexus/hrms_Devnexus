import React, { useState, useRef } from "react";
import { TextInput, TextArea } from "../../Component/Form/Inputs";

const AddSales = () => {
  const [heading, setHeading] = useState("");
  const [subHeading, setSubHeading] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [budget, setBudget] = useState("");
  const [files, setFiles] = useState([]);

  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});

  const token = JSON.parse(localStorage.getItem("authUser"))?.accessToken;
  const fileInputRef = useRef(null);

  const HEADING_MAX = 120;
  const DESC_MAX = 1000;

  const MAX_FILES = 10;
  const MAX_FILE_SIZE_MB = 5;
  const ALLOWED_MIME = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const validateForm = () => {
    const newErrors = {};

    const trimmedHeading = heading.trim();
    const trimmedDescription = description.trim();
    const trimmedType = type.trim();
    const trimmedBudget = budget.toString().trim();

    if (!trimmedHeading) {
      newErrors.heading = "Heading is required.";
    } else if (trimmedHeading.length < 3) {
      newErrors.heading = "Heading must be at least 3 characters.";
    } else if (trimmedHeading.length > HEADING_MAX) {
      newErrors.heading = `Heading must be under ${HEADING_MAX} characters.`;
    }

    if (!trimmedDescription) {
      newErrors.description = "Description is required.";
    } else if (trimmedDescription.length < 10) {
      newErrors.description = "Description must be at least 10 characters.";
    } else if (trimmedDescription.length > DESC_MAX) {
      newErrors.description = `Description must be under ${DESC_MAX} characters.`;
    }

    if (!trimmedType) {
      newErrors.type = "Type is required.";
    }

    if (!trimmedBudget) {
      newErrors.budget = "Budget is required.";
    } else {
      const num = Number(trimmedBudget);
      if (Number.isNaN(num)) {
        newErrors.budget = "Budget must be a valid number.";
      } else if (num <= 0) {
        newErrors.budget = "Budget must be greater than zero.";
      }
    }

    if (files.length > MAX_FILES) {
      newErrors.files = `You can upload a maximum of ${MAX_FILES} files.`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFiles = (selectedFiles) => {
    const selected = Array.from(selectedFiles);
    const validFiles = [];
    const rejectedMessages = [];

    selected.forEach((file) => {
      if (!ALLOWED_MIME.includes(file.type)) {
        rejectedMessages.push(`${file.name}: unsupported file type.`);
        return;
      }
      const sizeMb = file.size / (1024 * 1024);
      if (sizeMb > MAX_FILE_SIZE_MB) {
        rejectedMessages.push(
          `${file.name}: larger than ${MAX_FILE_SIZE_MB} MB.`
        );
        return;
      }
      validFiles.push(file);
    });

    const combinedFiles = [...files, ...validFiles];

    if (combinedFiles.length > MAX_FILES) {
      const allowedCount = MAX_FILES - files.length;
      if (allowedCount <= 0) {
        rejectedMessages.push(
          `Maximum of ${MAX_FILES} files already selected.`
        );
      } else {
        rejectedMessages.push(
          `Only ${allowedCount} more file(s) can be added.`
        );
      }
    }

    setFiles(combinedFiles.slice(0, MAX_FILES));

    setErrors((prev) => ({
      ...prev,
      files:
        rejectedMessages.length > 0 ? rejectedMessages.join(" ") : undefined,
    }));
  };

  const handleFileChange = (e) => handleFiles(e.target.files);

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setShowConfirm(true);
  };

  const confirmSubmit = async () => {
    setSubmitting(true);
    setErrors((prev) => ({ ...prev, submit: undefined }));

    const formData = new FormData();
    formData.append("heading", heading.trim());
    formData.append("subHeading", subHeading.trim());
    formData.append("description", description.trim());
    formData.append("type", type.trim());
    formData.append("budget", budget.toString().trim());
    files.forEach((file) => formData.append("docs", file));

    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/sales/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.message || "Failed to add sales data");
      }

      setHeading("");
      setSubHeading("");
      setDescription("");
      setType("");
      setBudget("");
      setFiles([]);
      setShowConfirm(false);
      setErrors({});
    } catch (err) {
      console.error(err);
      setErrors((prev) => ({
        ...prev,
        submit: err.message || "An error occurred while submitting.",
      }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Add Sales Data
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Fill in the sales details carefully. Required fields are marked with
          an asterisk.
        </p>

        {errors.submit && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {errors.submit}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <TextInput
            label="Heading"
            name="heading"
            required
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            maxLength={HEADING_MAX}
            showCounter
            error={errors.heading}
            placeholder="Enter heading"
            disabled={submitting}
          />

          <TextInput
            label="Sub Heading"
            name="subHeading"
            value={subHeading}
            onChange={(e) => setSubHeading(e.target.value)}
            maxLength={160}
            showCounter
            placeholder="Enter sub heading (optional)"
            disabled={submitting}
          />

          <TextArea
            label="Description"
            name="description"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={DESC_MAX}
            showCounter
            rows={4}
            error={errors.description}
            placeholder="Describe the sales detail"
            disabled={submitting}
          />

          <TextInput
            label="Type"
            name="type"
            required
            value={type}
            onChange={(e) => setType(e.target.value)}
            maxLength={80}
            error={errors.type}
            placeholder="Enter type (for example: lead, opportunity, closed)"
            disabled={submitting}
          />

          <TextInput
            label="Budget"
            name="budget"
            required
            min="0"
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            error={errors.budget}
            placeholder="Enter budget amount"
            disabled={submitting}
          />

          <div>
            <label className="block font-medium text-gray-700 mb-1.5">
              Upload Files (images, PDFs, documents)
            </label>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center border-2 border-dashed border-indigo-400 p-6 rounded-lg cursor-pointer hover:bg-indigo-50 transition"
            >
              <p className="text-gray-500 text-center text-sm">
                Drag and drop files here or click to upload
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Maximum {MAX_FILES} files, up to {MAX_FILE_SIZE_MB} MB each.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept={ALLOWED_MIME.join(",")}
                onChange={handleFileChange}
                className="hidden"
                disabled={submitting}
              />
            </div>
            {errors.files && (
              <p className="mt-1 text-xs text-red-600">{errors.files}</p>
            )}
          </div>

          {files.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-4">
              {files.map((file, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-2 bg-indigo-50 text-indigo-800 rounded-lg px-2 py-2 text-xs w-24"
                >
                  {file.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  ) : (
                    <span className="truncate w-full text-center">
                      {file.name}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(idx)}
                    className="text-[11px] text-red-600 hover:underline"
                    disabled={submitting}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-60`}
          >
            {submitting ? "Submitting..." : "Review and Submit"}
          </button>
        </form>

        {showConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md w-full">
              <h3 className="text-lg font-bold mb-4">Confirm Sales Data</h3>
              <p className="mb-2">
                <strong>Heading:</strong> {heading}
              </p>
              {subHeading && (
                <p className="mb-2">
                  <strong>Sub Heading:</strong> {subHeading}
                </p>
              )}
              <p className="mb-2">
                <strong>Description:</strong> {description}
              </p>
              <p className="mb-2">
                <strong>Type:</strong> {type}
              </p>
              <p className="mb-2">
                <strong>Budget:</strong> {budget}
              </p>
              {files.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {files.map((f, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-indigo-50 text-indigo-800 rounded text-xs"
                    >
                      {f.name}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setShowConfirm(false)}
                  disabled={submitting}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSubmit}
                  disabled={submitting}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                >
                  {submitting ? "Submitting..." : "Confirm and Submit"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddSales;
