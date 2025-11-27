import { create } from "zustand";

export const useHistory = create((set) => ({
    historyList: [],
    loading: false,
    error: null,

    fetchHistory: async () => {

        const token = JSON.parse(localStorage.getItem("authUser")).accessToken

        try {
            set({ loading: true, error: null })
            const res = await fetch(
              `${import.meta.env.VITE_BASE_URL}/payment`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );
            if (!res.ok) {
                console.log("error in respo", res)
            }
            const data = await res.json();
            set({ loading: false, historyList: data.data })
        } catch (error) {
            console.log("Error in handling history", error)
        }
    }
}))