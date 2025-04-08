import { FaPlay, FaPause, FaRedo, FaStepForward } from "react-icons/fa";
import { Button } from "../ui/Button";

interface TimerControlsProps {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkip: () => void;
}

export function TimerControls({
  isRunning,
  onStart,
  onPause,
  onReset,
  onSkip,
}: TimerControlsProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="icon"
        size="md"
        onClick={isRunning ? onPause : onStart}
        aria-label={isRunning ? "Pause timer" : "Start timer"}
      >
        {isRunning ? <FaPause size={14} /> : <FaPlay size={14} />}
      </Button>

      <Button
        variant="icon"
        size="md"
        onClick={onReset}
        aria-label="Reset timer"
      >
        <FaRedo size={14} />
      </Button>

      <Button
        variant="icon"
        size="md"
        onClick={onSkip}
        aria-label="Skip to next timer"
      >
        <FaStepForward size={14} />
      </Button>
    </div>
  );
}
