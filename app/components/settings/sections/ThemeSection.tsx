import React, { memo, useState, useEffect, useCallback } from "react";
import { debounce } from "../../../utils/debounce";
import { FaPalette } from "react-icons/fa";
import { CustomDropdown, DropdownOption } from "../../ui/CustomDropdown";
import { HourFormat } from "../../../constants";
import { ColorPickerModal } from "../../ui/ColorPickerModal";

type ColorType = "pomodoro" | "shortBreak" | "longBreak";

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
  const [colorPickerOpen, setColorPickerOpen] = useState<ColorType | null>(
    null
  );

  // Update local state when props change
  useEffect(() => {
    setLocalValues({
      themeColors,
      hourFormat,
    });
  }, [themeColors, hourFormat]);

  // Debounced update function for hour format
  const debouncedOnChange = useCallback(
    debounce((values: Partial<ThemeSectionProps>) => {
      onChange(values);
    }, 50),
    [onChange]
  );

  // Handle hour format changes
  const handleHourFormatChange = (value: HourFormat) => {
    // Update local state immediately
    setLocalValues((prev) => ({ ...prev, hourFormat: value }));

    // Use debounce for parent update
    debouncedOnChange({ hourFormat: value });
  };

  const handleColorChange = (color: string, type: keyof typeof themeColors) => {
    // New theme colors
    const newThemeColors = {
      ...localValues.themeColors,
      [type]: color,
    };

    // Update local state immediately
    setLocalValues((prev) => ({
      ...prev,
      themeColors: newThemeColors,
    }));

    // Update parent state immediately as well (no debounce)
    onChange({
      themeColors: newThemeColors,
    });

    // Keep the color picker modal open
    // User can continue selecting colors or close manually
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

      <div className="space-y-5">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-gray-700">Color Themes</label>
            <div className="flex gap-2">
              <button
                className="w-8 h-8 rounded-md"
                style={{ backgroundColor: localValues.themeColors.pomodoro }}
                onClick={() => setColorPickerOpen("pomodoro")}
                aria-label="Pomodoro color"
              />
              <button
                className="w-8 h-8 rounded-md"
                style={{ backgroundColor: localValues.themeColors.shortBreak }}
                onClick={() => setColorPickerOpen("shortBreak")}
                aria-label="Short break color"
              />
              <button
                className="w-8 h-8 rounded-md"
                style={{ backgroundColor: localValues.themeColors.longBreak }}
                onClick={() => setColorPickerOpen("longBreak")}
                aria-label="Long break color"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleResetColors}
              className="text-xs text-gray-600 hover:text-gray-900"
            >
              Reset to defaults
            </button>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <label className="text-gray-700">Hour Format</label>
          <CustomDropdown<HourFormat>
            value={localValues.hourFormat}
            options={hourFormatOptions}
            onChange={handleHourFormatChange}
            className="w-36"
          />
        </div>
      </div>

      {/* Color Picker Modals */}
      <ColorPickerModal
        isOpen={colorPickerOpen === "pomodoro"}
        onClose={() => setColorPickerOpen(null)}
        onSelect={(color) => handleColorChange(color, "pomodoro")}
        title="Pick a color for Pomodoro"
        selectedColor={localValues.themeColors.pomodoro}
      />
      <ColorPickerModal
        isOpen={colorPickerOpen === "shortBreak"}
        onClose={() => setColorPickerOpen(null)}
        onSelect={(color) => handleColorChange(color, "shortBreak")}
        title="Pick a color for Short Break"
        selectedColor={localValues.themeColors.shortBreak}
      />
      <ColorPickerModal
        isOpen={colorPickerOpen === "longBreak"}
        onClose={() => setColorPickerOpen(null)}
        onSelect={(color) => handleColorChange(color, "longBreak")}
        title="Pick a color for Long Break"
        selectedColor={localValues.themeColors.longBreak}
      />
    </div>
  );
});
