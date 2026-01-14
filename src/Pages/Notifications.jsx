import { useEffect, useRef, useState } from "react";
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
import { useAttendance } from "../Zustand/PersonalAttendance";

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

const Notifications = () => {
  const { user } = useAttendance();
  const token = localStorage.getItem("hrmsAuthToken");

  const { personalNotifications, addPersonalNotification } = useSocketStore();

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loaderRef = useRef(null);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);

      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/notification?page=${page}&limit=10`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      addPersonalNotification([
        ...data.notifications,
        ...personalNotifications,
      ]);

      setHasMore(data.hasMore);
      setPage((prev) => prev + 1);
    } catch (err) {
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNotifications();
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [fetchNotifications]);

  // Mark all as read
  const handleMarkAllRead = async () => {
    const unreadIds = personalNotifications
      .filter((n) => !n.isRead)
      .map((n) => n._id);

    if (!unreadIds.length) {
      return toast.info("All notifications already read");
    }

    try {
      await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/notification/read`,
        { ids: unreadIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      addPersonalNotification(
        personalNotifications.map((n) => ({ ...n, isRead: true }))
      );

      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to mark notifications");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4 bg-white shadow-xl rounded-2xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Bell className="w-6 h-6 text-indigo-600" />
          Notifications – {user?.FirstName}
        </h2>

        <button
          onClick={handleMarkAllRead}
          className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Mark all read
        </button>
      </div>

      {personalNotifications.length === 0 && !loading && (
        <p className="text-center text-gray-500 py-10">
          No notifications yet.
        </p>
      )}

      <ul className="space-y-3">
        {personalNotifications.map((note) => (
          <li
            key={note._id}
            className={`flex gap-4 p-4 rounded-xl transition ${note.isRead ? "bg-gray-50" : "bg-indigo-50"
              }`}
          >
            {typeIcons[note.type] || typeIcons.default}

            <div className="flex-1">
              <h3 className="font-semibold">{note.title}</h3>
              <p className="text-sm text-gray-600">{note.message}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(note.createdAt).toLocaleString()}
              </p>
            </div>

            {!note.isRead && (
              <span className="w-3 h-3 bg-indigo-500 rounded-full mt-2" />
            )}
          </li>
        ))}
      </ul>

      {/* Loader */}
      {hasMore && (
        <div ref={loaderRef} className="py-6 text-center text-gray-400">
          {loading ? "Loading..." : "Scroll to load more"}
        </div>
      )}
    </div>
  );
};

export default Notifications;
