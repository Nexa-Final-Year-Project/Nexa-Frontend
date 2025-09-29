import { ColumnType } from "./types";
import { Button } from "@/components/ui/button";
import { KanbanHeader } from "@/components/ui/kanban";
import { Plus } from "lucide-react";

interface ColumnHeaderProps {
  column: ColumnType;
  taskCount: number;
  onAddTask: () => void;
}

export const ColumnHeader = ({
  column,
  taskCount,
  onAddTask,
}: ColumnHeaderProps) => {
  return (
    <KanbanHeader>
      <div className="flex items-center gap-2">
        <div
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: column.color }}
        />
        <span className="uppercase text-sm font-medium">
          {column.name}
          {taskCount > 0 && (
            <span className="ml-1 text-xs text-gray-400">{taskCount}</span>
          )}
        </span>
      </div>
    </KanbanHeader>
  );
};
