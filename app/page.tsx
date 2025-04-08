"use client";

import { useState, useEffect } from "react";
import { FaList } from "react-icons/fa";
import { requestNotificationPermission } from "./utils/notifications";
import Timer from "./components/timer/Timer";
import TaskList from "./components/tasks/TaskList";
import SettingsModal from "./components/settings/SettingsModal";
import { Button } from "./components/ui/Button";

export default function Home() {
  const [showSettings, setShowSettings] = useState(false);
  const [showTaskList, setShowTaskList] = useState(false);

  // Request notification permissions when the app first loads
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      {/* Header */}
      <header className="container mx-auto max-w-4xl mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Pomodoro Timer</h1>
      </header>

      {/* Main Content */}
      <main className="container mx-auto max-w-4xl flex flex-col items-center">
        <div className="w-full max-w-md">
          {/* Timer Component */}
          <Timer onOpenSettings={() => setShowSettings(true)} />

          {/* Task Toggle Button */}
          <div className="mt-8 flex justify-center">
            <Button
              variant="outline"
              onClick={() => setShowTaskList(!showTaskList)}
              className="flex items-center gap-2"
            >
              <FaList size={14} />
              {showTaskList ? "Hide Tasks" : "Show Tasks"}
            </Button>
          </div>

          {/* Tasks Section */}
          {showTaskList && (
            <div className="mt-6 w-full">
              <TaskList />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto max-w-4xl mt-12 text-center text-sm text-gray-500">
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
