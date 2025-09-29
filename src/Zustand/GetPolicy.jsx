import { create } from "zustand";

export const usePolicy = create((set) => ({
    policyList: [],
    error: null,
    loading: false,

    fetchPolicy: async () => {
        try {
            set({ loading: true, error: null })
            const resp = await fetch("https://hrms-backend-9qzj.onrender.com/api/policy/get-policy")
            if (!resp.ok) {
                console.log("error in res", resp)
            }
            const data = await resp.json()
            set({ policyList: data, loading: false, error: null })

        } catch (error) {
            console.log("Error in Get policy", error)
        }
    }
}))