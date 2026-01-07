import axios from "axios";
import { toast } from "react-toastify";
import { create } from "zustand";

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,

})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("hrmsAuthToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const useAttendance = create((set, get) => ({
  loading: false,
  allAttendance: [], // null initially
  myAttendance: [], // null initially
  attendanceByUser: {},
  error: null,
  user: null,

  fetchUser: async (token) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/checkAuth`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );


      if (!response.ok) throw new Error("Failed to fetch user");

      const data = await response.json();

      if (data.success) {
        set({ user: data.user });
        localStorage.setItem("hrmsAuthToken", data.accessToken);
      }

    } catch (error) {
      toast.error("Session expired, please login again");
      // localStorage.removeItem("hrmsAuthToken");
      console.log(error)
    }
  },

  removeUser: () => {
    set({ user: null });
    localStorage.removeItem("hrmsAuthToken");
  },

  setUser: (user, token) => {
    set({ user });
    localStorage.setItem("hrmsAuthToken", token);

  },

  fetchAttendance: async () => {

    const token = localStorage.getItem("hrmsAuthToken")
    const userId = get()?.user?._id;

    if (!token || !userId) {
      set({ error: "Please login again.", myAttendance: [], loading: false });
      return;
    }

    set({ loading: true, error: null });

    try {
      const { data } = await api.get(
        `/attendance/${userId}`
      );

      if (!data.success) throw new Error("Failed to get attendance");


      console.log("fetchattendance", data);
      set({ loading: false, myAttendance: data.records, error: null });
    } catch (error) {
      set({ loading: false, error: error.message, myAttendance: [] });
    }
  },

  fetchAllAttendance: async () => {
    const token = localStorage.getItem("hrmsAuthToken")

    const userId = get().user?._id;

    if (!token || !userId) {
      set({ error: "Please login again.", allAttendance: [], loading: false });
      return;
    }

    set({ loading: true, error: null });

    try {
      const { data } = await api.get(
        "/attendance/"

      );

      if (!data.success) throw new Error("Failed to fetch teams");

      console.log("fetchAllattendance", data);

      set({
        loading: false,
        allAttendance: data.records,
        attendanceByUser: data.attendanceByUser,
        error: null,
      });
    } catch (error) {
      set({ loading: false, error: error.message, allAttendance: [] });
    }
  },
}));
