import { create } from "zustand";
import axios from "axios";

export const useNotificationAPI = create(() => ({
  // Fetch all notifications for the authenticated user
  fetchNotifications: async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/notifications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.notifications || [];
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      return [];
    }
  },

  // Mark a notification as read
  markNotificationAsRead: async (notificationId: string) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/notifications/${notificationId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { success: response.data.success };
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      return { success: false };
    }
  },

  // Mark all notifications as read
  markAllNotificationsAsRead: async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/notifications/read-all`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { success: response.data.success };
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      return { success: false };
    }
  },

  // Delete a notification
  deleteNotification: async (notificationId: string) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/notifications/${notificationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { success: response.data.success };
    } catch (error) {
      console.error("Failed to delete notification:", error);
      return { success: false };
    }
  },
}));
