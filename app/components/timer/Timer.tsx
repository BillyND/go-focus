import { useState, useEffect, useCallback } from "react";
import { useTimerStore } from "../../store/timerStore";
import { TimerMode, TIMER_INTERVAL, TIMER_MODE_LABELS } from "../../constants";
import { getPageTitle } from "../../utils/timeFormat";
import {
  showPomodoroCompleteNotification,
  showBreakCompleteNotification,
} from "../../utils/notifications";
import { toast } from "sonner";
import { TimerTabs } from "./TimerTabs";
import { TimerDisplay } from "./TimerDisplay";
import { TimerControls } from "./TimerControls";

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

  // Ensure timer is initialized with correct settings
  useEffect(() => {
    // On initial load, ensure timeRemaining matches settings
    if (timeRemaining === 0) {
      resetTimer(mode);
    }
  }, [mode, resetTimer, timeRemaining]);

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
    document.title = getPageTitle(
      timeRemaining,
      isRunning,
      TIMER_MODE_LABELS[mode]
    );
  }, [timeRemaining, isRunning, mode]);

  // Handle timer completion notifications
  useEffect(() => {
    // Check if timer just finished (timeRemaining is 0 but prevTimeRemaining was > 0)
    if (timeRemaining === 0 && prevTimeRemaining > 0) {
      // Show different notifications based on timer mode
      if (mode === TimerMode.POMODORO) {
        showPomodoroCompleteNotification();
        toast.success("Focus session complete! Time for a break!");
      } else {
        showBreakCompleteNotification();
        toast.success("Break complete! Time to focus!");
      }
    }

    setPrevTimeRemaining(timeRemaining);
  }, [timeRemaining, prevTimeRemaining, mode]);

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
      <TimerTabs currentMode={mode} onModeChange={handleModeChange} />

      <TimerDisplay
        timeRemaining={timeRemaining}
        totalTime={settings[mode] * 60}
        label={TIMER_MODE_LABELS[mode]}
      />

      <div className="mt-6 flex flex-col items-center gap-4">
        <TimerControls
          isRunning={isRunning}
          onStart={startTimer}
          onPause={pauseTimer}
          onReset={() => resetTimer()}
          onSkip={skipTimer}
        />
      </div>
    </div>
  );
}
