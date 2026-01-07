// src/Zustand/useTeamStore.js
import { create } from "zustand";
import ax from "axios";
import { toast } from "react-toastify";
import { useAttendance } from "./PersonalAttendance";

const token = localStorage.getItem("hrmsAuthToken")

const api = ax.create({
  baseURL: import.meta.env.VITE_BASE_URL || "http://localhost:8909/api"

});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("hrmsAuthToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);



export const useTeamStore = create((set, get) => ({
  teamName: "",
  teamDescription: "",
  members: [],
  currentTeamId: null,
  teamList: null,
  loadingTeam: false,
  updatingTeam: false,
  deletingTeam: false,
  teamError: null,
  error: null,

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

  // CREATE TEAM -------------------------------------------------------
  createTeam: async () => {
    const { teamName, teamDescription, members } = get();

    // console.log("first");
    if (!teamName.trim() || teamDescription.trim() === "") {
      toast.error("Team name or description is required");
      return false;
    }
    if (!members || members.length === 0) {
      toast.error("Add atleast one member");

      return false;
    }

    try {
      set({ loadingTeam: true, teamError: null });

      const { data } = await api.post("/team", {
        name: teamName,
        description: teamDescription,
        members,
      });

      toast.success(data.message);
      console.log(data);
      get().resetTeam();

      set({
        loadingTeam: false,
        currentTeamId: data.team?._id || null,
      });

      return true;
    } catch (err) {
      console.error(err);
      toast.success(data.message);

      set({
        loadingTeam: false,
        teamError: err.response?.data?.message || "Failed to create team",
      });

      return false;
    }
  },

  // LOAD TEAM -------------------------------------------------------
  loadTeamById: async (teamId) => {
    try {
      set({ loadingTeam: true, teamError: null });

      const { data } = await api.get(`/team/${teamId}`);
      const team = data.team;

      // console.log(team);

      set({
        currentTeamId: team._id,
        teamName: team.name,
        teamDescription: team.description || "",
        members: team?.members?.map((mem) => mem._id) || [],
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

  // UPDATE TEAM ------------------------------------------------------
  updateTeam: async (teamIdFromComponent) => {
    const { currentTeamId, teamName, teamDescription, members } = get();
    const teamId = teamIdFromComponent || currentTeamId;

    if (!teamId) {
      set({ teamError: "No team selected to update" });
      return false;
    }

    try {
      set({ updatingTeam: true, teamError: null });

      await api.put(`/team/${teamId}`, {
        name: teamName,
        description: teamDescription,
        members,
      });

      toast.success("Team updated successfully");
      set({ updatingTeam: false });
      return true;
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update team");

      set({
        updatingTeam: false,
        teamError: err.response?.data?.message || "Failed to update team",
      });
      return false;
    }
  },

  // DELETE TEAM ------------------------------------------------------
  deleteTeam: async (teamIdFromComponent) => {
    // const { currentTeamId } = get();
    // const teamId = teamIdFromComponent || currentTeamId;

    if (!teamIdFromComponent) {
      set({ teamError: "No team selected to delete" });
      return false;
    }

    try {
      set({ deletingTeam: true, teamError: null });

      await api.delete(`/team/${teamIdFromComponent}`);

      set({ deletingTeam: false });
      get().fetchTeams();

      toast.success("Team deleted successfully");

      return true;
    } catch (err) {
      console.error(err);
      set({
        deletingTeam: false,
        teamError: err.response?.data?.message || "Failed to delete team",
      });
      toast.error(teamError);

      return false;
    }
  },

  // FETCH TEAM ------------------------------------------------------

  fetchTeams: async (userId) => {

    const token = localStorage.getItem("hrmsAuthToken")


    if (!token || !userId) {
      set({ error: "Please login again.", teamList: null, loadingTeam: false });
      return;
    }

    set({ loadingTeam: true, error: null });

    try {
      const { data } = await api.get(`/team/get-teams`);
      console.log(data);
      set({ loadingTeam: false, teamList: data.teams, error: null });
    } catch (error) {
      toast.error(error.message || "Failed to fetch teams.");
      set({ loadingTeam: false, error: error.message, teamList: null });
    }
  },
}));
