import { create } from "zustand";

export const useAttendance = create((set) => ({
  loading: false,
  allAttendance: [], // null initially
  myAttendance: [], // null initially
  attendanceByUser: {},
  error: null,

  fetchAttendance: async () => {
    const authUser = JSON.parse(localStorage.getItem("authUser"));
    const token = authUser?.accessToken;
    const userId = authUser?.user?._id;

    if (!token || !userId) {
      set({ error: "Please login again.", myAttendance: [], loading: false });
      return;
    }

    set({ loading: true, error: null });

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/attendance/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to get attendance");

      const res = await response.json();
      console.log("fetchattendance", res);
      set({ loading: false, myAttendance: res.records, error: null });
    } catch (error) {
      set({ loading: false, error: error.message, myAttendance: [] });
    }
  },

  fetchAllAttendance: async () => {
    const authUser = JSON.parse(localStorage.getItem("authUser"));
    const token = authUser?.accessToken;
    const userId = authUser?.user?._id;

    if (!token || !userId) {
      set({ error: "Please login again.", allAttendance: [], loading: false });
      return;
    }

    set({ loading: true, error: null });

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/attendance/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch teams");

      const res = await response.json();
      console.log("fetchAllattendance", res);

      set({
        loading: false,
        allAttendance: res.records,
        attendanceByUser: res.attendanceByUser,
        error: null,
      });
    } catch (error) {
      set({ loading: false, error: error.message, allAttendance: [] });
    }
  },
}));
