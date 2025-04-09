/**
 * Collection of time-related utility functions to standardize time handling across the app
 */

/**
 * Formats the time in 12-hour format (e.g., "PM 12:36")
 * @param date The date to format
 * @returns Formatted time string
 */
export function formatTime12Hour(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${ampm} ${formattedHours}:${formattedMinutes}`;
}

/**
 * Formats the time in 24-hour format (e.g., "14:36")
 * @param date The date to format
 * @returns Formatted time string
 */
export function formatTime24Hour(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${formattedHours}:${formattedMinutes}`;
}

/**
 * Calculates the finish time based on duration in minutes
 * @param durationMinutes Duration in minutes
 * @returns Formatted finish time and the relative time in hours
 */
export function calculateFinishTime(durationMinutes: number): {
  finishTime: string;
  relativeHours: string;
} {
  const now = new Date();
  const finishDate = new Date(now.getTime() + durationMinutes * 60 * 1000);

  // Format the finish time in 12-hour format
  const finishTime = formatTime12Hour(finishDate);

  // Calculate relative hours (e.g., "0.2h")
  const hours = durationMinutes / 60;
  const relativeHours = hours.toFixed(1) + "h";

  return { finishTime, relativeHours };
}

/**
 * Formats seconds into MM:SS format
 * @param seconds Total seconds
 * @returns Formatted time string (MM:SS)
 */
export function formatSecondsToMinutesAndSeconds(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const formattedSeconds =
    remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

  return `${minutes}:${formattedSeconds}`;
}
