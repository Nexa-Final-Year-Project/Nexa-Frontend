import { Task } from "@/types/task";
import React from "react";
import { CheckCircle2, Clock, AlertCircle, Circle, ArrowRight } from "lucide-react";

const getPriorityColor = (priority: string) => {
  switch (priority?.toLowerCase()) {
    case 'high':
      return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
    case 'medium':
      return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'low':
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    default:
      return 'bg-white/10 text-white/60 border-white/20';
  }
};

const getStatusIcon = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'completed':
    case 'done':
      return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    case 'in progress':
    case 'in-progress':
      return <Clock className="w-4 h-4 text-cyan-400" />;
    case 'blocked':
      return <AlertCircle className="w-4 h-4 text-rose-400" />;
    default:
      return <Circle className="w-4 h-4 text-white/40" />;
  }
};

const TasksList = ({ tasks }: { tasks: Task[] }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="
        flex flex-col items-center justify-center py-12
        bg-neutral-900/40 rounded-2xl border border-white/[0.06]
        backdrop-blur-sm
      ">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mb-4">
          <CheckCircle2 className="w-8 h-8 text-white/20" />
        </div>
        <p className="text-white/40 text-sm">No tasks assigned yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {tasks.map((task) => (
        <div 
          key={task._id} 
          className="
            group p-4 rounded-xl
            bg-neutral-900/40 border border-white/[0.06]
            hover:bg-neutral-900/60 hover:border-white/[0.1]
            transition-all duration-300 cursor-pointer
            backdrop-blur-sm
          "
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              <div className="mt-0.5">
                {getStatusIcon(task.status)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-white truncate group-hover:text-white/90 transition-colors">
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-xs text-white/40 mt-1 line-clamp-1">
                    {task.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <span className={`
                    px-2 py-0.5 text-[10px] font-medium rounded-full border
                    ${getPriorityColor(task.priority)}
                  `}>
                    {task.priority || 'Normal'}
                  </span>
                  <span className="text-[10px] text-white/30">
                    {task.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="
              w-8 h-8 rounded-lg flex items-center justify-center
              bg-white/[0.02] border border-white/[0.04]
              opacity-0 group-hover:opacity-100 transition-opacity duration-300
            ">
              <ArrowRight className="w-4 h-4 text-white/40" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TasksList;
