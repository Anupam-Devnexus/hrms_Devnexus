// useDailyupdate.js
import { create } from "zustand";
import axios from "axios";

const token = localStorage.getItem("hrmsAuthToken")

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const useDailyupdate = create((set, get) => ({
  list: null,
  loading: false,
  error: null,

  fetchUpdates: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axiosInstance.get(
        `${import.meta.env.VITE_BASE_URL}/daily-updates`
      );
      console.log(data);
      set({ list: data, loading: false });
    } catch (err) {
      set({ error: err.message || "Failed to fetch", loading: false });
    }
  },

  // NEW: delete update
  deleteUpdate: async (id) => {
    try {
      await axiosInstance.delete(`/daily-updates/${id}`);

      set((state) => ({
        list: {
          ...state.list,
          prevUpdates: state.list.prevUpdates.filter((u) => u._id !== id),
        },
      }));
    } catch (err) {
      console.error(err);
      throw err;
    }
  },
}));
