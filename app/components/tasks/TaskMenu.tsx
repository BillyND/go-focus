import React, { memo, useRef, useEffect } from "react";
import {
  FaTrash,
  FaClipboard,
  FaFileImport,
  FaCheck,
  FaEye,
} from "react-icons/fa";
import { TaskMenuAction, TASK_MENU_ITEMS } from "../../constants";

interface TaskMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: TaskMenuAction) => void;
}

// Map of action to icon component
const actionIcons = {
  trash: <FaTrash size={16} />,
  template: <FaClipboard size={16} />,
  import: <FaFileImport size={16} />,
  check: <FaCheck size={16} />,
  eye: <FaEye size={16} />,
};

export const TaskMenu = memo(function TaskMenu({
  isOpen,
  onClose,
  onAction,
}: TaskMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-full mt-1 z-50 w-52 bg-white rounded-md shadow-lg overflow-hidden"
    >
      <div className="py-1">
        {TASK_MENU_ITEMS.map((item) => (
          <button
            key={item.id}
            disabled={item.locked}
            onClick={() => {
              onAction(item.id);
              onClose();
            }}
            className={`w-full text-left px-4 py-2 text-sm flex items-center gap-3 ${
              item.locked
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span className="text-gray-500">
              {actionIcons[item.icon as keyof typeof actionIcons]}
            </span>
            {item.label}
            {item.locked && <span className="ml-auto">🔒</span>}
          </button>
        ))}
      </div>
    </div>
  );
});
