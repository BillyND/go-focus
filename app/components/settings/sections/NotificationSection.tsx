import React, { memo, useState, useEffect, useCallback } from "react";
import { debounce } from "../../../utils/debounce";
import { FaBell } from "react-icons/fa";
import { CustomDropdown, DropdownOption } from "../../ui/CustomDropdown";
import { ReminderType } from "../../../constants";

interface NotificationSectionProps {
  reminderType: ReminderType;
  reminderMinutes: number;
  onChange: (
    values: Partial<{
      reminderType: ReminderType;
      reminderMinutes: number;
    }>
  ) => void;
}

const reminderTypeOptions: DropdownOption<ReminderType>[] = [
  { value: ReminderType.LAST, label: "Last" },
  { value: ReminderType.EVERY, label: "Every" },
];

export const NotificationSection = memo(function NotificationSection({
  reminderType,
  reminderMinutes,
  onChange,
}: NotificationSectionProps) {
  // Local state
  const [localValues, setLocalValues] = useState({
    reminderType,
    reminderMinutes,
  });

  // Update local state when props change
  useEffect(() => {
    setLocalValues({
      reminderType,
      reminderMinutes,
    });
  }, [reminderType, reminderMinutes]);

  // Debounced update function
  const debouncedOnChange = useCallback(
    debounce((values: Partial<NotificationSectionProps>) => {
      onChange(values);
    }, 50),
    [onChange]
  );

  return (
    <div className="py-4">
      <h3 className="text-gray-500 font-medium flex items-center gap-2 mb-4">
        <FaBell size={18} />
        NOTIFICATION
      </h3>

      <div className="space-y-4">
        <div className="flex items-center">
          <span className="text-gray-700 mr-2">Reminder</span>
          <CustomDropdown<ReminderType>
            value={localValues.reminderType}
            options={reminderTypeOptions}
            onChange={(value) => {
              setLocalValues((prev) => ({ ...prev, reminderType: value }));
              debouncedOnChange({ reminderType: value });
            }}
            className="w-28 mx-2"
          />
          <input
            type="number"
            value={localValues.reminderMinutes}
            onChange={(e) => {
              const minutes = parseInt(e.target.value, 10);
              setLocalValues((prev) => ({ ...prev, reminderMinutes: minutes }));
              debouncedOnChange({ reminderMinutes: minutes });
            }}
            min={1}
            max={60}
            className="w-16 px-3 py-2 bg-gray-100 rounded text-center mx-2"
          />
          <span className="text-gray-700 ml-2">min</span>
        </div>
      </div>
    </div>
  );
});
