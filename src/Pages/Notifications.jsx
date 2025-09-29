import React from "react";
import { mockNotifications } from "../DataStore/mockNotifications";
import {
    Bell,
    UserPlus,
    Settings,
    ClipboardList,
    Calendar,
    FileText,
    AlertTriangle,
    CheckCircle,
} from "lucide-react";

const typeIcons = {
    user: <UserPlus className="w-5 h-5 text-blue-500" />,
    system: <Settings className="w-5 h-5 text-gray-500" />,
    task: <ClipboardList className="w-5 h-5 text-indigo-500" />,
    project: <FileText className="w-5 h-5 text-purple-500" />,
    leave: <Calendar className="w-5 h-5 text-green-500" />,
    reminder: <Bell className="w-5 h-5 text-yellow-500" />,
    event: <CheckCircle className="w-5 h-5 text-pink-500" />,
    holiday: <CheckCircle className="w-5 h-5 text-teal-500" />,
    default: <AlertTriangle className="w-5 h-5 text-gray-400" />,
};

const priorityColors = {
    high: "bg-red-100 text-red-600",
    medium: "bg-yellow-100 text-yellow-600",
    low: "bg-green-100 text-green-600",
    critical: "bg-purple-100 text-purple-600",
};

const Notifications = () => {
    const user = JSON.parse(localStorage.getItem("authUser")) || {};
    const role = user.role?.toUpperCase() || "EMPLOYEE";

    // Merge role + common notifications
    const notifications = [
        ...(mockNotifications[role] || []),
        ...(mockNotifications.COMMON || []),
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return (
        <div className="max-w-4xl mx-auto mt-8 p-4 bg-white shadow-xl rounded-2xl border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Bell className="w-6 h-6 text-indigo-600" /> Notifications for - {role.toLowerCase()}
            </h2>

            {notifications.length === 0 ? (
                <p className="text-gray-500 text-center py-6">No notifications found.</p>
            ) : (
                <ul className="divide-y divide-gray-100 space-y-4">
                    {notifications.map((note) => (
                        <li
                            key={note.id}
                            className={`flex items-start gap-4 p-4 rounded-xl transition ${note.read ? "bg-gray-50" : "bg-indigo-50"
                                } hover:shadow-md`}
                        >
                            {/* Icon */}
                            <div className="flex-shrink-0">
                                {typeIcons[note.type] || typeIcons.default}
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold text-gray-800">{note.title}</h3>
                                    <span
                                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${priorityColors[note.priority] || "bg-gray-200 text-gray-600"
                                            }`}
                                    >
                                        {note.priority}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{note.message}</p>
                                <p className="text-xs text-gray-400 mt-2">
                                    {new Date(note.timestamp).toLocaleString()}
                                </p>
                            </div>

                            {/* Unread Dot */}
                            {!note.read && (
                                <span className="w-3 h-3 bg-indigo-500 rounded-full mt-2"></span>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Notifications;
