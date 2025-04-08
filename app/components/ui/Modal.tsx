import { ReactNode, useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";
import { Button } from "./Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Handle clicking outside to close
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl"
      >
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-medium">{title}</h2>
          <Button variant="icon" size="sm" onClick={onClose} aria-label="Close">
            <FaTimes size={16} />
          </Button>
        </div>

        <div className="p-4">{children}</div>

        {footer && (
          <div className="p-4 border-t flex justify-end gap-2">{footer}</div>
        )}
      </div>
    </div>
  );
}
