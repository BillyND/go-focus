import { useState, useEffect } from "react";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { useTimerStore } from "../../store/timerStore";
import { toast } from "sonner";
import { requestNotificationPermission } from "../../utils/notifications";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, updateSettings } = useTimerStore();
  const [formValues, setFormValues] = useState({ ...settings });
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Check for notification permission on component mount
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationsEnabled(Notification.permission === "granted");
    }
  }, []);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    // Handle different input types
    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setFormValues({ ...formValues, [name]: checked });
    } else if (type === "range") {
      setFormValues({ ...formValues, [name]: parseFloat(value) });
    } else if (type === "number") {
      // Ensure values are within reasonable limits
      const numValue = Math.max(1, Math.min(60, parseInt(value, 10) || 1));
      setFormValues({ ...formValues, [name]: numValue });
    } else {
      setFormValues({ ...formValues, [name]: value });
    }
  };

  // Handle form submission
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateSettings(formValues);
    onClose();
    toast.success("Settings updated");
  };

  // Request notifications permission
  const handleRequestNotifications = async () => {
    const granted = await requestNotificationPermission();
    setNotificationsEnabled(granted);

    if (granted) {
      toast.success("Notifications enabled");
    } else {
      toast.error("Notifications permission denied");
    }
  };

  // Play test sound
  const playTestSound = () => {
    try {
      const audio = new Audio(`/sounds/${formValues.alarmSound}.mp3`);
      audio.volume = formValues.alarmVolume;
      audio.play().catch((e) => {
        console.error("Error playing sound:", e);
        toast.error("Sound files may be missing", {
          description:
            "Please check that the audio files exist in the public/sounds directory",
        });
      });
    } catch (error) {
      console.error("Could not play test sound:", error);
      toast.error("Could not play test sound");
    }
  };

  const modalFooter = (
    <>
      <Button variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleSubmit}>
        Save Changes
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Settings"
      footer={modalFooter}
    >
      <div className="space-y-6">
        {/* Timer Durations */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Timer Durations</h3>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm mb-1" htmlFor="pomodoro">
                Focus (minutes)
              </label>
              <input
                id="pomodoro"
                name="pomodoro"
                type="number"
                min="1"
                max="60"
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={formValues.pomodoro}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="block text-sm mb-1" htmlFor="shortBreak">
                Short Break (minutes)
              </label>
              <input
                id="shortBreak"
                name="shortBreak"
                type="number"
                min="1"
                max="30"
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={formValues.shortBreak}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="block text-sm mb-1" htmlFor="longBreak">
                Long Break (minutes)
              </label>
              <input
                id="longBreak"
                name="longBreak"
                type="number"
                min="1"
                max="60"
                className="w-full border rounded-md px-3 py-2 text-sm"
                value={formValues.longBreak}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1" htmlFor="longBreakInterval">
              Long Break Interval (pomodoros)
            </label>
            <input
              id="longBreakInterval"
              name="longBreakInterval"
              type="number"
              min="1"
              max="10"
              className="w-full sm:w-1/3 border rounded-md px-3 py-2 text-sm"
              value={formValues.longBreakInterval}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Auto Start Options */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Auto Start</h3>

          <div className="flex items-center mb-2">
            <input
              id="autoStartBreaks"
              name="autoStartBreaks"
              type="checkbox"
              className="mr-3 h-4 w-4"
              checked={formValues.autoStartBreaks}
              onChange={handleInputChange}
            />
            <label htmlFor="autoStartBreaks" className="text-sm">
              Auto-start breaks
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="autoStartPomodoros"
              name="autoStartPomodoros"
              type="checkbox"
              className="mr-3 h-4 w-4"
              checked={formValues.autoStartPomodoros}
              onChange={handleInputChange}
            />
            <label htmlFor="autoStartPomodoros" className="text-sm">
              Auto-start pomodoros
            </label>
          </div>
        </div>

        {/* Sound Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Sound</h3>

          <div>
            <label className="block text-sm mb-1" htmlFor="alarmSound">
              Alarm Sound
            </label>
            <div className="flex items-center gap-2">
              <select
                id="alarmSound"
                name="alarmSound"
                className="flex-grow border rounded-md px-3 py-2 text-sm"
                value={formValues.alarmSound}
                onChange={handleInputChange}
              >
                <option value="bell">Bell</option>
                <option value="digital">Digital</option>
                <option value="kitchen">Kitchen Timer</option>
                <option value="analog">Analog Alarm</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={playTestSound}
                aria-label="Test sound"
              >
                <FaVolumeUp size={16} />
              </Button>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <label htmlFor="alarmVolume">Volume</label>
              <span>{Math.round(formValues.alarmVolume * 100)}%</span>
            </div>
            <div className="flex items-center gap-3">
              <FaVolumeMute size={16} className="text-gray-500" />
              <input
                id="alarmVolume"
                name="alarmVolume"
                type="range"
                min="0"
                max="1"
                step="0.01"
                className="w-full h-2 rounded-full bg-gray-200 appearance-none"
                value={formValues.alarmVolume}
                onChange={handleInputChange}
              />
              <FaVolumeUp size={16} className="text-gray-500" />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Notifications</h3>

          <Button
            variant={notificationsEnabled ? "outline" : "primary"}
            onClick={handleRequestNotifications}
            disabled={notificationsEnabled}
          >
            {notificationsEnabled
              ? "Notifications Enabled"
              : "Enable Notifications"}
          </Button>

          <p className="text-xs text-gray-500">
            Notifications will alert you when a timer ends, even if the tab is
            in the background.
          </p>
        </div>
      </div>
    </Modal>
  );
}
