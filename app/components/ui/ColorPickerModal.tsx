import React, { useEffect, useState } from "react";
import { Modal } from "./Modal";
import { FaCheck } from "react-icons/fa";
import { PREDEFINED_COLORS, DEFAULT_THEME_COLORS } from "../../constants";

interface ColorPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (color: string) => void;
  title: string;
  selectedColor: string;
}

export const ColorPickerModal: React.FC<ColorPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  title,
  selectedColor,
}) => {
  // Local state to ensure selected color is properly tracked
  const [currentSelectedColor, setCurrentSelectedColor] =
    useState(selectedColor);

  // Update local state when prop changes
  useEffect(() => {
    setCurrentSelectedColor(selectedColor);
  }, [selectedColor]);
  const handleColorSelect = (color: string) => {
    // Update local state immediately
    setCurrentSelectedColor(color);
    // Call onSelect without closing the modal
    // This allows users to try multiple colors without closing the modal
    onSelect(color);
  };

  // Find if the color is a default theme color (to show checkmark for default colors)
  const isDefaultThemeColor = (color: string): boolean => {
    return Object.values(DEFAULT_THEME_COLORS).some(
      (defaultColor) => defaultColor.toLowerCase() === color.toLowerCase()
    );
  };

  // Check if a color is selected
  const isColorSelected = (color: string): boolean => {
    console.log("===>color", color);
    // console.log("===>currentSelectedColor", currentSelectedColor);

    // If we have a currentSelectedColor, check if it matches
    if (currentSelectedColor) {
      return currentSelectedColor.toLowerCase() === color.toLowerCase();
    }
    // If no explicit selection has been made, check if it's a default color
    return isDefaultThemeColor(color);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="grid grid-cols-4 gap-3 p-4 mx-auto">
        {Object.entries(PREDEFINED_COLORS).map(([name, color]) => (
          <button
            key={name}
            className="w-12 h-12 rounded-md flex items-center justify-center relative mx-auto"
            style={{ backgroundColor: color }}
            onClick={() => handleColorSelect(color)}
            aria-label={`${name} color`}
          >
            {isColorSelected(color) && (
              <FaCheck className="text-white" size={16} />
            )}
          </button>
        ))}
      </div>
    </Modal>
  );
};
