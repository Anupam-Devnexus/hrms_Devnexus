import React from "react";
import { CalendarDays, Mail, Briefcase } from "lucide-react";

const PersonalLeaveCard = ({ leave }) => {
  if (!leave) return null;

  const {
    createdAt,
    days,
    employee,
    from,
    to,
    leaveType,
    reason,
    status,
    updatedAt,
  } = leave;

  // Status colors
  const statusClasses = {
    Approved: "bg-green-100 text-green-700 border-green-200",
    Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Rejected: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 shadow-lg rounded-2xl p-6 w-full max-w-md border border-gray-100 hover:shadow-xl transition duration-300">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4 mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {employee?.FirstName} {employee?.LastName}
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
            <Mail size={14} /> {employee?.Email}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Briefcase size={14} /> {employee?.Department}
          </div>
        </div>
        <span
          className={`px-4 py-1 rounded-full text-sm font-semibold border ${
            statusClasses[status] || "bg-gray-100 text-gray-600 border-gray-200"
          }`}
        >
          {status}
        </span>
      </div>

      {/* Leave Info */}
      <div className="space-y-3 text-gray-700">
        <p className="flex justify-between">
          <span className="font-medium">Leave Type:</span>
          <span className="text-gray-600">{leaveType}</span>
        </p>
        <p className="flex justify-between">
          <span className="font-medium">Total Days:</span>
          <span className="text-gray-600">{days}</span>
        </p>
        <p className="flex justify-between">
          <span className="font-medium flex items-center gap-1">
            <CalendarDays size={14} /> From:
          </span>
          <span>{new Date(from).toLocaleDateString()}</span>
        </p>
        <p className="flex justify-between">
          <span className="font-medium flex items-center gap-1">
            <CalendarDays size={14} /> To:
          </span>
          <span>{new Date(to).toLocaleDateString()}</span>
        </p>
        <div>
          <span className="font-medium">Reason:</span>
          <p className="text-gray-600 mt-1 bg-gray-50 p-2 rounded-lg border text-sm">
            {reason || "—"}
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 flex justify-between text-xs text-gray-400 border-t pt-3">
        <p>Created: {new Date(createdAt).toLocaleDateString()}</p>
        <p>Updated: {new Date(updatedAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default PersonalLeaveCard;
