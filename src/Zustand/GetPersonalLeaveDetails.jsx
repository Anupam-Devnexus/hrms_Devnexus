// leaveStore.js
import { create } from "zustand";
import axios from "axios";

export const useLeavePersonalDetails = create((set) => ({
  personalLeave: [],
  loading: false,
  error: null,

  // Fetch leave details
  fetchPersonalDetails: async () => {
    const token = localStorage.getItem("hrmsAuthToken")

    if (!token) {
      set({ error: "No token found", personalLeave: [] });
      return;
    }

    try {
      set({ loading: true, error: null });

      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/leave/get-all-requests`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // sending token in header
          },
        }
      );

      set({ personalLeave: res.data, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch data",
        loading: false,
      });
    }
  },
}));
