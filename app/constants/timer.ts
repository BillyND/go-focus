// Timer related constants

// Timer Mode
export enum TimerMode {
  POMODORO = "pomodoro",
  SHORT_BREAK = "shortBreak",
  LONG_BREAK = "longBreak",
}

// Timer interval in milliseconds
export const TIMER_INTERVAL = 1000; // 1 second

// Default timer settings
export const DEFAULT_TIMER_SETTINGS = {
  pomodoro: 25, // in minutes
  shortBreak: 5, // in minutes
  longBreak: 15, // in minutes
  longBreakInterval: 4, // number of pomodoros before long break
  autoStartBreaks: false, // auto start breaks after pomodoro completes
  autoStartPomodoros: false, // auto start pomodoros after break completes
};
