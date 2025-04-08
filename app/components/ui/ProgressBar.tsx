interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  showLabel?: boolean;
  color?: string;
  height?: string;
}

export function ProgressBar({
  value,
  max,
  className = "",
  showLabel = false,
  color = "#000",
  height = "0.5rem",
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={`w-full ${className}`}>
      <div
        className="relative rounded-full overflow-hidden"
        style={{
          height,
          backgroundColor: "rgba(255, 255, 255, 0.2)",
        }}
      >
        <div
          className="absolute h-full transition-all duration-300"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{Math.round(percentage)}%</span>
          <span>
            {max - value > 0 ? `${Math.round(max - value)}s` : "Complete"}
          </span>
        </div>
      )}
    </div>
  );
}
