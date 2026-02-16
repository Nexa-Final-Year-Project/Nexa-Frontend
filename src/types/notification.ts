export type NotificationType =
  | "task"
  | "comment"
  | "mention"
  | "sprint"
  | "project"
  | "system"
  | "Task"
  | "Sprint"
  | "AI"
  | "Blocker";

export type Notification = {
  _id: string;
  user?: string; // Backend uses 'user' field for userId
  userId?: string; // Keep for backwards compatibility
  type?: NotificationType;
  content?: string; // Backend uses 'content' field
  title?: string; // Keep for backwards compatibility
  message?: string; // Keep for backwards compatibility
  read: boolean;
  createdAt: string;
  updatedAt?: string;
  relatedId?: string; // ID of task, comment, sprint, etc.
  relatedType?: string; // "task", "sprint", "project", etc.
  actionUrl?: string; // URL to navigate to
  avatarUrl?: string;
  senderName?: string;
};
