"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaCog, FaList, FaChevronUp } from "react-icons/fa";
import Timer from "./components/Timer";
import Settings from "./components/Settings";
import TaskList from "./components/TaskList";
import { requestNotificationPermission } from "./utils/notifications";

export default function Home() {
  const [showSettings, setShowSettings] = useState(false);
  const [showTaskList, setShowTaskList] = useState(false);

  // Request notification permissions when the app first loads
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <div className="min-h-screen flex flex-col py-8 p-8">
      {/* Header */}
      <motion.header
        className="container mx-auto mb-8 flex justify-between items-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold">Pomodoro Timer</h1>
        <button
          className="btn btn-icon btn-ghost"
          onClick={() => setShowSettings(true)}
          aria-label="Settings"
        >
          <FaCog size={20} />
        </button>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto flex flex-col flex-grow items-center justify-center">
        <Timer />

        {/* Task Toggle Button */}
        <motion.button
          className="mt-4 btn border border-black rounded-full px-4 py-1 text-sm flex items-center gap-2"
          onClick={() => setShowTaskList(!showTaskList)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {showTaskList ? (
            <>
              <FaChevronUp size={12} /> Hide Tasks
            </>
          ) : (
            <>
              <FaList size={12} /> Show Tasks
            </>
          )}
        </motion.button>

        {/* Task List (Collapsible) */}
        <motion.div
          className="w-full"
          initial={{ height: 0, opacity: 0 }}
          animate={{
            height: showTaskList ? "auto" : 0,
            opacity: showTaskList ? 1 : 0,
          }}
          transition={{ duration: 0.2 }}
          style={{ overflow: showTaskList ? "visible" : "hidden" }}
        >
          {showTaskList && <TaskList />}
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer
        className="container mx-auto mt-8 text-center text-sm text-foreground/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <p>Built with Next.js and TailwindCSS</p>
      </motion.footer>

      {/* Settings Modal */}
      <Settings isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}
