import React, { useEffect, useState } from "react";
import { useTeams } from "../Zustand/GetTeams";
import TeamCardforLead from "../Component/Card/TeamCardforLead";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

  const { loading, error, teamList, fetchTeams } = useTeams();
  const [adminTeams, setAdminTeams] = useState(null);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState(null);

  const token = JSON.parse(localStorage.getItem("authUser"))?.accessToken;
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // 🔹 reusable function so we can call it after delete as well
  const fetchAdminTeams = async () => {
    setAdminLoading(true);
    setAdminError(null);
    try {
      const { data } = await axios.get(`${BASE_URL}/team/get-teams`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdminTeams(data.teams || []);
    } catch (err) {
      setAdminError(
        err.response?.data?.message || err.message || "Failed to load teams."
      );
    } finally {
      setAdminLoading(false);
    }
  };

  useEffect(() => {
    if (role === "ADMIN") {
      fetchAdminTeams();
    } else {
      fetchTeams();
    }
  }, [role, fetchTeams]);

  // 🔥 Delete handler
  const handleDeleteTeam = async (teamId) => {
    if (!teamId) {
      alert("Invalid team ID");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this team? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${BASE_URL}/team/delete-team/${teamId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Refresh the list after delete
      if (role === "ADMIN") {
        fetchAdminTeams();
      } else {
        fetchTeams();
      }

      alert("Team deleted successfully.");
    } catch (err) {
      console.error("Failed to delete team:", err);
      alert(
        err.response?.data?.message ||
          "Something went wrong while deleting the team."
      );
    }
  };

  const totalCount =
    role === "ADMIN" ? adminTeams?.length || 0 : teamList?.count || 0;
  const list = role === "ADMIN" ? adminTeams || [] : teamList?.teams || [];

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

      {(loading || adminLoading) && <Loader count={4} />}

      {(error || adminError) && (
        <p className="text-red-600 font-medium bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-sm">
          {error || adminError}
        </p>
      )}

      {!loading && !adminLoading && !(error || adminError) && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.length > 0 ? (
            list.map((team) => (
              <TeamCardforLead
                key={team._id}
                team={team}
                onEdit={(t) => navigate(`/teams/${t._id}/edit`)}
                onDelete={(t) => handleDeleteTeam(t._id)}
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
