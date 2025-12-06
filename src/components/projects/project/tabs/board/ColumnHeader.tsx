import { ColumnType } from "./types";
import { Button } from "@/components/ui/button";
import { KanbanHeader } from "@/components/ui/kanban";
import { Plus, Sparkles } from "lucide-react";

interface ColumnHeaderProps {
  column: ColumnType;
  taskCount: number;
  onAddTask: () => void;
}

// Map column status to gradient colors
const columnGradients: Record<
  string,
  { from: string; to: string; glow: string }
> = {
  Backlog: {
    from: "from-slate-500",
    to: "to-slate-600",
    glow: "rgba(100,116,139,0.4)",
  },
  Todo: {
    from: "from-blue-500",
    to: "to-cyan-500",
    glow: "rgba(59,130,246,0.4)",
  },
  "In Progress": {
    from: "from-amber-500",
    to: "to-orange-500",
    glow: "rgba(245,158,11,0.4)",
  },
  Done: {
    from: "from-emerald-500",
    to: "to-green-500",
    glow: "rgba(16,185,129,0.4)",
  },
  Blocked: {
    from: "from-red-500",
    to: "to-rose-500",
    glow: "rgba(239,68,68,0.4)",
  },
};

export const ColumnHeader = ({
  column,
  taskCount,
  onAddTask,
}: ColumnHeaderProps) => {
  const gradient = columnGradients[column.name] || columnGradients["Backlog"];

  return (
    <KanbanHeader>
      <div
        className="
        flex items-center justify-between w-full
        px-4 py-3 rounded-xl
        bg-neutral-900/60 backdrop-blur-sm
        border border-white/[0.06]
      "
      >
        <div className="flex items-center gap-3">
          {/* Status indicator with glow */}
          <div
            className={`
              w-3 h-3 rounded-full
              bg-gradient-to-br ${gradient.from} ${gradient.to}
            `}
            style={{ boxShadow: `0 0 10px ${gradient.glow}` }}
          />

          {/* Column name */}
          <span className="text-sm font-semibold text-white/90 tracking-wide">
            {column.name}
          </span>

          {/* Task count badge */}
          {taskCount > 0 && (
            <span
              className="
              px-2 py-0.5 rounded-md
              bg-white/[0.06] border border-white/[0.04]
              text-xs font-medium text-white/50
            "
            >
              {taskCount}
            </span>
          )}
        </div>

        {/* Add task button */}
        <button
          onClick={onAddTask}
          className="
            p-1.5 rounded-lg
            bg-white/[0.04] hover:bg-white/[0.08]
            border border-white/[0.04] hover:border-white/[0.1]
            transition-all duration-200 cursor-pointer
            group
          "
        >
          <Plus className="w-4 h-4 text-white/40 group-hover:text-white/70 transition-colors" />
        </button>
      </div>
    </KanbanHeader>
  );
};
