import { create } from "zustand";

export const useTeamStore = create((set, get) => ({
  selectedTeam: [],
  teamName: "",
  teamDescription: "",
  showMyTeam: false,

  toggleMember: (id) => {
    const { selectedTeam } = get();
    set({
      selectedTeam: selectedTeam.includes(id)
        ? selectedTeam.filter((empId) => empId !== id)
        : [...selectedTeam, id],
    });
  },

  isMember: (id) => get().selectedTeam.includes(id),

  removeMember: (id) =>
    set((state) => ({
      selectedTeam: state.selectedTeam.filter((empId) => empId !== id),
    })),

  resetTeam: () => set({ selectedTeam: [], teamName: "", teamDescription: "" }),

  toggleShowMyTeam: () =>
    set((state) => ({ showMyTeam: !state.showMyTeam })),

  setTeamName: (name) => set({ teamName: name }),
  setTeamDescription: (desc) => set({ teamDescription: desc }),

  saveTeam: async () => {
    const { selectedTeam, teamName, teamDescription } = get();
    if (!teamName.trim()) {
      alert("Please enter a team name.");
      return;
    }
    const token = JSON.parse(localStorage.getItem("authUser")).accessToken;
    const id = JSON.parse(localStorage.getItem("authUser")).user._id;
    console.log(token)
    try {
      const response = await fetch(
        "https://hrms-backend-9qzj.onrender.com/api/team/create-team",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: teamName,
            description: teamDescription,
            members: selectedTeam,
            lead: id,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to save team");

      console.log(response)

      const data = await response.json();
      console.log("✅ Team saved:", data);
      alert(`✅ Team "${teamName}" created with ${selectedTeam.length} members`);
      set({ selectedTeam: [], teamName: "", teamDescription: "" });
    } catch (error) {
      console.error("Save team error:", error);
      alert("❌ Failed to save team. Try again.");
    }
  },
}));
