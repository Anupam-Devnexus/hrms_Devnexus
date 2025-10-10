// Zustand store (NotificationAndOnlineUsers.js)
import { create } from "zustand";

const useSocketStore = create((set, get) => ({
  personalNotifications: [],
  generalNotifications: [],
  onlineUsers: new Set(),

  addPersonalNotification: (newNotifs) =>
    set((state) => {
      const existingIds = new Set(
        state.personalNotifications.map((n) => n._id)
      );
      const filtered = newNotifs.filter((n) => !existingIds.has(n._id));
      return {
        personalNotifications: [...filtered, ...state.personalNotifications],
      };
    }),

  addGeneralNotification: (data) => {
    const incoming = Array.isArray(data) ? data : [data];
    const existingIds = new Set(get().generalNotifications.map((n) => n._id));

    const newOnes = incoming.filter((n) => !existingIds.has(n._id));
    if (newOnes.length === 0) return;

    set((state) => ({
      generalNotifications: [...newOnes, ...state.generalNotifications],
    }));
  },

  addUserOnline: (userId) =>
    set((state) => ({
      onlineUsers: new Set([...state.onlineUsers, userId]),
    })),
}));

export default useSocketStore;
