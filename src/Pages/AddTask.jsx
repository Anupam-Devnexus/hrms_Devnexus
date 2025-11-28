import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../Zustand/GetAllData";
import {
  TextInput,
  TextArea,
  SelectInput,
  DateInput,
} from "../Component/Form/Inputs";

const AddTask = () => {
  const authuser = JSON.parse(localStorage.getItem("authUser"));
  const userId = authuser?.user?._id || "";
  const name = authuser?.user?.FirstName || "User";
  const role = authuser?.user?.Role?.toUpperCase() || "EMPLOYEE";

  const { fetchAllData, allData } = useUserStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const Employee_Data = allData?.data?.EMPLOYEE || [];

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    assignee: role === "EMPLOYEE" ? [userId] : [],
    assigner: userId,
  });

  const TITLE_MAX = 100;
  const DESC_MAX = 800;
  const DESC_MIN = 10;
  const TITLE_MIN = 3;

  const todayStr = new Date().toISOString().split("T")[0];

  // ---------- Validation ----------
  const validateForm = () => {
    const newErrors = {};

    const trimmedTitle = formData.title.trim();
    const trimmedDesc = formData.description.trim();

    if (!trimmedTitle) {
      newErrors.title = "Title is required.";
    } else if (trimmedTitle.length < TITLE_MIN) {
      newErrors.title = `Title must be at least ${TITLE_MIN} characters.`;
    } else if (trimmedTitle.length > TITLE_MAX) {
      newErrors.title = `Title must be under ${TITLE_MAX} characters.`;
    }

    if (!trimmedDesc) {
      newErrors.description = "Description is required.";
    } else if (trimmedDesc.length < DESC_MIN) {
      newErrors.description = `Description must be at least ${DESC_MIN} characters.`;
    } else if (trimmedDesc.length > DESC_MAX) {
      newErrors.description = `Description must be under ${DESC_MAX} characters.`;
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Due date is required.";
    } else if (formData.dueDate < todayStr) {
      newErrors.dueDate = "Due date cannot be in the past.";
    }

    if (
      role !== "EMPLOYEE" &&
      (!formData.assignee || formData.assignee.length === 0)
    ) {
      newErrors.assignee = "Please select an assignee.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------- Handlers ----------
  const handleChange = (e) => {
    const { name, value } = e.target;

    if ((name === "title" || name === "description") && value.startsWith(" ")) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAssignTo = (e) => {
    const selectedId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      assignee: selectedId ? [selectedId] : [],
    }));
    setErrors((prev) => ({ ...prev, assignee: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
      };

      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/task/add-task`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("API Response:", data);

      if (!res.ok) {
        throw new Error(data?.message || "Failed to add task");
      }

      setFormData({
        title: "",
        description: "",
        dueDate: "",
        priority: "medium",
        assignee: role === "EMPLOYEE" ? [userId] : [],
        assigner: userId,
      });
      setErrors({});
      navigate("/dashboard/tasks");
    } catch (err) {
      console.error("❌ Error adding task:", err);
      setErrors((prev) => ({
        ...prev,
        submit: err.message || "Something went wrong while adding the task.",
      }));
    } finally {
      setLoading(false);
    }
  };

  // ---------- Render ----------
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-6 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-6 sm:p-8 border border-gray-100">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 flex items-center gap-2">
              Add New Task
              <span className="text-blue-600 text-sm sm:text-base font-semibold">
                ({role})
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Fill in the details carefully. Required fields are marked with *
            </p>
          </div>
          <button
            type="button"
            className="px-4 py-2 bg-gray-800 text-white rounded-xl text-sm font-semibold hover:bg-black transition-all"
            onClick={() => navigate("/dashboard/tasks")}
          >
            ⬅ Back to Tasks
          </button>
        </div>

        {/* Global error */}
        {errors.submit && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {errors.submit}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title + Due date */}
          <div className="grid sm:grid-cols-2 gap-4">
            <TextInput
              label="Task Title"
              name="title"
              required
              disabled={loading}
              value={formData.title}
              onChange={handleChange}
              maxLength={TITLE_MAX}
              showCounter
              error={errors.title}
              placeholder="Enter a short, clear title"
            />

            <DateInput
              label="Due Date"
              name="dueDate"
              required
              disabled={loading}
              value={formData.dueDate}
              onChange={handleChange}
              min={todayStr}
              error={errors.dueDate}
            />
          </div>

          {/* Description */}
          <TextArea
            label="Description"
            name="description"
            required
            disabled={loading}
            value={formData.description}
            onChange={handleChange}
            maxLength={DESC_MAX}
            showCounter
            rows={4}
            error={errors.description}
            placeholder="Describe the task (what, why, how)..."
          />

          {/* Priority + Assign to (for non-EMPLOYEE) */}
          {(role === "ADMIN" || role === "HR" || role === "TL") && (
            <div className="grid sm:grid-cols-2 gap-4">
              <SelectInput
                label="Priority"
                name="priority"
                disabled={loading}
                value={formData.priority}
                onChange={handleChange}
                options={[
                  { value: "low", label: "Low" },
                  { value: "medium", label: "Medium" },
                  { value: "high", label: "High" },
                  { value: "urgent", label: "Urgent" },
                ]}
              />

              <SelectInput
                label="Assign To"
                required
                disabled={loading}
                name="assignee"
                value={formData.assignee[0] || ""}
                onChange={handleAssignTo}
                error={errors.assignee}
                options={[
                  { value: "", label: "Select Employee" },
                  ...Employee_Data.map((emp) => ({
                    value: emp._id,
                    label: `${emp.FirstName} ${emp.LastName}`,
                  })),
                ]}
              />
            </div>
          )}

          {/* Auto assign info for EMPLOYEE */}
          {role === "EMPLOYEE" && (
            <p className="text-xs sm:text-sm text-gray-500">
              This task will be automatically assigned to{" "}
              <span className="font-semibold text-gray-800">{name}</span>.
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-bold text-base sm:text-lg hover:bg-blue-700 active:scale-95 transition-all ${
              loading ? "opacity-80 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>Add Task</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
