"use client";

import { useState, useEffect } from "react";
import { FaCog } from "react-icons/fa";
import { requestNotificationPermission } from "./utils/notifications";
import { useTimerStore } from "./store/timerStore";
import { TimerMode } from "./constants";
import Timer from "./components/timer/Timer";
import TaskList from "./components/tasks/TaskList";
import SettingsModal from "./components/settings/SettingsModal";
import { Button } from "./components/ui/Button";

export default function Home() {
  const [showSettings, setShowSettings] = useState(false);
  const { mode, settings } = useTimerStore();

  // Get current theme color based on mode with fallback to default colors
  const currentThemeColor =
    settings.themeColors?.[mode] ||
    (mode === TimerMode.POMODORO
      ? "#d95550"
      : mode === TimerMode.SHORT_BREAK
      ? "#4c9195"
      : "#457ca3");

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
            <TaskList />
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
