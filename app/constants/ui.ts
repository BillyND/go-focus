// UI Constants

// Debounce delay values (in milliseconds)
export const DEBOUNCE_DELAY = {
  INPUT: 50,
  SEARCH: 300,
  RESIZE: 100,
};

// CSS Classnames
export const CLASSNAMES = {
  INPUT: {
    DEFAULT: "w-full px-3 py-2 bg-gray-100 rounded text-center",
    SMALL: "w-16 px-3 py-2 bg-gray-100 rounded text-center",
  },
};

// Format Values
export enum HourFormat {
  TWELVE_HOUR = "12-hour",
  TWENTY_FOUR_HOUR = "24-hour",
}

// Timer Icons
export enum TimerIcons {
  TIMER = "timer",
  TASK = "task",
  SOUND = "sound",
  THEME = "theme",
  NOTIFICATION = "notification",
}

// Define color types as enum
export enum ColorType {
  POMODORO = "pomodoro",
  SHORT_BREAK = "shortBreak",
  LONG_BREAK = "longBreak",
}
