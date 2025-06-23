import React, { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import TaskList from "./components/TaskList";
import CalendarTimeline from "./components/CalendarTimeline";
import CalendarTabs from "./components/CalendarTabs";

// Define types here so all components can use them
export type TaskStatus = "not started" | "in progress" | "done";
export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  startDate: string;
  dueDate: string;
  category?: string; // or project?: string
}

const statusCycle: Record<TaskStatus, TaskStatus> = {
  "not started": "in progress",
  "in progress": "done",
  done: "not started",
};

const App: React.FC = () => {
  // Centralized tasks state (start empty)
  const [tasks, setTasks] = useState<Task[]>([]);

  // Add a new task with a dueDate from the form (or today if not provided)
  const handleAddTask = (
    title: string,
    status: Task["status"],
    startDate?: string,
    dueDate?: string,
    category?: string
  ) => {
    const newTask: Task = {
      id: Date.now(),
      title,
      status,
      startDate: startDate || new Date().toISOString().split("T")[0], // Use provided startDate if available
      dueDate: dueDate || new Date().toISOString().split("T")[0],
      category: category || "Uncategorized", // set category here
    };
    setTasks((prev) => [...prev, newTask]);
  };

  // Update a task's status
  const updateTaskStatus = (id: number, newStatus: Task["status"]) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  };

  // Handler to cycle status
  const handleStatusClick = (id: number) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      updateTaskStatus(id, statusCycle[task.status]);
    }
  };

  return (
    <div className="flex flex-col bg-slate-100 h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 flex flex-col">
          {/* Add CalendarTabs at the top of your main content area */}
          <CalendarTabs />
          <TaskList
            tasks={tasks}
            onAddTask={handleAddTask}
            onStatusClick={handleStatusClick}
          />
          <CalendarTimeline tasks={tasks} />
        </main>
      </div>
    </div>
  );
};

export default App;
