import { create } from "zustand";

export const useNotificationAPI = create(() => ({
  // Mock API - replace with actual API calls
  fetchNotifications: async (userId: string) => {
    try {
      // const response = await fetch(`/api/notifications/${userId}`);
      // return response.json();
      return [];
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      return [];
    }
  },

  markNotificationAsRead: async (notificationId: string) => {
    try {
      // const response = await fetch(`/api/notifications/${notificationId}`, {
      //   method: "PATCH",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ read: true }),
      // });
      // return response.json();
      return { success: true };
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      return { success: false };
    }
  },

  markAllNotificationsAsRead: async (userId: string) => {
    try {
      // const response = await fetch(`/api/notifications/${userId}/mark-all-read`, {
      //   method: "PATCH",
      // });
      // return response.json();
      return { success: true };
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      return { success: false };
    }
  },

  deleteNotification: async (notificationId: string) => {
    try {
      // await fetch(`/api/notifications/${notificationId}`, {
      //   method: "DELETE",
      // });
      return { success: true };
    } catch (error) {
      console.error("Failed to delete notification:", error);
      return { success: false };
    }
  },
}));
