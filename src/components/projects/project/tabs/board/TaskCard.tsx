"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar/avatar";
import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  Clock,
  Pencil,
  Check,
  X,
  MoreHorizontal,
  MoreVertical,
} from "lucide-react";
import { shortDateFormatter } from "./constants";
import { ReusableDropdownMenu } from "@/components/ui/dropdown/ReusableDropdownMenu";
import { Task, TaskPriority } from "@/types/task";
import PriorityBadge from "@/components/tasks/PriorityBadge";
import { useTasks } from "@/hooks/tasks/useTasks";
import DropdownSearchPanel from "@/components/shared/search/DropdownSearchPanel";
import AssignTasksPanel from "@/components/shared/search/panels/AssignTasksPanel";
import { ProjectMember } from "@/types/project";

interface TaskCardProps {
  task: Task;
  isEditing: boolean;
  editValue: string;
  onEditChange: (value: string) => void;
  onStartEdit: () => void;
  setEditModal: (open: boolean) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDelete: () => void;
  handleEditTaskModal?: (task: Task) => void; // Optional for edit modal handling
  members: ProjectMember[]; // Add members prop to pass project members
}

export const TaskCard = ({
  task,
  isEditing,
  editValue,
  onEditChange,
  onStartEdit,
  setEditModal,
  onSaveEdit,
  onCancelEdit,
  onDelete,
  handleEditTaskModal,
  members,
}: TaskCardProps) => {
  const { updateTask } = useTasks();
  const renderMenu = () => (
    <ReusableDropdownMenu
      trigger={
        <Button
          variant="ghost"
          className="p-1 cursor-pointer group-hover:opacity-100 opacity-0"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      }
      items={[
        { label: "Edit", onClick: () => handleEditTaskModal?.(task) },
        { label: "Delete", onClick: onDelete },
      ]}
    />
  );

  const handlePriorityChange = async (priority: TaskPriority) => {
    await updateTask(task?._id, {
      priority,
    });
  };

  return (
    <div className=" !cursor-pointer group">
      <div className="flex flex-col gap-2 items-start p-2">
        <div className="flex items-center justify-between w-full">
          <PriorityBadge
            priority={task.priority}
            onPriorityChange={handlePriorityChange}
          />
          {renderMenu()}
        </div>
        {/* Title / Edit */}
        <div className="flex items-center justify-between w-full">
          {isEditing ? (
            <div
              className="flex items-center gap-1 w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                value={editValue}
                onChange={(e) => onEditChange(e.target.value)}
                className="flex-1 text-sm border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent"
                autoFocus
              />
              <Button variant="ghost" size="icon" onClick={onSaveEdit}>
                <Check className="h-4 w-4 text-green-500" />
              </Button>
              <Button variant="ghost" size="icon" onClick={onCancelEdit}>
                <X className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <p className="font-medium text-sm">{task?.title}</p>
              <Pencil
                className="h-3.5 w-3.5 text-gray-400 opacity-0 group-hover:opacity-100 cursor-pointer"
                onClick={onStartEdit}
              />
            </div>
          )}
        </div>

        {/* Date & Avatar */}
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col gap-1">
            <div
              className={`flex items-center gap-1 text-xs font-medium rounded px-1 py-[1px] w-fit ${"text-orange-500 border border-orange-500"}`}
            >
              <Clock className="h-3 w-3" />
              {String(
                shortDateFormatter.format(new Date(task?.dueDate || new Date()))
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              {task?.type}
            </div>
          </div>
          {/* {task?.createdBy && (
            <Avatar className="h-6 w-6">
              <AvatarImage
                src={task?.createdBy?.avatar?.url}
                alt={task?.createdBy?.name}
              />
            </Avatar>
          )} */}
          <AssignTasksPanel
            members={members}
            taskId={task?._id}
            assignee={task?.assignedUsers?.[0]}
          />
        </div>
      </div>
    </div>
  );
};
