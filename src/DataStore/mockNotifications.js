export const mockNotifications = {
  ADMIN: [
    {
      id: 1,
      title: "New User Registered",
      message: "A new employee account has been created.",
      type: "user",
      priority: "high",
      timestamp: "2025-09-11T09:30:00Z",
      read: false,
    },
    {
      id: 2,
      title: "System Update",
      message: "Server maintenance scheduled for tonight at 11:30 PM.",
      type: "system",
      priority: "medium",
      timestamp: "2025-09-10T18:00:00Z",
      read: false,
    },
  ],

  HR: [
    {
      id: 3,
      title: "Leave Request",
      message: "Ankit Sharma applied for 2 days of leave.",
      type: "leave",
      priority: "high",
      timestamp: "2025-09-10T14:45:00Z",
      read: false,
    },
    {
      id: 4,
      title: "Policy Update",
      message: "New work-from-home guidelines published.",
      type: "policy",
      priority: "medium",
      timestamp: "2025-09-09T10:00:00Z",
      read: true,
    },
  ],

  TL: [
    {
      id: 5,
      title: "Task Assigned",
      message: "You assigned a new task to your team.",
      type: "task",
      priority: "high",
      timestamp: "2025-09-11T08:15:00Z",
      read: false,
    },
    {
      id: 6,
      title: "Project Deadline",
      message: "Project Alpha deadline is approaching in 3 days.",
      type: "project",
      priority: "critical",
      timestamp: "2025-09-10T07:00:00Z",
      read: false,
    },
  ],

  EMPLOYEE: [
    {
      id: 7,
      title: "Daily Report Reminder",
      message: "Don’t forget to submit your daily report by 6 PM.",
      type: "reminder",
      priority: "medium",
      timestamp: "2025-09-11T06:30:00Z",
      read: false,
    },
    {
      id: 8,
      title: "Leave Approved",
      message: "Your leave request from 12–13 Sep has been approved.",
      type: "leave",
      priority: "low",
      timestamp: "2025-09-10T12:15:00Z",
      read: true,
    },
  ],

  COMMON: [
    {
      id: 9,
      title: "Birthday Celebration",
      message: "Team lunch for Priya’s birthday at 1 PM today 🎉",
      type: "event",
      priority: "low",
      timestamp: "2025-09-11T04:00:00Z",
      read: false,
    },
    {
      id: 10,
      title: "Holiday Announcement",
      message: "Office will remain closed on 15th September for Independence Day.",
      type: "holiday",
      priority: "low",
      timestamp: "2025-09-08T08:30:00Z",
      read: true,
    },
  ],
};
