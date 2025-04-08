import React, { memo, useState, useEffect, useCallback } from "react";
import { debounce } from "../../../utils/debounce";
import { FaPalette } from "react-icons/fa";
import { CustomDropdown, DropdownOption } from "../../ui/CustomDropdown";
import { HourFormat } from "../../../constants";

interface ThemeSectionProps {
  themeColors: {
    pomodoro: string;
    shortBreak: string;
    longBreak: string;
  };
  hourFormat: HourFormat;
  onChange: (
    values: Partial<{
      themeColors: {
        pomodoro: string;
        shortBreak: string;
        longBreak: string;
      };
      hourFormat: HourFormat;
    }>
  ) => void;
  onResetColors: () => void;
}

const hourFormatOptions: DropdownOption<HourFormat>[] = [
  { value: HourFormat.TWELVE_HOUR, label: "12-hour" },
  { value: HourFormat.TWENTY_FOUR_HOUR, label: "24-hour" },
];

export const ThemeSection = memo(function ThemeSection({
  themeColors,
  hourFormat,
  onChange,
  onResetColors,
}: ThemeSectionProps) {
  // Local state
  const [localValues, setLocalValues] = useState({
    themeColors,
    hourFormat,
  });

  // Update local state when props change
  useEffect(() => {
    setLocalValues({
      themeColors,
      hourFormat,
    });
  }, [themeColors, hourFormat]);

  // Debounced update function
  const debouncedOnChange = useCallback(
    debounce((values: Partial<ThemeSectionProps>) => {
      onChange(values);
    }, 50),
    [onChange]
  );

  const handleColorChange = (color: string, type: keyof typeof themeColors) => {
    // Update local state immediately
    setLocalValues((prev) => ({
      ...prev,
      themeColors: {
        ...prev.themeColors,
        [type]: color,
      },
    }));

    // Debounce update to parent
    debouncedOnChange({
      themeColors: {
        ...localValues.themeColors,
        [type]: color,
      },
    });
  };

  // Local reset function
  const handleResetColors = () => {
    onResetColors();
  };

  return (
    <div className="border-b border-gray-200 py-4">
      <h3 className="text-gray-500 font-medium flex items-center gap-2 mb-4">
        <FaPalette size={18} />
        THEME
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-3">Color Themes</label>
          <div className="flex gap-3 mb-2">
            <button
              className="w-10 h-10 rounded-md"
              style={{ backgroundColor: localValues.themeColors.pomodoro }}
              onClick={() => {
                const color = window.prompt(
                  "Enter Pomodoro color (hex):",
                  localValues.themeColors.pomodoro
                );
                if (color) handleColorChange(color, "pomodoro");
              }}
              aria-label="Pomodoro color"
            />
            <button
              className="w-10 h-10 rounded-md"
              style={{ backgroundColor: localValues.themeColors.shortBreak }}
              onClick={() => {
                const color = window.prompt(
                  "Enter Short Break color (hex):",
                  localValues.themeColors.shortBreak
                );
                if (color) handleColorChange(color, "shortBreak");
              }}
              aria-label="Short break color"
            />
            <button
              className="w-10 h-10 rounded-md"
              style={{ backgroundColor: localValues.themeColors.longBreak }}
              onClick={() => {
                const color = window.prompt(
                  "Enter Long Break color (hex):",
                  localValues.themeColors.longBreak
                );
                if (color) handleColorChange(color, "longBreak");
              }}
              aria-label="Long break color"
            />
          </div>
          <button
            onClick={handleResetColors}
            className="text-sm text-gray-600 hover:text-gray-900 mt-2"
          >
            Reset to defaults
          </button>
        </div>

        <div className="flex justify-between items-center">
          <label className="text-gray-700">Hour Format</label>
          <CustomDropdown<HourFormat>
            value={localValues.hourFormat}
            options={hourFormatOptions}
            onChange={(value) => {
              setLocalValues((prev) => ({ ...prev, hourFormat: value }));
              debouncedOnChange({ hourFormat: value });
            }}
            className="w-36"
          />
        </div>
      </div>
    </div>
  );
});
