import React from "react";
import type { Task } from "../../App";

interface WeekViewProps {
  tasks: Task[];
}

const WeekView: React.FC<WeekViewProps> = ({ tasks }) => (
  <div className="p-6">
    <h2 className="mb-4 font-bold text-slate-700 text-xl">Week View</h2>
    <div className="flex justify-center items-center bg-white shadow p-4 rounded min-h-[120px]">
      {/* Week grid will go here */}
      <span className="text-slate-400">[Week grid placeholder]</span>
      {/* Example usage to avoid unused variable warning: */}
 <pre>{JSON.stringify(tasks, null, 2)}</pre> 
    </div>
  </div>
);

export default WeekView;