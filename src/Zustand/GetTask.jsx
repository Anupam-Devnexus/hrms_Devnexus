import { create } from "zustand";

export const useTaskStore = create((set) => ({
    tasks: [],
    loading: false,
    error: null,

    fetchTasks: async () => {
        set({ loading: true, error: null });

        try {
            const authUser = localStorage.getItem("authUser");
            const parsedUser = authUser ? JSON.parse(authUser) : null;
            const userId = parsedUser?.user?._id;
            const token = parsedUser?.accessToken;
            // console.log(token, userId)
            if (!userId || !token) {
                throw new Error("User not authenticated");
            }


            const res = await fetch(
              `${import.meta.env.VITE_BASE_URL}/task/get-tasks`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );
            if (!res.ok) throw new Error("Failed to fetch tasks");
            // console.log(res);
            const data = await res.json();
            // console.log(data);

            set({ tasks: data, loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },
}));
