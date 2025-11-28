// src/Zustand/useTeamStore.js
import { create } from "zustand";
import axios from "axios";

export const useTeamStore = create((set, get) => ({
  teamName: "",
  teamDescription: "",
  members: [], // array of employee ids
  currentTeamId: null,

  loadingTeam: false,
  updatingTeam: false,
  deletingTeam: false,
  teamError: null,

  setTeamName: (name) => set({ teamName: name }),
  setTeamDescription: (desc) => set({ teamDescription: desc }),

  isMember: (empId) => get().members.includes(empId),

  toggleMember: (empId) =>
    set((state) =>
      state.members.includes(empId)
        ? { members: state.members.filter((id) => id !== empId) }
        : { members: [...state.members, empId] }
    ),

  resetTeam: () =>
    set({
      teamName: "",
      teamDescription: "",
      members: [],
      currentTeamId: null,
      teamError: null,
    }),

  // 🔹 Load team for update form
  loadTeamById: async (teamId) => {
    try {
      set({ loadingTeam: true, teamError: null });
      const res = await axios.get(`/api/teams/${teamId}`);
      const team = res.data.data; // adjust to your API response shape

      set({
        currentTeamId: team._id,
        teamName: team.name,
        teamDescription: team.description || "",
        members: team.members || [],
        loadingTeam: false,
      });
    } catch (err) {
      console.error(err);
      set({
        loadingTeam: false,
        teamError: err.response?.data?.message || "Failed to load team",
      });
    }
  },

  // 🔹 Update existing team
  updateTeam: async (teamIdFromComponent) => {
    const { currentTeamId, teamName, teamDescription, members } = get();
    const teamId = teamIdFromComponent || currentTeamId;

    if (!teamId) {
      set({ teamError: "No team selected to update" });
      return false;
    }

    try {
      set({ updatingTeam: true, teamError: null });

      await axios.put(`/api/teams/${teamId}`, {
        name: teamName,
        description: teamDescription,
        members,
      });

      set({ updatingTeam: false });
      return true;
    } catch (err) {
      console.error(err);
      set({
        updatingTeam: false,
        teamError: err.response?.data?.message || "Failed to update team",
      });
      return false;
    }
  },

  // 🔹 Delete team
  deleteTeam: async (teamIdFromComponent) => {
    const { currentTeamId } = get();
    const teamId = teamIdFromComponent || currentTeamId;

    if (!teamId) {
      set({ teamError: "No team selected to delete" });
      return false;
    }

    try {
      set({ deletingTeam: true, teamError: null });

      await axios.delete(`/api/teams/${teamId}`);

      set({ deletingTeam: false });
      get().resetTeam();
      return true;
    } catch (err) {
      console.error(err);
      set({
        deletingTeam: false,
        teamError: err.response?.data?.message || "Failed to delete team",
      });
      return false;
    }
  },
}));
