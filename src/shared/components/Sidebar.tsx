const Sidebar = () => {
  return (
    <aside className="bg-slate-200 p-4 border-slate-300 border-r w-80">
      <div className="mb-2 font-semibold text-slate-700">Navigation</div>
      <ul className="space-y-2 text-slate-600 text-sm">
        <li className="bg-slate-300 p-2 rounded">Today</li>
        <li className="bg-slate-300 p-2 rounded">This Week</li>
        <li className="bg-slate-300 p-2 rounded">Projects</li>
      </ul>
    </aside>
  );
};

export default Sidebar;