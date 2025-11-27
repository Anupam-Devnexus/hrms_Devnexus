import { create } from "zustand";

export const usePolicy = create((set) => ({
    policyList: [],
    error: null,
    loading: false,

    fetchPolicy: async () => {
        try {
            set({ loading: true, error: null })
            const resp = await fetch(
              `${import.meta.env.VITE_BASE_URL}/policy/get-policy`
            );
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