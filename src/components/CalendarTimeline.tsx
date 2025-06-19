import { useState } from "react";
import type { Task, TaskStatus } from "../App";

interface CalendarTimelineProps {
  tasks: Task[];
}

const DAY_WIDTH = 80; // px per day column

const getBarColor = (status: TaskStatus) => {
  switch (status) {
    case "done":
      return "bg-green-400";
    case "in progress":
      return "bg-yellow-400";
    default:
      return "bg-gray-300";
  }
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

// Reference helpers for accurate scaling
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

const CalendarTimeline: React.FC<CalendarTimelineProps> = ({ tasks }) => {
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  // Placeholder for future modal logic
  const openEditModal = (task: Task) => {
    // TODO: Implement modal logic here
    alert(`Edit task: ${task.title}`);
  };

  const filteredTasks =
    statusFilter === "all"
      ? tasks
      : tasks.filter((task) => task.status === statusFilter);

  const timelineDates = getTimelineDates(filteredTasks);
  const timelineStart = timelineDates[0];

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
          {/* Task Bars */}
          <div className="space-y-4 mt-4">
            {filteredTasks.map((task) => {
              const left =
                offsetFromStart(task.startDate, timelineStart) * DAY_WIDTH;
              const width =
                (daysBetween(task.startDate, task.dueDate) + 1) * DAY_WIDTH;
              const valid =
                timelineDates.includes(task.startDate) &&
                timelineDates.includes(task.dueDate);

              return (
                <div key={task.id} className="flex items-center">
                  <div className="pr-4 w-48 font-medium text-slate-700 text-sm truncate">
                    {task.title}
                  </div>
                  <div
                    className="relative"
                    style={{
                      width: timelineDates.length * DAY_WIDTH,
                      height: 32,
                    }}>
                    {valid && (
                      <div
                        className={`absolute top-0 h-8 rounded cursor-pointer ${getBarColor(
                          task.status
                        )} text-white text-xs px-2 flex items-center`}
                        style={{
                          width: `${width}px`,
                          left: `${left}px`,
                          transition: "left 0.2s, width 0.2s",
                        }}
                        onClick={() => openEditModal(task)}
                        title="Click to edit">
                        {task.status}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {filteredTasks.length === 0 && (
        <div className="pt-20 text-slate-400 text-center">
          [Timeline will appear here]
        </div>
      )}
    </section>
  );
};

export default CalendarTimeline;
