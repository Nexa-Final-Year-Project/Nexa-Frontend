import { useTheme } from "next-themes";
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
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const gradient = columnGradients[column.name] || columnGradients["Backlog"];

  return (
    <KanbanHeader>
      <div
        className={`
        flex items-center justify-between w-full
        px-4 py-3 rounded-xl
        backdrop-blur-sm border
        ${
          isDark
            ? "bg-neutral-900/60 border-white/[0.06]"
            : "bg-neutral-50 border-neutral-300"
        }
      `}
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
          <span
            className={`text-sm font-semibold tracking-wide ${
              isDark ? "text-white/90" : "text-neutral-900"
            }`}
          >
            {column.name}
          </span>

          {/* Task count badge */}
          {taskCount > 0 && (
            <span
              className={`
              px-2 py-0.5 rounded-md border
              text-xs font-medium
              ${
                isDark
                  ? "bg-white/[0.06] border-white/[0.04] text-white/50"
                  : "bg-neutral-200 border-neutral-300 text-neutral-700"
              }
            `}
            >
              {taskCount}
            </span>
          )}
        </div>

        {/* Add task button */}
        <button
          onClick={onAddTask}
          className={`
            p-1.5 rounded-lg
            border transition-all duration-200 cursor-pointer
            group
            ${
              isDark
                ? "bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.04] hover:border-white/[0.1]"
                : "bg-neutral-200 hover:bg-neutral-300 border-neutral-300 hover:border-neutral-400"
            }
          `}
        >
          <Plus
            className={`w-4 h-4 transition-colors ${
              isDark
                ? "text-white/40 group-hover:text-white/70"
                : "text-neutral-600 group-hover:text-neutral-900"
            }`}
          />
        </button>
      </div>
    </KanbanHeader>
  );
};
