import React from "react";

interface ToggleProps {
  isChecked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

export const Toggle: React.FC<ToggleProps> = ({
  isChecked,
  onChange,
  label,
  className = "",
}) => {
  return (
    <label className={`inline-flex items-center cursor-pointer ${className}`}>
      <div
        className={`relative w-11 h-6 rounded-full transition-colors ease-in-out duration-200 ${
          isChecked ? "bg-gray-400" : "bg-gray-200"
        }`}
        onClick={() => onChange(!isChecked)}
      >
        <div
          className={`absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-200 ease-in-out transform ${
            isChecked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </div>
      {label && <span className="ml-3 text-sm">{label}</span>}
    </label>
  );
};
