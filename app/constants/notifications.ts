// Notification related constants

// Reminder Types
export enum ReminderType {
  LAST = "last",
  EVERY = "every",
}

// Default notification settings
export const DEFAULT_NOTIFICATION_SETTINGS = {
  reminderType: ReminderType.LAST,
  reminderMinutes: 5,
};
