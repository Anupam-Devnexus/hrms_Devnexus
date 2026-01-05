import { create } from "zustand";
import axios from "axios";

const API_URL = `${import.meta.env.VITE_BASE_URL}/holiday`;

// Helper to get token
const getAuthHeader = () => {
  try {
    const authUser = JSON.parse(localStorage.getItem("authUser"));
    return authUser?.accessToken
      ? { Authorization: `Bearer ${authUser.accessToken}` }
      : {};
  } catch {
    return {};
  }
};

// Normalize leave object safely
const normalizeLeave = (leave) => ({
  _id: leave?._id || "",
  date: leave?.date || "",
  title: leave?.title || "",
  description: leave?.description || "",
});

const useAllLeaves = create((set, get) => ({
  // ---------------- State ----------------
  leaves: [],
  loading: false,
  error: null,

  // ---------------- Get All Leaves ----------------
  getLeaves: async () => {
    set({ loading: true, error: null });
    try {
      const res = await axios.get(API_URL, { headers: getAuthHeader() });
      const list = Array.isArray(res.data?.data) ? res.data.data : [];
      set({ leaves: list.map(normalizeLeave), loading: false });
    } catch (err) {
      set({ error: err?.response?.data?.message || "Failed to fetch leaves", loading: false });
    }
  },

  // ---------------- Create Leave ----------------
  createLeave: async (payload) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.post(API_URL, payload, { headers: getAuthHeader() });
      const newLeave = normalizeLeave(res.data?.data);
      if (!newLeave._id) throw new Error("Invalid leave response");

      set({ leaves: [newLeave, ...get().leaves], loading: false });
      return true;
    } catch (err) {
      set({ error: err?.response?.data?.message || "Failed to create leave", loading: false });
      console.log( err?.response || "Failed to create leave")
      return false;
    }
  },

  // ---------------- Update Leave ----------------
  updateLeave: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      const res = await axios.patch(`${API_URL}/${id}`, payload, { headers: getAuthHeader() });
      const updatedLeave = normalizeLeave(res.data?.data);

      set({
        leaves: get().leaves.map((l) => (l._id === id ? updatedLeave : l)),
        loading: false,
      });
      return true;
    } catch (err) {
      set({
        error: err?.response?.data?.message || "Failed to update leave",
        loading: false,
      });
      return false;
    }
  },

  // ---------------- Delete Leave ----------------
  deleteLeave: async (id) => {
    set({ loading: true, error: null });
    try {
      await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
      set({ leaves: get().leaves.filter((l) => l._id !== id), loading: false });
      return true;
    } catch (err) {
      set({
        error: err?.response?.data?.message || "Failed to delete leave",
        loading: false,
      });
      return false;
    }
  },

  // ---------------- Utilities ----------------
  clearError: () => set({ error: null }),
}));

export default useAllLeaves;
