import React, { useState } from "react";
import { FaRegCalendarAlt, FaRegCalendar, FaChartBar } from "react-icons/fa";

const tabOptions = [
  { key: "month", label: "Month View", icon: <FaRegCalendarAlt className="inline mr-2" /> },
  { key: "week", label: "Week View", icon: <FaRegCalendar className="inline mr-2" /> },
  { key: "timeline", label: "Timeline View", icon: <FaChartBar className="inline mr-2" /> },
] as const;

type TabKey = typeof tabOptions[number]["key"];

const CalendarTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("timeline");

  return (
    <div className="flex gap-2 mb-4 border-slate-200 border-b">
      {tabOptions.map((tab) => (
        <button
          key={tab.key}
          className={`px-4 py-2 rounded-t transition font-semibold flex items-center
            ${
              activeTab === tab.key
                ? "bg-slate-100 border-b-3 border-slate-600 text-slate-600 shadow-sm"
                : "bg-slate-300 text-slate-600 hover:bg-slate-200 hover:shadow"
            }
          `}
          style={{
            borderBottom:
              activeTab === tab.key
                ? "3px solid #475569"
                : "3px solid transparent",
          }}
          onClick={() => setActiveTab(tab.key)}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default CalendarTabs;