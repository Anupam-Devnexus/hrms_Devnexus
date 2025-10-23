import { useState } from "react";
import {
  Home,
  User,
  ClipboardList,
  Bell,
  CheckSquare,
  Users,
  FileText,
  Settings,
  ChevronDown,
  ChevronRight,
  ReceiptIndianRupee,
  Scale,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { FaPowerOff } from "react-icons/fa";

// Config-driven menu
const menuConfig = {
  common: [
    { label: "Dashboard", icon: <Home size={18} />, path: "/dashboard" },
    { label: "Profile", icon: <User size={18} />, path: "/dashboard/profile" },
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
      label: "Teams",
      icon: <ClipboardList size={18} />,
      path: "/dashboard/teams",
    },
    {
      label: "Notifications",
      icon: <Bell size={18} />,
      path: "/dashboard/notifications",
    },
    {
      label: "Daily Updates",
      icon: <FileText size={18} />,
      path: "/dashboard/daily-updates",
    },
    {
      label: "Payslips",
      icon: <ReceiptIndianRupee size={18} />,
      path: "/dashboard/payslips",
    },
    {
      label: "Policies",
      icon: <Scale size={18} />,
      path: "/dashboard/policies",
    },
  ],

  tl: [
    { label: "Sales", icon: <FileText size={18} />, path: "/dashboard/sales" },
    {
      label: "Tasks",
      icon: <ClipboardList size={18} />,
      path: "/dashboard/tasks",
    },
    {
      label: "Team",
      icon: <Users size={18} />,
      children: [{ label: "Create Team", path: "/dashboard/create-team" }],
    },
  ],

  hr: [
    {
      label: "HR Panel",
      icon: <Users size={18} />,
      children: [
        { label: "User Management", path: "/dashboard/user-management" },
        // { label: "Policies", path: "/dashboard/policies" },
        { label: "Leaves Approval", path: "/dashboard/leaves-approval" },
        { label: "Generate Payslips", path: "/dashboard/generate-slip" },
        { label: "Payroll", path: "/dashboard/payroll" },
        { label: "Expenses", path: "/dashboard/expenses" },
      ],
    },
  ],

  admin: [
    {
      label: "Administration",
      icon: <Settings size={18} />,
      children: [
        { label: "User Management", path: "/dashboard/user-management" },
        // { label: "Policies", path: "/dashboard/policies" },
        { label: "Add User", path: "/dashboard/add-user" },
        { label: "Leaves Approval", path: "/dashboard/leaves-approval" },
        { label: "Sales", path: "/dashboard/sales" },
        { label: "Payroll", path: "/dashboard/payroll" },
        { label: "Expenses", path: "/dashboard/expenses" },
        // { label: "Administration", path: "/dashboard/administration" },
      ],
    },
  ],
};

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("authUser")) || {};
  const role = user.user?.Role || user?.user?.role || "EMPLOYEE";

  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const menuItems = [
    ...menuConfig.common,
    ...(menuConfig[role.toLowerCase()] || []),
  ];
  const displayName = user?.user?.FirstName || user?.user?.Email || "User";
  const roleName = role.toUpperCase();

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 fixed left-0 top-0 flex flex-col shadow-lg">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center gap-3">
        <img
          src="https://res.cloudinary.com/dt4ohfuwc/image/upload/v1750671563/DevNexus_qqt3p3.png"
          alt="Logo"
          className="w-12 h-12 object-contain"
        />
        <div>
          <h1 className="text-lg font-semibold tracking-wide">Devnexus</h1>
          <p className="text-xs text-gray-400">{roleName} Portal</p>
        </div>
      </div>

      {/* Scrollable Menu */}
      <nav className="flex-1 overflow-y-scroll px-3 py-4 space-y-1">
        {menuItems.map((item, idx) =>
          item.children ? (
            <div key={idx}>
              <button
                onClick={() => toggleMenu(item.label)}
                className="flex items-center justify-between w-full px-3 py-2 rounded-lg 
                           hover:bg-gray-700/60 transition-all duration-200 text-sm font-medium"
              >
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-gray-700/40 rounded-lg">
                    {item.icon}
                  </span>
                  {item.label}
                </div>
                {openMenus[item.label] ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </button>

              {/* Submenu */}
              <div
                className={`ml-8  flex flex-col gap-1 mb-4 transition-all duration-300 ${
                  openMenus[item.label]
                    ? "max-h-40 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                {item.children.map((child, cidx) => (
                  <NavLink
                    key={cidx}
                    to={child.path}
                    className={({ isActive }) =>
                      `px-2 py-1 rounded-md text-xs transition-all duration-200 ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "hover:bg-gray-700 hover:text-blue-400"
                      }`
                    }
                  >
                    {child.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ) : (
            <NavLink
              key={idx}
              to={item.path}
              end //  important for exact match
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "hover:bg-gray-700 hover:text-blue-400"
                }`
              }
            >
              <span className="p-2 bg-gray-700/40 rounded-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          )
        )}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-gray-700 flex items-center justify-between">
        <div className="flex gap-3 items-center">
          {user?.user?.Profile_url ? (
            <img
              src={user?.user?.Profile_url}
              alt={displayName}
              className="w-10 h-10 rounded-full object-cover border border-gray-600"
            />
          ) : (
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-600 font-bold text-sm">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="font-medium">{displayName}</p>
            <p className="text-xs text-gray-400">{roleName}</p>
          </div>
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("authUser");
            window.location.href = "/";
          }}
          className="bg-red-600 hover:bg-red-700 transition-all duration-200 text-white rounded-full shadow-md"
        >
          <FaPowerOff size={10} />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
