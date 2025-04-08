import { useTimerStore } from "../../store/timerStore";
import { TimerMode, DEFAULT_THEME_COLORS } from "../../constants";

interface TimerTabsProps {
  currentMode: TimerMode;
  onModeChange: (mode: TimerMode) => void;
}

export function TimerTabs({ currentMode, onModeChange }: TimerTabsProps) {
  const { settings } = useTimerStore();

  const modes: { key: TimerMode; label: string }[] = [
    { key: TimerMode.POMODORO, label: "Focus" },
    { key: TimerMode.SHORT_BREAK, label: "Short Break" },
    { key: TimerMode.LONG_BREAK, label: "Long Break" },
  ];

  // Use the constant defaults for fallback
  const defaultColors = DEFAULT_THEME_COLORS;

  return (
    <div className="flex w-full mb-6 overflow-hidden rounded-md bg-white/10">
      {modes.map(({ key, label }) => {
        const isActive = currentMode === key;
        const activeStyle = isActive
          ? {
              backgroundColor: "white",
              color: settings.themeColors?.[key] || defaultColors[key],
            }
          : {};

        return (
          <button
            key={key}
            className={`flex-1 py-3 text-center text-sm font-medium transition-colors
              ${
                isActive
                  ? "text-opacity-100"
                  : "text-white text-opacity-80 hover:text-opacity-100"
              }`}
            style={activeStyle}
            onClick={() => onModeChange(key)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
