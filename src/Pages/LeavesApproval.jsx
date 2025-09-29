import React, { useEffect } from "react";
import { useLeaveStore } from "../Zustand/GetLeave";
import LeaveCard from "../Component/Card/LeaveCard";

const LeavesApproval = () => {
  const { leaveList, error, loading, fetchLeave, updateLeaveStatus } = useLeaveStore();

  useEffect(() => {
    fetchLeave();
  }, []);

  const handleStatusChange = async (id, status) => {
    await updateLeaveStatus(id, status);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400 animate-pulse">Loading leave requests...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500 font-medium">Error: {error}</p>
      </div>
    );

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-black">Leave Approvals</h1>
        <span className="px-3 py-1 text-sm rounded-full bg-blue-800 text-white">
          {leaveList.length} Requests
        </span>
      </div>

      {/* Grid of leave requests */}
      {leaveList.length === 0 ? (
        <div className="flex items-center justify-center h-40 rounded-lg bg-gray-800 text-gray-400">
          No leave requests found.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {leaveList.map((leave) => (
            <div
              key={leave._id}
              className="bg-gray-800 rounded-xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
            >
              {/* You can replace with your <LeaveCard /> if it has more detail */}
              <LeaveCard leave={leave} onStatusChange={handleStatusChange} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeavesApproval;
