import { ReactNode, useEffect, useRef, useLayoutEffect } from "react";
import { FaTimes } from "react-icons/fa";

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

  // Disable body scrolling when modal is open - improved implementation
  useLayoutEffect(() => {
    if (!isOpen) return;

    // Store the original values
    const originalStyle = document.body.style.cssText;
    const scrollY = window.scrollY;

    // Apply fixed positioning to maintain scroll position
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";

    return () => {
      // Restore original styles
      document.body.style.cssText = originalStyle;

      // Restore scroll position
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] flex flex-col shadow-xl"
      >
        {/* Fixed Header */}
        <div className="flex justify-between items-center border-b py-3 px-4 flex-shrink-0">
          <h2 className="text-xl font-medium">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close"
          >
            <FaTimes size={16} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 overflow-y-auto flex-grow">{children}</div>

        {/* Fixed Footer */}
        {footer && (
          <div className="py-3 px-4 border-t flex justify-end gap-2 flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
