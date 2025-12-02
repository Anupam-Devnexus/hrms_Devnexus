import React from "react";
import { User, Mail, Phone, MapPin, Shield, Calendar } from "lucide-react";
import { IoGitBranchOutline } from "react-icons/io5";
import { AiTwotoneBank } from "react-icons/ai";
import { MdAccountBalanceWallet } from "react-icons/md";

const EmployeeCard = ({ employee }) => {
  // Parse permissions safely
  let permissions = [];
  if (employee.Permissions && employee.Permissions.length > 0) {
    try {
      permissions = Array.isArray(employee.Permissions[0])
        ? employee.Permissions[0]
        : JSON.parse(employee.Permissions[0]);
    } catch {
      permissions = [employee.Permissions[0]];
    }
  }

  // Role-based badge colors
  const roleColors = {
    ADMIN: "bg-red-100 text-red-700 border-red-300",
    "TEAM LEAD": "bg-purple-100 text-purple-700 border-purple-300",
    EMPLOYEE: "bg-blue-100 text-blue-700 border-blue-300",
  };

  const role = employee.Role?.toUpperCase();
  const roleBadge =
    roleColors[role] || "bg-gray-100 text-gray-600 border-gray-300";

  return (
    <div className="transition p-2 flex flex-col">
      {/* Header with Profile */}
      <div className="flex items-center gap-4 mb-6">
        <img
          draggable={false}
          src={employee.Profile_url}
          alt={`${employee.FirstName} ${employee.LastName}`}
          className="w-20 h-20 rounded-full border-4 border-indigo-100 object-cover"
        />
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {employee.FirstName} {employee.LastName}
          </h2>

          {/* Role Badge */}
          <span
            className={`inline-block mt-1 px-3 py-1 text-xs font-semibold rounded-full border ${roleBadge}`}
          >
            {employee.Role}
          </span>

          <p className="text-sm text-gray-500 mt-1">{employee.Designation}</p>
          <p className="text-sm text-gray-400">{employee.Department}</p>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-2">
          <Mail size={16} className="text-indigo-500" />
          <span>{employee.Email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone size={16} className="text-green-500" />
          <span>{employee.Phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-pink-500" />
          <span>{employee.CurrentAddress}</span>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="bg-gray-50 rounded-xl p-3 mb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-1">
          Emergency Contact
        </h3>
        <p className="text-sm text-gray-600">
          {employee.EmergencyName} ({employee.EmergencyRelation})
        </p>
        <p className="text-sm text-gray-500">📞 {employee.EmergencyPhone}</p>
      </div>

      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-1">
          Bank Details
        </h3>
        <div className="flex items-center gap-2">
          {/* <AiTwotoneBank size={16} className="text-indigo-500" /> */}
          <span>{employee.BankDetails.BankName}</span>
        </div>
        <div className="flex items-center gap-2">
          {/* <MdAccountBalanceWallet size={16} className="text-green-500" /> */}
          <span>{employee.BankDetails.AccountNumber}</span>
        </div>
        <div className="flex items-center gap-2">
          {/* <MapPin size={16} className="text-pink-500" /> */}
          <span>{employee.BankDetails.IFSC}</span>
        </div>
        <div className="flex items-center gap-2">
          {/* <IoGitBranchOutline size={16} className="text-pink-500" /> */}
          <span>{employee.BankDetails.Branch}</span>
        </div>
      </div>
      {/* Permissions */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-1">
          <Shield size={16} className="text-indigo-500" />
          Permissions
        </h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {permissions.length > 0 ? (
            permissions.map((perm, index) => (
              <span
                key={index}
                className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2 py-1 rounded-full"
              >
                {perm}
              </span>
            ))
          ) : (
            <span className="text-xs text-gray-400">No permissions</span>
          )}
        </div>
      </div>

      {/* Dates */}
      <div className="flex  justify-between text-xs text-gray-500 border-t pt-3 mt-auto">
        <div className="flex items-center gap-1">
          <Calendar size={14} className="text-indigo-500" />
          <span>
            Joined: {new Date(employee.JoiningDate).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <User size={14} className="text-pink-500" />
          <span>DOB: {new Date(employee.Dob).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCard;
