import { create } from "zustand";

// export const useNotificationsAndOnlineStore = create((set) => ({
//   onlineUsers: [],

//   addOnlineUser: async (userId) => {
//     set({ onlineUsers: afn });
//   },

//   addUser: async (newUser) => {
//     set({ loading: true, error: null });
//     try {
//       const res = await fetch(
//         "https://hrms-backend-9qzj.onrender.com/api/user",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(newUser),
//         }
//       );

//       if (!res.ok) throw new Error("Failed to add user");
//       const addedUser = await res.json();

//       set((state) => ({
//         allData: {
//           ...state.allData,
//           data: {
//             ...state.allData.data,
//             [addedUser.Role]: [
//               ...(state.allData.data[addedUser.Role] || []),
//               addedUser,
//             ],
//           },
//         },
//         loading: false,
//       }));
//     } catch (err) {
//       set({ error: err.message, loading: false });
//     }
//   },

//   // Delete a user (admin only)
//   deleteUser: async (userId, role, currentUserRole) => {
//     if (currentUserRole !== "ADMIN") {
//       alert("Only admins can delete users!");
//       return;
//     }

//     if (!window.confirm("⚠️ Are you sure you want to delete this user?"))
//       return;

//     set({ loading: true, error: null });
//     try {
//       const res = await fetch(
//         `https://hrms-backend-9qzj.onrender.com/api/delete-user/${userId}`,
//         { method: "DELETE" }
//       );
//       if (!res.ok) throw new Error("Failed to delete user");

//       // Update local store
//       set((state) => ({
//         allData: {
//           ...state.allData,
//           data: {
//             ...state.allData.data,
//             [role]:
//               state.allData.data[role]?.filter((u) => u._id !== userId) || [],
//           },
//         },
//         loading: false,
//       }));
//     } catch (err) {
//       set({ error: err.message, loading: false });
//     }
//   },
// }));

const useSocketStore = create((set) => ({
  onlineUsers: [],

  personalNotifications: [],

  generalNotifications: [],

  toggleState: false,

  // -------------------------
  // 2. ACTIONS
  // -------------------------

  /**
   * Updates the list of currently online user IDs.
   * This is typically called when the server sends a full list update.
   * @param {string[]} newOnlineUsers - An array of user IDs.
   */
  setOnlineUsers: (newOnlineUsers) =>
    set({
      onlineUsers: newOnlineUsers,
    }),

  /**
   * Adds a new user ID to the online list.
   * This is called when a single user comes online.
   * @param {string} userId - The ID of the user who just came online.
   */
  addUserOnline: (userId) =>
    set((state) => {
      if (state.onlineUsers.includes(userId)) return state;
      return {
        onlineUsers: [...state.onlineUsers, userId],
      };
    }),

  /**
   * Removes a user ID from the online list.
   * This is called when a single user goes offline.
   * @param {string} userId - The ID of the user who just went offline.
   */
  removeUserOnline: (userId) =>
    set((state) => ({
      onlineUsers: state.onlineUsers.filter((id) => id !== userId),
    })),

  /**
   * Adds a new notification to the list.
   * @param {object} notification - The notification object (e.g., {title, message}).
   */
  addPersonalNotification: (notification) =>
    set((state) => ({
      // Add the new notification to the front of the list
      notifications: [...notification, ...state.notifications],
    })),

  addGeneralNotification: (notification) =>
    set((state) => ({
      // Add the new notification to the front of the list
      notifications: [...notification, ...state.notifications],
    })),

  /**
   * Toggles the state to force a re-render of components listening to this state.
   */
  toggle: () =>
    set((state) => ({
      toggleState: !state.toggleState,
    })),

  /**
   * Clears all state (useful on logout).
   */
  clearState: () =>
    set({
      onlineUsers: [],
      notifications: [],
      toggleState: false,
    }),
}));

export default useSocketStore;
