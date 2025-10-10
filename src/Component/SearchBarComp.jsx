import React, { useState, useEffect, useRef } from "react";
import { FaBell, FaSearch } from "react-icons/fa";
import { FaRegBell } from "react-icons/fa";
import { BsBell } from "react-icons/bs";
import { CiSettings } from "react-icons/ci";
import {
  Home,
  User,
  ClipboardList,
  CheckSquare,
  FileText,
  Users,
} from "lucide-react";
import { data, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import useSocketStore from "../Zustand/NotificationAndOnlineUsers.jsx";

const SearchBarComp = () => {
  const navigate = useNavigate();
  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const { Role, _id } = authUser.user;

  const { generalNotifications } = useSocketStore.getState();

  const [menuItems, setMenuItems] = useState([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const notificationRef = useRef();

  const settingsRef = useRef();

  // Menu configuration
  const menuConfig = {
    common: [
      { label: "Dashboard", icon: <Home size={18} />, path: "/dashboard" },
      {
        label: "Profile",
        icon: <User size={18} />,
        path: "/dashboard/profile",
      },
      {
        label: "Attendance",
        icon: <ClipboardList size={18} />,
        path: "/dashboard/attendance",
      },
      {
        label: "Leaves",
        icon: <CheckSquare size={18} />,
        path: "/dashboard/leaves",
      },
      {
        label: "Tasks",
        icon: <ClipboardList size={18} />,
        path: "/dashboard/tasks",
      },
      {
        label: "Notifications",
        icon: <FaBell size={18} />,
        path: "/dashboard/notifications",
      },
      {
        label: "Daily Updates",
        icon: <FileText size={18} />,
        path: "/dashboard/daily-updates",
      },
    ],
    tl: [
      {
        label: "Team",
        icon: <Users size={18} />,
        children: [
          { label: "View Team", path: "/team" },
          { label: "Create Team", path: "/create-team" },
        ],
      },
    ],
    hr: [
      {
        label: "HR Panel",
        icon: <Users size={18} />,
        children: [
          { label: "User Management", path: "/user-management" },
          { label: "Mark Attendance", path: "/mark-attendance" },
          { label: "Policies", path: "/policies" },
          { label: "Leaves Approval", path: "/leaves-approval" },
          { label: "Administration", path: "/administration" },
        ],
      },
    ],
    admin: [
      {
        label: "Admin Panel",
        icon: <CiSettings size={18} />,
        children: [
          { label: "User Management", path: "/dashboard/user-management" },
          { label: "Attendance", path: "/dashboard/attendance-admin" },
          { label: "Policies", path: "/dashboard/policies" },
          { label: "Leaves", path: "/dashboard/leaves-admin" },
          { label: "Add User", path: "/dashboard/add-user" },
          { label: "Sales", path: "/dashboard/sales" },
          { label: "Administration", path: "/dashboard/administration" },
        ],
      },
    ],
  };

  // Initialize menu based on role
  useEffect(() => {
    const roleMenus = menuConfig[Role] || [];
    setMenuItems([...menuConfig.common, ...roleMenus]);
  }, [Role]);

  // Search filter
  useEffect(() => {
    if (!query) return setResults([]);
    const filterItems = (items) =>
      items
        .map((item) => {
          if (item.children) {
            const filteredChildren = filterItems(item.children);
            if (filteredChildren.length > 0)
              return { ...item, children: filteredChildren };
          }
          if (item.label.toLowerCase().includes(query.toLowerCase()))
            return item;
          return null;
        })
        .filter(Boolean);
    setResults(filterItems(menuItems));
  }, [query, menuItems]);

  // Handle navigation
  const handleNavigate = (path) => {
    navigate(path);
    setQuery("");
  };

  // Recursive rendering for search results
  const renderResults = (items) =>
    items.map((item, index) => (
      <div
        key={index}
        className="px-3 py-2 hover:bg-blue-50 flex items-center gap-2 cursor-pointer rounded-md transition"
        onClick={() => item.path && handleNavigate(item.path)}
      >
        {item.icon && <span className="text-blue-500">{item.icon}</span>}
        <span className="text-gray-700">{item.label}</span>
        {item.children && (
          <div className="ml-4">{renderResults(item.children)}</div>
        )}
      </div>
    ));

  // Handle outside clicks for dropdowns
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      )
        setShowNotifications(false);
      if (settingsRef.current && !settingsRef.current.contains(e.target))
        setShowSettings(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    console.log("searchbar general notification ", generalNotifications);
  }, [generalNotifications]);

  // Socket.IO notifications
  // useEffect(() => {
  //   if (!_id) return;

  //   const handleGeneralNotification = (data) => {
  //     console.log(" Notification received:", data);
  //     if (Array.isArray(data)) {
  //       const toastDuration = 4000;

  //       data.forEach((item, index) => {
  //         setTimeout(() => {
  //           toast.info(item.title);
  //         }, index * toastDuration);
  //       });
  //     }

  //     addGeneralNotification(data);
  //   };

  //   const handlePersonalNotification = (data) => {
  //     console.log("Personal Notification received:", data);

  //     if (Array.isArray(data)) {
  //       const toastDuration = 4000;

  //       data.forEach((item, index) => {
  //         setTimeout(() => {
  //           toast.info(item.title);
  //         }, index * toastDuration);
  //       });
  //     }

  //     addPersonalNotification(data);
  //   };

  //   const handleUserOnline = (data) => {
  //     if (data.userId === _id) return;

  //     addUserOnline(data.userId);

  //     toast.info(`${data.userId}   is online now`);
  //     // toast.info(
  //     //   `${data.userDetail.FirstName} ${data.userDetail.LastName} is online now`
  //     // );

  //     console.log(`${data.userId} is online now`);
  //   };

  //   socket.emit("register", {
  //     userId: _id,
  //     Role,
  //   }); // join user room for targeted notifications

  //   // socket.on(_id, handlePersonalNotification);

  //   socket.on("pendingNotifications", handlePersonalNotification);

  //   socket.on("notification", handleGeneralNotification);

  //   socket.on("userOnline", handleUserOnline);

  //   // setToggleState(!toggleState);

  //   return () => {
  //     socket.off("notification", handleGeneralNotification);
  //     socket.off("pendingNotifications", handlePersonalNotification);
  //     // socket.off(_id, handleGeneralNotification);
  //     socket.off("userOnline", handleUserOnline);
  //   };
  // }, [_id]);

  return (
    <div className="flex items-center justify-between w-full px-4 gap-3 py-2 bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Search */}
      <div className="relative flex-1 max-w-5xl">
        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full px-3 py-2 focus-within:ring-2 focus-within:ring-blue-400 transition">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search menu..."
            className="w-full bg-transparent outline-none text-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        {results.length > 0 && (
          <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
            {renderResults(results)}
          </div>
        )}
      </div>

      {/* Icons */}
      <div className="flex items-center gap-6 ">
        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          {/* {generalNotifications.length > 0 ? (
            <FaBell
              className="text-gray-600 hover:text-blue-600 cursor-pointer transition"
              size={20}
              onClick={() => setShowNotifications(!showNotifications)}
            />
          ) : ( */}
          <BsBell
            className="   hover:text-blue-600 cursor-pointer transition"
            size={18}
            onClick={() => setShowNotifications(!showNotifications)}
          />
          {/* )} */}
          {generalNotifications.length > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500   w-2 h-2 font-bold  aspect-square  rounded-full"></div>
          )}
          {showNotifications && (
            <div className="absolute  right-0 mt-3 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <h3 className="font-semibold p-3 border-b text-gray-700">
                Notifications
              </h3>
              <div className="max-h-56 border overflow-y-auto">
                {generalNotifications.map((notif, i) => (
                  <div
                    key={i}
                    className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-600"
                  >
                    {notif.title}: {notif.message}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="relative" ref={settingsRef}>
          <CiSettings
            className="text-gray-600 hover:text-blue-600 cursor-pointer transition"
            size={22}
            onClick={() => setShowSettings(!showSettings)}
          />
          {showSettings && (
            <div className="absolute right-0 mt-3 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div
                className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700"
                onClick={() => navigate("/dashboard/profile")}
              >
                Profile
              </div>
              <div
                className="px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700"
                onClick={() => navigate("/dashboard/settings")}
              >
                Settings
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBarComp;
