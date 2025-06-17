const getStatusColor = (status: string) => {
  switch (status) {
    case "in progress":
      return "bg-yellow-400 text-yellow-900";
    case "done":
      return "bg-green-400 text-green-900";
    case "not started":
    default:
      return "bg-gray-300 text-gray-700";
  }
};

const TaskList = () => {
  const tasks = [
    { id: 1, title: "Design Homepage", status: "in progress" },
    { id: 2, title: "Write Wireframe Notes", status: "done" },
    { id: 3, title: "Plan Database", status: "not started" },
  ];

  return (
    <section className="w-1/3 bg-white p-4 border-r border-slate-300">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">Your Tasks</h2>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className="p-3 rounded bg-slate-100 border border-slate-300 flex justify-between items-center">
            <div>
              <div className="font-medium text-slate-700">{task.title}</div>
              <div className="text-sm text-slate-500">Due: --/--/----</div>
            </div>
            <span
              className={`text-xs px-2 py-1 rounded-full font-semibold ${getStatusColor(
                task.status
              )}`}
            >
              {task.status}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TaskList;