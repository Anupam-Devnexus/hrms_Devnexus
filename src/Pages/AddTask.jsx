import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../Zustand/GetAllData";

const AddTask = () => {
  const authuser = JSON.parse(localStorage.getItem("authUser"));
  const userId = authuser?.user?._id || "";
  const name = authuser?.user?.FirstName || "User";
  const role = authuser?.user?.Role?.toUpperCase() || "EMPLOYEE";

  const { fetchAllData, allData } = useUserStore();
  const navigate = useNavigate();
  const [loading, setloading] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const Employee_Data = allData?.data?.EMPLOYEE || [];

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    assignee: userId,
    assigner: "",
  });

  // handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // handle employee selection
  const handleAssignTo = (e) => {
    const selectedId = e.target.value;
    const selectedEmp = Employee_Data.find((emp) => emp._id === selectedId);
    if (selectedEmp) {
      setFormData({
        ...formData,
        assigner: selectedEmp._id,
      });
    }
  };

  // submit form
  const handleSubmit = async (e) => {
    setloading(true);
    e.preventDefault();

    try {
      const res = await fetch(
        "https://hrms-backend-9qzj.onrender.com/api/task/add-task",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      console.log(data);

      if (!res.ok) throw new Error("Failed to add task");
      console.log("✅ Task added successfully");

      setloading(false);
      // reset
      setFormData({
        title: "",
        description: "",
        dueDate: "",
        priority: "medium",
        assignee: role === "EMPLOYEE" ? [{ id: userId, name }] : [],
        assigner: { id: userId, name },
      });

      navigate("/dashboard/tasks");
    } catch (err) {
      setloading(false);

      console.error("❌ Error adding task:", err);
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-2 px-2">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl p-10 border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-5 mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-2">
            ➕ Add New Task
            <span className="text-blue-600 text-lg font-medium">({role})</span>
          </h1>
          <button
            className="px-5 py-2 bg-gray-700 text-white rounded-xl hover:bg-gray-900 transition-all"
            onClick={() => navigate("/dashboard/tasks")}
          >
            ⬅ Back
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-7">
          {/* Task Title */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Task Title
            </label>
            <input
              type="text"
              name="title"
              disabled={loading && true}
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={loading && true}
              required
              rows="4"
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write task details..."
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Due Date
            </label>
            <input
              type="date"
              disabled={loading && true}
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Priority (Only for ADMIN/HR/MANAGER) */}
          {(role === "ADMIN" || role === "HR" || role === "TL") && (
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Priority
              </label>
              <select
                name="priority"
                disabled={loading && true}
                value={formData.priority}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          )}

          {/* Assign To (Dropdown) */}
          {(role === "ADMIN" || role === "HR" || role === "TL") && (
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Assign To
              </label>
              <select
                disabled={loading && true}
                onChange={handleAssignTo}
                // value={formData.assignee}
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Employee</option>
                {Employee_Data?.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.FirstName} {emp.LastName}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Auto-Assigned Info (Employee role) */}
          {role === "EMPLOYEE" && (
            <p className="text-sm text-gray-500">
              Task will be automatically assigned to{" "}
              <span className="font-semibold text-gray-700">{name}</span>.
            </p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-blue-700 active:scale-95 transition-all"
          >
            🚀 Add Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
