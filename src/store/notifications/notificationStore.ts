import { create } from "zustand";
import { Notification } from "@/types/notification";

type NotificationState = {
  notifications: Notification[];
  unreadCount: number;
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  updateUnreadCount: () => void;
};

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,

  setNotifications: (notifications) => {
    set({ notifications });
    get().updateUnreadCount();
  },

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
    })),

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n._id === id ? { ...n, read: true } : n
      ),
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),

  deleteNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n._id !== id),
    })),

  clearAll: () => set({ notifications: [] }),

  updateUnreadCount: () => {
    const count = get().notifications.filter((n) => !n.read).length;
    set({ unreadCount: count });
  },
}));

export const useNotifications = () =>
  useNotificationStore((state) => state.notifications);

export const useUnreadCount = () =>
  useNotificationStore((state) => state.unreadCount);

// Individual action selectors to avoid creating new objects on every render
export const useSetNotifications = () =>
  useNotificationStore((state) => state.setNotifications);

export const useAddNotification = () =>
  useNotificationStore((state) => state.addNotification);

export const useMarkAsRead = () =>
  useNotificationStore((state) => state.markAsRead);

export const useMarkAllAsRead = () =>
  useNotificationStore((state) => state.markAllAsRead);

export const useDeleteNotification = () =>
  useNotificationStore((state) => state.deleteNotification);

export const useClearAllNotifications = () =>
  useNotificationStore((state) => state.clearAll);

// Deprecated - use individual selectors instead to avoid infinite loops
export const useNotificationActions = () =>
  useNotificationStore((state) => ({
    setNotifications: state.setNotifications,
    addNotification: state.addNotification,
    markAsRead: state.markAsRead,
    markAllAsRead: state.markAllAsRead,
    deleteNotification: state.deleteNotification,
    clearAll: state.clearAll,
  }));
