import React, { memo, useState, useEffect, useCallback } from "react";
import { debounce } from "../../../utils/debounce";
import { FaPalette } from "react-icons/fa";
import { CustomDropdown, DropdownOption } from "../../ui/CustomDropdown";
import { ColorType, HourFormat } from "../../../constants";
import { ColorPickerModal } from "../../ui/ColorPickerModal";

// Type for theme colors object
type ThemeColors = {
  [ColorType.POMODORO]: string;
  [ColorType.SHORT_BREAK]: string;
  [ColorType.LONG_BREAK]: string;
};

interface ThemeSectionProps {
  themeColors: ThemeColors;
  hourFormat: HourFormat;
  onChange: (
    values: Partial<{
      themeColors: ThemeColors;
      hourFormat: HourFormat;
    }>
  ) => void;
  onResetColors: () => void;
}

const hourFormatOptions: DropdownOption<HourFormat>[] = [
  { value: HourFormat.TWELVE_HOUR, label: "12-hour" },
  { value: HourFormat.TWENTY_FOUR_HOUR, label: "24-hour" },
];

const colorTypeConfig: Record<ColorType, { title: string; label: string }> = {
  [ColorType.POMODORO]: {
    title: "Pick a color for Pomodoro",
    label: "Pomodoro color",
  },
  [ColorType.SHORT_BREAK]: {
    title: "Pick a color for Short Break",
    label: "Short break color",
  },
  [ColorType.LONG_BREAK]: {
    title: "Pick a color for Long Break",
    label: "Long break color",
  },
};

export const ThemeSection = memo(function ThemeSection({
  themeColors,
  hourFormat,
  onChange,
  onResetColors,
}: ThemeSectionProps) {
  const [localValues, setLocalValues] = useState({
    themeColors,
    hourFormat,
  });

  const [colorPickerOpen, setColorPickerOpen] = useState<ColorType | null>(
    null
  );

  useEffect(() => {
    setLocalValues({ themeColors, hourFormat });
  }, [themeColors, hourFormat]);

  const debouncedOnChange = useCallback(
    debounce((values: Partial<ThemeSectionProps>) => {
      onChange(values);
    }, 50),
    [onChange]
  );

  const handleHourFormatChange = (value: HourFormat) => {
    setLocalValues((prev) => ({ ...prev, hourFormat: value }));
    debouncedOnChange({ hourFormat: value });
  };

  const handleColorChange = (color: string, type: ColorType) => {
    const newThemeColors = {
      ...localValues.themeColors,
      [type]: color,
    };

    setLocalValues((prev) => ({
      ...prev,
      themeColors: newThemeColors,
    }));

    onChange({ themeColors: newThemeColors });
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
              {Object.values(ColorType).map((type) => (
                <button
                  key={type}
                  className="w-8 h-8 rounded-md"
                  style={{ backgroundColor: localValues.themeColors[type] }}
                  onClick={() => setColorPickerOpen(type)}
                  aria-label={colorTypeConfig[type].label}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end">
            <button
              onClick={onResetColors}
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

      {colorPickerOpen && (
        <ColorPickerModal
          isOpen={!!colorPickerOpen}
          onClose={() => setColorPickerOpen(null)}
          onSelect={(color) => handleColorChange(color, colorPickerOpen)}
          title={colorTypeConfig[colorPickerOpen].title}
          selectedColor={localValues.themeColors[colorPickerOpen]}
        />
      )}
    </div>
  );
});
