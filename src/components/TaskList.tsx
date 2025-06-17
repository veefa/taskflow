import { useState } from "react";
import AddTaskForm from "./AddTaskForm";

type TaskStatus = "not started" | "in progress" | "done";

interface Task {
  id: number;
  title: string;
  status: TaskStatus;
}

const statusCycle: Record<TaskStatus, TaskStatus> = {
  "not started": "in progress",
  "in progress": "done",
  done: "not started",
};

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
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Design Homepage", status: "in progress" },
    { id: 2, title: "Write Wireframe Notes", status: "done" },
    { id: 3, title: "Plan Database", status: "not started" },
  ]);

  const handleAddTask = (title: string, status: TaskStatus) => {
    setTasks((prev) => [...prev, { id: Date.now(), title, status }]);
  };

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
