import { Task } from "@/types/task";
import React from "react";

const TasksList = ({ tasks }: { tasks: Task[] }) => {
  return (
    <div>
      {tasks.map((task) => (
        <div key={task._id} className="p-4 border rounded-md shadow-sm">
          <h3 className="text-lg font-semibold">{task.title}</h3>
          <p className="text-sm text-gray-600">{task.description}</p>
          <p className="text-xs text-gray-400">Status: {task.status}</p>
        </div>
      ))}
    </div>
  );
};

export default TasksList;
