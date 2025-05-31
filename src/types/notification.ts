interface UserNotificationSettings {
  id: number;
  userId: number;
  enableDailyReminders: boolean;
  reminderTime: string; // format: HH:MM
  enableWeeklyReport: boolean;
  weeklyReportDay: WeekDay;
  enableMoodReminders: boolean;
  moodReminderFrequency: MoodReminderFrequency;
  createdAt: string;
  updatedAt: string;
}

interface UpdateNotificationSettingsRequest {
  enableDailyReminders?: boolean;
  reminderTime?: string;
  enableWeeklyReport?: boolean;
  weeklyReportDay?: WeekDay;
  enableMoodReminders?: boolean;
  moodReminderFrequency?: MoodReminderFrequency;
}

type WeekDay = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

type MoodReminderFrequency = 'DAILY' | 'EVERY_OTHER_DAY' | 'TWICE_A_WEEK' | 'WEEKLY';

interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

type NotificationType = 'REMINDER' | 'TASK_DUE' | 'GOAL_ACHIEVED' | 'SYSTEM' | 'MOOD_CHECK';

export type { UserNotificationSettings, UpdateNotificationSettingsRequest, WeekDay, MoodReminderFrequency, Notification, NotificationType };
