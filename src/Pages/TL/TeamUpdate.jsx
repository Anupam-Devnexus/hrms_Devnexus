// src/Pages/Teams/UpdateTeam.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUserStore } from "../../Zustand/GetAllData";
import { useTeamStore } from "../../Zustand/useTeamStore";

export default function UpdateTeam() {
  const { id } = useParams();
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
    members,
    loadingTeam,
    updatingTeam,
    teamError,
  } = useTeamStore();

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAllData();
    if (id) loadTeamById(id);
  }, [fetchAllData, loadTeamById, id]);

  const employees = allData.data?.EMPLOYEE || [];

  //  NO FILTER TABS — ONLY SEARCH
  const filteredEmployees = employees.filter((emp) => {
    const q = search.toLowerCase();
    const name = `${emp.FirstName} ${emp.LastName}`.toLowerCase();
    return (
      name.includes(q) ||
      emp.Email.toLowerCase().includes(q) ||
      emp.Department?.toLowerCase().includes(q)
    );
  });

  const handleUpdate = async () => {
    if (!teamName.trim() || members.length === 0) {
      alert("Team name is required or no members selected.");
      return;
    }

    const res = await updateTeam(id);
    if (res) {
      navigate(-1);
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
      <h2 className="text-2xl font-bold text-gray-800">✏️ Update Team</h2>

      {/* TEAM DETAILS */}
      <div className="space-y-2">
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Team Name *
          </label>
          <input
            type="text"
            maxLength={50}
            required
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="w-full px-4 py-2 border   rounded-lg focus:ring text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Team Description
          </label>
          <textarea
            value={teamDescription}
            required
            onChange={(e) => setTeamDescription(e.target.value)}
            maxLength={200}
            rows={4}
            className="w-full px-4 py-2 border rounded-lg focus:ring text-sm resize-none"
          />
        </div>
      </div>

      {/*  TEAM MEMBERS SECTION (Simplified & Improved) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Manage Members
          </h3>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search employee..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 text-sm border rounded-lg shadow-sm focus:ring "
        />

        {/* EMPLOYEE GRID */}
        {filteredEmployees.length === 0 ? (
          <p className="text-gray-500 text-sm">No employees found.</p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredEmployees.map((emp) => {
              const selected = isMember(emp._id);
              return (
                <button
                  type="button"
                  key={emp._id}
                  onClick={() => toggleMember(emp._id)}
                  className={`text-left cursor-pointer p-4 rounded-lg border flex flex-col justify-between min-h-[120px] transition ${
                    selected
                      ? "bg-blue-50 border-blue-500 shadow-sm"
                      : "bg-gray-50 border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 text-sm truncate">
                        {emp.FirstName} {emp.LastName}
                      </p>
                      <p className="text-[11px] text-gray-600 truncate">
                        {emp.Department}
                      </p>
                      <p className="text-[11px] text-gray-500 break-all mt-1">
                        {emp.Email}
                      </p>
                    </div>

                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleMember(emp._id)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 cursor-pointer accent-blue-600"
                    />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* BUTTONS */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
        >
          Cancel
        </button>

        <button
          onClick={handleUpdate}
          disabled={updatingTeam}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg text-sm shadow hover:bg-blue-700 disabled:opacity-60"
        >
          {updatingTeam ? "Saving..." : "Update Team"}
        </button>
      </div>
    </div>
  );
}
