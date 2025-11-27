import React, { useEffect, useState } from "react";
import { useUserStore } from "../../Zustand/GetAllData";
import { useTeamStore } from "../../Zustand/useTeamStore";

export default function CreateTeam() {
  const { allData, fetchAllData, loading, error } = useUserStore();

  const {
    teamName,
    teamDescription,
    toggleMember,
    isMember,
    setTeamName,
    setTeamDescription,
    saveTeam,
  } = useTeamStore();

  const [role, setRole] = useState("");

  useEffect(() => {
    fetchAllData();
    const authUser = JSON.parse(localStorage.getItem("authUser"));
    setRole(authUser?.user?.Role || "");
  }, [fetchAllData]);

  if (loading) return <div className="text-gray-500">Loading employees...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  const employees = allData.data?.EMPLOYEE || [];

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8 bg-white rounded-2xl shadow-md">
      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        👥 Create New Team
      </h2>

      {/* Team Details */}
      <div className="space-y-4">
        <div className="space-y-1">
          <label className="block text-sm font-semibold text-gray-700">
            Team Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Enter team name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-semibold text-gray-700">
            Team Description
          </label>
          <textarea
            value={teamDescription}
            onChange={(e) => setTeamDescription(e.target.value)}
            placeholder="Write a short description about this team..."
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none text-sm resize-y max-h-48"
          />
        </div>
      </div>

      {/* Employee Selection */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-800">
          Select Team Members
        </h3>
        {employees.length === 0 ? (
          <p className="text-gray-500 text-sm">No employees available.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {employees.map((emp) => {
              const selected = isMember(emp._id);
              return (
                <button
                  type="button"
                  key={emp._id}
                  onClick={() => toggleMember(emp._id)}
                  className={`text-left cursor-pointer p-4 rounded-lg border transition flex flex-col justify-between gap-2 min-h-[120px] ${
                    selected
                      ? "bg-blue-50 border-blue-400 shadow"
                      : "bg-gray-50 border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    {/* Text block */}
                    <div className="flex-1 min-w-0">
                      {/* Name + department */}
                      <div className="flex flex-col gap-0.5">
                        <p
                          className="font-medium text-gray-800 text-sm truncate"
                          title={`${emp.FirstName} ${emp.LastName}`}
                        >
                          {emp.FirstName} {emp.LastName}
                        </p>
                        {emp.Department && (
                          <span
                            className="font-light text-gray-700 text-[11px] truncate"
                            title={emp.Department}
                          >
                            ({emp.Department})
                          </span>
                        )}
                      </div>

                      {/* Designation */}
                      {emp.Designation && (
                        <p
                          className="font-light text-gray-700 text-[11px] truncate"
                          title={emp.Designation}
                        >
                          {emp.Designation}
                        </p>
                      )}

                      {/* Email */}
                      {emp.Email && (
                        <p
                          className="text-[11px] text-gray-500 break-all leading-snug mt-1"
                          title={emp.Email}
                        >
                          {emp.Email}
                        </p>
                      )}
                    </div>

                    {/* Checkbox */}
                    <div className="flex-shrink-0 pt-1">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleMember(emp._id)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={saveTeam}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 active:scale-95 transition text-sm"
        >
          💾 Save Team
        </button>
      </div>
    </div>
  );
}
