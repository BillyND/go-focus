import { formatTime } from "../../utils/timeFormat";
import { ProgressBar } from "../ui/ProgressBar";

interface TimerDisplayProps {
  timeRemaining: number;
  totalTime: number;
  label: string;
}

export function TimerDisplay({
  timeRemaining,
  totalTime,
  label,
}: TimerDisplayProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center py-8 px-6 rounded-lg bg-white/10">
      <span className="text-6xl md:text-7xl lg:text-8xl font-light text-white timer-display">
        {formatTime(timeRemaining)}
      </span>

      <span className="mt-3 text-white/70 text-sm font-medium">{label}</span>

      <div className="w-full mt-8">
        <ProgressBar
          value={totalTime - timeRemaining}
          max={totalTime}
          color="white"
          height="4px"
        />
      </div>
    </div>
  );
}
