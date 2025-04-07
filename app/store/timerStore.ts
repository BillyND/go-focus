import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TimerMode = "pomodoro" | "shortBreak" | "longBreak";

interface TimerState {
  // Timer settings
  settings: {
    pomodoro: number; // in minutes
    shortBreak: number; // in minutes
    longBreak: number; // in minutes
    longBreakInterval: number; // number of pomodoros before long break
    autoStartBreaks: boolean;
    autoStartPomodoros: boolean;
    alarmSound: string;
    alarmVolume: number;
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
        alarmSound: "bell",
        alarmVolume: 0.7,
      },

      // Default state
      mode: "pomodoro",
      timeRemaining: 25 * 60, // 25 minutes in seconds
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
        let newMode: TimerMode = "pomodoro";
        let newCompletedPomodoros = completedPomodoros;

        // Logic for determining the next timer mode
        if (mode === "pomodoro") {
          newCompletedPomodoros += 1;

          // Check if it's time for a long break
          if (newCompletedPomodoros % settings.longBreakInterval === 0) {
            newMode = "longBreak";
          } else {
            newMode = "shortBreak";
          }
        } else {
          // If we're in a break, next is always a pomodoro
          newMode = "pomodoro";
        }

        // Set new state
        set({
          mode: newMode,
          timeRemaining: get().settings[newMode] * 60,
          isRunning:
            (newMode === "pomodoro" && get().settings.autoStartPomodoros) ||
            (newMode !== "pomodoro" && get().settings.autoStartBreaks),
          completedPomodoros: newCompletedPomodoros,
          completedSessions:
            mode === "longBreak"
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
        completedPomodoros: state.completedPomodoros,
        completedSessions: state.completedSessions,
      }),
    }
  )
);
