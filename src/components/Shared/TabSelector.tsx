import React from 'react';
import clsx from 'clsx';
import { FaRegCalendarAlt, FaRegCalendar, FaChartBar } from 'react-icons/fa';

type ViewOption = 'month' | 'week' | 'timeline';

interface TabSelectorProps {
  activeTab: ViewOption;
  onTabChange: (tab: ViewOption) => void;
}

const tabs: { label: string; value: ViewOption; icon: React.ReactNode }[] = [
  { label: 'Month View', value: 'month', icon: <FaRegCalendarAlt className="inline mr-2" /> },
  { label: 'Week View', value: 'week', icon: <FaRegCalendar className="inline mr-2" /> },
  { label: 'Timeline View', value: 'timeline', icon: <FaChartBar className="inline mr-2" /> },
];

const TabSelector: React.FC<TabSelectorProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex border-b border-gray-300">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={clsx(
            'px-4 py-2 text-sm font-medium transition-colors duration-200 flex items-center',
            activeTab === tab.value
              ? 'border-b-2 border-indigo-600 font-bold text-indigo-600'
              : 'text-gray-500 hover:text-indigo-600'
          )}
          onClick={() => onTabChange(tab.value)}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabSelector;