// src/Component/RecentTasks.jsx
import React from "react";

const RecentTasks = ({ tasks = [] }) => {
  if (!tasks.length) {
    return (
      <div className="p-4 bg-gray-800 rounded-xl text-gray-300 text-sm">
        No recent tasks available.
      </div>
    );
  }

  // Show only the latest 5 tasks
  const recentTasks = tasks.slice(0, 5);

  return (
    <div className="bg-gray-800 rounded-xl shadow-md p-4">
      <h2 className="text-lg font-semibold text-gray-100 mb-3">
        Recent Tasks
      </h2>
      <ul className="space-y-3">
        {recentTasks.map((task) => (
          <li
            key={task._id}
            className="flex items-center justify-between p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
          >
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-100">
                {task.title}
              </span>
              <span className="text-xs text-gray-400">{task.status}</span>
            </div>
            <span className="text-xs text-gray-400">
              {new Date(task.createdAt).toLocaleDateString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentTasks;
