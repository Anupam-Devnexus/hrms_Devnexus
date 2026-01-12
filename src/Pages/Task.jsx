import { useEffect, useState } from "react";
import { useTaskStore } from "../Zustand/GetTask";
import { Link, useNavigate } from "react-router-dom";
import { useAttendance } from "../Zustand/PersonalAttendance";
import { toast } from "react-toastify";
import axios from "axios";

const Task = () => {
  const { fetchTasks, tasks, loading, error } = useTaskStore();
  const { user } = useAttendance();
  const [deletingId, setDeletingId] = useState(null)
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks(user?._id);
    // console.log(tasks)
  }, [user]);

  const handleDelete = async (id) => {
    if (!id) {
      toast.error("id not passed")
      return
    }
    // console.log(id)
    setDeletingId(id)

    try {
      const { data } = await axios.delete(import.meta.env.VITE_BASE_URL + `/task/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      console.log(data)

      toast.success(data.message)

      fetchTasks(user?._id)

    } catch (error) {
      toast.error(data.message)
    } finally {
      setDeletingId(null)
    }
  }

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
            {tasks.map((task, index) => (
              <div
                key={task._id}
                className="bg-white p-4 justify-between rounded-lg shadow flex hover:shadow-md transition"
              >
                <div>

                  <div className="flex gap-2" >

                    <h2 className="text-lg font-semibold text-gray-700">
                      {task.title}
                    </h2>
                    -
                    {task.assignee.map((t, index) => <p key={index} className="text-gray-600">{t.FirstName + " " + t.LastName}</p>)}

                  </div>
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
                <div className="flex items-end gap-1  
                  flex-col" >
                  <Link className="text-blue-500 underline hover:no-underline" to={`update-task/${task._id}`}>Update</Link>
                  <button onClick={() => handleDelete(task._id)} style={{
                    padding: 0
                  }} className="text-red-500 underline hover:no-underline ">{deletingId == task._id ? 'Deleting...' : 'Delete'}</button>
                </div>
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
