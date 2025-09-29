export type Task = {
  _id: string;
  title: string;
  description?: string;
  type: TaskType;
  status: TaskStatus;
  priority: TaskPriority;
  project: string;
  dueDate?: Date;
  createdBy?: {
    _id: string;
    name: string;
    avatar: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
};

export type TaskAssignment = {
  _id: string;
  task: Task;
  assignee: string;
  assignedAt: string;
};

export type TaskPriority = "Low" | "Medium" | "High";
export type TaskStatus = "Backlog" | "In Progress" | "Blocked" | "Done";
export type TaskType = "Bug" | "Feature" | "Research" | "Blocker";
