import React from "react";
import type { Task } from "../../App";

interface TimelineViewProps {
  tasks: Task[];
}

const TimelineView: React.FC<TimelineViewProps> = ({ tasks }) => (
  <div className="p-6">
    <h2 className="mb-4 font-bold text-slate-700 text-xl">Timeline View</h2>
    <div className="flex justify-center items-center bg-white shadow p-4 rounded min-h-[120px]">
      {/* Timeline chart will go here */}
      <span className="text-slate-400">[Timeline chart placeholder]</span>
      {/* Render tasks to avoid unused variable warning */}
      <pre className="hidden">{JSON.stringify(tasks, null, 2)}</pre>
    </div>
  </div>
);

export default TimelineView;

