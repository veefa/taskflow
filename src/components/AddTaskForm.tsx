import { useState } from "react";

// Define the possible statuses a task can have
type TaskStatus = "not started" | "in progress" | "done";

// Props for AddTaskForm: expects a function to handle adding a task
interface AddTaskFormProps {
  onAddTask: (title: string, status: TaskStatus, dueDate?: string) => void;
}

// Functional component for the Add Task form
const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAddTask }) => {
  // State for the task title input
  const [title, setTitle] = useState("");
  // State for the task status select
  const [status, setStatus] = useState<TaskStatus>("not started");
  // State for the due date input
  const [dueDate, setDueDate] = useState<string>("");

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (!title.trim()) return; // Do not submit if title is empty

    // Call the parent handler to add the task
    onAddTask(title.trim(), status, dueDate || undefined);
    // Reset form fields after submission
    setTitle("");
    setStatus("not started");
    setDueDate("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mb-4">
      {/* Input for task title */}
      <input
        type="text"
        value={title}
        placeholder="Task title"
        onChange={(e) => setTitle(e.target.value)}
        className="bg-white p-2 border border-slate-300 rounded w-full text-slate-700"
      />
      {/* Dropdown to select task status */}
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as TaskStatus)}
        className="bg-white p-2 border border-slate-300 rounded w-full text-slate-700"
      >
        <option value="not started">Not Started</option>
        <option value="in progress">In Progress</option>
        <option value="done">Done</option>
      </select>
      {/* Date picker for due date */}
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="bg-white p-2 border border-slate-300 rounded w-full text-slate-700"
      />
      {/* Submit button */}
      <button
        type="submit"
        className="flex justify-center items-center gap-2 bg-slate-600 hover:bg-slate-700 shadow-sm px-4 py-2 rounded-md w-full font-semibold text-white transition"
      >
        Add Task
      </button>
    </form>
  );
};

export default AddTaskForm;