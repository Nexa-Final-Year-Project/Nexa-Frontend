import { useEffect } from "react";
import { useSetNotifications } from "@/store/notifications/notificationStore";
import { Notification } from "@/types/notification";

// Sample notifications for demo/testing
const sampleNotifications: Notification[] = [
  {
    _id: "1",
    userId: "user1",
    type: "task",
    title: "Task assigned to you",
    message: "You have been assigned to 'Design data ingestion API'",
    read: false,
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(), // 5 mins ago
    relatedId: "task1",
    relatedType: "task",
    actionUrl: "/tasks/task1",
    senderName: "John Doe",
  },
  {
    _id: "2",
    userId: "user1",
    type: "comment",
    title: "New comment on your task",
    message: "Sarah commented: 'This looks good, can we add error handling?'",
    read: false,
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(), // 15 mins ago
    relatedId: "comment2",
    relatedType: "comment",
    actionUrl: "/tasks/task1#comment2",
    senderName: "Sarah Smith",
  },
  {
    _id: "3",
    userId: "user1",
    type: "mention",
    title: "You were mentioned",
    message: "@yourname what do you think about this approach?",
    read: false,
    createdAt: new Date(Date.now() - 30 * 60000).toISOString(), // 30 mins ago
    relatedId: "comment3",
    relatedType: "comment",
    actionUrl: "/tasks/task2#comment3",
    senderName: "Mike Johnson",
  },
  {
    _id: "4",
    userId: "user1",
    type: "sprint",
    title: "Sprint started",
    message: "Sprint 52 has been started with 4 tasks assigned to you",
    read: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60000).toISOString(), // 2 hours ago
    relatedId: "sprint52",
    relatedType: "sprint",
    actionUrl: "/sprints/sprint52",
    senderName: "Sprint Manager",
  },
  {
    _id: "5",
    userId: "user1",
    type: "project",
    title: "Project update",
    message: "NEXA project has been updated with new settings",
    read: true,
    createdAt: new Date(Date.now() - 5 * 60 * 60000).toISOString(), // 5 hours ago
    relatedId: "project1",
    relatedType: "project",
    actionUrl: "/projects/project1",
    senderName: "Project Lead",
  },
];

export const useInitializeNotifications = () => {
  const setNotifications = useSetNotifications();

  useEffect(() => {
    // Load sample notifications on mount (for demo)
    setNotifications(sampleNotifications);

    // In production, you would fetch from your API:
    // const userId = useAuth().user?.id;
    // const notifications = await fetchNotifications(userId);
    // setNotifications(notifications);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
