const AttendanceTable = ({
    data,
    attendanceByUser,
    role,
    navigate,
}) => {
    return (
        <div className="overflow-x-auto rounded-2xl shadow-lg  ">
            <table className="min-w-full bg-white">
                <thead className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                    <tr>
                        <th className="px-4 py-3 text-left">Employee</th>
                        <th className="px-4 py-3 text-left">Role</th>
                        <th className="px-4 py-3 text-left">Department</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Last Updated</th>
                        {(role === "ADMIN" || role === "HR") && (
                            <th className="px-4 py-3 text-left">Actions</th>
                        )}
                    </tr>
                </thead>

                <tbody>
                    {data.map((user) => {
                        const attendance =
                            attendanceByUser[user._id]?.attendance?.[0];

                        return (
                            <tr
                                key={user._id}
                                className="border-b hover:bg-gray-50"
                            >
                                {/* Employee */}
                                <td className="px-4 py-3 flex items-center gap-3">
                                    <img
                                        src={user.Profile_url || "/default-avatar.png"}
                                        alt="profile"
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div>
                                        <p className="font-semibold">
                                            {user.FirstName} {user.LastName}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            ID: {user.EmployeeId}
                                        </p>
                                    </div>
                                </td>

                                {/* Role */}
                                <td className="px-4 py-3">
                                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                                        {user.Role}
                                    </span>
                                </td>

                                {/* Department */}
                                <td className="px-4 py-3">
                                    {user.Department || "N/A"}
                                </td>

                                {/* Status */}
                                <td className="px-4 py-3">
                                    {attendance?.status ? (
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold ${attendance.status === "Present"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {attendance.status}
                                        </span>
                                    ) : (
                                        <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs">
                                            No record
                                        </span>
                                    )}
                                </td>

                                {/* Last Updated */}
                                <td className="px-4 py-3 text-sm text-gray-500">
                                    {attendance
                                        ? `${attendance.checkInDate}, ${attendance.checkInTime}`
                                        : "—"}
                                </td>

                                {/* Actions */}
                                {(role === "ADMIN" || role === "HR") && (
                                    <td className="px-4 py-3">
                                        <button
                                            disabled={role !== "HR"}
                                            onClick={() =>
                                                navigate(
                                                    `/dashboard/mark-attendance/${user._id}`
                                                )
                                            }
                                            className={`px-3 py-1 rounded text-xs text-white ${role === "HR"
                                                    ? "bg-indigo-600 hover:bg-indigo-700"
                                                    : "bg-gray-400 cursor-not-allowed"
                                                }`}
                                        >
                                            Mark Attendance
                                        </button>
                                    </td>
                                )}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default AttendanceTable;
