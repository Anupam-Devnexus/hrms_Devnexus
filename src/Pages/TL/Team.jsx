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
  }, []);

  if (loading) return <div className="text-gray-500">Loading employees...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  const employees = allData.data?.EMPLOYEE || [];
  // console.log(employees)

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 bg-white rounded-2xl shadow-md">
      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        👥 Create New Team
      </h2>

      {/* Team Details */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Team Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Enter team name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Team Description
          </label>
          <textarea
            value={teamDescription}
            onChange={(e) => setTeamDescription(e.target.value)}
            placeholder="Write a short description about this team..."
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Employee Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Select Team Members
        </h3>
        {employees.length === 0 ? (
          <p className="text-gray-500">No employees available.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {employees.map((emp) => {
              const selected = isMember(emp._id);
              return (
                <div
                  key={emp._id}
                  onClick={() => toggleMember(emp._id)}
                  className={`cursor-pointer p-4 rounded-lg border transition ${
                    selected
                      ? "bg-blue-50 border-blue-400 shadow"
                      : "bg-gray-50 border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center justify-between">

                      <p className="font-medium text-gray-800">
                        {emp.FirstName} {emp.LastName}
                      </p>
                      <i className="font-light text-gray-800 text-xs">
                       ( {emp.Department} )
                      </i>
                      </div>
                      <i className="font-light text-gray-800 text-xs">
                        {emp.Designation} 
                      </i>
                      <p className="text-sm text-gray-500">{emp.Email}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleMember(emp._id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={saveTeam}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 transition"
        >
          💾 Save Team
        </button>
      </div>
    </div>
  );
}
