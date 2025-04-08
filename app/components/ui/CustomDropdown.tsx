import { useState, useEffect, useRef, useCallback } from "react";
import { FaChevronDown } from "react-icons/fa";

export type DropdownOption<T extends React.Key = string> = {
  value: T;
  label: string;
};

interface CustomDropdownProps<T extends React.Key = string> {
  value: T;
  options: DropdownOption<T>[];
  onChange: (value: T) => void;
  className?: string;
}

export function CustomDropdown<T extends React.Key = string>({
  value,
  options,
  onChange,
  className = "",
}: CustomDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get the current selected option
  const selectedOption =
    options.find((option) => option.value === value) || options[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle option selection
  const handleSelect = useCallback(
    (option: DropdownOption<T>) => {
      onChange(option.value);
      setIsOpen(false);
    },
    [onChange]
  );

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        className="flex items-center justify-between w-full border rounded-md pl-3 pr-3 py-2 text-sm h-9 bg-white"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{selectedOption.label}</span>
        <FaChevronDown size={12} className="ml-2 text-gray-500" />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
          <ul className="py-1" role="listbox">
            {options.map((option) => (
              <li
                key={option.value}
                role="option"
                aria-selected={option.value === value}
                className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                  option.value === value ? "bg-gray-200" : ""
                }`}
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
