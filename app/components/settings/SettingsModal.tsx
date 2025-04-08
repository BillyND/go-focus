import { useState, useEffect } from "react";
import { useTimerStore, DEFAULT_THEME_COLORS } from "../../store/timerStore";
import { toast } from "sonner";
import {
  AlarmSoundType,
  HourFormat,
  ReminderType,
  TickingSoundType,
} from "../../constants";
import { requestNotificationPermission } from "../../utils/notifications";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { TimerSection } from "./sections/TimerSection";
import { TaskSection } from "./sections/TaskSection";
import { SoundSection } from "./sections/SoundSection";
import { ThemeSection } from "./sections/ThemeSection";
import { NotificationSection } from "./sections/NotificationSection";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Extended settings interface with additional fields
interface ExtendedSettings {
  // Timer settings
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
  longBreakInterval: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;

  // Sound settings
  alarmSound: AlarmSoundType;
  alarmVolume: number;
  tickingSound: TickingSoundType;
  tickingVolume: number;
  repeatCount: number;

  // Theme settings
  themeColors: {
    pomodoro: string;
    shortBreak: string;
    longBreak: string;
  };
  hourFormat: HourFormat;

  // Task settings
  autoCheckTasks: boolean;
  autoSwitchTasks: boolean;

  // Notification settings
  reminderType: ReminderType;
  reminderMinutes: number;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, updateSettings } = useTimerStore();

  // Initialize with default values for any new fields
  const [formValues, setFormValues] = useState<ExtendedSettings>({
    ...settings,
    themeColors: settings.themeColors || { ...DEFAULT_THEME_COLORS },

    // Default values for new fields
    tickingSound: TickingSoundType.NONE,
    tickingVolume: 0.5,
    repeatCount: 1,
    hourFormat: HourFormat.TWELVE_HOUR,
    autoCheckTasks: false,
    autoSwitchTasks: false,
    reminderType: ReminderType.LAST,
    reminderMinutes: 5,
  });

  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Check for notification permission on component mount
  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotificationsEnabled(Notification.permission === "granted");
    }
  }, []);

  // Handle form submission
  const handleSubmit = () => {
    // Only send the fields that the store actually knows about
    // This prevents errors when we add new fields to the form that aren't in the store yet
    const {
      pomodoro,
      shortBreak,
      longBreak,
      longBreakInterval,
      autoStartBreaks,
      autoStartPomodoros,
      alarmSound,
      alarmVolume,
      themeColors,
    } = formValues;

    updateSettings({
      pomodoro,
      shortBreak,
      longBreak,
      longBreakInterval,
      autoStartBreaks,
      autoStartPomodoros,
      alarmSound,
      alarmVolume,
      themeColors,
    });

    onClose();
    toast.success("Settings updated");
  };

  // Handler for section changes
  const handleSectionChange = (values: Partial<ExtendedSettings>) => {
    setFormValues((prev) => ({ ...prev, ...values }));
  };

  // Reset colors to defaults
  const handleResetColors = () => {
    setFormValues((prev) => ({
      ...prev,
      themeColors: { ...DEFAULT_THEME_COLORS },
    }));
  };

  // Play alarm sound
  const playAlarmSound = () => {
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

  // Play ticking sound
  const playTickingSound = () => {
    if (formValues.tickingSound === TickingSoundType.NONE) return;

    try {
      const audio = new Audio(`/sounds/${formValues.tickingSound}.mp3`);
      audio.volume = formValues.tickingVolume;
      audio.play().catch((e) => {
        console.error("Error playing sound:", e);
        toast.error("Sound files may be missing");
      });
    } catch (error) {
      console.error("Could not play ticking sound:", error);
      toast.error("Could not play ticking sound");
    }
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
      <div className="max-h-[70vh] overflow-y-auto">
        {/* Timer Settings */}
        <TimerSection
          pomodoro={formValues.pomodoro}
          shortBreak={formValues.shortBreak}
          longBreak={formValues.longBreak}
          longBreakInterval={formValues.longBreakInterval}
          autoStartBreaks={formValues.autoStartBreaks}
          autoStartPomodoros={formValues.autoStartPomodoros}
          onChange={handleSectionChange}
        />

        {/* Task Settings */}
        <TaskSection
          autoCheckTasks={formValues.autoCheckTasks}
          autoSwitchTasks={formValues.autoSwitchTasks}
          onChange={handleSectionChange}
        />

        {/* Sound Settings */}
        <SoundSection
          alarmSound={formValues.alarmSound}
          alarmVolume={formValues.alarmVolume}
          tickingSound={formValues.tickingSound}
          tickingVolume={formValues.tickingVolume}
          repeatCount={formValues.repeatCount}
          onChange={handleSectionChange}
          onPlayAlarmSound={playAlarmSound}
          onPlayTickingSound={playTickingSound}
        />

        {/* Theme Settings */}
        <ThemeSection
          themeColors={formValues.themeColors}
          hourFormat={formValues.hourFormat}
          onChange={handleSectionChange}
          onResetColors={handleResetColors}
        />

        {/* Notification Settings */}
        <NotificationSection
          reminderType={formValues.reminderType}
          reminderMinutes={formValues.reminderMinutes}
          onChange={handleSectionChange}
        />

        {/* Notifications Permission */}
        <div className="py-4">
          <h3 className="text-lg font-medium mb-4">Browser Notifications</h3>
          <Button
            variant={notificationsEnabled ? "outline" : "primary"}
            onClick={handleRequestNotifications}
            disabled={notificationsEnabled}
          >
            {notificationsEnabled
              ? "Notifications Enabled"
              : "Enable Notifications"}
          </Button>
          <p className="mt-2 text-xs text-gray-500">
            Notifications will alert you when a timer ends, even if the tab is
            in the background.
          </p>
        </div>
      </div>
    </Modal>
  );
}
