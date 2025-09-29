import React, { useState } from "react";

const LeaveCard = ({ leave, onStatusChange }) => {
  const authUser = JSON.parse(localStorage.getItem("authUser"))?.user?.Role;
  const [loading, setLoading] = useState(false);

  const handleAction = async (status) => {
    try {
      setLoading(true);
      await onStatusChange(leave._id, status);
    } catch {
      alert("Failed to update leave");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-5 mb-4 border">
      {/* Employee Info */}
      <h2 className="text-xl font-semibold text-gray-800">
        {leave.employee?.FirstName} {leave.employee?.LastName}
      </h2>
      <p className="text-gray-600 text-sm">{leave.employee?.Email}</p>
      <p className="text-gray-600 text-sm">Dept: {leave.employee?.Department}</p>

      {/* Leave Details */}
      <div className="mt-3">
        <p>
          <span className="font-semibold">Leave Type:</span> {leave.leaveType}
        </p>
        <p>
          <span className="font-semibold">Reason:</span> {leave.reason}
        </p>
        <p>
          <span className="font-semibold">From:</span>{" "}
          {new Date(leave.from).toLocaleDateString()}
        </p>
        <p>
          <span className="font-semibold">To:</span>{" "}
          {new Date(leave.to).toLocaleDateString()}
        </p>
        <p>
          <span className="font-semibold">Days:</span> {leave.days}
        </p>
        <p>
          <span className="font-semibold">Status:</span>
          <span
            className={`ml-2 px-2 py-1 rounded-lg text-white 
              ${leave.status === "Pending"
                ? "bg-yellow-500"
                : leave.status === "Approved"
                ? "bg-green-500"
                : "bg-red-500"}`}
          >
            {leave.status}
          </span>
        </p>
      </div>

      {/* Show Action Buttons only for ADMIN */}
      {authUser === "ADMIN" && leave.status === "Pending" && (
        <div className="flex gap-4 mt-4">
          <button
            disabled={loading}
            onClick={() => handleAction("Approved")}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Approve"}
          </button>
          <button
            disabled={loading}
            onClick={() => handleAction("Rejected")}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Reject"}
          </button>
        </div>
      )}
    </div>
  );
};

export default LeaveCard;
