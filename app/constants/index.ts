// UI Constants
export const DEBOUNCE_DELAY = {
  INPUT: 50,
  SEARCH: 300,
  RESIZE: 100,
};

// Timer Mode
export enum TimerMode {
  POMODORO = "pomodoro",
  SHORT_BREAK = "shortBreak",
  LONG_BREAK = "longBreak",
}

// Timer Icons
export enum TimerIcons {
  TIMER = "timer",
  TASK = "task",
  SOUND = "sound",
  THEME = "theme",
  NOTIFICATION = "notification",
}

// Format Values
export enum HourFormat {
  TWELVE_HOUR = "12-hour",
  TWENTY_FOUR_HOUR = "24-hour",
}

// Sound Types
export enum SoundType {
  ALARM = "alarm",
  TICKING = "ticking",
}

// Reminder Types
export enum ReminderType {
  LAST = "last",
  EVERY = "every",
}

// Sounds
export enum AlarmSoundType {
  BELL = "bell",
  DIGITAL = "digital",
  KITCHEN = "kitchen",
  ANALOG = "analog",
  WOOD = "wood",
}

export enum TickingSoundType {
  NONE = "none",
  TICK1 = "tick1",
  TICK2 = "tick2",
}

// CSS Classnames
export const CLASSNAMES = {
  INPUT: {
    DEFAULT: "w-full px-3 py-2 bg-gray-100 rounded text-center",
    SMALL: "w-16 px-3 py-2 bg-gray-100 rounded text-center",
  },
};
