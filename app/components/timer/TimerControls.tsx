import { memo } from "react";
import { FaPlay, FaPause, FaRedo, FaStepForward } from "react-icons/fa";

interface TimerControlsProps {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkip: () => void;
}

export const TimerControls = memo(function TimerControls({
  isRunning,
  onStart,
  onPause,
  onReset,
  onSkip,
}: TimerControlsProps) {
  return (
    <div className="flex items-center justify-center gap-3">
      {/* Main Start/Pause Button */}
      <button
        className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg hover:opacity-90 transition-opacity"
        onClick={isRunning ? onPause : onStart}
        aria-label={isRunning ? "Pause timer" : "Start timer"}
      >
        {isRunning ? (
          <FaPause size={24} className="ml-0.5" />
        ) : (
          <FaPlay size={24} className="ml-1.5" />
        )}
      </button>

      <div className="flex flex-col gap-3 justify-center">
        {/* Reset Button */}
        <button
          className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          onClick={onReset}
          aria-label="Reset timer"
        >
          <FaRedo size={14} className="text-white" />
        </button>

        {/* Skip Button */}
        <button
          className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          onClick={onSkip}
          aria-label="Skip to next timer"
        >
          <FaStepForward size={14} className="text-white ml-0.5" />
        </button>
      </div>
    </div>
  );
});
