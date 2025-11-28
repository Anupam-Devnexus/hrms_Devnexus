import React, { useEffect, useState, useMemo } from "react";
import { useDailyupdate } from "../Zustand/GetDailyUpdates";
import { ArrowLeft, Calendar, Search, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Allupdates = () => {
  const { list, loading, error, fetchUpdates, deleteUpdate } = useDailyupdate();
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const navigate = useNavigate();

  const authUser = JSON.parse(localStorage.getItem("authUser"))?.user || {};
  const role = authUser?.Role?.toUpperCase() || "EMPLOYEE";

  useEffect(() => {
    fetchUpdates();
  }, [fetchUpdates]);

  const updates = list?.prevUpdates || [];

  const { sortedUpdates, todayCount } = useMemo(() => {
    const todayLocalStr = new Date().toLocaleDateString();

    const filtered = updates
      .map((u) => ({
        ...u,
        employee: u.employee || {},
      }))
      .filter((update) => {
        const lowerSearch = search.toLowerCase();

        const matchesSearch =
          update.employee.FirstName?.toLowerCase().includes(lowerSearch) ||
          update.title?.toLowerCase().includes(lowerSearch) ||
          update.description?.toLowerCase().includes(lowerSearch);

        const createdDate = update.createdAt
          ? new Date(update.createdAt)
          : null;

        const createdIsoDate = createdDate
          ? createdDate.toISOString().slice(0, 10)
          : "";

        const matchesDate = dateFilter ? createdIsoDate === dateFilter : true;

        return matchesSearch && matchesDate;
      })
      .map((update) => {
        const createdDate = update.createdAt
          ? new Date(update.createdAt)
          : null;
        const createdLocalStr = createdDate
          ? createdDate.toLocaleDateString()
          : "";
        const isToday = createdLocalStr === todayLocalStr;

        return {
          ...update,
          _createdLocalStr: createdLocalStr || "N/A",
          _isToday: isToday,
        };
      });

    const todays = filtered.filter((u) => u._isToday);
    const others = filtered.filter((u) => !u._isToday);

    const sortByCreatedDesc = (a, b) =>
      new Date(b.createdAt) - new Date(a.createdAt);

    const sortedToday = [...todays].sort(sortByCreatedDesc);
    const sortedOthers = [...others].sort(sortByCreatedDesc);

    return {
      sortedUpdates: [...sortedToday, ...sortedOthers],
      todayCount: todays.length,
    };
  }, [updates, search, dateFilter]);

  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this update? This cannot be undone.");
    if (!ok) return;

    try {
      await deleteUpdate(id);
      toast.success("Update deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete update");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate("/dashboard/daily-updates")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-100 transition text-sm"
          >
            <ArrowLeft size={18} className="text-gray-600" />
            <span className="font-medium text-gray-700">Back</span>
          </button>
          <h2 className="text-2xl font-bold ml-4 text-gray-800">
            All daily updates
          </h2>
        </div>

        <div className="flex flex-col items-start sm:items-end text-sm text-gray-600">
          <span className="font-medium">Role: {role}</span>
          <span className="text-xs text-gray-500">
            Today&apos;s updates: {todayCount}
          </span>
        </div>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-1/2">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search by title, description or employee name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
          />
        </div>

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
        />
      </div>

      {loading && (
        <div className="text-blue-600 text-sm bg-blue-50 border border-blue-200 p-3 rounded-lg mb-4">
          Loading updates...
        </div>
      )}

      {error && (
        <div className="text-red-600 text-sm bg-red-50 border border-red-200 p-3 rounded-lg mb-4">
          Error: {error}
        </div>
      )}

      {!loading && !error && sortedUpdates.length === 0 && (
        <p className="text-gray-500 text-center py-10 text-sm">
          No updates match your search or filter.
        </p>
      )}

      {/* Updates list */}
      <div className="grid gap-5">
        {sortedUpdates.map((update, index) => {
          const isToday = update._isToday;
          const taskDate = update._createdLocalStr;

          const employeeFirst = update.employee?.FirstName || "";
          const employeeLast = update.employee?.LastName || "";
          const employeeName =
            `${employeeFirst} ${employeeLast}`.trim() || "Unknown";

          // can delete? (owner OR admin) AND within 12 hours
          const createdAt = update.createdAt
            ? new Date(update.createdAt)
            : null;
          const twelveHoursMs = 12 * 60 * 60 * 1000;
          const within12h =
            createdAt &&
            new Date().getTime() - createdAt.getTime() <= twelveHoursMs;

          const isOwner =
            update.employee?._id &&
            authUser?._id &&
            update.employee._id === authUser._id;

          const canDelete = within12h && (isOwner || role === "ADMIN");

          return (
            <div
              key={update._id || index}
              className={`p-5 border border-gray-400 rounded-xl shadow-sm hover:shadow-md transition flex flex-col sm:flex-row sm:justify-between gap-4 ${
                isToday ? "bg-[#D9E9CF]" : "bg-white"
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-lg text-gray-800 break-words">
                      {update.title || "Untitled update"}{" "}
                      <span className="font-thin text-sm font-serif text-cyan-950">
                        ~ {employeeName}
                      </span>
                    </h3>
                  </div>

                  {canDelete && (
                    <button
                      onClick={() => handleDelete(update._id)}
                      className="flex-shrink-0 text-red-600 hover:text-red-800"
                      title="Delete update"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                <p className="text-gray-600 mt-2 text-sm break-words max-h-32 overflow-y-auto">
                  {update.description}
                </p>
                <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                  <Calendar size={16} />
                  <span>{isToday ? "Today" : taskDate}</span>
                </div>
              </div>

              {update?.secure_url && (
                <div className="sm:text-right">
                  <h4 className="font-semibold text-sm text-gray-800 mb-1">
                    Attachment
                  </h4>
                  <a
                    className="text-blue-800 underline text-sm break-all"
                    target="_blank"
                    rel="noreferrer"
                    href={update.secure_url}
                  >
                    Open
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Allupdates;
