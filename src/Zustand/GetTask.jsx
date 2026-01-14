import { create } from "zustand";
import { axiosInstance } from "../utils/axiosInstance";
import { toast } from "react-toastify";



export const useTaskStore = create((set) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async (userId) => {
    set({ loading: true, error: null });

    try {
      const token = localStorage.getItem("hrmsAuthToken");

      if (!userId || !token) {
        throw new Error("User not authenticated");
      }


      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/task/get-tasks`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch tasks");
      // console.log(res);
      const data = await res.json();
      // console.log(data);

      set({ tasks: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  fetchTaskList: async () => {
    set({ loading: true, error: null });

    try {
      const { data } = await axiosInstance.get(
        `/task/task-list`)

      set({ tasks: data.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
      toast.error(err.message)
      console.log(err)
    }
  },

  addTask: async (task) => {
    try {

    } catch (error) {
      console.log(error)
      throw new Error(error.message);
    }
  }
}
));
