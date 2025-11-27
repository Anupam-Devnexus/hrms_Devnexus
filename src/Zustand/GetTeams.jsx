import { create } from "zustand";

export const useTeams = create((set) => ({
  loading: false,
  teamList: null, // null initially
  error: null,

  fetchTeams: async () => {
    const authUser = JSON.parse(localStorage.getItem("authUser"));
    const token = authUser?.accessToken;
    const userId = authUser?.user?._id;

    if (!token || !userId) {
      set({ error: "Please login again.", teamList: null, loading: false });
      return;
    }

    set({ loading: true, error: null });

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/team/joined-by/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch teams");

      const res = await response.json(); // { count, teams: [...] }
      set({ loading: false, teamList: res, error: null });
    } catch (error) {
      set({ loading: false, error: error.message, teamList: null });
    }
  },
}));
