import React, { memo, useState, useEffect, useCallback } from "react";
import { debounce } from "../../../utils/debounce";
import { FaList, FaInfoCircle } from "react-icons/fa";
import { Toggle } from "../../ui/Toggle";

interface TaskSectionProps {
  autoCheckTasks: boolean;
  autoSwitchTasks: boolean;
  onChange: (
    values: Partial<{
      autoCheckTasks: boolean;
      autoSwitchTasks: boolean;
    }>
  ) => void;
}

export const TaskSection = memo(function TaskSection({
  autoCheckTasks,
  autoSwitchTasks,
  onChange,
}: TaskSectionProps) {
  // Local state
  const [localValues, setLocalValues] = useState({
    autoCheckTasks,
    autoSwitchTasks,
  });

  // Update local state when props change
  useEffect(() => {
    setLocalValues({
      autoCheckTasks,
      autoSwitchTasks,
    });
  }, [autoCheckTasks, autoSwitchTasks]);

  // Debounced update function
  const debouncedOnChange = useCallback(
    debounce((values: Partial<TaskSectionProps>) => {
      onChange(values);
    }, 50),
    [onChange]
  );
  return (
    <div className="border-b border-gray-200 py-4">
      <h3 className="text-gray-500 font-medium flex items-center gap-2 mb-4">
        <FaList size={18} />
        TASK
      </h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-gray-700">Auto Check Tasks</span>
            <FaInfoCircle
              size={16}
              className="text-gray-400 cursor-help"
              title="Automatically check off tasks when timer completes"
            />
          </div>
          <Toggle
            isChecked={localValues.autoCheckTasks}
            onChange={(checked) => {
              setLocalValues((prev) => ({ ...prev, autoCheckTasks: checked }));
              debouncedOnChange({ autoCheckTasks: checked });
            }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-gray-700">Auto Switch Tasks</span>
            <FaInfoCircle
              size={16}
              className="text-gray-400 cursor-help"
              title="Automatically switch to the next task when the current one is complete"
            />
          </div>
          <Toggle
            isChecked={localValues.autoSwitchTasks}
            onChange={(checked) => {
              setLocalValues((prev) => ({ ...prev, autoSwitchTasks: checked }));
              debouncedOnChange({ autoSwitchTasks: checked });
            }}
          />
        </div>
      </div>
    </div>
  );
});
