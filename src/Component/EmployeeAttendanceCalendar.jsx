import { useMemo, useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  parseISO,
  addMonths,
  differenceInMonths,
  isWithinInterval,
  isAfter,
  isBefore,
  isSunday,
} from "date-fns";
import { FiChevronLeft, FiChevronRight, FiInfo } from "react-icons/fi";

/* ======================================================
   Employee Attendance Calendar (Production Ready)
====================================================== */

const EmployeeAttendanceCalendar = ({ joiningDate, leaves = [] }) => {
  const today = new Date();
  const joinDate = parseISO(joiningDate);

  /* ----------------------------------------------------
     Normalize & expand leaves
  ---------------------------------------------------- */
  const leaveData = useMemo(() => {
    const expandedDates = new Set();

    const intervals = leaves
      .filter((l) => l.status === "Approved")
      .map((l) => {
        const start = parseISO(l.from);
        const end = parseISO(l.to);
        const dates = eachDayOfInterval({ start, end });

        dates.forEach((d) =>
          expandedDates.add(format(d, "yyyy-MM-dd"))
        );

        return {
          id: l._id,
          type: l.leaveType,
          reason: l.reason,
          start,
          end,
          totalDays: dates.length,
          dates,
        };
      });

    return { intervals, expandedDates };
  }, [leaves]);

  /* ----------------------------------------------------
     Present days calculation
  ---------------------------------------------------- */
  const presentDays = useMemo(() => {
    let count = 0;
    let current = new Date(joinDate);

    while (current <= today) {
      const key = format(current, "yyyy-MM-dd");

      if (
        !isSunday(current) &&
        !leaveData.expandedDates.has(key)
      ) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }

    return count;
  }, [joinDate, leaveData]);

  /* ----------------------------------------------------
     Month carousel
  ---------------------------------------------------- */
  const months = useMemo(() => {
    const total = differenceInMonths(today, joinDate) + 1;
    return Array.from({ length: total }, (_, i) =>
      addMonths(startOfMonth(joinDate), i)
    );
  }, [joinDate]);

  const [monthIndex, setMonthIndex] = useState(months.length - 1);
  const currentMonth = months[monthIndex];

  const calendarDays = useMemo(() => {
    return eachDayOfInterval({
      start: startOfMonth(currentMonth),
      end: endOfMonth(currentMonth),
    });
  }, [currentMonth]);
const absentDays = useMemo(() => {
  return leaveData.intervals.reduce((count, leave) => {
    return (
      count +
      leave.dates.filter((d) => !isSunday(d)).length
    );
  }, 0);
}, [leaveData]);

  /* ======================================================
     UI
  ===================================================== */
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* ================= HEADER ================= */}
      <div className="bg-white rounded-2xl shadow p-6 flex flex-wrap justify-between gap-6">
        <div>
          <h2 className="text-xl font-semibold">
            Attendance Overview
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Joined on{" "}
            <span className="font-medium text-gray-700">
              {format(joinDate, "dd MMM yyyy")}
            </span>
          </p>
        </div>

        <div className="flex gap-4">
  <Stat label="Present Days" value={presentDays} color="green" />
  <Stat label="Absent Days" value={absentDays} color="red" />
  <Stat
    label="Leave Applications"
    value={leaveData.intervals.length}
    color="yellow"
  />
</div>

      </div>

      {/* ================= CALENDAR ================= */}
      <div className="bg-white rounded-2xl shadow p-6">
        {/* Month Controls */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() =>
              setMonthIndex((i) => Math.max(i - 1, 0))
            }
            disabled={monthIndex === 0}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
          >
            <FiChevronLeft />
          </button>

          <span className="font-medium text-gray-700">
            {format(currentMonth, "MMMM yyyy")}
          </span>

          <button
            onClick={() =>
              setMonthIndex((i) =>
                Math.min(i + 1, months.length - 1)
              )
            }
            disabled={monthIndex === months.length - 1}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-40"
          >
            <FiChevronRight />
          </button>
        </div>

        {/* Week Header */}
        <div className="grid grid-cols-7 text-center text-xs text-gray-500 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
            (d) => (
              <div key={d}>{d}</div>
            )
          )}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day) => {
            const key = format(day, "yyyy-MM-dd");
            const isLeave = leaveData.expandedDates.has(key);
            const isFuture = isAfter(day, today);
            const isBeforeJoin = isBefore(day, joinDate);

            let style =
              "bg-gray-50 text-gray-400 border-gray-200";

            if (!isFuture && !isBeforeJoin) {
              if (isLeave) {
                style =
                  "bg-red-100 text-red-700 border-red-300";
              } else if (!isSunday(day)) {
                style =
                  "bg-green-50 text-green-700 border-green-300";
              }
            }

            const leaveInfo = leaveData.intervals.find((l) =>
              isWithinInterval(day, l)
            );

            return (
              <div
                key={key}
                className={`relative h-20 rounded-xl border flex flex-col items-center justify-center ${style} group`}
              >
                <span className="font-semibold">
                  {format(day, "dd")}
                </span>

                {/* Tooltip */}
                {leaveInfo && (
                  <div className="absolute bottom-full mb-2 hidden group-hover:block z-20">
                    <div className="bg-gray-900 text-white text-xs rounded-lg p-3 w-52 shadow-lg">
                      <p className="font-semibold">
                        {leaveInfo.type}
                      </p>
                      <p className="opacity-80">
                        {leaveInfo.reason}
                      </p>
                      <p className="mt-1 text-[10px] opacity-60">
                        {leaveInfo.totalDays} day(s)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= LEAVE HISTORY ================= */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          Leave History <FiInfo className="text-gray-400" />
        </h3>

        {leaveData.intervals.length === 0 ? (
          <p className="text-sm text-gray-500">
            No leaves taken yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-left">From</th>
                  <th className="p-3 text-left">To</th>
                  <th className="p-3 text-left">Days</th>
                  <th className="p-3 text-left">Dates</th>
                </tr>
              </thead>
              <tbody>
                {leaveData.intervals.map((l) => (
                  <tr
                    key={l.id}
                    className="border-t hover:bg-gray-50 align-top"
                  >
                    <td className="p-3 font-medium">
                      {l.type}
                    </td>
                    <td className="p-3">
                      {format(l.start, "dd MMM yyyy")}
                    </td>
                    <td className="p-3">
                      {format(l.end, "dd MMM yyyy")}
                    </td>
                    <td className="p-3 font-semibold">
                      {l.totalDays}
                    </td>
                    <td className="p-3">
                      <div className="flex flex-wrap gap-1">
                        {l.dates.map((d) => (
                          <span
                            key={d}
                            className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700"
                          >
                            {format(d, "dd MMM")}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

/* ================= Reusable Stat ================= */
const Stat = ({ label, value, color }) => (
  <div
    className={`px-5 py-3 rounded-xl bg-${color}-100 text-${color}-700`}
  >
    <p className="text-xs">{label}</p>
    <p className="text-lg font-semibold">{value}</p>
  </div>
);

export default EmployeeAttendanceCalendar;
