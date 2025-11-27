import React, { useEffect } from "react";
import { useTaskStore } from "../Zustand/GetTask";
import { useNavigate } from "react-router-dom";

const Task = () => {
  const { fetchTasks, tasks, loading, error } = useTaskStore();
  const navigate = useNavigate();
  useEffect(() => {
    fetchTasks();
  }, []);
 

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-6">
      <div className="max-w-5xl mx-auto">

        <section className="flex items-center justify-between">

          <h1 className="text-2xl font-bold mb-6 text-gray-800">My Tasks</h1>
          <button
            onClick={() => navigate('/dashboard/add-task')}
            className="px-3 py-1 bg-blue-500 text-white font-semibold">
            Add Task
          </button>
        </section>


        {/* Loading */}
        {loading && (
          <p className="text-blue-600 text-center font-medium">Loading tasks...</p>
        )}

        {/* Error */}
        {error && (
          <p className="text-red-600 text-center font-medium">
            ❌ {error}
          </p>
        )}

        {/* Task List */}
        {!loading && !error && tasks.length > 0 ? (
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
              >
                <h2 className="text-lg font-semibold text-gray-700">
                  {task.title}
                </h2>
                <p className="text-gray-600">{task.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                  📅 Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
                <p
                  className={`mt-2 font-medium ${task.status === "Completed"
                    ? "text-green-600"
                    : "text-yellow-600"
                    }`}
                >
                  {task.status}
                </p>
              </div>
            ))}
          </div>
        ) : (
          !loading &&
          !error && (
            <p className="text-gray-500 text-center">No tasks available.</p>
          )
        )}
      </div>
    </div>
  );
};

export default Task;
