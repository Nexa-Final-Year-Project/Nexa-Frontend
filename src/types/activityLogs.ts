export enum ActionType {
  CREATED = "created",
  UPDATED = "updated",
  DELETED = "deleted",
  COMMENTED = "commented",
  ASSIGNED = "assigned",
  UNASSIGNED = "unassigned",
  STATUS_CHANGED = "status_changed",
  OTHER = "other",
}

export enum EntityType {
  TASK = "Task",
  PROJECT = "Project",
  SPRINT = "Sprint",
  USER = "User",
  COMMENT = "Comment",
  OTHER = "Other",
}

export type ActivityLog = {
  _id: string;
  user: string;
  action: ActionType;
  entityType: EntityType;
  project?: string;
  task?: string;
  sprint?: string;
  comment?: string;
  timestamp: string; // ISO date string
  details?: string; // Additional details about the action
};

export type SearchResult = {
  id: string;
  entityType: EntityType;
  title: string;
  description?: string;
  link: string;
};
