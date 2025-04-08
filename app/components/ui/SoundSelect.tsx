import { FaVolumeUp } from "react-icons/fa";
import { memo } from "react";
import { Button } from "./Button";
import { CustomDropdown, DropdownOption } from "./CustomDropdown";

interface SoundSelectProps {
  value: string;
  onChange: (value: string) => void;
  onPlaySound: () => void;
}

const soundOptions: DropdownOption[] = [
  { value: "bell", label: "Bell" },
  { value: "digital", label: "Digital" },
  { value: "kitchen", label: "Kitchen Timer" },
  { value: "analog", label: "Analog Alarm" },
];

export const SoundSelect = memo(function SoundSelect({
  value,
  onChange,
  onPlaySound,
}: SoundSelectProps) {
  return (
    <div className="flex items-center">
      <CustomDropdown
        value={value}
        options={soundOptions}
        onChange={onChange}
        className="flex-grow"
      />
      <Button
        variant="outline"
        size="md"
        className="rounded-l-none h-9 ml-[-1px] border-l-0"
        onClick={onPlaySound}
        aria-label="Test sound"
      >
        <FaVolumeUp size={16} />
      </Button>
    </div>
  );
});
