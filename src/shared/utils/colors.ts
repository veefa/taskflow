import type { Task } from "../../App";

export const getStatusDotColor = (status: Task["status"]) => {
  switch (status) {
    case "done":
      return "bg-green-400";
    case "in progress":
      return "bg-yellow-400";
    case "not started":
    default:
      return "bg-gray-300";
  }
};

export const getCategoryBgColor = (category?: string) => {
  switch (category) {
    case "Work":
      return "bg-blue-200 text-blue-900 border-blue-400";
    case "Personal":
      return "bg-green-200 text-green-900 border-green-400";
    case "Health":
      return "bg-pink-200 text-pink-900 border-pink-400";
    default:
      return "bg-slate-200 text-slate-900 border-slate-400";
  }
};