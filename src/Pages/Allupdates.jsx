import React, { useEffect, useState } from "react";
import { useDailyupdate } from "../Zustand/GetDailyUpdates";
import { ArrowLeft, Calendar, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Allupdates = ({ onBack }) => {
  const { list, loading, error, fetchUpdates } = useDailyupdate();
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
const navigate = useNavigate();
  useEffect(() => {
    fetchUpdates();
  }, []);

  const updates = list?.prevUpdates || [];

  // Filtering logic
  const filteredUpdates = updates.filter((update) => {
    const matchesSearch =
      update.title?.toLowerCase().includes(search.toLowerCase()) ||
      update.description?.toLowerCase().includes(search.toLowerCase());

    const matchesDate = dateFilter
      ? new Date(update.createdAt).toISOString().slice(0, 10) === dateFilter
      : true;

    return matchesSearch && matchesDate;
  });

  return (
    <div className="p-6 max-w-5xl mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={()=>  navigate('/dashboard/daily-updates')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 shadow-sm hover:bg-gray-100 transition"
        >
          <ArrowLeft size={18} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Back</span>
        </button>
        <h2 className="text-2xl font-bold ml-6 text-gray-800">
          All Daily Updates
        </h2>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        {/* Search */}
        <div className="relative w-full sm:w-1/2">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search updates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
        </div>

        {/* Date filter */}
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>

      {/* States */}
      {loading && (
        <div className="text-blue-600 font-medium bg-blue-50 border border-blue-200 p-3 rounded-lg">
          Loading updates...
        </div>
      )}

      {error && (
        <div className="text-red-600 font-semibold bg-red-50 border border-red-200 p-3 rounded-lg">
          Error: {error}
        </div>
      )}

      {!loading && !error && filteredUpdates.length === 0 && (
        <p className="text-gray-500 text-center py-10">
          No updates match your search or filter.
        </p>
      )}

      {/* Updates List */}
      <div className="grid gap-5">
        {filteredUpdates.map((update, index) => (
          <div
            key={update._id || index}
            className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition"
          >
            <h3 className="font-semibold text-lg text-gray-800">
              {update.title || "Untitled Update"}
            </h3>
            <p className="text-gray-600 mt-2">{update.description}</p>
            <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
              <Calendar size={16} />
              {new Date(update.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Allupdates;
