import { create } from "zustand";

export const useUserStore = create((set) => ({
  allData: { data: {} },
  loading: false,
  error: null,

  
  fetchAllData: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("https://hrms-backend-9qzj.onrender.com/api/user");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      set({ allData: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

 
  addUser: async (newUser) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("https://hrms-backend-9qzj.onrender.com/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (!res.ok) throw new Error("Failed to add user");
      const addedUser = await res.json();


      set((state) => ({
        allData: {
          ...state.allData,
          data: {
            ...state.allData.data,
            [addedUser.Role]: [
              ...(state.allData.data[addedUser.Role] || []),
              addedUser,
            ],
          },
        },
        loading: false,
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  // Delete a user (admin only)
  deleteUser: async (userId, role, currentUserRole) => {
    if (currentUserRole !== "ADMIN") {
      alert("Only admins can delete users!");
      return;
    }

    if (!window.confirm("⚠️ Are you sure you want to delete this user?")) return;

    set({ loading: true, error: null });
    try {
      const res = await fetch(
        `https://hrms-backend-9qzj.onrender.com/api/delete-user/${userId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete user");

      // Update local store
      set((state) => ({
        allData: {
          ...state.allData,
          data: {
            ...state.allData.data,
            [role]: state.allData.data[role]?.filter((u) => u._id !== userId) || [],
          },
        },
        loading: false,
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },
}));
