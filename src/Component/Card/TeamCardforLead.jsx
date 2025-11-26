import React from "react";
import { FaUsers, FaCalendarAlt, FaCrown } from "react-icons/fa";

const TeamCardforLead = ({ team }) => {
  return (
    <div
      className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 
                 border border-gray-200 hover:shadow-2xl hover:scale-[1.02] 
                 transition-all duration-300 flex flex-col"
    >
      {/* Team Name & Description */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-1">{team.name}</h2>
        <p className="text-sm text-gray-500 mb-4">
          {team.description || "No description available"}
        </p>
      </div>
      {}
      {/* Team Lead */}
      {team && (
        <div className="flex items-center gap-3 mb-6 p-3 bg-indigo-50 rounded-xl">
          <img
            src={
              team.avatar ||
              `https://ui-avatars.com/api/?name=${
                team.lead.FirstName + team.lead.LastName
              }`
            }
            alt={team.lead.FirstName}
            className="w-12 h-12 rounded-full border-2 border-indigo-500 shadow-sm"
          />
          <div>
            <div className="flex flex-col items-start justify-start">
              <p className="font-semibold text-gray-800 flex items-start gap-2">
                {team.lead.FirstName} {team.lead.LastName}{" "}
                <FaCrown className="text-yellow-500" />
              </p>
              <i className="font-light text-xs text-gray-500">
                {team.lead.Email}
              </i>
            </div>
            <p className="text-sm text-gray-500">Team Lead</p>
          </div>
        </div>
      )}

      {/* All Members */}
      <div className="mt-2">
        <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <FaUsers className="text-indigo-500" /> Team Members (
          {team.members?.length || 0})
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
          {team.members?.map((member, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <img
                src={
                  member.avatar ||
                  `https://ui-avatars.com/api/?name=${member.FirstName}`
                }
                alt={member.name}
                className="w-10 h-10 rounded-full border border-gray-200"
              />
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {member.FirstName}
                </p>
                <p className="text-xs text-gray-500">
                  {member.role || "Member"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Section */}
      <div className="mt-6 flex justify-between text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <FaUsers className="text-indigo-500" />
          <span>{team.members?.length || 0} Members</span>
        </div>
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-pink-500" />
          <span>
            {team.createdAt
              ? new Date(team.createdAt).toLocaleDateString()
              : "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TeamCardforLead;
