import { FaVolumeUp } from "react-icons/fa";
import { memo } from "react";
import { Button } from "./Button";
import { CustomDropdown, DropdownOption } from "./CustomDropdown";
import { AlarmSoundType } from "../../constants";

interface SoundSelectProps {
  value: AlarmSoundType;
  onChange: (value: AlarmSoundType) => void;
  onPlaySound: () => void;
}

const soundOptions: DropdownOption<AlarmSoundType>[] = [
  { value: AlarmSoundType.BELL, label: "Bell" },
  { value: AlarmSoundType.DIGITAL, label: "Digital" },
  { value: AlarmSoundType.KITCHEN, label: "Kitchen Timer" },
  { value: AlarmSoundType.ANALOG, label: "Analog Alarm" },
  { value: AlarmSoundType.WOOD, label: "Wood" },
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
        className="flex-grow rounded-r-none"
      />
      <Button
        variant="outline"
        size="md"
        className="rounded-l-none h-9 border-l-0"
        onClick={onPlaySound}
        aria-label="Test sound"
      >
        <FaVolumeUp size={16} />
      </Button>
    </div>
  );
});
