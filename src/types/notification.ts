export type NotificationType =
  | "task"
  | "comment"
  | "mention"
  | "sprint"
  | "project"
  | "system";

export type Notification = {
  _id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt?: string;
  relatedId?: string; // ID of task, comment, sprint, etc.
  relatedType?: string; // "task", "sprint", "project", etc.
  actionUrl?: string; // URL to navigate to
  avatarUrl?: string;
  senderName?: string;
};
