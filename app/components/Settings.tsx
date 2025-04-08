import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { useTimerStore } from "../store/timerStore";
import { toast } from "sonner";
import { requestNotificationPermission } from "../utils/notifications";

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Settings({ isOpen, onClose }: SettingsProps) {
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
        toast.error("Error playing sound. Sound files may be missing.", {
          description: "Please add .mp3 files to the /public/sounds directory.",
        });
      });
    } catch (error) {
      console.error("Could not play test sound:", error);
      toast.error("Could not play test sound", {
        description:
          "Sound files are not available. This is normal in the demo version.",
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="bg-background rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
          >
            <div className="flex justify-between items-center border-b border-foreground/10 p-4">
              <h2 className="text-xl font-bold">Settings</h2>
              <button
                className="btn btn-icon btn-ghost"
                onClick={onClose}
                aria-label="Close settings"
              >
                <FaTimes size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Timer Durations */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium mb-2">Timer Durations</h3>

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
                      className="input w-full"
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
                      className="input w-full"
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
                      className="input w-full"
                      value={formValues.longBreak}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="block text-sm mb-1"
                    htmlFor="longBreakInterval"
                  >
                    Long Break Interval (pomodoros)
                  </label>
                  <input
                    id="longBreakInterval"
                    name="longBreakInterval"
                    type="number"
                    min="1"
                    max="10"
                    className="input w-full sm:w-1/3"
                    value={formValues.longBreakInterval}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Auto Start Options */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium mb-2">Auto Start</h3>

                <div className="flex items-center">
                  <input
                    id="autoStartBreaks"
                    name="autoStartBreaks"
                    type="checkbox"
                    className="mr-3 h-5 w-5"
                    checked={formValues.autoStartBreaks}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="autoStartBreaks">Auto-start breaks</label>
                </div>

                <div className="flex items-center">
                  <input
                    id="autoStartPomodoros"
                    name="autoStartPomodoros"
                    type="checkbox"
                    className="mr-3 h-5 w-5"
                    checked={formValues.autoStartPomodoros}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="autoStartPomodoros">
                    Auto-start pomodoros
                  </label>
                </div>
              </div>

              {/* Sound Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium mb-2">Sound</h3>

                <div>
                  <label className="block text-sm mb-1" htmlFor="alarmSound">
                    Alarm Sound
                  </label>
                  <div className="flex items-center gap-2">
                    <select
                      id="alarmSound"
                      name="alarmSound"
                      className="select w-full"
                      value={formValues.alarmSound}
                      onChange={handleInputChange}
                    >
                      <option value="bell">Bell</option>
                      <option value="digital">Digital</option>
                      <option value="kitchen">Kitchen Timer</option>
                      <option value="analog">Analog Alarm</option>
                    </select>
                    <button
                      type="button"
                      className="btn btn-icon btn-outline"
                      onClick={playTestSound}
                    >
                      <FaVolumeUp size={16} />
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    className="flex justify-between text-sm mb-1"
                    htmlFor="alarmVolume"
                  >
                    <span>Volume</span>
                    <span>{Math.round(formValues.alarmVolume * 100)}%</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <FaVolumeMute size={16} className="text-foreground/60" />
                    <input
                      id="alarmVolume"
                      name="alarmVolume"
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      className="w-full h-2 rounded-full bg-foreground/10 appearance-none"
                      value={formValues.alarmVolume}
                      onChange={handleInputChange}
                    />
                    <FaVolumeUp size={16} className="text-foreground/60" />
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium mb-2">Notifications</h3>

                <button
                  type="button"
                  className={`btn ${
                    notificationsEnabled ? "btn-outline" : "btn-primary"
                  }`}
                  onClick={handleRequestNotifications}
                  disabled={notificationsEnabled}
                >
                  {notificationsEnabled
                    ? "Notifications Enabled"
                    : "Enable Notifications"}
                </button>

                <p className="text-xs text-foreground/60">
                  Notifications will alert you when a timer ends, even if the
                  tab is in the background.
                </p>
              </div>

              <div className="pt-4 border-t border-foreground/10 flex justify-end space-x-3">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
