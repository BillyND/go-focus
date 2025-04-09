"use client";

import { useState, useEffect, useMemo } from "react";
import { FaCog } from "react-icons/fa";
import { requestNotificationPermission } from "./utils/notifications";
import { useTimerStore } from "./store/timerStore";
import { DEFAULT_THEME_COLORS, TimerMode } from "./constants";
import { calculateFinishTime } from "./utils/timeUtils";
import Timer from "./components/timer/Timer";
import NewTaskList from "./components/tasks/NewTaskList";
import SettingsModal from "./components/settings/SettingsModal";
import { Button } from "./components/ui/Button";

export default function Home() {
  const [showSettings, setShowSettings] = useState(false);
  const { mode, settings, completedPomodoros, timeRemaining } = useTimerStore();

  // Get current theme color based on mode with fallback to default colors
  const currentThemeColor =
    settings.themeColors?.[mode] ||
    (mode === TimerMode.POMODORO
      ? DEFAULT_THEME_COLORS.pomodoro
      : mode === TimerMode.SHORT_BREAK
      ? DEFAULT_THEME_COLORS.shortBreak
      : DEFAULT_THEME_COLORS.longBreak);

  // Calculate finish time based on current timer and settings
  const { finishTime, relativeHours } = useMemo(() => {
    // Get remaining pomodoros from target (3 is our target for this demo)
    const targetPomodoros = 3;
    const remainingPomodoros = Math.max(
      0,
      targetPomodoros - completedPomodoros
    );

    // Calculate total minutes remaining
    // Current pomodoro remaining time + remaining full pomodoros
    const minutesRemaining =
      timeRemaining / 60 + // Current pomodoro's remaining minutes
      remainingPomodoros * settings.pomodoro; // Future pomodoros

    return calculateFinishTime(minutesRemaining);
  }, [completedPomodoros, timeRemaining, settings.pomodoro]);

  // Request notification permissions when the app first loads
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <div
      className="p-4 min-h-screen transition-colors duration-300"
      style={{ backgroundColor: currentThemeColor }}
    >
      {/* Header */}
      <header className="container mx-auto max-w-4xl mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Go Focus</h1>
        <Button
          variant="outline"
          onClick={() => setShowSettings(true)}
          className="bg-white/20 text-white hover:bg-white/30 border-white/30"
          aria-label="Settings"
        >
          <FaCog size={14} className="mr-2" />
          Setting
        </Button>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-4xl flex flex-col items-center">
        <div className="w-full max-w-md">
          {/* Timer Component */}
          <Timer />

          {/* Tasks Section */}
          <div className="mt-6 w-full">
            <NewTaskList
              currentPomodoroCount={completedPomodoros}
              targetPomodoroCount={3}
              finishTime={finishTime}
              finishTimeIsRelative={true}
              relativeTimeText={relativeHours}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto max-w-4xl mt-12 text-center text-sm text-white/70">
        <p>Built with Next.js and TailwindCSS</p>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}
