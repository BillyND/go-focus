import { formatTime } from "../../utils/timeFormat";
import { ProgressBar } from "../ui/ProgressBar";
import { Card } from "../ui/Card";

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
    <Card className="w-full flex flex-col items-center justify-center py-6">
      <span className="text-3xl md:text-5xl lg:text-6xl font-bold timer-display">
        {formatTime(timeRemaining)}
      </span>

      <span className="mt-2 text-gray-500 text-sm font-medium">{label}</span>

      <div className="w-full mt-6 px-4">
        <ProgressBar value={totalTime - timeRemaining} max={totalTime} />
      </div>
    </Card>
  );
}
