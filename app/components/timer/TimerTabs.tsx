import { TimerMode } from "../../store/timerStore";

interface TimerTabsProps {
  currentMode: TimerMode;
  onModeChange: (mode: TimerMode) => void;
}

export function TimerTabs({ currentMode, onModeChange }: TimerTabsProps) {
  const modes: { key: TimerMode; label: string }[] = [
    { key: "pomodoro", label: "Focus" },
    { key: "shortBreak", label: "Short Break" },
    { key: "longBreak", label: "Long Break" },
  ];

  return (
    <div className="flex w-full mb-6 border overflow-hidden rounded">
      {modes.map(({ key, label }) => (
        <button
          key={key}
          className={`flex-1 py-3 text-center text-sm font-medium transition-colors
            ${
              currentMode === key
                ? "bg-gray-800 text-white"
                : "bg-white hover:bg-gray-100"
            }`}
          onClick={() => onModeChange(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
