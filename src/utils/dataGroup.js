export const groupTasksByDate = (tasks) => {
  const now = new Date();
  const today = now.toDateString();

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const groups = {
    today: [],
    thisWeek: [],
    thisMonth: [],
    lastMonth: [],
    older: [],
  };

  tasks.forEach((task) => {
    const date = new Date(task.dueDate);

    if (date.toDateString() === today) {
      groups.today.push(task);
    } else if (date >= startOfWeek) {
      groups.thisWeek.push(task);
    } else if (date >= startOfMonth) {
      groups.thisMonth.push(task);
    } else if (date >= startOfLastMonth && date <= endOfLastMonth) {
      groups.lastMonth.push(task);
    } else {
      groups.older.push(task);
    }
  });

  return groups;
};

export const sortTasks = (tasks) =>
  tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
