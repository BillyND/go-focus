import React from "react";
import { Modal } from "./Modal";
import { FaCheck } from "react-icons/fa";
import { PREDEFINED_COLORS } from "../../constants";

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
  const handleColorSelect = (color: string) => {
    // Just call onSelect without closing the modal
    // This allows users to try multiple colors without closing the modal
    onSelect(color);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="grid grid-cols-4 gap-4 p-4">
        {Object.entries(PREDEFINED_COLORS).map(([name, color]) => (
          <button
            key={name}
            className="w-16 h-16 rounded-md flex items-center justify-center relative"
            style={{ backgroundColor: color }}
            onClick={() => handleColorSelect(color)}
            aria-label={`${name} color`}
          >
            {selectedColor === color && (
              <FaCheck className="text-white" size={20} />
            )}
          </button>
        ))}
      </div>
    </Modal>
  );
};
