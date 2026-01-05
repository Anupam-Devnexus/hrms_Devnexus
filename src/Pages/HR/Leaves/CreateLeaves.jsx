import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useAllLeaves from "../../../Zustand/GetAllLeaves";

export default function CreateLeaves() {
  const { leaves, loading, error, getLeaves, createLeave, clearError } = useAllLeaves();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ date: "", title: "", description: "" });

  // ---------------- Fetch leaves on mount ----------------
  useEffect(() => {
    getLeaves();
  }, [getLeaves]);

  // ---------------- Memoize normalized leaves ----------------
  const safeLeaves = useMemo(() => {
    if (!Array.isArray(leaves)) return [];
    return leaves.filter((l) => l?._id && l.title && l.date);
  }, [leaves]);

  // ---------------- Handlers ----------------
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();

    const payload = {
      date: formData.date,
      title: formData.title.trim(),
      description: formData.description.trim(),
    };

    if (!payload.date || !payload.title) return;

    const success = await createLeave(payload);
    if (success) setFormData({ date: "", title: "", description: "" });
  };

  // ---------------- UI ----------------
  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Create Leave Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-5 space-y-4">
        <h2 className="text-lg font-semibold">Create Leave (HR)</h2>
        {error && <p className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="date"
            name="date"
            value={formData.date}
            min={new Date().toISOString().split("T")[0]}
            onChange={handleChange}
            required
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            name="title"
            value={formData.title}
            maxLength={50}
            placeholder="Public Holiday"
            onChange={handleChange}
            required
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <textarea
          name="description"
          value={formData.description}
          maxLength={300}
          rows={3}
          placeholder="Optional description"
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Create Leave"}
        </button>
      </form>

      {/* Leaves List */}
      <div className="bg-white shadow-md rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">All Leaves</h2>
          <button
            onClick={() => navigate("/dashboard/edit-leaves")}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            Edit Leaves
          </button>
        </div>

        {loading && <p className="text-sm">Loading...</p>}
        {!loading && safeLeaves.length === 0 && <p className="text-gray-500 text-sm">No leaves created</p>}

        <ul className="space-y-3">
          {safeLeaves.map((item) => (
            <li key={item._id} className="border rounded p-3 hover:bg-gray-50 transition">
              <p className="font-medium">{item.title}</p>
              <p className="text-sm text-gray-600">{new Date(item.date).toDateString()}</p>
              {item.description && <p className="text-sm mt-1">{item.description}</p>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
