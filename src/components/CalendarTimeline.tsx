import { useState } from "react";
import type { Task, TaskStatus } from "../App";

interface CalendarTimelineProps {
  tasks: Task[];
}

const DAY_WIDTH = 80; // px per day column

const categoryColors: { [key: string]: string } = {
  Work: "bg-red-400",
  Personal: "bg-blue-400",
  School: "bg-green-400",
  Health: "bg-yellow-400",
  Other: "bg-purple-400",
  Uncategorized: "bg-gray-400",
};

// Helper to get all unique dates between min startDate and max dueDate
const getTimelineDates = (tasks: Task[]) => {
  const allDates = tasks
    .flatMap((task) => [task.startDate, task.dueDate])
    .filter(Boolean) as string[];

  if (allDates.length === 0) return [];

  const minDate = new Date(allDates.reduce((a, b) => (a < b ? a : b)));
  const maxDate = new Date(allDates.reduce((a, b) => (a > b ? a : b)));

  const dates: string[] = [];

  for (
    let d = new Date(minDate.getTime());
    d <= maxDate;
    d.setDate(d.getDate() + 1)
  ) {
    dates.push(new Date(d.getTime()).toISOString().split("T")[0]);
  }

  return dates;
};

const daysBetween = (start: string, end: string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
};

const offsetFromStart = (start: string, globalStart: string) => {
  return daysBetween(globalStart, start);
};

const isToday = (date: string) =>
  new Date(date).toDateString() === new Date().toDateString();

const formatDurationTooltip = (start: string, end: string) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const days = daysBetween(start, end) + 1;
  return `${startDate.toLocaleDateString()} → ${endDate.toLocaleDateString()} (${days} day${
    days > 1 ? "s" : ""
  })`;
};

// Add this helper near the top (replace groupByCategory):
const groupByStatus = (tasks: Task[]) => {
  return tasks.reduce<Record<string, Task[]>>((groups, task) => {
    const key = task.status;
    if (!groups[key]) groups[key] = [];
    groups[key].push(task);
    return groups;
  }, {});
};

const statusDotColor: { [key in TaskStatus]: string } = {
  "not started": "bg-gray-400",
  "in progress": "bg-yellow-400",
  done: "bg-green-400",
};

const CalendarTimeline: React.FC<CalendarTimelineProps> = ({ tasks }) => {
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  // Placeholder for future modal logic
  const openEditModal = (task: Task) => {
    alert(`Edit task: ${task.title}`);
  };

  const filteredTasks =
    statusFilter === "all"
      ? tasks
      : tasks.filter((task) => task.status === statusFilter);

  const grouped = groupByStatus(filteredTasks);

  const timelineDates = getTimelineDates(filteredTasks);
  const timelineStart = timelineDates[0];

  // Defensive: If no timeline, show empty state
  if (!timelineStart) {
    return (
      <section className="flex-1 bg-slate-50 p-4 overflow-x-auto">
        <div className="pt-20 text-slate-400 text-center">
          No tasks to display in this view.
        </div>
      </section>
    );
  }

  return (
    <section className="flex-1 bg-slate-50 p-4 overflow-x-auto">
      {/* Filter UI */}
      <div className="flex items-center gap-2 mb-4">
        <label
          htmlFor="timeline-status-filter"
          className="font-medium text-slate-700 text-sm">
          Filter by status:
        </label>
        <select
          id="timeline-status-filter"
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as TaskStatus | "all")
          }
          className="bg-white px-2 py-1 border border-slate-300 rounded text-slate-700">
          <option value="all">All</option>
          <option value="not started">Not Started</option>
          <option value="in progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
      <h2 className="mb-4 font-semibold text-slate-800 text-lg">
        Timeline View
      </h2>
      <div className="overflow-x-auto">
        <div className="min-w-[1200px]">
          {/* Timeline Axis */}
          <div className="flex mb-2 border-slate-300 border-b">
            <div className="w-48" /> {/* Empty cell for alignment */}
            {timelineDates.map((date) => (
              <div
                key={date}
                className={`py-2 border-slate-200 border-l text-xs text-center ${
                  isToday(date)
                    ? "bg-yellow-100 font-semibold text-yellow-700"
                    : "text-slate-500"
                }`}
                style={{ minWidth: DAY_WIDTH, width: DAY_WIDTH }}>
                {new Date(date).toLocaleDateString()}
              </div>
            ))}
          </div>
          {/* Grouped Task Bars */}
          <div className="space-y-8 mt-4">
            {Object.entries(grouped).map(([status, tasks]) => (
              <div key={status}>
                <div className="mb-2 font-bold text-slate-700 capitalize">
                  {status}
                </div>
                <div className="space-y-4">
                  {tasks.map((task) => {
                    const left =
                      offsetFromStart(task.startDate, timelineStart) *
                      DAY_WIDTH;
                    const width =
                      (daysBetween(task.startDate, task.dueDate) + 1) *
                      DAY_WIDTH;
                    const valid =
                      timelineDates.includes(task.startDate) &&
                      timelineDates.includes(task.dueDate);

                    return (
                      <div key={task.id} className="flex items-center">
                        <div className="flex items-center gap-2 pr-4 w-48">
                          <div
                            className={`w-3 h-3 rounded-full ${statusDotColor[task.status]}`}
                            title={task.status}
                          />
                          <span className="text-slate-600 text-xs">
                            {task.title}
                          </span>
                        </div>
                        <div
                          className="relative"
                          style={{
                            width: timelineDates.length * DAY_WIDTH,
                            height: 32,
                            paddingRight: 8,
                          }}>
                          {valid && (
                            <div
                              className={`absolute top-0 h-8 rounded cursor-pointer ${
                                categoryColors[task.category || "Uncategorized"] ||
                                "bg-gray-400"
                              } text-white drop-shadow-sm text-xs px-2 flex items-center`}
                              style={{
                                width: `${width}px`,
                                left: `${left}px`,
                                transition: "left 0.2s, width 0.2s",
                              }}
                              onClick={() => openEditModal(task)}
                              title={formatDurationTooltip(
                                task.startDate,
                                task.dueDate
                              )}>
                              {task.title}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {filteredTasks.length === 0 && (
        <div className="pt-20 text-slate-400 text-center">
          No tasks to display in this view.
        </div>
      )}
    </section>
  );
};

export default CalendarTimeline;
