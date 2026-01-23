"use client";

import { useState, useMemo } from "react";
import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanProvider,
} from "@/components/ui/kanban/index";
import { Button } from "@/components/ui/button";
import { columns, users } from "./constants";
import { ColumnHeader } from "./ColumnHeader";
import { TaskCard } from "./TaskCard";
import { CreateTaskCard } from "./CreateTaskCard";
import { Task } from "@/types/task";
import { useTasks } from "@/hooks/tasks/useTasks";
import SearchBar from "./SearchBar";
import { MultiSelectDropdown as FilterDropdown } from "./FilterDropdown";
import { FilterPanel } from "./FilterPanel";
import { TopBar } from "./TopBar";
import EditTaskModal from "./EditTaskModal";
import { ProjectMember } from "@/types/project";

const priorities = ["Low", "Medium", "High"]; // example priorities

const Board = ({
  projectId,
  members,
  tasks,
  setTasks,
}: {
  projectId: string;
  members: ProjectMember[];
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [addingColumn, setAddingColumn] = useState<string | null>(null);
  const [editModal, setEditModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterOwner, setFilterOwner] = useState<string[]>([]);
  const [filterPriority, setFilterPriority] = useState("");

  const { createTask, updateTask, deleteTask, isLoading } = useTasks();
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);

  const [selectedOwners, setSelectedOwners] = useState<string[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (
        searchTerm &&
        !task.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !(task.description ?? "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
        return false;

      if (selectedOwners.length > 0 && !selectedOwners.includes(task.owner?.id))
        return false;

      if (
        selectedPriorities.length > 0 &&
        !selectedPriorities.includes(task.priority)
      )
        return false;

      if (
        selectedStatuses.length > 0 &&
        !selectedStatuses.includes(task.status)
      )
        return false;

      return true;
    });
  }, [tasks, searchTerm, selectedOwners, selectedPriorities, selectedStatuses]);

  const activeFilters = [
    ...selectedOwners.map((id) => ({
      label: `Owner: ${users.find((u) => u.id === id)?.name ?? id}`,
      value: id,
    })),
    ...selectedPriorities.map((p) => ({ label: `Priority: ${p}`, value: p })),
    ...selectedStatuses.map((s) => ({ label: `Status: ${s}`, value: s })),
  ];

  const handleCreateTask = async (
    columnId: string,
    taskData: {
      name: string;
      ownerId: string;
      dateType: "due" | "start";
      date: string;
    }
  ) => {
    const newTask: Task = {
      _id: `task-${Date.now()}`,
      title: taskData.name,
      description: "",
      status: columnId, // Use columnId directly since it matches status
      priority: "Medium",
      dueDate: taskData.date ? new Date(taskData.date) : new Date(),
      project: projectId,
      createdAt: new Date(),
      updatedAt: new Date(),
      type: "Feature",
      owner: users.find((u) => u.id === taskData.ownerId) || undefined,
    };

    await createTask(newTask);
    setAddingColumn(null);
  };

  // Handle task movement between columns
  const handleTaskMove = async (taskId: string, newColumnId: string) => {
    const taskToUpdate = tasks.find((task) => task._id === taskId);
    if (!taskToUpdate) return;
    const prevStatus = taskToUpdate?.status;
    try {
      // Update the task status (column)
      const updatedTask = {
        ...taskToUpdate,
        status: newColumnId,
        updatedAt: new Date(),
      };

      setTasks(tasks.map((task) => (task._id === taskId ? updatedTask : task)));
      await updateTask(taskId, { status: newColumnId });
    } catch (error) {
      setTasks(
        tasks.map((task) =>
          task._id === taskId ? { ...task, status: prevStatus } : task
        )
      );
    }
  };
  const handleEditTask = (taskId: string) => {
    updateTask(taskId, { title: editValue });
    setEditingId(null);
  };

  const handleEditTaskModal = (task: Task) => {
    setEditingId(task._id);
    setEditValue(task.title);
    setEditModal(true);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
  };

  return (
    <>
      {/* Filters and Search Bar */}
      <TopBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        activeFilterCount={activeFilters.length}
        onOpenFilters={() => setFilterPanelOpen(true)}
        activeFilters={activeFilters}
        onRemoveFilter={(val) => {
          if (selectedOwners.includes(val)) {
            setSelectedOwners(selectedOwners.filter((id) => id !== val));
          } else if (selectedPriorities.includes(val)) {
            setSelectedPriorities(selectedPriorities.filter((p) => p !== val));
          } else {
            setSelectedStatuses(selectedStatuses.filter((s) => s !== val));
          }
        }}
        onClearFilters={() => {
          setSelectedOwners([]);
          setSelectedPriorities([]);
          setSelectedStatuses([]);
          setSearchTerm("");
        }}
        members={members}
      />
      <FilterPanel
        open={filterPanelOpen}
        onClose={() => setFilterPanelOpen(false)}
        owners={users}
        priorities={["Low", "Medium", "High", "Urgent"]}
        statuses={["Backlog", "In Progress", "Done", "Blocked"]}
        selectedOwners={selectedOwners}
        selectedPriorities={selectedPriorities}
        selectedStatuses={selectedStatuses}
        onApplyFilters={(owners, priorities, statuses) => {
          setSelectedOwners(owners);
          setSelectedPriorities(priorities);
          setSelectedStatuses(statuses);
        }}
        onClearAll={() => {
          setSelectedOwners([]);
          setSelectedPriorities([]);
          setSelectedStatuses([]);
        }}
      />
      <div className="w-full overflow-x-auto pb-4">
        <KanbanProvider
          columns={columns}
          data={columns
            .map((column) => {
              // Find tasks for this column
              const columnTasks = filteredTasks.filter(
                (task) => task.status === column.id
              );

              // If no tasks, create a dummy placeholder task to enable drag-and-drop
              if (columnTasks.length === 0) {
                return {
                  id: `placeholder-${column.id}`,
                  name: "placeholder",
                  column: column.id,
                  isPlaceholder: true, // Add a flag to identify placeholder tasks
                };
              }

              // Return actual tasks
              return columnTasks.map((task) => ({
                ...task,
                id: task._id,
                name: task.title,
                column: task.status,
                isPlaceholder: false,
              }));
            })
            .flat()} // Flatten the array of arrays
          onDataChange={(updatedData) => {
            // Find the task that moved by comparing with previous state
            updatedData.forEach((updatedItem) => {
              const originalTask = tasks.find(
                (task) => task._id === updatedItem.id
              );
              if (originalTask && originalTask.status !== updatedItem.column) {
                // Task moved to a different column
                handleTaskMove(updatedItem.id, updatedItem.column);
              }
            });
          }}
          className="auto-cols-[minmax(260px,1fr)] sm:auto-cols-[minmax(300px,1fr)] grid-flow-col gap-4 p-3 min-w-full"
        >
        {(column) => {
          const columnTasks = filteredTasks.filter(
            (task) => task.status === column.id
          );
          const hasPlaceholder = columnTasks.length === 0;

          return (
            <KanbanBoard
              id={column.id}
              key={column.id}
              className="min-w-[260px] sm:min-w-[300px]"
            >
              <ColumnHeader
                column={column}
                taskCount={columnTasks.length}
                onAddTask={() => setAddingColumn(column.id)}
              />

              <KanbanCards id={column.id}>
                {(kanbanItem) => {
                  // Skip rendering for placeholder tasks
                  if (kanbanItem.isPlaceholder) {
                    return null;
                  }

                  const task = tasks.find((t) => t._id === kanbanItem.id);
                  if (!task) return null;

                  return (
                    <KanbanCard
                      key={task._id}
                      id={task._id}
                      column={column.id}
                      name={task.title}
                      className="glass-card !cursor-pointer group"
                    >
                      <TaskCard
                        task={task}
                        isEditing={editingId === task._id}
                        editValue={editValue}
                        onEditChange={setEditValue}
                        onStartEdit={() => {
                          setEditingId(task._id);
                          setEditValue(task.title);
                        }}
                        onSaveEdit={() => handleEditTask(task._id)}
                        onCancelEdit={() => setEditingId(null)}
                        onDelete={() => handleDeleteTask(task._id)}
                        handleEditTaskModal={handleEditTaskModal}
                        members={members}
                      />
                    </KanbanCard>
                  );
                }}
              </KanbanCards>

              {/* Rest of your column code remains the same */}
              {addingColumn === column.id && (
                <CreateTaskCard
                  column={column}
                  users={users}
                  onCreate={(taskData) => handleCreateTask(column.id, taskData)}
                  onCancel={() => setAddingColumn(null)}
                  isLoading={isLoading}
                />
              )}

              {!addingColumn && (
                <div className="flex items-center justify-start gap-2 p-2">
                  <Button
                    className="mt-2 text-sm dark:text-gray-100 gap-2 justify-start cursor-pointer"
                    variant="outline"
                    onClick={() => setAddingColumn(column.id)}
                  >
                    + Create
                  </Button>
                </div>
              )}
            </KanbanBoard>
          );
        }}
        </KanbanProvider>
      </div>
      {editModal && (
        <EditTaskModal
          open={editModal}
          onClose={() => setEditModal(false)}
          initialData={tasks.find((t) => t._id === editingId)}
          assignees={users}
          onSave={(updatedTask) => {
            updateTask(updatedTask._id, updatedTask);
            setEditModal(false);
          }}
        />
      )}
    </>
  );
};

export default Board;
