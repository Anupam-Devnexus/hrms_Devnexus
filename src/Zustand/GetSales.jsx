import { create } from "zustand";

export const useSalesStore = create((set) => ({
    salesList: [],
    error: null,
    loading: false,

    fetchSales: async () => {
        const token = JSON.parse(localStorage.getItem("authUser")).accessToken;
        set({ loading: true, error: null })
        try {
            const data = await fetch(
              "https://hrms-backend-9qzj.onrender.com/api/sales/",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (!data.ok) {
                console.log("respone is not okay")
            }
            const res = await data.json();
            set({ loading: false, salesList: res })

        } catch (error) {
            console.log(error)
        }
    }
}))