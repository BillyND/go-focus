import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlay, FaPause, FaRedo, FaStepForward, FaCog } from "react-icons/fa";
import { useTimerStore, TimerMode } from "../store/timerStore";
import {
  formatTime,
  getTimerProgress,
  getPageTitle,
} from "../utils/timeFormat";
import {
  showPomodoroCompleteNotification,
  showBreakCompleteNotification,
} from "../utils/notifications";
import { toast } from "sonner";

const TIMER_INTERVAL = 1000; // 1 second

const modeLabels: Record<TimerMode, string> = {
  pomodoro: "Focus",
  shortBreak: "Short Break",
  longBreak: "Long Break",
};

export default function Timer() {
  const {
    mode,
    timeRemaining,
    isRunning,
    settings,
    startTimer,
    pauseTimer,
    resetTimer,
    skipTimer,
    tick,
  } = useTimerStore();

  const [prevTimeRemaining, setPrevTimeRemaining] = useState(timeRemaining);
  const [showSettings, setShowSettings] = useState(false);

  // Handle timer tick
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        tick();
      }, TIMER_INTERVAL);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, tick]);

  // Update document title based on timer state
  useEffect(() => {
    document.title = getPageTitle(timeRemaining, isRunning, modeLabels[mode]);
  }, [timeRemaining, isRunning, mode]);

  // Handle timer completion notifications
  useEffect(() => {
    // Check if timer just finished (timeRemaining is 0 but prevTimeRemaining was > 0)
    if (timeRemaining === 0 && prevTimeRemaining > 0) {
      // Show different notifications based on timer mode
      if (mode === "pomodoro") {
        showPomodoroCompleteNotification();
        toast.success("Pomodoro complete! Time for a break!");
      } else {
        showBreakCompleteNotification();
        toast.success("Break complete! Time to focus!");
      }
    }

    setPrevTimeRemaining(timeRemaining);
  }, [timeRemaining, prevTimeRemaining, mode]);

  // Calculate progress percentage
  const progress = getTimerProgress(timeRemaining, settings[mode]);

  // Handle mode change
  const handleModeChange = useCallback(
    (newMode: TimerMode) => {
      if (newMode !== mode) {
        resetTimer(newMode);
      }
    },
    [mode, resetTimer]
  );

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Timer Mode Tabs */}
      <div className="flex mb-8 border-collapse">
        {(Object.keys(modeLabels) as TimerMode[]).map((modeKey, index) => (
          <button
            key={modeKey}
            className={`flex-1 py-2 text-center text-sm font-medium transition-colors duration-300 border border-foreground/20 ${
              mode === modeKey ? "bg-white text-black" : "bg-transparent"
            } ${index > 0 ? "border-l-0" : ""}`}
            onClick={() => handleModeChange(modeKey)}
          >
            {modeLabels[modeKey]}
          </button>
        ))}
      </div>

      {/* Timer Display */}
      <motion.div
        className="glass-effect mb-8 flex flex-col items-center justify-center py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`timer-${mode}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <div className="timer-text text-center">
              {formatTime(timeRemaining)}
            </div>
            <div className="mt-2 text-center text-foreground/60">
              {modeLabels[mode]}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Progress Bar */}
        <div className="w-full mt-8 px-4">
          <div className="flex justify-between mt-2 text-xs text-foreground/60">
            <div>{`${Math.round(progress)}%`}</div>
            <div>{formatTime(timeRemaining)}</div>
          </div>
        </div>
      </motion.div>

      {/* Timer Controls - controls absolutely positioned at the center of the screen */}
      <div
        className="w-full flex justify-center mt-2 mb-8"
        style={{ marginTop: "0" }}
      >
        <div style={{ display: "flex", border: "1px solid black" }}>
          <button
            style={{
              width: "25px",
              height: "25px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRight: "1px solid black",
            }}
            onClick={isRunning ? pauseTimer : startTimer}
          >
            {isRunning ? <FaPause size={12} /> : <FaPlay size={12} />}
          </button>

          <button
            style={{
              width: "25px",
              height: "25px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRight: "1px solid black",
            }}
            onClick={() => resetTimer()}
          >
            <FaRedo size={12} />
          </button>

          <button
            style={{
              width: "25px",
              height: "25px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRight: "1px solid black",
            }}
            onClick={skipTimer}
          >
            <FaStepForward size={12} />
          </button>

          <button
            style={{
              width: "25px",
              height: "25px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={() => setShowSettings(!showSettings)}
          >
            <FaCog size={12} />
          </button>
        </div>
      </div>

      {/* Stats Display */}
      <div className="text-center mb-4">
        <div className="text-xs">Pomodoros/Sessions</div>
        <div className="text-xs">
          {useTimerStore.getState().completedPomodoros}/
          {useTimerStore.getState().completedSessions}
        </div>
      </div>
    </div>
  );
}
