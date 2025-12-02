import React, { useEffect, useState } from "react";
import TeamCardforLead from "../Component/Card/TeamCardforLead";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTeamStore } from "../Zustand/useTeamStore";

const Loader = ({ count = 3 }) => (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: count }).map((_, idx) => (
      <div
        key={idx}
        className="h-44 bg-white/60 animate-pulse rounded-2xl shadow-md"
      />
    ))}
  </div>
);

const Team = () => {
  const navigate = useNavigate();

  const role =
    JSON.parse(localStorage.getItem("authUser"))?.user?.Role?.toUpperCase() ||
    "EMPLOYEE";

  const { loadingTeam, error, teamList, fetchTeams } = useTeamStore();
  const [deletingId, setDeletingId] = useState(null);

  const { deleteTeam } = useTeamStore();

  useEffect(() => {
    fetchTeams();
  }, [role, fetchTeams]);

  //  Delete handler
  const handleDeleteTeam = async (teamId) => {
    if (!teamId) {
      alert("Invalid team ID");
      return;
    }

    const confirmDelete = confirm(
      "Are you sure you want to delete this team? This action cannot be undone."
    );
    if (!confirmDelete) return;
    setDeletingId(teamId);
    deleteTeam(teamId);
  };

  const totalCount = teamList?.length || 0;
  const list = teamList;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-2 sm:p-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white rounded-2xl shadow-xl p-6 mb-8">
        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-wide">
          {role} – Teams dashboard
        </h1>
        <p className="mt-2 text-sm sm:text-base text-indigo-100">
          {role === "ADMIN"
            ? "View and manage all teams in the organization."
            : "View and manage the teams you are part of."}
        </p>
        <div className="mt-4">
          <span className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-xs sm:text-sm font-medium">
            Total teams: <span className="ml-1 font-bold">{totalCount}</span>
          </span>
        </div>
      </div>

      {loadingTeam && <Loader count={4} />}

      {error && (
        <p className="text-red-600 font-medium bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-sm">
          {error}
        </p>
      )}

      {!loadingTeam && !error && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list?.length > 0 ? (
            list.map((team) => (
              <TeamCardforLead
                key={team._id}
                isdeleting={deletingId === team._id}
                team={team}
                onEdit={() => navigate(`update/${team._id}`)}
                onDelete={() => handleDeleteTeam(team._id)}
                showActions={role === "TL" || role === "ADMIN"}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <p className="text-gray-700 text-lg font-semibold">
                No teams found
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {role === "ADMIN"
                  ? "No teams have been created yet."
                  : "Once you join a team, it will be listed here."}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Team;
