import { create } from "zustand";

export const useLeaveStore = create((set) => ({
  leaveList: [],
  loading: false,
  error: null,

  // -----------------------------
  // Fetch all leave requests
  // -----------------------------
  fetchLeave: async () => {
    try {
      set({ loading: true, error: null });

      const token = localStorage.getItem("hrmsAuthToken")
      // console.log(token)
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/leave/get-all-requests`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        const errMsg = await res.json();
        throw new Error(errMsg.message || "Failed to fetch leaves");
      }

      const data = await res.json();
      set({ leaveList: data.leaves || [], loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
      console.error("Fetch leaves error:", err);
    }
  },

  // -----------------------------
  // Update leave status (Admin only)
  // -----------------------------
  updateLeaveStatus: async (id, status) => {
    try {
      const token = localStorage.getItem("hrmsAuthToken")

      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/leave/update-request-status/${id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!res.ok) {
        const errMsg = await res.json();
        throw new Error(errMsg.message || "Failed to update leave");
      }

      const updated = await res.json();

      // ✅ update state locally after success
      set((state) => ({
        leaveList: state.leaveList.map((leave) =>
          leave._id === id ? { ...leave, status: updated.leave.status } : leave
        ),
      }));

      return updated.leave;
    } catch (err) {
      console.error("Update leave status error:", err);
      throw err;
    }
  },
}));
