import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUserStore } from "../Zustand/GetAllData";
import axios from "axios";
import { toast } from "react-toastify";
import EmployeeAttendanceCalendar from "../Component/EmployeeAttendanceCalendar";

const MarkAttendance = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allData, fetchAllData } = useUserStore();
  const [employee, setEmployee] = useState(null);
  const [status, setStatus] = useState("Present");
  const [showCalendar, setShowCalendar] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get today's date (YYYY-MM-DD) and current time (HH:MM)
  const today = new Date().toISOString().split("T")[0];
  const now = new Date().toISOString().slice(11, 16);

  const [date, setDate] = useState(today);
  const [time, setTime] = useState(now);

  // Fetch all employee data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchAllData();
      setLoading(false);
    };
    !allData && fetchData();
    console.log(allData)
  }, [allData]);

  // Set current employee based on ID
  useEffect(() => {
    if (allData?.data) {
      const users = Object.values(allData.data).flat();
      const emp = users.find((u) => u._id === id);
      setEmployee(emp || null);
    }
  }, [allData, id]);

  // Submit attendance
  const handleSubmit = async () => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/attendance/checkin`,
        { userId: id, status, date, time },
        { headers: { "Content-Type": "application/json" } }
      );

      if (!data.success) toast.error(data.message);
      else toast.success(data.message);

      navigate("/dashboard/attendance");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Something went wrong");
    }
  };

  if (loading) return <div className="p-6">Loading data...</div>;
  if (!employee) return <div className="p-6">Employee not found</div>;
  console.log("ALL dat", employee?.Leaves)
  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <button
        onClick={() => setShowCalendar(!showCalendar)}
        className="mb-4 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
      >
        {showCalendar ? "Back" : "All Data"}
      </button>

      {showCalendar ? (
        <EmployeeAttendanceCalendar
          leaves={employee?.Leaves || 2}
          joiningDate={employee?.JoiningDate || ""}
        />
      ) : (
        <>
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
            <label className="block text-gray-600 font-medium mb-1">Select Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={today}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          {/* Time Picker */}
          <div className="mt-4">
            <label className="block text-gray-600 font-medium mb-1">Select Time</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              max={now}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          {/* Attendance Status */}
          <div className="mt-4">
            <label className="block text-gray-600 font-medium mb-1">Attendance Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            >
              <option value="Present">✅ Present</option>
              <option value="Absent">❌ Absent</option>
              <option value="Half-Day">🌓 Half-Day</option>
              <option value="WFH">🏠 WFH</option>
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
        </>
      )}
    </div>
  );
};

export default MarkAttendance;
