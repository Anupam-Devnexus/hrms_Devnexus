import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLeavePersonalDetails } from "../Zustand/GetPersonalLeaveDetails";
import PersonalLeaveCard from "../Component/Card/PersonalLeaveCard";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useAttendance } from "../Zustand/PersonalAttendance";

// Loader component
const Loader = () => (
  <div className="flex justify-center items-center py-20">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-500"></div>
  </div>
);

const Leave = () => {
  const navigate = useNavigate();
  const { personalLeave, loading, error, fetchPersonalDetails } =
    useLeavePersonalDetails();
  const { user } = useAttendance();


  const role = user?.Role?.toUpperCase() || "EMPLOYEE";
  const total_leave = 14;

  useEffect(() => {
    fetchPersonalDetails();
  }, [fetchPersonalDetails]);

  // Calculate approved leave days (only for non-admin)
  const approvedDays = useMemo(() => {
    if (role === "ADMIN") return 0;
    if (!personalLeave?.Approved) return 0;
    return personalLeave.Approved;
  }, [personalLeave, role]);

  const remainingDays = Math.max(total_leave - approvedDays, 0);

  // Pie chart data (only for non-admin)
  const leaveData = [
    { name: "Taken", value: approvedDays },
    { name: "Remaining", value: remainingDays },
  ];
  const COLORS = ["#EF4444", "#22C55E"]; // red, green

  return (
    <div className="p-4  bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <h1 className="text-gray-800 font-semibold text-xl sm:text-2xl">
          Leave Dashboard for{" "}
          <span className="text-2xl sm:text-3xl text-blue-600 font-bold">
            {user?.FirstName} {user?.LastName}
          </span>
        </h1>

        {role !== "ADMIN" && (
          <button
            className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition"
            onClick={() => navigate("/dashboard/apply-leave")}
          >
            Apply Leave
          </button>
        )}
      </div>

      {/* Leave Summary */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-1">
        {role === "ADMIN" ? (
          ""
        ) : (
          <>
            <div className="bg-white shadow rounded-xl p-4 text-center border border-gray-200">
              <p className="text-gray-500 text-sm">Total Leaves</p>
              <h2 className="text-2xl font-bold text-gray-800">
                {total_leave}
              </h2>
            </div>
            <div className="bg-white shadow rounded-xl p-4 text-center border border-gray-200">
              <p className="text-gray-500 text-sm">Leaves Taken</p>
              <h2 className="text-2xl font-bold text-red-500">
                {approvedDays}
              </h2>
            </div>
            <div className="bg-white shadow rounded-xl p-4 text-center border border-gray-200">
              <p className="text-gray-500 text-sm">Remaining</p>
              <h2
                className={`text-2xl font-bold ${remainingDays > 0 ? "text-green-600" : "text-red-600"
                  }`}
              >
                {remainingDays}
              </h2>
            </div>
          </>
        )}
      </section>

      {/* Progress Chart */}
      {role !== "ADMIN" && (
        <section className="bg-white shadow rounded-xl p-6 border border-gray-200 mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Leave Utilization
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="w-60 h-60">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={leaveData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                  >
                    {leaveData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-red-500 rounded"></span>
                <p className="text-gray-700">
                  Taken:{" "}
                  <span className="font-semibold text-red-600">
                    {approvedDays} days
                  </span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-green-500 rounded"></span>
                <p className="text-gray-700">
                  Remaining:{" "}
                  <span className="font-semibold text-green-600">
                    {remainingDays} days
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Leave Cards */}
      <section>
        {loading && <Loader />}
        {error && (
          <p className="text-center text-red-600 font-medium">{error}</p>
        )}

        {!loading &&
          !error &&
          (!personalLeave?.leaves || personalLeave.leaves.length === 0) && (
            <p className="text-center text-gray-500">
              No leave records found
              {role !== "ADMIN" && ". Apply for your first leave!"}
            </p>
          )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-4">
          {personalLeave?.leaves?.map((leave) => (
            <PersonalLeaveCard key={leave._id} leave={leave} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Leave;
