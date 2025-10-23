import { useEffect, useState } from "react";
import { useUserStore } from "../Zustand/GetAllData";
import { useNavigate } from "react-router-dom";
import { useAttendance } from "../Zustand/PersonalAttendance";

// Loader component
const Loader = () => (
  <div className="flex justify-center items-center py-20">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-500"></div>
  </div>
);

const Attendance = () => {
  const { allData, fetchAllData, loading, error } = useUserStore();
  const {
    myAttendance,
    allAttendance,
    attendanceByUser,
    fetchAttendance,
    fetchAllAttendance,
  } = useAttendance();
  const [attendanceData, setAttendanceData] = useState([]);
  const [MyattendanceData, setMyAttendanceData] = useState([]);
  const [search, setSearch] = useState("");
  const [toggle, setToggle] = useState(false);
  const navigate = useNavigate();

  const authUser = JSON.parse(localStorage.getItem("authUser")) || {};
  const firstName = authUser?.user?.FirstName || "";
  const email = authUser?.user?.Email || "";
  const role = authUser?.user?.Role?.toUpperCase() || "EMPLOYEE";

  useEffect(() => {
    fetchAllData();
    fetchAttendance();
    fetchAllAttendance();
    // console.log(attendanceByUser);
  }, []);

  useEffect(() => {
    if (allData?.data) {
      const users = Object.values(allData.data).flat();

      if (role === "ADMIN" || role === "HR") {
        setAttendanceData(users);
        const user = users.find(
          (u) =>
            (u.FirstName?.toLowerCase() === firstName.toLowerCase() &&
              u.Role?.toUpperCase() === role) ||
            (u.Email?.toLowerCase() === email.toLowerCase() &&
              u.Role?.toUpperCase() === role)
        );
        setMyAttendanceData(user ? [user] : []);
      } else {
        const user = users.find(
          (u) =>
            (u.FirstName?.toLowerCase() === firstName.toLowerCase() &&
              u.Role?.toUpperCase() === role) ||
            (u.Email?.toLowerCase() === email.toLowerCase() &&
              u.Role?.toUpperCase() === role)
        );
        setAttendanceData(user ? [user] : []);
      }
    }
  }, [allData, role, firstName, email]);

  const filteredData = attendanceData.filter(
    (u) =>
      u.FirstName?.toLowerCase().includes(search.toLowerCase()) ||
      u.LastName?.toLowerCase().includes(search.toLowerCase()) ||
      u.EmployeeId?.toString().includes(search)
  );

  if (loading) return <Loader />;
  if (error)
    return <div className="text-red-500 text-center py-6">{error}</div>;

  return (
    <div className="p-4  bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-indigo-600 flex items-center gap-2">
          📊 Attendance
        </h2>

        {(role === "ADMIN" || role === "HR") && (
          <div className="flex gap-2">
            <button
              className="bg-blue-600 text-white"
              onClick={() => {
                setToggle(!toggle);
              }}
            >
              {!toggle ? "My Attendence" : "Mark Attendence"}
            </button>
            {toggle && (
              <input
                type="text"
                placeholder="🔍 Search by name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-4 py-2 w-full sm:w-64 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            )}
          </div>
        )}
      </div>

      {/* Table */}
      {(role === "HR" || role === "ADMIN") && !toggle ? (
        filteredData.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl shadow-lg border border-gray-200">
            <table className="min-w-full bg-white rounded-2xl overflow-hidden">
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
                {filteredData.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b last:border-none hover:bg-gray-50 transition "
                  >
                    {/* Employee */}
                    <td className="px-4 py-3 flex items-center gap-3">
                      <img
                        src={user.Profile_url || "/default-avatar.png"}
                        alt="profile"
                        className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                      />
                      <div>
                        <p className="font-semibold text-gray-800">
                          {user.FirstName} {user.LastName}
                        </p>
                        <p className="text-xs text-gray-500">
                          ID: {user.EmployeeId}
                        </p>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3">
                      <span className="bg-blue-100 text-blue-700 text-xs sm:text-sm px-2 py-1 rounded-full font-medium">
                        {user.Role}
                      </span>
                    </td>

                    {/* Department */}
                    <td className="px-4 py-3">
                      <span className="bg-purple-100 text-purple-700 text-xs sm:text-sm px-2 py-1 rounded-full font-medium">
                        {user.Department || "N/A"}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      {attendanceByUser[user._id]?.attendance[0]?.status ? (
                        attendanceByUser[user._id]?.attendance[0]?.status ===
                        "Present" ? (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                            Present
                          </span>
                        ) : (
                          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                            {attendanceByUser[user._id]?.attendance[0]?.status}
                          </span>
                        )
                      ) : (
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                          No record
                        </span>
                      )}
                    </td>

                    {/* Last Updated */}
                    <td className="px-4 py-3 text-gray-500 text-sm sm:text-base">
                      {attendanceByUser[user._id]
                        ? `${
                            attendanceByUser[user._id]?.attendance[0]
                              ?.checkInDate
                          }, ${
                            attendanceByUser[user._id]?.attendance[0]
                              ?.checkInTime
                          }`
                        : "No record"}
                      {/* {
                        console.log(attendanceByUser[user._id].attendance[0].date)
                      } */}
                      {/* {attendanceByUser[user._id].attendance[0].date} */}
                    </td>

                    {/* Actions */}
                    {(role === "ADMIN" || role === "HR") && (
                      <td className="px-4 py-3">
                        <button
                          disabled={role !== "HR"}
                          style={{
                            cursor: role !== "HR" && "not-allowed",
                          }}
                          onClick={() =>
                            navigate(`/dashboard/mark-attendance/${user._id}`)
                          }
                          className="px-3 py-1 bg-indigo-600 cursor-pointer text-white rounded-md text-xs sm:text-sm hover:bg-indigo-700 transition"
                        >
                          Mark Attendance
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400 text-sm sm:text-base mt-4 text-center">
            No attendance records found.
          </p>
        )
      ) : myAttendance.length > 0 ? (
        <div className="overflow-x-auto rounded-2xl shadow-lg border border-gray-200">
          <table className="min-w-full bg-white rounded-2xl overflow-hidden">
            <thead className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Employee</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Department</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Date</th>
                {(role === "ADMIN" || role === "HR") && (
                  <th className="px-4 py-3 text-left">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {myAttendance.map((attend) => (
                <tr
                  key={attend._id}
                  className="border-b last:border-none hover:bg-gray-50 transition "
                >
                  {/* Employee */}
                  <td className="px-4 py-3 flex items-center gap-3">
                    <img
                      src={authUser.user.Profile_url || "/default-avatar.png"}
                      alt="profile"
                      className="w-10 h-10 rounded-full border border-gray-200 object-cover"
                    />
                    <div>
                      <p className="font-semibold text-gray-800">
                        {authUser.user.FirstName} {authUser.user.LastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        ID: {authUser.user.EmployeeId}
                      </p>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="px-4 py-3">
                    <span className="bg-blue-100 text-blue-700 text-xs sm:text-sm px-2 py-1 rounded-full font-medium">
                      {authUser.user.Role}
                    </span>
                  </td>

                  {/* Department */}
                  <td className="px-4 py-3">
                    <span className="bg-purple-100 text-purple-700 text-xs sm:text-sm px-2 py-1 rounded-full font-medium">
                      {authUser.user.Department || "N/A"}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    {attend.status === "Present" ? (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                        Present
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                        {attend.status}
                      </span>
                    )}
                  </td>

                  {/* Last Updated */}
                  <td className="px-4 py-3 text-gray-500 text-sm sm:text-base">
                    {new Date(attend.date).toLocaleString()}
                    {}
                  </td>

                  {/* Actions */}
                  {(role === "ADMIN" || role === "HR") && (
                    <td className="px-4 py-3">
                      <button
                        style={{ cursor: "not-allowed" }}
                        className="px-3 py-1   bg-indigo-600  text-white ounded-md text-xs sm:text-sm hover:bg-indigo-700 transition"
                      >
                        Mark Attendance
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-400 text-sm sm:text-base mt-4 text-center">
          No attendance records found.
        </p>
      )}
    </div>
  );
};

export default Attendance;
