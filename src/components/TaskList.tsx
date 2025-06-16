import React from 'react';
 
const TaskList: React.FC = () => {
    return (
        <div>
          <h2 className="font-bold text-lg">Task List</h2>
          <div className="flex flex-col space-y-4">
            <div className="bg-white shadow p-4 rounded">
              <h3 className="font-semibold">Task 1</h3>
              <p>Details about task 1</p>
            </div>
            <div className="bg-white shadow p-4 rounded">
              <h3 className="font-semibold">Task 2</h3>
              <p>Details about task 2</p>
            </div>
            {/* Add more tasks as needed */}
          </div>
        </div>
      );
}
 
export default TaskList;