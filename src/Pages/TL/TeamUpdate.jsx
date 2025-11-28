// src/Pages/Teams/UpdateTeam.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUserStore } from "../../Zustand/GetAllData";
import { useTeamStore } from "../../Zustand/useTeamStore";

export default function UpdateTeam() {
  const { teamId } = useParams();
  const navigate = useNavigate();

  const {
    allData,
    fetchAllData,
    loading: loadingEmployees,
    error: employeeError,
  } = useUserStore();

  const {
    teamName,
    teamDescription,
    isMember,
    toggleMember,
    setTeamName,
    setTeamDescription,
    loadTeamById,
    updateTeam,
    deleteTeam,
    loadingTeam,
    updatingTeam,
    deletingTeam,
    teamError,
  } = useTeamStore();

  const [role, setRole] = useState("");

  useEffect(() => {
    fetchAllData();

    const authUser = JSON.parse(localStorage.getItem("authUser"));
    setRole(authUser?.user?.Role || "");

    // Load existing team data
    if (teamId) {
      loadTeamById(teamId);
    }
  }, [fetchAllData, loadTeamById, teamId]);

  const employees = allData.data?.EMPLOYEE || [];

  const handleUpdate = async () => {
    if (!teamName.trim()) {
      alert("Team name is required");
      return;
    }

    const ok = await updateTeam(teamId);
    if (ok) {
      navigate("/teams"); // change to your listing route
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this team? This cannot be undone."
    );
    if (!confirmDelete) return;

    const ok = await deleteTeam(teamId);
    if (ok) {
      navigate("/teams"); // change to your listing route
    }
  };

  if (loadingTeam || loadingEmployees) {
    return <div className="text-gray-500">Loading team data...</div>;
  }

  if (teamError || employeeError) {
    return (
      <div className="text-red-500">Error: {teamError || employeeError}</div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8 bg-white rounded-2xl shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          ✏️ Update Team
        </h2>

        {/* Delete only for TL / ADMIN */}
        {["TL", "TeamLead", "ADMIN", "Admin"].includes(role) && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={deletingTeam}
            className="px-4 py-2 text-sm font-semibold rounded-lg border border-red-500 text-red-600 hover:bg-red-50 disabled:opacity-60"
          >
            {deletingTeam ? "Deleting..." : "🗑 Delete Team"}
          </button>
        )}
      </div>

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
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Edit Team Members
          </h3>
          <p className="text-xs text-gray-500">
            Click a card or checkbox to add/remove members.
          </p>
        </div>

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
                    <div className="flex-1 min-w-0">
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

                      {emp.Designation && (
                        <p
                          className="font-light text-gray-700 text-[11px] truncate"
                          title={emp.Designation}
                        >
                          {emp.Designation}
                        </p>
                      )}

                      {emp.Email && (
                        <p
                          className="text-[11px] text-gray-500 break-all leading-snug mt-1"
                          title={emp.Email}
                        >
                          {emp.Email}
                        </p>
                      )}
                    </div>

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

      {/* Update Button */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          onClick={handleUpdate}
          disabled={updatingTeam}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow hover:bg-blue-700 active:scale-95 transition text-sm disabled:opacity-60"
        >
          {updatingTeam ? "Saving..." : "💾 Update Team"}
        </button>
      </div>
    </div>
  );
}
