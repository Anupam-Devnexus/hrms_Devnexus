import { useEffect } from "react";
import { mockNotifications } from "../DataStore/mockNotifications";
import useSocketStore from "../Zustand/NotificationAndOnlineUsers";
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
import axios from "axios";
import { toast } from "react-toastify";

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
  const { accessToken: token } = JSON.parse(localStorage.getItem("authUser"));
  // console.warn(token);
  const { personalNotifications, addPersonalNotification } = useSocketStore();

  const user = JSON.parse(localStorage.getItem("authUser")) || {};
  const role = user.Role?.toUpperCase() || "EMPLOYEE";

  // Merge role + common notifications
  // const notifications = [
  //   ...(mockNotifications[role] || []),
  //   ...(mockNotifications.COMMON || []),
  // ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const handleMarkAllRead = async () => {
    try {
      const unReadMessages = personalNotifications.filter((n) => !n.isRead);
      if (unReadMessages.length === 0)
        return toast.info("All notifications are already read");

      const { data } = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/notification/read`,
        { ids: unReadMessages.map((n) => n._id) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        addPersonalNotification(
          personalNotifications.map((n) =>
            unReadMessages.some((u) => u._id === n._id)
              ? { ...n, isRead: true }
              : n
          )
        );
        toast.success("All marked as read!");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to mark as read");
      console.error(err);
    }
  };

  useEffect(() => {
    (async () => {
      const { data } = await axios(
        `${import.meta.env.VITE_BASE_URL}/notification/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // const data = await response.json();

      addPersonalNotification(data.notifications);

      console.log("all notifications", data);
    })();

    if (!personalNotifications?.length) return;

    const controller = new AbortController();

    const timeoutId = setTimeout(async () => {
      try {
        const unReadMessages = personalNotifications.filter((noti) => {
          if (noti.isRead === false) return noti._id;
        });

        if (unReadMessages.length > 0) {
          const { data } = await axios.patch(
            `${import.meta.env.VITE_BASE_URL}/notification/read`,
            { ids: unReadMessages }, // send only ids or whole objects
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              signal: controller.signal,
            }
          );

          if (data.success) {
            addPersonalNotification(data.notifications);
          } else {
            toast.error(data.message);
          }

          console.log(" Marked as read:", data);
        }
      } catch (err) {
        if (err.name === "CanceledError") {
          console.log("Request aborted");
        } else {
          toast.error(err.message);

          console.error("Failed to mark read", err);
        }
      }
    }, 5000); // wait 5s before marking as read

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    // console.log("empty effect");
  }, [personalNotifications]);

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4 bg-white shadow-xl rounded-2xl border border-gray-100">
      <div className="flex justify-between my-4 w-full ">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Bell className="w-6 h-6 text-indigo-600" /> Notifications for -{" "}
          {user.user.FirstName}
        </h2>

        <button onClick={handleMarkAllRead} className="bg-blue-500 text-white ">
          Mark All Read
        </button>
      </div>

      {personalNotifications.length === 0 ? (
        <p className="text-gray-500 text-center py-6">
          No notifications found.
        </p>
      ) : (
        <ul className="divide-y divide-gray-100 space-y-4">
          {[...personalNotifications]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((note) => (
              <li
                key={note._id} // ✅ use correct key
                className={`flex items-start gap-4 p-4 rounded-xl transition ${
                  note.isRead ? "bg-gray-50" : "bg-indigo-50" //  use correct field
                } hover:shadow-md`}
              >
                <div className="flex-shrink-0">
                  {typeIcons[note?.type] || typeIcons.default}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800">
                      {note.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{note.message}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(note.createdAt).toLocaleString()}
                  </p>
                </div>

                {!note.isRead && (
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
