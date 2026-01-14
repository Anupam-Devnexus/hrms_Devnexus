import React, { useEffect, useMemo, useState } from "react";
import SearchBarComp from "../Component/SearchBarComp";
import { useUserStore } from "../Zustand/GetAllData";
import { useTaskStore } from "../Zustand/GetTask";
import { useTeamStore } from "../Zustand/useTeamStore";
import TaskCard from "../Component/Card/TaskCard";
import {
  FaUsers,
  FaDollarSign,
  FaCheckCircle,
  FaCalendar,
  FaCheckSquare,
  FaSun,
  FaClipboardList,
  FaBell,
  FaTasks,
} from "react-icons/fa";
import { useAttendance } from "../Zustand/PersonalAttendance";

// Icon mapping
const iconMap = {
  users: FaUsers,
  "dollar-sign": FaDollarSign,
  "check-circle": FaCheckCircle,
  calendar: FaCalendar,
  "check-square": FaCheckSquare,
  sun: FaSun,
  "clipboard-list": FaClipboardList,
  bell: FaBell,
  tasks: FaTasks,
};

// Color mapping
const colorMap = {
  blue: "from-blue-500/20 to-blue-500/5 text-blue-600",
  green: "from-green-500/20 to-green-500/5 text-green-600",
  yellow: "from-yellow-500/20 to-yellow-500/5 text-yellow-600",
  red: "from-red-500/20 to-red-500/5 text-red-600",
  purple: "from-purple-500/20 to-purple-500/5 text-purple-600",
};

// Loader Component
const Loader = () => (
  <div className="flex justify-center items-center py-20">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-500"></div>
  </div>
);

export default function Dashboard() {
  const { user } = useAttendance();

  const [loadingState, setLoadingState] = useState(true);

  const role = user?.Role;
  const userId = user?._id;

  const { allData,stats, fetchAllData, fetchDashboardStats } = useUserStore();
  const { tasks, fetchTasks } = useTaskStore();
  const { teamList, fetchTeams } = useTeamStore();
  // const [cardValue, setCardValue] = useState({
  //   appliedLeaves: 0,
  //   approvedleaves: 0,
  // });

  // useEffect(() => {
  //   if (!user) console.log("user not found")
  // }, [user])

  useEffect(() => {
    Promise.all([fetchAllData(), fetchTasks(userId), fetchTeams(), fetchDashboardStats()]).finally(() =>
      setLoadingState(false)
    );
  }, []);

  // Filter userData
  const userData = useMemo(() => {
    if (!allData?.data) return null;
    const roleArray = allData.data[role?.toUpperCase()] || [];
    return roleArray.find((user) => user._id === userId) || null;
  }, [allData, role, userId]);

  // Filter tasks based on role
  const filteredTasks = useMemo(() => {
    if (["ADMIN", "TL", "MANAGER"].includes(role?.toUpperCase())) {
      return tasks; // Elevated roles see all
    }
    return tasks?.filter((task) =>
      task.assignee?.some((a) => a._id === userId)
    );
  }, [tasks, role, userId]);

  // Stats

  // console.log(allData);

  const cardData = [
    {
      label: role == "ADMIN" ? "Leave Requests" : "Leaves Taken",
      value: userData?.Leaves?.length ?? 0,
      // value: 0,
      icon: "calendar",
      color: "blue",
      description: "Total leaves applied",
      // totalLeaveApplied: userData?.Leaves?.length ?? 0,
    },
    {
      label: "Tasks Assigned",
      value: filteredTasks?.length ?? 0,
      icon: "tasks",
      color: "green",
      description: "Tasks you need to complete",
    },
    {
      label: role === "EMPLOYEE" ? "Teams Joined" : "Active Teams",
      value:
        role?.toUpperCase() === "EMPLOYEE"
          ? userData?.JoinedTeams?.length ?? 0
          : teamList?.length ?? 0,
      icon: "users",
      color: "yellow",
      description:
        role?.toUpperCase() === "EMPLOYEE"
          ? "Teams you are in"
          : "Total teams in system",
    },
    {
      label: "Notifications",
      value: userData?.Notifications?.length ?? 0,
      icon: "bell",
      color: "red",
      description: "Unread notifications",
    },
  ];

  // Task breakdown
  const taskStats = useMemo(() => {
    const statusMap = { todo: 0, inprogress: 0, done: 0 };
    filteredTasks?.forEach((task) => {
      const st = task.status?.toLowerCase();
      if (statusMap[st] !== undefined) statusMap[st]++;
    });
    return statusMap;
  }, [filteredTasks]);

  if (loadingState || !userData) return <Loader />;

  return (
    <div className="flex flex-col gap-6 px-4 mb-2 bg-gray-100 min-h-screen">
      {/* Search Bar */}
      <SearchBarComp />

      {/* User Info */}
      <div className="flex flex-col sm:flex-row items-center gap-6 p-5 bg-white rounded-3xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
        <img
          draggable={false}
          src={userData.Profile_url || "/default-avatar.png"}
          alt="Profile"
          className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border-4 border-indigo-500 shadow-xl object-cover"
        />
        <div className="flex flex-col">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
            {userData.FirstName} {userData.LastName}
          </h2>
          <i className="text-md sm:text-lg text-indigo-600 font-medium">
            {userData.Designation}
          </i>
          <p className="text-sm sm:text-base text-gray-500">
            {userData.Department}
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cardData.map((card, index) => {
          const Icon = iconMap[card.icon] || FaClipboardList;
          const colorClass =
            colorMap[card.color] ||
            "from-gray-500/20 to-gray-500/5 text-gray-600";

          return (
            <div
              key={index}
              className={`relative rounded-2xl p-5 shadow-md bg-gradient-to-br ${colorClass} backdrop-blur-md border border-gray-100 
              hover:shadow-2xl hover:scale-105 transition-transform duration-300`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-medium text-gray-600">
                    {card.label}
                  </h3>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-800">
                    {card.value}
                  </p>
                </div>
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white shadow-inner">
                  <Icon className="text-2xl sm:text-3xl" />
                </div>
              </div>
              <p className="mt-4 text-xs sm:text-sm text-gray-500 leading-relaxed">
                {card.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Task Status Overview */}
      <div className="bg-white p-5 rounded-3xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">
          Task Overview
        </h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xl sm:text-2xl font-bold text-blue-600">
              {taskStats.todo}
            </p>
            <p className="text-sm sm:text-base text-gray-500">To Do</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-yellow-600">
              {taskStats.inprogress}
            </p>
            <p className="text-sm sm:text-base text-gray-500">In Progress</p>
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-bold text-green-600">
              {taskStats.done}
            </p>
            <p className="text-sm sm:text-base text-gray-500">Completed</p>
          </div>
        </div>
      </div>

      {/* Tasks */}
      <div className="mt-6">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-4">
          {["ADMIN", "TL", "MANAGER"].includes(role?.toUpperCase())
            ? "All Tasks"
            : "Your Tasks"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks && filteredTasks.length > 0 ? (
            filteredTasks.map((task) => <TaskCard key={task._id} task={task} />)
          ) : (
            <p className="text-gray-500 italic">No tasks assigned yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
