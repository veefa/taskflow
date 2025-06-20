import type { Task, TaskStatus } from "../App";
import AddTaskForm from "./AddTaskForm";

interface TaskListProps {
  tasks: Task[];
  onAddTask: (
    title: string,
    status: TaskStatus,
    startDate?: string,
    dueDate?: string,
    category?: string
  ) => void;
  onStatusClick: (id: number) => void;
}

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

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onAddTask,
  onStatusClick,
}) => (
  <section className="bg-white p-4 border-slate-300 border-r w-1/3">
    <h2 className="mb-4 font-semibold text-slate-800 text-lg">Your Tasks</h2>
    <AddTaskForm onAddTask={onAddTask} />
    <div className="space-y-3">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex justify-between items-center bg-slate-100 p-3 border border-slate-300 rounded">
          <div>
            <div className="font-medium text-slate-700">{task.title}</div>
            <div className="text-slate-500 text-sm">
              Due:{" "}
              {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString()
                : "--/--/----"}
            </div>
            {task.category && (
              <div className="mt-1 text-slate-400 text-xs">
                Category: {task.category}
              </div>
            )}
          </div>
          <button
            onClick={() => onStatusClick(task.id)}
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

export default TaskList;
