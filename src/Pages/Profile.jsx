import React, { useEffect, useState } from "react";
import { useUserStore } from "../Zustand/GetAllData";
import {
  Mail,
  Phone,
  MapPin,
  Briefcase,
  User,
  Calendar,
  Shield,
  FileText,
  Settings,
  Activity,
  CheckCircle,
  XCircle,
  Handshake,
} from "lucide-react";

// Spinner Component
const Loader = () => (
  <div className="flex justify-center items-center py-20">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-500"></div>
  </div>
);

// Info item
const InfoItem = ({ label, value, icon: Icon }) => (
  <div className="flex items-center overflow-auto space-x-2 text-gray-600 text-sm">
    {Icon && <Icon className="w-5 h-5 text-indigo-400 shrink-0" />}
    <span className="font-semibold text-gray-800">{label}:</span>
    <span className="">{value || "N/A"}</span>
  </div>
);

// Badge (chip)
const Badge = ({ text, color = "indigo" }) => (
  <span
    className={`inline-flex items-center whitespace-nowrap bg-${color}-100 text-${color}-700 text-xs sm:text-sm font-medium px-3 py-1 rounded-full shadow-sm`}
  >
    {text}
  </span>
);

// Section card
const Section = ({ title, icon: Icon, children }) => (
  <div className="p-5 border rounded-2xl shadow-sm bg-white hover:shadow-lg transition-all duration-300">
    <h3 className="flex items-center gap-2 font-semibold text-gray-700 mb-3 text-sm sm:text-base uppercase tracking-wide">
      {Icon && <Icon className="w-5 h-5 text-indigo-500 shrink-0" />} {title}
    </h3>
    <div className="space-y-2">{children}</div>
  </div>
);

const Profile = () => {
  const { allData, fetchAllData, loading, error } = useUserStore();
  const [currentUser, setCurrentUser] = useState(null);
  const [isActive, setIsActive] = useState(false);

  const authUser = JSON.parse(localStorage.getItem("authUser"));
  const username = authUser.user?.FirstName;
  const role = authUser.user?.Role?.toUpperCase() || "EMPLOYEE";

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (allData?.data && username) {
      const roleUsers = allData.data[role] || [];
      const user = roleUsers.find(
        (u) =>
          u.FirstName.toLowerCase() === username.toLowerCase() ||
          u.Email.toLowerCase() === username.toLowerCase()
      );
      setCurrentUser(user || null);
      if (user) setIsActive(user.IsActive);
    }
  }, [allData, username, role]);

  const toggleStatus = () => {
    setIsActive((prev) => !prev);
    // TODO: Add API call to update status
  };

  if (loading) return <Loader />;
  if (error)
    return <div className="text-center py-10 text-red-600">Error: {error}</div>;
  if (!currentUser)
    return (
      <div className="text-center py-10 text-gray-500">No user data found.</div>
    );

  const permissions =
    currentUser.Permissions && currentUser.Permissions.length > 0
      ? Array.isArray(currentUser.Permissions[0])
        ? currentUser.Permissions[0]
        : (() => {
            try {
              return JSON.parse(currentUser.Permissions[0]);
            } catch {
              return [currentUser.Permissions[0]];
            }
          })()
      : [];

  return (
    <div className="flex justify-center items-start py-2 px-2 bg-gray-100 min-h-screen">
      <div className="w-full max-w-6xl bg-white shadow-xl rounded-3xl overflow-hidden">
        {/* Header */}
        <div className="relative h-36 sm:h-52 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          <div className="absolute -bottom-16 sm:-bottom-20 left-1/2 transform -translate-x-1/2">
            <img
              draggable={false}
              src={currentUser.Profile_url}
              alt={`${currentUser.FirstName} ${currentUser.LastName}`}
              className="w-28 h-28 sm:w-40 sm:h-40 rounded-2xl border-4 border-white shadow-xl object-cover"
            />
          </div>
        </div>

        {/* Main */}
        <div className="mt-20 sm:mt-24 px-6 sm:px-12 pb-10">
          {/* User Info */}
          <div className="text-center">
            <h2 className="text-2xl sm:text-4xl font-bold text-gray-800">
              {currentUser.FirstName} {currentUser.LastName}
            </h2>
            <p className="text-indigo-500 font-medium mt-1 text-sm sm:text-base">
              {currentUser.Designation} • {currentUser.Department}
            </p>
            <div className="mt-3 flex justify-center gap-2">
              <Badge
                text={currentUser.Role}
                color={currentUser.Role === "ADMIN" ? "red" : "blue"}
              />
            </div>
          </div>

          {/* Sections */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Section title="Contact" icon={Phone}>
              <InfoItem label="Email" value={currentUser.Email} icon={Mail} />
              <InfoItem label="Phone" value={currentUser.Phone} icon={Phone} />
              <InfoItem
                label="Current Address"
                value={currentUser.CurrentAddress}
                icon={MapPin}
              />
              <InfoItem
                label="Permanent Address"
                value={currentUser.PermanentAddress}
                icon={MapPin}
              />
            </Section>

            <Section title="Emergency Contact" icon={Activity}>
              <InfoItem
                label="Name"
                value={`${currentUser.EmergencyName} (${currentUser.EmergencyRelation})`}
                icon={User}
              />
              <InfoItem
                label="Relation"
                value={currentUser.EmergencyRelation}
                icon={Handshake}
              />
              <InfoItem
                label="Phone"
                value={currentUser.EmergencyPhone}
                icon={Phone}
              />
            </Section>

            <Section title="Job Info" icon={Briefcase}>
              <InfoItem
                label="Employee ID"
                value={currentUser.EmployeeId}
                icon={Shield}
              />
              {/* <InfoItem
                label="Salary"
                value={currentUser.Salary}
                icon={FileText}
              /> */}
              <InfoItem
                label="Joining Date"
                value={
                  currentUser.JoiningDate
                    ? new Date(currentUser.JoiningDate).toLocaleDateString()
                    : "N/A"
                }
                icon={Calendar}
              />
              <InfoItem
                label="Date of Birth"
                value={
                  currentUser.Dob
                    ? new Date(currentUser.Dob).toLocaleDateString()
                    : "N/A"
                }
                icon={Calendar}
              />
            </Section>

            <Section title="Permissions" icon={Shield}>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {permissions.length > 0 && permissions[0] !== "" ? (
                  permissions.map((perm, idx) => (
                    <Badge key={idx} text={perm} color="indigo" />
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">No permissions</span>
                )}
              </div>
            </Section>

            <Section title="Allowed Tabs" icon={FileText}>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {currentUser.AllowedTabs?.length > 0 ? (
                  currentUser.AllowedTabs.map((tab, idx) => (
                    <Badge key={idx} text={tab} color="green" />
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">No access</span>
                )}
              </div>
            </Section>

            <Section title="Tasks" icon={Settings}>
              {currentUser.Tasks?.length > 0 ? (
                <ol className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                  {currentUser.Tasks.map((task, idx) => (
                    <li key={idx}>{task.title}</li>
                  ))}
                </ol>
              ) : (
                <span className="text-gray-400 text-sm">No tasks assigned</span>
              )}
            </Section>

            <Section title="System Info" icon={Activity}>
              <InfoItem
                label="Created"
                value={new Date(currentUser.createdAt).toLocaleString()}
                icon={Calendar}
              />
              <InfoItem
                label="Updated"
                value={new Date(currentUser.updatedAt).toLocaleString()}
                icon={Calendar}
              />
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
