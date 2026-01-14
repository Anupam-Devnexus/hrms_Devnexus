import axios from "axios";
import { toast } from "react-toastify";
import { create } from "zustand";

export const useUserStore = create((set) => ({
  allData: null,
  loading: false,
  error: null,
  stats: null,

  fetchAllData: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/user`
      );
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();

      // console.log("all emp", data);
      set({ allData: data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  fetchDashboardStats: async () => {
    try {
      const { data } = await axios.get(import.meta.env.VITE_BASE_URL + '/stats', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem("hrmsAuthToken")
        }
      })
      console.log(data.data)
      set({ stats: data.data })
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  },

  addUser: async (newUser) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/user`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        }
      );

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

    if (!window.confirm("⚠️ Are you sure you want to delete this user?"))
      return;

    set({ loading: true, error: null });
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/delete-user/${userId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete user");

      // Update local store
      set((state) => ({
        allData: {
          ...state.allData,
          data: {
            ...state.allData.data,
            [role]:
              state.allData.data[role]?.filter((u) => u._id !== userId) || [],
          },
        },
        loading: false,
      }));
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  }

}));
