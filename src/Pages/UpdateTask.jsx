import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUserStore } from "../Zustand/GetAllData";
import {
    TextInput,
    TextArea,
    SelectInput,
    DateInput,
} from "../Component/Form/Inputs";
import { useAttendance } from "../Zustand/PersonalAttendance";

const TITLE_MAX = 100;
const TITLE_MIN = 3;
const DESC_MAX = 800;
const DESC_MIN = 10;

const UpdateTask = () => {
    const { id } = useParams(); // taskId
    const navigate = useNavigate();
    const { user } = useAttendance();
    const { fetchAllData, allData } = useUserStore();

    const role = user?.Role?.toUpperCase();
    const userId = user?._id;

    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        dueDate: "",
        priority: "medium",
        assignee: [],
        assigner: userId,
    });

    const Employee_Data = allData?.data?.EMPLOYEE || [];
    const todayStr = new Date().toISOString().split("T")[0];

    /* ---------------- Fetch initial data ---------------- */
    useEffect(() => {
        fetchAllData();

        const fetchTask = async () => {
            try {
                const res = await fetch(
                    `${import.meta.env.VITE_BASE_URL}/task/get-task/${id}`
                );
                const { data } = await res.json();

                console.log(data.assignee[0]._id)

                if (!res.ok) throw new Error(data?.message);

                setFormData({
                    title: data.title || "",
                    description: data.description || "",
                    dueDate: data.dueDate?.split("T")[0] || "",
                    priority: data.priority || "medium",
                    assignee: [data.assignee[0]._id] || [],
                    assigner: data.assigner || userId,
                });
            } catch (err) {
                console.error(err);
                navigate("/dashboard/tasks");
            } finally {
                setPageLoading(false);
            }
        };

        fetchTask();
    }, [id, fetchAllData, navigate, userId]);

    /* ---------------- Validation ---------------- */
    const validateForm = () => {
        const newErrors = {};
        const t = formData.title.trim();
        const d = formData.description.trim();

        if (!t) newErrors.title = "Title is required.";
        else if (t.length < TITLE_MIN) newErrors.title = "Title too short.";
        else if (t.length > TITLE_MAX) newErrors.title = "Title too long.";

        if (!d) newErrors.description = "Description is required.";
        else if (d.length < DESC_MIN) newErrors.description = "Too short.";
        else if (d.length > DESC_MAX) newErrors.description = "Too long.";

        if (!formData.dueDate) newErrors.dueDate = "Due date required.";

        if (role !== "EMPLOYEE" && !formData.assignee.length) {
            newErrors.assignee = "Select an assignee.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /* ---------------- Handlers ---------------- */
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((p) => ({ ...p, [name]: value }));
    };

    const handleAssignTo = (e) => {
        setFormData((p) => ({
            ...p,
            assignee: e.target.value ? [e.target.value] : [],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const res = await fetch(
                `${import.meta.env.VITE_BASE_URL}/task/update-task/${id}`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ...formData,
                        title: formData.title.trim(),
                        description: formData.description.trim(),
                    }),
                }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data?.message);

            navigate("/dashboard/tasks");
        } catch (err) {
            setErrors({ submit: err.message || "Update failed" });
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) return <p className="text-center mt-10">Fetching...</p>;

    /* ---------------- Render ---------------- */
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-6 px-3 sm:px-4">
            <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-6 sm:p-8 border border-gray-100">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4 mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800 flex items-center gap-2">
                            Update Task
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
                                value={formData.assignee[0]}
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
                        className={`w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-bold text-base sm:text-lg hover:bg-blue-700 active:scale-95 transition-all ${loading ? "opacity-80 cursor-not-allowed" : ""
                            }`}
                    >
                        {loading ? (
                            <>
                                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Updating...
                            </>
                        ) : (
                            <>Update Task</>
                        )}
                    </button>
                    {/* Global error */}
                    {errors.submit && (
                        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                            {errors.submit}
                        </div>
                    )}

                </form>
            </div>
        </div>
    );
};

export default UpdateTask;
