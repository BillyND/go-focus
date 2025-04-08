import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AlarmSoundType, TimerMode } from "../constants";

// Default theme colors
export const DEFAULT_THEME_COLORS = {
  pomodoro: "#d95550", // Red/Orange
  shortBreak: "#4c9195", // Green
  longBreak: "#457ca3", // Blue
};

interface TimerState {
  // Timer settings
  settings: {
    pomodoro: number; // in minutes
    shortBreak: number; // in minutes
    longBreak: number; // in minutes
    longBreakInterval: number; // number of pomodoros before long break
    autoStartBreaks: boolean;
    autoStartPomodoros: boolean;
    alarmSound: AlarmSoundType;
    alarmVolume: number;
    themeColors: {
      pomodoro: string;
      shortBreak: string;
      longBreak: string;
    };
  };

  // Timer status
  mode: TimerMode;
  timeRemaining: number; // in seconds
  isRunning: boolean;
  completedPomodoros: number;
  completedSessions: number;

  // Timer actions
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: (mode?: TimerMode) => void;
  skipTimer: () => void;
  tick: () => void;
  updateSettings: (settings: Partial<TimerState["settings"]>) => void;
}

// Helper to convert minutes to seconds
const minutesToSeconds = (minutes: number): number => minutes * 60;

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      // Default settings
      settings: {
        pomodoro: 25,
        shortBreak: 5,
        longBreak: 15,
        longBreakInterval: 4,
        autoStartBreaks: true,
        autoStartPomodoros: false,
        alarmSound: AlarmSoundType.BELL,
        alarmVolume: 0.7,
        themeColors: { ...DEFAULT_THEME_COLORS },
      },

      // Default state
      mode: TimerMode.POMODORO,
      timeRemaining: minutesToSeconds(25), // Default initial value
      isRunning: false,
      completedPomodoros: 0,
      completedSessions: 0,

      // Timer actions
      startTimer: () => set({ isRunning: true }),

      pauseTimer: () => set({ isRunning: false }),

      resetTimer: (mode) => {
        const { settings } = get();
        const currentMode = mode || get().mode;
        const timeRemaining = settings[currentMode] * 60;

        set({
          timeRemaining,
          isRunning: false,
          mode: currentMode,
        });
      },

      skipTimer: () => {
        const { mode, completedPomodoros, settings } = get();
        let newMode: TimerMode = TimerMode.POMODORO;
        let newCompletedPomodoros = completedPomodoros;

        // Logic for determining the next timer mode
        if (mode === TimerMode.POMODORO) {
          newCompletedPomodoros += 1;

          // Check if it's time for a long break
          if (newCompletedPomodoros % settings.longBreakInterval === 0) {
            newMode = TimerMode.LONG_BREAK;
          } else {
            newMode = TimerMode.SHORT_BREAK;
          }
        } else {
          // If we're in a break, next is always a pomodoro
          newMode = TimerMode.POMODORO;
        }

        // Set new state
        set({
          mode: newMode,
          timeRemaining: get().settings[newMode] * 60,
          isRunning:
            (newMode === TimerMode.POMODORO &&
              get().settings.autoStartPomodoros) ||
            (newMode !== TimerMode.POMODORO && get().settings.autoStartBreaks),
          completedPomodoros: newCompletedPomodoros,
          completedSessions:
            mode === TimerMode.LONG_BREAK
              ? get().completedSessions + 1
              : get().completedSessions,
        });
      },

      tick: () => {
        const { timeRemaining, isRunning } = get();

        if (!isRunning || timeRemaining <= 0) return;

        const newTimeRemaining = timeRemaining - 1;

        // If timer completes
        if (newTimeRemaining <= 0) {
          // Try to play sound
          try {
            const audio = new Audio(`/sounds/${get().settings.alarmSound}.mp3`);
            audio.volume = get().settings.alarmVolume;
            audio.play().catch((e) => {
              console.error("Error playing sound:", e);
              // Fallback silent notification if sound fails
              if (Notification.permission === "granted") {
                new Notification("Timer Complete", {
                  silent: true,
                  body: "Your timer has finished",
                  icon: "/favicon.ico",
                });
              }
            });
          } catch (error) {
            console.error("Could not play alarm sound:", error);
          }

          // Skip to next timer
          set({ timeRemaining: 0 });
          get().skipTimer();
        } else {
          // Normal tick
          set({ timeRemaining: newTimeRemaining });
        }
      },

      updateSettings: (newSettings) => {
        const settings = { ...get().settings, ...newSettings };
        set({ settings });

        // Update current timer if relevant setting changed
        const { mode } = get();
        if (newSettings[mode] !== undefined) {
          set({ timeRemaining: settings[mode] * 60 });
        }
      },
    }),
    {
      name: "pomodoro-timer-storage",
      partialize: (state) => ({
        settings: state.settings,
        mode: state.mode,
        completedPomodoros: state.completedPomodoros,
        completedSessions: state.completedSessions,
      }),
      onRehydrateStorage: () => (state) => {
        // After store is rehydrated from localStorage, initialize timeRemaining based on settings
        if (state) {
          const { mode, settings } = state;
          // Set the initial timeRemaining based on the current mode and settings
          state.timeRemaining = settings[mode] * 60;
        }
      },
    }
  )
);
