import React, { memo } from "react";

interface RangeSliderProps {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  label?: string;
  showPercentage?: boolean;
  className?: string;
}

// This component standardizes the range slider UI across the application
export const RangeSlider = memo(function RangeSlider({
  min,
  max,
  step,
  value,
  onChange,
  label,
  showPercentage = true,
  className = "",
}: RangeSliderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(e.target.value));
  };

  const displayValue = showPercentage ? Math.round(value * 100) : value;

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between mb-1">
          {label && <span className="text-gray-500 text-sm">{label}</span>}
          {showPercentage && (
            <span className="text-gray-500 text-sm">
              {displayValue}
              {showPercentage ? "%" : ""}
            </span>
          )}
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="w-full h-2 appearance-none rounded-lg bg-gray-200 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-800 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gray-800"
      />
    </div>
  );
});
