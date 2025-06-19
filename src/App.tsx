import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TaskList from './components/TaskList';
import CalendarTimeline from './components/CalendarTimeline';

// Define types here so all components can use them
export type TaskStatus = "not started" | "in progress" | "done";
export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
  dueDate: string; // Added dueDate for timeline/calendar
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
  const handleAddTask = (title: string, status: Task["status"], dueDate?: string) => {
    const newTask: Task = {
      id: Date.now(),
      title,
      status,
      dueDate: dueDate || new Date().toISOString().split("T")[0],
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
        <TaskList
          tasks={tasks}
          onAddTask={handleAddTask}
          onStatusClick={handleStatusClick}
        />
        <CalendarTimeline tasks={tasks} />
      </div>
    </div>
  );
};

export default App;