import { ColumnType, User } from "./types";

export const columns: ColumnType[] = [
  { id: "Backlog", name: "Backlog", color: "#6B7280" },
  { id: "In Progress", name: "In Progress", color: "#F59E0B" },
  { id: "Blocked", name: "Blocked", color: "#10B981" },
  { id: "Done", name: "Done", color: "#9CA3AF" },
];

export const users: User[] = [
  { id: "user-1", name: "Ali Khan", image: "/avatars/ali.png" },
  { id: "user-2", name: "Sara Malik", image: "/avatars/sara.png" },
];

export const shortDateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});
