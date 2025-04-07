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
      <div className="flex mb-8 border-b border-foreground/20">
        {(Object.keys(modeLabels) as TimerMode[]).map((modeKey) => (
          <button
            key={modeKey}
            className={`flex-1 py-3 text-center text-sm font-medium transition-colors duration-300 border-b-2 ${
              mode === modeKey
                ? "border-primary-600 text-primary-600"
                : "border-transparent hover:border-foreground/20"
            }`}
            onClick={() => handleModeChange(modeKey)}
          >
            {modeLabels[modeKey]}
          </button>
        ))}
      </div>

      {/* Timer Display */}
      <motion.div
        className="card glass-effect mb-8 flex flex-col items-center justify-center py-16"
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
        <div className="w-full mt-8 px-8">
          <div className="w-full h-2 bg-foreground/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary-600"
              initial={{ width: `${progress}%` }}
              animate={{ width: `${progress}%` }}
              transition={{ type: "spring", stiffness: 50 }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-foreground/60">
            <div>{`${Math.round(progress)}%`}</div>
            <div>{formatTime(timeRemaining)}</div>
          </div>
        </div>
      </motion.div>

      {/* Timer Controls */}
      <div className="flex justify-center space-x-4 mb-8">
        <motion.button
          className="btn btn-icon btn-outline rounded-full"
          whileTap={{ scale: 0.9 }}
          onClick={isRunning ? pauseTimer : startTimer}
        >
          {isRunning ? <FaPause size={18} /> : <FaPlay size={18} />}
        </motion.button>

        <motion.button
          className="btn btn-icon btn-outline rounded-full"
          whileTap={{ scale: 0.9 }}
          onClick={() => resetTimer()}
        >
          <FaRedo size={18} />
        </motion.button>

        <motion.button
          className="btn btn-icon btn-outline rounded-full"
          whileTap={{ scale: 0.9 }}
          onClick={skipTimer}
        >
          <FaStepForward size={18} />
        </motion.button>

        <motion.button
          className="btn btn-icon btn-outline rounded-full"
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowSettings(!showSettings)}
        >
          <FaCog size={18} />
        </motion.button>
      </div>

      {/* Stats Display */}
      <div className="flex justify-center space-x-8 text-center">
        <div>
          <div className="text-foreground/60 text-xs mb-1">Pomodoros</div>
          <div className="text-lg font-bold">
            {useTimerStore.getState().completedPomodoros}
          </div>
        </div>
        <div>
          <div className="text-foreground/60 text-xs mb-1">Sessions</div>
          <div className="text-lg font-bold">
            {useTimerStore.getState().completedSessions}
          </div>
        </div>
      </div>
    </div>
  );
}
