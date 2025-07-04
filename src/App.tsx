import React, { useState, useEffect } from "react";
import Header from "./shared/components/Header";
import Sidebar from "./shared/components/Sidebar";
import TaskList from "./shared/components/TaskList";
import CalendarTabs from "./shared/components/CalendarTabs";
import MonthView from "./views/MonthView";
import WeekView from "./views/WeekView";
import TimelineView from "./views/TimelineView";

// Define types here so all components can use them
export type TaskStatus = "not started" | "in progress" | "done";
export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  startDate: string;      // "YYYY-MM-DD"
  endDate: string;        // "YYYY-MM-DD"
  startTime: string;      // "HH:mm"
  endTime?: string;       // "HH:mm", optional
  category?: string;      // optional category field
}

const statusCycle: Record<TaskStatus, TaskStatus> = {
  "not started": "in progress",
  "in progress": "done",
  done: "not started",
};

const TAB_KEY = "taskflow_activeTab";

const App: React.FC = () => {
  // Centralized tasks state (start empty)
  const [tasks, setTasks] = useState<Task[]>([]);
  // Read initial tab from localStorage, fallback to "month"
  const [activeTab, setActiveTab] = useState<"month" | "week" | "timeline">(
    () =>
      (localStorage.getItem(TAB_KEY) as "month" | "week" | "timeline") ||
      "month"
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Save tab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(TAB_KEY, activeTab);
  }, [activeTab]);

  // Add a new task
  const handleAddTask = (
    title: string,
    status: Task["status"],
    startDate: string,
    endDate: string,
    startTime: string,
    endTime?: string,
    category?: string
  ) => {
    const newTask: Task = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      title,
      status,
      startDate,
      endDate,
      startTime,
      endTime,
      category,
    };
    setTasks((prev) => [...prev, newTask]);
  };

  // Update a task's status
  const updateTaskStatus = (id: string, newStatus: Task["status"]) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, status: newStatus } : task
      )
    );
  };

  // Handler to cycle status
  const handleStatusClick = (id: string) => {
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
        {/* Main content area */}
        <main className="flex flex-1">
          {/* Task list and form always visible on the left */}
          <TaskList
            tasks={
              selectedDate
                ? tasks.filter((t) => t.startDate === selectedDate)
                : tasks
            }
            onAddTask={handleAddTask}
            onStatusClick={handleStatusClick}
          />
          {/* Calendar section swaps based on activeTab */}
          <div className="flex flex-col flex-1">
            <CalendarTabs activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="flex-1 mt-6">
              {tasks.length === 0 ? (
                <div className="pt-20 text-slate-400 text-center">
                  No tasks to display.
                </div>
              ) : (
                <>
                  {activeTab === "month" && (
                    <MonthView
                      tasks={tasks}
                      selectedDate={selectedDate}
                      onDateSelect={setSelectedDate}
                    />
                  )}
                  {activeTab === "week" && <WeekView tasks={tasks} />}
                  {activeTab === "timeline" && <TimelineView tasks={tasks} />}
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
