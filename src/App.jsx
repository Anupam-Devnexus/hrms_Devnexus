// App.jsx
import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";
import socket from "./socket";
import useSocketStore from "./Zustand/NotificationAndOnlineUsers";

import ProtectedRoute from "./Auth/ProtectedRoute";

// ---------------- Lazy Loaded Pages ----------------
const Login = lazy(() => import("./Auth/Login"));
const ForgotPass = lazy(() => import("./Pages/ForgotPass"));
const ResetPassword = lazy(() => import("./Pages/ResetPassword"));

const Dashboard = lazy(() => import("./Pages/Dashboard"));
const Navbar = lazy(() => import("./Component/Navbar"));
const Profile = lazy(() => import("./Pages/Profile"));
const DailyUpdates = lazy(() => import("./Pages/DailyUpadates"));
const UserManagement = lazy(() => import("./Pages/UserManagement"));
const AddUser = lazy(() => import("./Pages/AddUser"));
const Notifications = lazy(() => import("./Pages/Notifications"));
const Attendance = lazy(() => import("./Pages/Attendance"));
const MarkAttendance = lazy(() => import("./Pages/MarkAttendance"));
const Team = lazy(() => import("./Pages/TL/Team"));
const Leave = lazy(() => import("./Pages/Leave"));
const ApplyLeave = lazy(() => import("./Pages/ApplyLeave"));
const EditProfile = lazy(() => import("./Pages/EditProfile"));
const Task = lazy(() => import("./Pages/Task"));
const Sales = lazy(() => import("./Pages/TL/Sales"));
const Policies = lazy(() => import("./Pages/Policies"));
const AddTask = lazy(() => import("./Pages/AddTask"));
const Teams = lazy(() => import("./Pages/Team"));
const LeavesApproval = lazy(() => import("./Pages/LeavesApproval"));
const Adminisration = lazy(() => import("./Pages/Adminisration"));
const Allupdates = lazy(() => import("./Pages/Allupdates"));
const AddPolicies = lazy(() => import("./Pages/Admin/AddPolicies"));
const Settings = lazy(() => import("./Pages/Settings"));
const Payroll = lazy(() => import("./Pages/HR/Payroll"));
const HistoryPayment = lazy(() => import("./Pages/HistoryPayment"));
const Expenses = lazy(() => import("./Pages/Expenses"));
const PayslipForm = lazy(() => import("./Pages/SalarySlip"));
const GetPaySlip = lazy(() => import("./Pages/GetPaySlip"));
const AddSales = lazy(() => import("./Pages/TL/AddSales"));
const UpdateTeam = lazy(() => import("./Pages/TL/TeamUpdate"));
const EditLeaves = lazy(() => import('./Pages/HR/Leaves/EditLeaves'))
const CreateLeaves = lazy(() =>
  import("./Pages/HR/Leaves/CreateLeaves")
);

// ---------------- App ----------------
export default function App() {
  const [authUser, setAuthUser] = useState(() => {
    try {
      const stored = localStorage.getItem("authUser");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const {
    personalNotifications,
    generalNotifications,
    addPersonalNotification,
    addGeneralNotification,
  } = useSocketStore();

  // ---------------- Socket Notifications ----------------
  useEffect(() => {
    if (!authUser?.user) return;

    const { _id, Role } = authUser.user;

    const filterNew = (incoming, existing) => {
      const ids = new Set(existing.map((n) => n._id));
      return incoming.filter((n) => !ids.has(n._id));
    };

    const handleGeneral = (data) => {
      const incoming = Array.isArray(data) ? data : [data];
      const fresh = filterNew(incoming, generalNotifications);

      fresh.forEach((n) => toast.info(n.title));
      if (fresh.length) addGeneralNotification(fresh);
    };

    const handlePersonal = (data) => {
      const incoming = Array.isArray(data) ? data : [data];
      const fresh = filterNew(incoming, personalNotifications);

      fresh.forEach((n) => toast.info(n.title));
      if (fresh.length) addPersonalNotification(fresh);
    };

    socket.emit("register", { userId: _id, Role });
    socket.on("notification", handleGeneral);
    socket.on("pendingNotifications", handlePersonal);

    return () => {
      socket.off("notification", handleGeneral);
      socket.off("pendingNotifications", handlePersonal);
    };
  }, [authUser]);

  // ---------------- Dashboard Routes ----------------
  const dashboardRoutes = useMemo(
    () => (
      <>
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="daily-updates" element={<DailyUpdates />} />
        <Route path="user-management" element={<UserManagement />} />
        <Route path="add-user" element={<AddUser />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="mark-attendance/:id" element={<MarkAttendance />} />
        <Route path="create-team" element={<Team />} />
        <Route path="leaves" element={<Leave />} />
        <Route path="apply-leave" element={<ApplyLeave />} />
        <Route path="edit-profile/:id" element={<EditProfile />} />
        <Route path="tasks" element={<Task />} />
        <Route path="sales" element={<Sales />} />
        <Route path="add" element={<AddSales />} />
        <Route path="policies" element={<Policies />} />
        <Route path="add-task" element={<AddTask />} />
        <Route path="teams" element={<Teams />} />
        <Route path="teams/update/:id" element={<UpdateTeam />} />
        <Route path="leaves-approval" element={<LeavesApproval />} />
        <Route path="generate-slip" element={<PayslipForm />} />
        <Route path="payslips" element={<GetPaySlip />} />
        <Route path="administration" element={<Adminisration />} />
        <Route path="allupdates" element={<Allupdates />} />
        <Route path="Add-policy" element={<AddPolicies />} />
        <Route path="settings" element={<Settings />} />
        <Route path="payroll" element={<Payroll />} />
        <Route path="history" element={<HistoryPayment />} />
        <Route path="expenses" element={<Expenses />} />
        <Route path="all-leaves" element={<CreateLeaves />} />
        <Route path="edit-leaves" element={<EditLeaves />} />
        <Route path="*" element={<div>Page Not Found</div>} />
      </>
    ),
    []
  );

  return (
    <Router>
      <Suspense fallback={<div className="p-4">Loading...</div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login setAuthUser={setAuthUser} />} />
          <Route path="/forgot-password" element={<ForgotPass />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <div className="flex">
                  <Navbar />
                  <div className="flex-1 ml-64 p-1">
                    <Routes>{dashboardRoutes}</Routes>
                  </div>
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>

        <ToastContainer position="top-right" newestOnTop />
      </Suspense>
    </Router>
  );
}
