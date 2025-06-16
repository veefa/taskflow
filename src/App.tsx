import React from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TaskList from './components/TaskList';
import CalendarTimeline from './components/CalendarTimeline';

const App: React.FC = () => {
  return (
    <div className="flex flex-col bg-slate-100 h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <TaskList />
        <CalendarTimeline />
      </div>
    </div>
  );
};

export default App;