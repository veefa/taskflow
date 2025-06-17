import { useState } from "react";

type TaskStatus = "not started" | "in progress" | "done";

interface AddTaskFormProps {
  onAddTask: (title: string, status: TaskStatus) => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<TaskStatus>("not started");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask(title.trim(), status);
    setTitle("");
    setStatus("not started");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mb-4">
      <input
        type="text"
        value={title}
        placeholder="Task title"
        onChange={(e) => setTitle(e.target.value)}
        className="bg-white p-2 border border-slate-300 rounded w-full text-slate-700"
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as TaskStatus)}
        className="bg-white p-2 border border-slate-300 rounded w-full text-slate-700"
      >
        <option value="not started">Not Started</option>
        <option value="in progress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <button
        type="submit"
        className="bg-violet-700 hover:bg-violet-800 p-2 rounded w-full font-semibold text-white"
      >
        Add Task
      </button>
    </form>
  );
};

export default AddTaskForm;