// App.jsx
import React, { useEffect } from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Login from "./Auth/Login";
import ProtectedRoute from "./Auth/ProtectedRoute";
import Dashboard from "./Pages/Dashboard";
import Navbar from "./Component/Navbar";
import Profile from "./Pages/Profile";
import DailyUpdates from "./Pages/DailyUpadates";
import UserManagement from "./Pages/UserManagement";
import AddUser from "./Pages/AddUser";
import Notifications from "./Pages/Notifications";
import Attendance from "./Pages/Attendance";
import MarkAttendance from "./Pages/MarkAttendance";
import Team from "./Pages/TL/Team";
import Leave from "./Pages/Leave";
import ApplyLeave from "./Pages/ApplyLeave";
import EditProfile from "./Pages/EditProfile";
import Task from "./Pages/Task";
import Sales from "./Pages/TL/Sales";
import Updates from "./Pages/TL/UpdateSales";
import Policies from "./Pages/Policies";
import AddTask from "./Pages/AddTask";
import Teams from "./Pages/Team";
import LeavesApproval from "./Pages/LeavesApproval";
import Adminisration from "./Pages/Adminisration";
import Allupdates from "./Pages/Allupdates";
import ForgotPass from "./Pages/ForgotPass";
import AddPolicies from "./Pages/Admin/AddPolicies";
import Settings from "./Pages/Settings";
import Payroll from "./Pages/HR/Payroll";
import HistoryPayment from "./Pages/HistoryPayment";
import Expenses from "./Pages/Expenses";
import { ToastContainer, toast } from "react-toastify";
import useSocketStore from "./Zustand/NotificationAndOnlineUsers.jsx";
import socket from "./socket.js";
import PayslipForm from "./Pages/SalarySlip.jsx";
import GetPaySlip from "./Pages/GetPaySlip.jsx";
import axios from "axios";
import CheckAuth from "./Auth/CheckAuth.js";

export default function App() {
  // const navigate = useNavigate();
  const authUser = JSON.parse(localStorage.getItem("authUser"));

  // console.log("App jsx", authUser);

  const {
    personalNotifications,
    generalNotifications,
    addPersonalNotification,
    addGeneralNotification,
    // addUserOnline,
  } = useSocketStore();

  // useEffect(() => {
  //   CheckAuth(authUser.accessToken);
  // }, []);

  useEffect(() => {
    if (!authUser) return;
    const { Role, _id } = authUser.user;

    //  Helper function to filter out already existing notifications
    const filterNewNotifications = (incoming, existing) => {
      const existingIds = new Set(existing.map((n) => n._id));
      return incoming.filter((n) => !existingIds.has(n._id));
    };

    //  Handle general notifications
    const handleGeneralNotification = (data) => {
      const incoming = Array.isArray(data) ? data : [data];
      const newOnes = filterNewNotifications(incoming, generalNotifications);

      newOnes.forEach((n) => toast.info(n.title, { autoClose: 3000 }));
      if (newOnes.length) addGeneralNotification(newOnes);
    };

    //  Handle personal notifications
    const handlePersonalNotification = (data) => {
      const incoming = Array.isArray(data) ? data : [data];
      const newOnes = filterNewNotifications(incoming, personalNotifications);

      newOnes.forEach((n) => toast.info(n.title, { autoClose: 3000 }));
      if (newOnes.length) addPersonalNotification(newOnes);
    };

    // --- Register socket & listeners ---
    socket.emit("register", { userId: _id, Role });

    socket.on("notification", handleGeneralNotification);
    socket.on("pendingNotifications", handlePersonalNotification);

    return () => {
      socket.off("notification", handleGeneralNotification);
      socket.off("pendingNotifications", handlePersonalNotification);
      // socket.off("userOnline", handleUserOnline);
    };
  }, [authUser, personalNotifications, generalNotifications]);

  return (
    <Router>
      <Routes>
        {/* Login Page */}
        <Route path="/" element={<Login />} />
        <Route path="forgot-password" element={<ForgotPass />} />
        {/* <Route path="/add-user" element={<AddUser />} /> */}

        {/* Protected Dashboard (common for all roles) */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <div className="flex">
                {/* Sidebar */}
                <Navbar />
                {/* Main content */}
                <div className="flex-1 ml-64 p-1">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="daily-updates" element={<DailyUpdates />} />
                    <Route
                      path="user-management"
                      element={<UserManagement />}
                    />
                    <Route path="add-user" element={<AddUser />} />
                    <Route path="notifications" element={<Notifications />} />
                    <Route path="attendance" element={<Attendance />} />
                    <Route
                      path="mark-attendance/:id"
                      element={<MarkAttendance />}
                    />
                    <Route path="create-team" element={<Team />} />
                    <Route path="leaves" element={<Leave />} />
                    <Route path="apply-leave" element={<ApplyLeave />} />
                    <Route path="edit-profile/:id" element={<EditProfile />} />
                    <Route path="tasks" element={<Task />} />
                    <Route path="sales" element={<Sales />} />
                    <Route path="sales-updates" element={<Updates />} />
                    <Route path="policies" element={<Policies />} />
                    <Route path="add-task" element={<AddTask />} />
                    <Route path="teams" element={<Teams />} />
                    <Route
                      path="leaves-approval"
                      element={<LeavesApproval />}
                    />
                    <Route path="generate-slip" element={<PayslipForm />} />
                    <Route path="payslips" element={<GetPaySlip />} />
                    <Route path="administration" element={<Adminisration />} />
                    <Route path="allupdates" element={<Allupdates />} />
                    <Route path="Add-policy" element={<AddPolicies />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="payroll" element={<Payroll />} />
                    <Route path="history" element={<HistoryPayment />} />
                    <Route path="expenses" element={<Expenses />} />
                    <Route path="*" element={<div>Page Not Found</div>} />
                  </Routes>
                </div>
                <ToastContainer
                  position="top-right"
                  autoClose={5000}
                  newestOnTop
                />
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
