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
  Zap,
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

// Priority color mapping
const priorityGlow: Record<string, string> = {
  "Urgent": "shadow-[0_0_15px_rgba(239,68,68,0.3)]",
  "High": "shadow-[0_0_15px_rgba(245,158,11,0.2)]",
  "Medium": "shadow-[0_0_10px_rgba(59,130,246,0.15)]",
  "Low": "shadow-none",
};

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
          className="
            p-1.5 rounded-lg cursor-pointer
            opacity-0 group-hover:opacity-100
            hover:bg-white/[0.08]
            transition-all duration-200
          "
        >
          <MoreVertical className="h-4 w-4 text-white/50" />
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

  const glowClass = priorityGlow[task.priority] || priorityGlow["Low"];

  return (
    <div
      className={`
        !cursor-pointer group
        relative overflow-hidden
        bg-neutral-900/60 border border-white/[0.06]
        rounded-xl p-3
        hover:border-white/[0.12]
        hover:bg-neutral-900/80
        transition-all duration-300
        ${glowClass}
      `}
      onClick={() => {
        if (!isEditing && handleEditTaskModal) handleEditTaskModal(task);
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (
          !isEditing &&
          handleEditTaskModal &&
          (e.key === "Enter" || e.key === " ")
        ) {
          handleEditTaskModal(task);
        }
      }}
    >
      {/* Hover shine effect */}
      <div className="
        absolute inset-0 
        bg-gradient-to-r from-transparent via-white/[0.02] to-transparent
        translate-x-[-100%] group-hover:translate-x-[100%]
        transition-transform duration-700 ease-out
        pointer-events-none
      " />
      
      <div className="relative z-10 flex flex-col gap-3">
        {/* Header: Priority and Menu */}
        <div className="flex items-center justify-between">
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
              className="flex items-center gap-2 w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                value={editValue}
                onChange={(e) => onEditChange(e.target.value)}
                className="
                  flex-1 text-sm font-medium
                  bg-white/[0.03] border border-white/[0.1]
                  rounded-lg px-3 py-2
                  text-white placeholder:text-white/30
                  focus:border-violet-500/40 focus:outline-none
                  transition-all duration-200
                "
                autoFocus
              />
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onSaveEdit}
                className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 cursor-pointer"
              >
                <Check className="h-4 w-4 text-emerald-400" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onCancelEdit}
                className="h-8 w-8 rounded-lg bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 cursor-pointer"
              >
                <X className="h-4 w-4 text-rose-400" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <p className="font-medium text-sm text-white/90 line-clamp-2">{task?.title}</p>
            </div>
          )}
        </div>

        {/* Footer: Date, Type & Avatar */}
        <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
          <div className="flex flex-col gap-1.5">
            {/* Due Date Badge */}
            <div className="
              flex items-center gap-1.5
              text-xs font-medium
              bg-amber-500/10 border border-amber-500/20
              text-amber-400 rounded-lg
              px-2 py-1 w-fit
            ">
              <Clock className="h-3 w-3" />
              {String(
                shortDateFormatter.format(new Date(task?.dueDate || new Date()))
              )}
            </div>
            {/* Task Type */}
            <div className="flex items-center gap-1.5 text-xs text-white/40">
              <Zap className="h-3 w-3 text-violet-400" />
              {task?.type}
            </div>
          </div>
          
          {/* Assigned Users */}
          <div className="flex items-center gap-2">
            {task?.assignedUsers && task.assignedUsers.length > 0 && (
              <div className="
                ring-2 ring-neutral-900 rounded-full
                shadow-[0_0_10px_rgba(139,92,246,0.2)]
              ">
                <Avatar className="h-7 w-7">
                  <AvatarImage
                    src={task.assignedUsers[0]?.avatar?.url}
                    alt={task.assignedUsers[0]?.name || "Assignee"}
                  />
                </Avatar>
              </div>
            )}
            <AssignTasksPanel
              members={members}
              taskId={task?._id}
              assignee={task?.assignedUsers?.[0]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
