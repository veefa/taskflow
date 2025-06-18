import { useState } from "react";
import AddTaskForm from "./AddTaskForm";

// Define possible task statuses
type TaskStatus = "not started" | "in progress" | "done";

// Task interface for type safety
interface Task {
  id: number;
  title: string;
  status: TaskStatus;
}

// Map each status to the next status for cycling
const statusCycle: Record<TaskStatus, TaskStatus> = {
  "not started": "in progress",
  "in progress": "done",
  done: "not started",
};

// Return Tailwind classes for each status badge
const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case "in progress":
      return "bg-yellow-400 text-yellow-900";
    case "done":
      return "bg-green-400 text-green-900";
    case "not started":
    default:
      return "bg-gray-300 text-gray-700";
  }
};

const TaskList = () => {
  // Local state for managing the list of tasks
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Design Homepage", status: "in progress" },
    { id: 2, title: "Write Wireframe Notes", status: "done" },
    { id: 3, title: "Plan Database", status: "not started" },
  ]);

  // Add a new task to the list
  const handleAddTask = (title: string, status: TaskStatus) => {
    setTasks((prev) => [...prev, { id: Date.now(), title, status }]);
  };

  // Cycle the status of a task when its badge is clicked
  const handleStatusClick = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, status: statusCycle[task.status] } : task
      )
    );
  };

  return (
    <section className="bg-white p-4 border-slate-300 border-r w-1/3">
      <h2 className="mb-4 font-semibold text-slate-800 text-lg">Your Tasks</h2>
      {/* Form for adding new tasks */}
      <AddTaskForm onAddTask={handleAddTask} />
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex justify-between items-center bg-slate-100 p-3 border border-slate-300 rounded">
            <div>
              <div className="font-medium text-slate-700">{task.title}</div>
              <div className="text-slate-500 text-sm">Due: --/--/----</div>
            </div>
            {/* Clickable status badge to cycle status */}
            <button
              onClick={() => handleStatusClick(task.id)}
              className={`text-xs px-2 py-1 rounded-full font-semibold ${getStatusColor(
                task.status
              )} transition`}>
              {task.status}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TaskList;
