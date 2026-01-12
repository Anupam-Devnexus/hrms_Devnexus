import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../Zustand/GetAllData";
import { useAttendance } from "../Zustand/PersonalAttendance";
import MyAttendanceTable from "../Component/table/MyAttendanceTable";
import AttendanceTable from "../Component/table/AttendanceTable";
import { Loader } from "../Component/Loader";

// Loader

const Attendance = () => {
  const navigate = useNavigate();

  const {
    user,
    myAttendance,
    attendanceByUser,
    fetchAttendance,
    fetchAllAttendance,
  } = useAttendance();

  const { allData, fetchAllData, loading, error } = useUserStore();

  const [search, setSearch] = useState("");
  const [toggle, setToggle] = useState(false);

  const role = user?.Role?.toUpperCase();

  //  Correct effect
  useEffect(() => {
    if (!user || !role) return;


    if (role === "ADMIN" || role === "HR") {
      fetchAllAttendance();
      fetchAllData();
    } else {
      fetchAttendance();

    }
  }, [user, role, fetchAttendance, fetchAllAttendance, fetchAllData]);

  //  Flatten all users (ADMIN / HR only)
  const allUsers = useMemo(() => {
    if (!allData?.data) return [];
    return Object.values(allData.data).flat();
  }, [allData]);

  //  Filter only for ADMIN / HR
  const filteredUsers = useMemo(() => {
    if (role !== "ADMIN" && role !== "HR") return [];

    return allUsers.filter(
      (u) =>
        u.FirstName?.toLowerCase().includes(search.toLowerCase()) ||
        u.LastName?.toLowerCase().includes(search.toLowerCase()) ||
        u.EmployeeId?.toString().includes(search)
    );
  }, [allUsers, search, role]);

  if (loading) return <Loader />;
  if (error)
    return <div className="text-red-500 text-center py-6">{error}</div>;

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-indigo-600">
          📊 Attendance
        </h2>

        {(role === "ADMIN" || role === "HR") && (
          <div className="flex gap-2">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => setToggle((p) => !p)}
            >
              {!toggle ? "My Attendance" : "All Attendance"}
            </button>

            {!toggle && (
              <input
                type="text"
                placeholder="🔍 Search by name or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-4 py-2 w-64 rounded-lg border"
              />
            )}
          </div>
        )}
      </div>

      {/*  ADMIN / HR TABLE */}
      {(role === "ADMIN" || role === "HR") && !toggle && (
        filteredUsers.length ? (
          <AttendanceTable
            data={filteredUsers}
            attendanceByUser={attendanceByUser}
            role={role}
            navigate={navigate}
          />
        ) : (
          <Empty />
        )
      )}
      {(role === "ADMIN" || role === "HR") && toggle && (
        myAttendance.length ? (
          <MyAttendanceTable user={user} data={myAttendance} />
        ) : (
          <Empty />
        )
      )}


      {/*  EMPLOYEE TABLE */}
      {role === "EMPLOYEE" || role === "TL" && (
        myAttendance.length ? (
          <MyAttendanceTable user={user} data={myAttendance} />
        ) : (
          <Empty />
        )
      )}
    </div>
  );
};

const Empty = () => (
  <p className="text-gray-400 text-center py-10">
    No attendance records found.
  </p>
);

export default Attendance;
