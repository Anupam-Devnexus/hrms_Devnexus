import React from "react";
import { useTeamStore } from "../../Zustand/useTeamStore";

const TeamCard = ({ employee }) => {
  const toggleMember = useTeamStore((state) => state.toggleMember);
  const isMember = useTeamStore((state) => state.isMember);

  return (
    <div className="p-4 border rounded-xl shadow-md flex items-center justify-between mb-3 bg-white hover:shadow-lg transition">
      <div className="flex items-center gap-4">
        <img
          draggable={false}
          src={employee.Profile_url}
          alt={employee.FirstName}
          className="w-14 h-14 rounded-full object-cover border"
        />
        <div>
          <h3 className="font-semibold text-lg capitalize">
            {employee.FirstName} {employee.LastName}
          </h3>
          <p className="text-sm text-gray-600">{employee.Designation}</p>
          <p className="text-sm text-gray-500">{employee.Department}</p>
          <p className="text-xs text-gray-400">{employee.Email}</p>
        </div>
      </div>

      {/* Checkbox */}
      <div className="flex flex-col items-center">
        <input
          type="checkbox"
          checked={isMember(employee._id)}
          onChange={() => toggleMember(employee._id)}
          className="w-5 h-5"
        />
        <span
          className={`text-xs mt-1 ${
            employee.IsActive ? "text-green-600" : "text-red-500"
          }`}
        >
          {employee.IsActive ? "Active" : "Inactive"}
        </span>
      </div>
    </div>
  );
};

export default TeamCard;
