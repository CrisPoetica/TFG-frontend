import axios from 'axios';
import type {
  UserNotificationSettings,
  UpdateNotificationSettingsRequest,
  Notification,
  NotificationType
} from '../types/notification';

const API_URL = 'http://localhost:8092/api';

// Esta constante se usará temporalmente hasta implementar autenticación completa
const TEST_USER_ID = 1;

export const getUserNotificationSettings = async (): Promise<UserNotificationSettings> => {
  try {
    const response = await axios.get<UserNotificationSettings>(
      `${API_URL}/users/${TEST_USER_ID}/notification-settings`
    );
    return response.data;
  } catch (error) {
    console.error('Error getting notification settings:', error);
    throw error;
  }
};

export const updateNotificationSettings = async (
  settings: UpdateNotificationSettingsRequest
): Promise<UserNotificationSettings> => {
  try {
    const response = await axios.put<UserNotificationSettings>(
      `${API_URL}/users/${TEST_USER_ID}/notification-settings`,
      settings
    );
    return response.data;
  } catch (error) {
    console.error('Error updating notification settings:', error);
    throw error;
  }
};

export const getUserNotifications = async (
  page: number = 0,
  size: number = 10
): Promise<{ notifications: Notification[]; totalCount: number }> => {
  try {
    const response = await axios.get<{ content: Notification[]; totalElements: number }>(
      `${API_URL}/users/${TEST_USER_ID}/notifications`,
      {
        params: { page, size }
      }
    );
    
    return {
      notifications: response.data.content,
      totalCount: response.data.totalElements
    };
  } catch (error) {
    console.error('Error getting user notifications:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId: number): Promise<void> => {
  try {
    await axios.put(`${API_URL}/users/${TEST_USER_ID}/notifications/${notificationId}/read`);
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const markAllNotificationsAsRead = async (): Promise<void> => {
  try {
    await axios.put(`${API_URL}/users/${TEST_USER_ID}/notifications/read-all`);
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

export const deleteNotification = async (notificationId: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/users/${TEST_USER_ID}/notifications/${notificationId}`);
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

export const clearAllNotifications = async (): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/users/${TEST_USER_ID}/notifications/clear-all`);
  } catch (error) {
    console.error('Error clearing all notifications:', error);
    throw error;
  }
};
