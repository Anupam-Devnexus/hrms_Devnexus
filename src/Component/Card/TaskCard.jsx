import React from "react";
import { format } from "date-fns";
import { Clock, User, Calendar, Flag, ClipboardList } from "lucide-react";

const TaskCard = ({ task }) => {
  const {
    title,
    description,
    assignee,
    assigner,
    startDate,
    dueDate,
    priority,
    status,
  } = task;

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-600";
      case "medium":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-green-100 text-green-600";
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "in-progress":
        return "bg-blue-100 text-blue-600";
      case "done":
        return "bg-green-100 text-green-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition">
      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center gap-2">
        <ClipboardList size={20} className="text-indigo-500" />
        {title}
      </h2>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4">{description}</p>

      {/* Dates */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar size={16} className="text-indigo-500" />
          Start: {format(new Date(startDate), "dd MMM, yyyy")}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Clock size={16} className="text-red-500" />
          Due: {format(new Date(dueDate), "dd MMM, yyyy")}
        </div>
      </div>

      {/* People */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <User size={16} className="text-blue-500" />
          <span>
            <strong>Assignee:</strong> {assignee[0]?.FirstName}{" "}
            {assignee[0]?.LastName}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <User size={16} className="text-green-500" />
          <span>
            <strong>Assigner:</strong> {assigner?.FirstName} {assigner?.LastName}
          </span>
        </div>
      </div>

      {/* Labels */}
      <div className="flex gap-2">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
            priority
          )}`}
        >
          <Flag size={14} className="inline mr-1" />
          {priority}
        </span>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
            status
          )}`}
        >
          {status}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;
