import React from "react";
import {
  FaUsers,
  FaCalendarAlt,
  FaCrown,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

const TeamCardforLead = ({ team, onEdit, onDelete, showActions = true }) => {
  if (!team) return null;

  const lead = team.lead || {};
  const members = Array.isArray(team.members) ? team.members : [];

  const leadFullName =
    `${lead.FirstName || ""} ${lead.LastName || ""}`.trim() || "Unknown";
  const leadAvatarUrl =
    team.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      lead.FullName || leadFullName || team.name || "Lead"
    )}`;

  const handleEditClick = (e) => {
    e.stopPropagation();
    if (onEdit) onEdit(team);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete(team);
  };

  return (
    <div
      className="relative group
                 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6
                 border border-gray-200 hover:shadow-2xl hover:scale-[1.02]
                 transition-all duration-300 flex flex-col"
    >
      {/* Hover actions (Edit / Delete) */}
      {showActions && (onEdit || onDelete) && (
        <div
          className="absolute top-3 right-3 flex gap-2
                     opacity-0 group-hover:opacity-100
                     translate-y-[-4px] group-hover:translate-y-0
                     transition-all duration-200"
        >
          {onEdit && (
            <button
              type="button"
              onClick={handleEditClick}
              className="p-1.5 rounded-full bg-white shadow border border-gray-200
                         hover:bg-blue-50 hover:border-blue-400 text-gray-700 hover:text-blue-600
                         text-xs"
              title="Edit team"
            >
              <FaEdit className="w-3.5 h-3.5" />
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={handleDeleteClick}
              className="p-1.5 rounded-full bg-white shadow border border-gray-200
                         hover:bg-red-50 hover:border-red-400 text-gray-700 hover:text-red-600
                         text-xs"
              title="Delete team"
            >
              <FaTrash className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Team name and description */}
      <div className="min-w-0">
        <h2
          className="text-xl font-bold text-gray-800 mb-1 truncate"
          title={team.name}
        >
          {team.name}
        </h2>
        <p
          className="text-sm text-gray-500 mb-4 break-words max-h-20 overflow-y-auto"
          title={team.description}
        >
          {team.description || "No description available."}
        </p>
      </div>

      {/* Team lead */}
      {lead && lead.FirstName && (
        <div className="flex items-center gap-3 mb-6 p-3 bg-indigo-50 rounded-xl">
          <img
            src={leadAvatarUrl}
            alt={leadFullName}
            className="w-12 h-12 rounded-full border-2 border-indigo-500 shadow-sm flex-shrink-0"
          />
          <div className="min-w-0">
            <div className="flex items-start gap-2 min-w-0">
              <p
                className="font-semibold text-gray-800 text-sm truncate flex items-center gap-1"
                title={leadFullName}
              >
                {leadFullName}
                <FaCrown className="text-yellow-500 flex-shrink-0" />
              </p>
            </div>
            {lead.Email && (
              <p
                className="font-light text-xs text-gray-500 break-all"
                title={lead.Email}
              >
                {lead.Email}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">Team lead</p>
          </div>
        </div>
      )}

      {/* Team members */}
      <div className="mt-2">
        <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <FaUsers className="text-indigo-500" />
          <span className="truncate">Team members ({members.length})</span>
        </h3>

        {members.length === 0 ? (
          <p className="text-xs text-gray-400">
            No members added to this team.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {members.map((member, idx) => {
              const memberName = member?.FirstName || "Member";
              const memberFullName = `${member?.FirstName || ""} ${
                member?.LastName || ""
              }`.trim();
              const memberAvatarUrl =
                member.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  memberFullName || memberName
                )}`;

              return (
                <div
                  key={member._id || idx}
                  className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition min-w-0"
                >
                  <img
                    src={memberAvatarUrl}
                    alt={memberFullName || memberName}
                    className="w-10 h-10 rounded-full border border-gray-200 flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <p
                      className="text-sm font-medium text-gray-800 truncate"
                      title={memberFullName || memberName}
                    >
                      {memberFullName || memberName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {member.role || "Member"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 flex justify-between text-xs sm:text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <FaUsers className="text-indigo-500" />
          <span>{members.length} members</span>
        </div>
        <div className="flex items-center gap-2">
          <FaCalendarAlt className="text-pink-500" />
          <span>
            {team.createdAt
              ? new Date(team.createdAt).toLocaleDateString()
              : "Created date not available"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TeamCardforLead;
