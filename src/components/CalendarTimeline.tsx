import type { Task } from "../App";


interface CalendarTimelineProps {
  tasks: Task[];
}

// Helper to group tasks by due date
const groupTasksByDate = (tasks: Task[]) => {
  const map: { [date: string]: Task[] } = {};
  tasks.forEach((task) => {
    const date = task.dueDate || "No Date";
    if (!map[date]) map[date] = [];
    map[date].push(task);
  });
  return map;
};

const CalendarTimeline: React.FC<CalendarTimelineProps> = ({ tasks }) => {
  const grouped = groupTasksByDate(tasks);

  return (
    <section className="flex-1 bg-slate-50 p-4 overflow-y-auto">
      <h2 className="mb-4 font-semibold text-slate-800 text-lg">Timeline View</h2>
      <div className="space-y-6">
        {Object.keys(grouped).length === 0 ? (
          <div className="pt-20 text-slate-400 text-center">[Timeline will appear here]</div>
        ) : (
          Object.keys(grouped).map((date) => (
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