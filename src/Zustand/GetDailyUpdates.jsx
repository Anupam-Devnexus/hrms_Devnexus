import { create } from "zustand";

export const useDailyupdate = create((set) => ({
  list: [],
  loading: false,
  error: null,

  fetchUpdates: async () => {
    try {
      const storedUser = localStorage.getItem("authUser");
      if (!storedUser) {
        throw new Error("User not logged in");
      }

      const token = JSON.parse(storedUser)?.accessToken;
      if (!token) {
        throw new Error("Token not found");
      }

      set({ loading: true, error: null });

      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/daily-updates`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const data = await response.json();

      set({ loading: false, list: data });
    } catch (error) {
      console.error("Error fetching updates:", error);
      set({ loading: false, error: error.message });
    }
  },
}));
