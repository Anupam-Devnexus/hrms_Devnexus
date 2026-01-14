import { create } from "zustand";
import { axiosInstance } from "../utils/axiosInstance";

export const useDailyupdate = create((set, get) => ({
  updates: [],          // ALWAYS array
  loading: false,
  error: null,

  // 🔹 POST DAILY UPDATE
  postDailyUpdate: async (formData) => {
    if (!formData) {
      toast.error("Update data missing");
      return;
    }

    set({ loading: true, error: null });

    try {
      const { data } = await axiosInstance.post(
        "/daily-updates",
        formData
      );

      if (data.success) {
        set((state) => ({
          updates: [data.update, ...state.updates],
          loading: false,
        }));
        toast.success("Daily update posted");
        return true;
      }
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to post update";
      set({ error: message, loading: false });
      toast.error(message);
      return false;
    }
  },

  // 🔹 FETCH UPDATES (BY TASK)
  fetchUpdates: async (taskId) => {
    if (!taskId) return;

    set({ loading: true, error: null });

    try {
      const { data } = await axiosInstance.get(
        `/daily-updates/task/${taskId}`
      );

      set({
        updates: data.updates || [],
        loading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch updates",
        loading: false,
      });
    }
  },


  // 🔹 DELETE UPDATE
  deleteUpdate: async (updateId) => {
    if (!updateId) return;

    try {
      await axiosInstance.delete(`/daily-updates/${updateId}`);

      set((state) => ({
        updates: state.updates.filter((u) => u._id !== updateId),
      }));

      toast.success("Update deleted");
    } catch (err) {
      toast.error("Failed to delete update");
      throw err;
    }
  },

  // 🔹 RESET (optional)
  resetUpdates: () => set({ updates: [], error: null }),
}));
