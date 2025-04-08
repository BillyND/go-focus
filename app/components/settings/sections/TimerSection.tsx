import React, { memo, useState, useEffect, useCallback } from "react";
import { debounce } from "../../../utils/debounce";
import { FaClock } from "react-icons/fa";
import { Toggle } from "../../ui/Toggle";

interface TimerSectionProps {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  onChange: (
    values: Partial<{
      pomodoro: number;
      shortBreak: number;
      longBreak: number;
      longBreakInterval: number;
      autoStartBreaks: boolean;
      autoStartPomodoros: boolean;
    }>
  ) => void;
}

export const TimerSection = memo(function TimerSection({
  pomodoro,
  shortBreak,
  longBreak,
  longBreakInterval,
  autoStartBreaks,
  autoStartPomodoros,
  onChange,
}: TimerSectionProps) {
  // Local state
  const [localValues, setLocalValues] = useState({
    pomodoro,
    shortBreak,
    longBreak,
    longBreakInterval,
    autoStartBreaks,
    autoStartPomodoros,
  });

  // Update local state when props change
  useEffect(() => {
    setLocalValues({
      pomodoro,
      shortBreak,
      longBreak,
      longBreakInterval,
      autoStartBreaks,
      autoStartPomodoros,
    });
  }, [
    pomodoro,
    shortBreak,
    longBreak,
    longBreakInterval,
    autoStartBreaks,
    autoStartPomodoros,
  ]);

  // Debounced update function
  const debouncedOnChange = useCallback(
    (values: Partial<TimerSectionProps>) => {
      debounce((values: Partial<TimerSectionProps>) => {
        onChange(values);
      }, 100)(values);
    },
    [onChange]
  );

  // Handle local input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    if (type === "number") {
      const numValue = Math.max(1, Math.min(60, parseInt(value, 10) || 1));
      // Update local state immediately
      setLocalValues((prev) => ({ ...prev, [name]: numValue }));
      // Debounce update to parent
      debouncedOnChange({ [name]: numValue });
    } else if (type === "checkbox") {
      // Update local state immediately
      setLocalValues((prev) => ({ ...prev, [name]: e.target.checked }));
      // Debounce update to parent
      debouncedOnChange({ [name]: e.target.checked });
    }
  };

  return (
    <div className="border-b border-gray-200 pb-4">
      <h3 className="text-gray-500 font-medium flex items-center gap-2 mb-4">
        <FaClock size={18} />
        TIMER
      </h3>

      <div className="space-y-4">
        <div>
          <div className="text-gray-700 mb-2">Time (minutes)</div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <div className="text-gray-500 text-sm mb-1">Pomodoro</div>
              <input
                type="number"
                name="pomodoro"
                value={localValues.pomodoro}
                onChange={handleInputChange}
                min={1}
                max={60}
                className="w-full px-3 py-2 bg-gray-100 rounded text-center"
              />
            </div>
            <div>
              <div className="text-gray-500 text-sm mb-1">Short Break</div>
              <input
                type="number"
                name="shortBreak"
                value={localValues.shortBreak}
                onChange={handleInputChange}
                min={1}
                max={30}
                className="w-full px-3 py-2 bg-gray-100 rounded text-center"
              />
            </div>
            <div>
              <div className="text-gray-500 text-sm mb-1">Long Break</div>
              <input
                type="number"
                name="longBreak"
                value={localValues.longBreak}
                onChange={handleInputChange}
                min={1}
                max={60}
                className="w-full px-3 py-2 bg-gray-100 rounded text-center"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-700">Auto Start Breaks</span>
          <Toggle
            isChecked={localValues.autoStartBreaks}
            onChange={(checked) => {
              setLocalValues((prev) => ({ ...prev, autoStartBreaks: checked }));
              debouncedOnChange({ autoStartBreaks: checked });
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-700">Auto Start Pomodoros</span>
          <Toggle
            isChecked={localValues.autoStartPomodoros}
            onChange={(checked) => {
              setLocalValues((prev) => ({
                ...prev,
                autoStartPomodoros: checked,
              }));
              debouncedOnChange({ autoStartPomodoros: checked });
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-700">Long Break interval</span>
          <input
            type="number"
            name="longBreakInterval"
            value={localValues.longBreakInterval}
            onChange={handleInputChange}
            min={1}
            max={10}
            className="w-16 px-3 py-2 bg-gray-100 rounded text-center"
          />
        </div>
      </div>
    </div>
  );
});
