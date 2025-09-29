import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUserStore } from "../Zustand/GetAllData";

const MarkAttendance = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { allData, fetchAllData } = useUserStore();
    const [employee, setEmployee] = useState(null);
    const [status, setStatus] = useState("Present");

    // Get today's date (YYYY-MM-DD)
    const today = new Date().toISOString().split("T")[0];
    const [date, setDate] = useState(today);

    useEffect(() => {
        fetchAllData();
    }, []);

    useEffect(() => {
        if (allData?.data) {
            const users = Object.values(allData.data).flat();
            const emp = users.find((u) => u._id === id);
            setEmployee(emp || null);
        }
    }, [allData, id]);

    const handleSubmit = () => {
        alert(
            `Attendance for ${employee.FirstName} on ${date} marked as ${status}`
        );
        // TODO: API call example:
        // fetch(`/api/attendance/${employee._id}`, {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({ date, status }),
        // });
        navigate("/attendance");
    };

    if (!employee) return <div className="p-6">Loading employee...</div>;

    return (
        <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
                Mark Attendance for {employee.FirstName} {employee.LastName}
            </h2>

            <div className="space-y-2 text-gray-700 text-sm">
                <p><strong>Employee ID:</strong> {employee.EmployeeId}</p>
                <p><strong>Email:</strong> {employee.Email}</p>
                <p><strong>Role:</strong> {employee.Role}</p>
                <p><strong>Department:</strong> {employee.Department}</p>
                <p><strong>Designation:</strong> {employee.Designation}</p>
            </div>

            {/* Date Picker */}
            <div className="mt-4">
                <label className="block text-gray-600 font-medium mb-1">
                    Select Date
                </label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    max={today} // ❌ Prevent future dates
                    className="w-full border rounded-lg px-3 py-2"
                />
            </div>

            {/* Attendance Status */}
            <div className="mt-4">
                <label className="block text-gray-600 font-medium mb-1">
                    Attendance Status
                </label>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                >
                    <option value="Present">✅ Present</option>
                    <option value="Absent">❌ Absent</option>
                    <option value="Half-Day">🌓 Half-Day</option>
                    <option value="Work From Home">🏠 WFH</option>
                    <option value="Leave">📝 Leave</option>
                </select>
            </div>

            {/* Buttons */}
            <div className="flex justify-between mt-6">
                <button
                    onClick={() => navigate("/dashboard/attendance")}
                    className="px-4 py-2 bg-gray-300 rounded-lg"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                    Submit
                </button>
            </div>
        </div>
    );
};

export default MarkAttendance;
