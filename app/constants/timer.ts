// Timer related constants

// Timer Mode Labels
export const TIMER_MODE_LABELS: Record<TimerMode, string> = {
  pomodoro: "Focus",
  shortBreak: "Short Break",
  longBreak: "Long Break",
};

// Timer Mode
export enum TimerMode {
  POMODORO = "pomodoro",
  SHORT_BREAK = "shortBreak",
  LONG_BREAK = "longBreak",
}

// Note: We keep the enum value "pomodoro" for compatibility
// but use "focus" in the UI for better user understanding

// Timer interval in milliseconds
export const TIMER_INTERVAL = 1000; // 1 second

// Default timer settings
export const DEFAULT_TIMER_SETTINGS = {
  pomodoro: 25, // in minutes
  shortBreak: 5, // in minutes
  longBreak: 15, // in minutes
  longBreakInterval: 4, // number of focus sessions before long break
  autoStartBreaks: false, // auto start breaks after focus session completes
  autoStartPomodoros: false, // auto start focus sessions after break completes
};
