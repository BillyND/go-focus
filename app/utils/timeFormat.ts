/**
 * Format seconds to MM:SS
 */
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}

/**
 * Format seconds to human readable format
 */
export function formatTimeHuman(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (remainingSeconds === 0) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  }

  return `${minutes} minute${
    minutes !== 1 ? "s" : ""
  } ${remainingSeconds} second${remainingSeconds !== 1 ? "s" : ""}`;
}

/**
 * Get timer progress percentage
 */
export function getTimerProgress(
  currentSeconds: number,
  totalMinutes: number
): number {
  const totalSeconds = totalMinutes * 60;
  const progress = ((totalSeconds - currentSeconds) / totalSeconds) * 100;
  return Math.min(Math.max(progress, 0), 100); // Clamp between 0-100
}

/**
 * Get page title based on timer state
 */
export function getPageTitle(
  timeRemaining: number,
  isRunning: boolean,
  mode: string
): string {
  if (timeRemaining <= 0) {
    return "Time's up! - Pomodoro Timer";
  }

  const timeString = formatTime(timeRemaining);
  const modeDisplay = mode.charAt(0).toUpperCase() + mode.slice(1);

  if (isRunning) {
    return `${timeString} - ${modeDisplay} - Pomodoro Timer`;
  }

  return `${timeString} (Paused) - ${modeDisplay} - Pomodoro Timer`;
}
