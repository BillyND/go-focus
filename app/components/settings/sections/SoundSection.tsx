import React, { memo, useState, useEffect, useCallback } from "react";
import { debounce } from "../../../utils/debounce";
import { FaVolumeUp } from "react-icons/fa";
import { CustomDropdown, DropdownOption } from "../../ui/CustomDropdown";
import { AlarmSoundType, TickingSoundType } from "../../../constants";
import { RangeSlider } from "../../ui/RangeSlider";

interface SoundSectionProps {
  alarmSound: AlarmSoundType;
  alarmVolume: number;
  tickingSound: TickingSoundType;
  tickingVolume: number;
  repeatCount: number;
  onChange: (
    values: Partial<{
      alarmSound: AlarmSoundType;
      alarmVolume: number;
      tickingSound: TickingSoundType;
      tickingVolume: number;
      repeatCount: number;
    }>
  ) => void;
  onPlayAlarmSound: () => void;
  onPlayTickingSound: () => void;
}

const alarmSoundOptions: DropdownOption<AlarmSoundType>[] = [
  { value: AlarmSoundType.BELL, label: "Bell" },
  { value: AlarmSoundType.DIGITAL, label: "Digital" },
  { value: AlarmSoundType.KITCHEN, label: "Kitchen Timer" },
  { value: AlarmSoundType.ANALOG, label: "Analog Alarm" },
  { value: AlarmSoundType.WOOD, label: "Wood" },
];

const tickingSoundOptions: DropdownOption<TickingSoundType>[] = [
  { value: TickingSoundType.NONE, label: "None" },
  { value: TickingSoundType.TICK1, label: "Tick 1" },
  { value: TickingSoundType.TICK2, label: "Tick 2" },
];

export const SoundSection = memo(function SoundSection({
  alarmSound,
  alarmVolume,
  tickingSound,
  tickingVolume,
  repeatCount,
  onChange,
  onPlayAlarmSound,
  onPlayTickingSound,
}: SoundSectionProps) {
  // Local state
  const [localValues, setLocalValues] = useState({
    alarmSound,
    alarmVolume,
    tickingSound,
    tickingVolume,
    repeatCount,
  });

  // Update local state when props change
  useEffect(() => {
    setLocalValues({
      alarmSound,
      alarmVolume,
      tickingSound,
      tickingVolume,
      repeatCount,
    });
  }, [alarmSound, alarmVolume, tickingSound, tickingVolume, repeatCount]);

  // Debounced update function
  const debouncedOnChange = useCallback(
    debounce((values: Partial<SoundSectionProps>) => {
      onChange(values);
    }, 50),
    [onChange]
  );

  const handleVolumeChange = (volume: number, type: "alarm" | "ticking") => {
    if (type === "alarm") {
      setLocalValues((prev) => ({ ...prev, alarmVolume: volume }));
      debouncedOnChange({ alarmVolume: volume });
    } else {
      setLocalValues((prev) => ({ ...prev, tickingVolume: volume }));
      debouncedOnChange({ tickingVolume: volume });
    }
  };

  return (
    <div className="border-b border-gray-200 py-4">
      <h3 className="text-gray-500 font-medium flex items-center gap-2 mb-4">
        <FaVolumeUp size={18} />
        SOUND
      </h3>

      <div className="space-y-6">
        {/* Alarm Sound */}
        <div>
          <label className="block text-gray-700 mb-2">Alarm Sound</label>
          <div className="flex space-x-2">
            <CustomDropdown<AlarmSoundType>
              value={localValues.alarmSound}
              options={alarmSoundOptions}
              onChange={(value) => {
                setLocalValues((prev) => ({ ...prev, alarmSound: value }));
                debouncedOnChange({ alarmSound: value });
              }}
              className="flex-grow"
            />
            <button
              onClick={onPlayAlarmSound}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded"
              title="Test alarm sound"
            >
              <FaVolumeUp />
            </button>
          </div>

          <div className="mt-3">
            <RangeSlider
              min={0}
              max={1}
              step={0.01}
              value={localValues.alarmVolume}
              onChange={(value) => handleVolumeChange(value, "alarm")}
              label="Volume"
            />
          </div>

          <div className="mt-3 flex justify-end items-center">
            <span className="text-gray-700 mr-2">repeat</span>
            <input
              type="number"
              min="1"
              max="10"
              value={localValues.repeatCount}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                setLocalValues((prev) => ({ ...prev, repeatCount: value }));
                debouncedOnChange({ repeatCount: value });
              }}
              className="w-16 px-3 py-2 bg-gray-100 rounded text-center"
            />
          </div>
        </div>

        {/* Ticking Sound */}
        <div>
          <label className="block text-gray-700 mb-2">Ticking Sound</label>
          <div className="flex space-x-2">
            <CustomDropdown<TickingSoundType>
              value={localValues.tickingSound}
              options={tickingSoundOptions}
              onChange={(value) => {
                setLocalValues((prev) => ({ ...prev, tickingSound: value }));
                debouncedOnChange({ tickingSound: value });
              }}
              className="flex-grow"
            />
            <button
              onClick={onPlayTickingSound}
              className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded"
              title="Test ticking sound"
              disabled={tickingSound === TickingSoundType.NONE}
            >
              <FaVolumeUp />
            </button>
          </div>

          <div className="mt-3">
            <RangeSlider
              min={0}
              max={1}
              step={0.01}
              value={localValues.tickingVolume}
              onChange={(value) => handleVolumeChange(value, "ticking")}
              label="Volume"
            />
          </div>
        </div>
      </div>
    </div>
  );
});
