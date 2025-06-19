import { useState } from "react";
import type { Task, TaskStatus } from "../App";

interface CalendarTimelineProps {
  tasks: Task[];
}

const CalendarTimeline: React.FC<CalendarTimelineProps> = ({ tasks }) => {
  // Local state for status filter
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");

  // Filter tasks by status
  const filteredTasks = tasks.filter((task) =>
    statusFilter === "all" ? true : task.status === statusFilter
  );

  // Group tasks by due date
  const groupTasksByDate = (tasks: Task[]) => {
    const map: { [date: string]: Task[] } = {};
    tasks.forEach((task) => {
      const date = task.dueDate || "No Date";
      if (!map[date]) map[date] = [];
      map[date].push(task);
    });
    return map;
  };

  const grouped = groupTasksByDate(filteredTasks);

  return (
    <section className="flex-1 bg-slate-50 p-4 overflow-y-auto">
      {/* Filter UI */}
      <div className="flex items-center gap-2 mb-4">
        <label htmlFor="timeline-status-filter" className="font-medium text-slate-700 text-sm">
          Filter by status:
        </label>
        <select
          id="timeline-status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as TaskStatus | "all")}
          className="bg-white px-2 py-1 border border-slate-300 rounded text-slate-700"
        >
          <option value="all">All</option>
          <option value="not started">Not Started</option>
          <option value="in progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
      <h2 className="mb-4 font-semibold text-slate-800 text-lg">Timeline View</h2>
      <div className="space-y-6">
        {Object.keys(grouped).length === 0 ? (
          <div className="pt-20 text-slate-400 text-center">[Timeline will appear here]</div>
        ) : (
          Object.keys(grouped)
            .sort((a, b) => {
              if (a === "No Date") return 1;
              if (b === "No Date") return -1;
              return new Date(a).getTime() - new Date(b).getTime();
            })
            .map((date) => (
              <div key={date}>
                <h3 className="mb-2 font-semibold text-slate-600 text-sm">
                  {date !== "No Date"
                    ? new Date(date).toLocaleDateString()
                    : "No Date"}
                </h3>
                <ul className="space-y-2">
                  {grouped[date].map((task) => (
                    <li
                      key={task.id}
                      className="flex justify-between items-center bg-white shadow-sm p-3 border border-slate-300 rounded"
                    >
                      <span className="text-slate-700">{task.title}</span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-semibold  ${
                          task.status === "done"
                            ? "bg-green-400 text-green-900"
                            : task.status === "in progress"
                            ? "bg-yellow-400 text-yellow-900"
                            : "bg-gray-300 text-gray-700"
                        }`}
                      >
                        {task.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))
        )}
      </div>
    </section>
  );
};

export default CalendarTimeline;