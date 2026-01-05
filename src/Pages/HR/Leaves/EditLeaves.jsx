import { useEffect, useState, memo } from "react";
import useAllLeaves from "../../../Zustand/GetAllLeaves";

const EditRow = memo(function EditRow({
  leave,
  onUpdate,
  onDelete,
  loading,
}) {
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    date: leave.date?.slice(0, 10),
    title: leave.title,
    description: leave.description || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSave = async () => {
    const success = await onUpdate(leave._id, form);
    if (success) setEditMode(false);
  };

  return (
    <li className="border rounded p-3 space-y-2">
      {editMode ? (
        <>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="border rounded px-2 py-1 w-full"
          />

          <input
            type="text"
            name="title"
            maxLength={50}
            value={form.title}
            onChange={handleChange}
            className="border rounded px-2 py-1 w-full"
          />

          <textarea
            name="description"
            rows={2}
            value={form.description}
            onChange={handleChange}
            className="border rounded px-2 py-1 w-full"
          />

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="bg-gray-200 px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="font-medium">{leave.title}</p>
          <p className="text-sm text-gray-600">
            {new Date(leave.date).toDateString()}
          </p>
          {leave.description && (
            <p className="text-sm">{leave.description}</p>
          )}

          <div className="flex gap-3 mt-2">
            <button
              onClick={() => setEditMode(true)}
              className="text-blue-600 text-sm"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(leave._id)}
              disabled={loading}
              className="text-red-600 text-sm"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </li>
  );
});

export default function EditLeaves() {
  const {
    leaves,
    loading,
    error,
    getLeaves,
    updateLeave,
    deleteLeave,
  } = useAllLeaves();

  useEffect(() => {
    getLeaves();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this leave?")) return;
    await deleteLeave(id);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4">
      <h2 className="text-lg font-semibold">Edit Leaves</h2>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {loading && <p>Loading...</p>}

      {!loading && leaves.length === 0 && (
        <p className="text-gray-500">No leaves available</p>
      )}

      <ul className="space-y-3">
        {leaves.map((leave) => (
          <EditRow
            key={leave._id}
            leave={leave}
            loading={loading}
            onUpdate={updateLeave}
            onDelete={handleDelete}
          />
        ))}
      </ul>
    </div>
  );
}
