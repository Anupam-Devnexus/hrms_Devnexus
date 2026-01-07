const MyAttendanceTable = ({ user, data }) => {
    return (
        <div className="overflow-x-auto rounded-2xl shadow-lg  not-last-of-type:">
            <table className="min-w-full bg-white">
                <thead className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                    <tr>
                        <th className="px-4 py-3 text-left">Employee</th>
                        <th className="px-4 py-3 text-left">Role</th>
                        <th className="px-4 py-3 text-left">Department</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Date</th>
                    </tr>
                </thead>

                <tbody>
                    {data.map((attend) => (
                        <tr key={attend._id} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-3 flex items-center gap-3">
                                <img
                                    src={user.Profile_url || "/default-avatar.png"}
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

                            <td className="px-4 py-3">{user.Role}</td>
                            <td className="px-4 py-3">
                                {user.Department || "N/A"}
                            </td>

                            <td className="px-4 py-3">
                                <span
                                    className={`px-3 py-1 rounded-full text-xs ${attend.status === "Present"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {attend.status}
                                </span>
                            </td>

                            <td className="px-4 py-3 text-sm text-gray-500">
                                {new Date(attend.date).toLocaleString()}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MyAttendanceTable;
