/**
 * Request notification permissions
 */
export async function requestNotificationPermission(): Promise<boolean> {
  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    return false;
  }

  if (!("Notification" in window)) {
    console.log("This browser does not support desktop notifications");
    return false;
  }

  if (Notification.permission === "granted") {
    return true;
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }

  return false;
}

/**
 * Show notification
 */
export function showNotification(
  title: string,
  options?: NotificationOptions
): void {
  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    return;
  }

  if (!("Notification" in window) || Notification.permission !== "granted") {
    return;
  }

  try {
    // Create and show notification
    new Notification(title, {
      icon: "/favicon.ico",
      ...options,
    });
  } catch (error) {
    console.error("Error showing notification:", error);
  }
}

/**
 * Show pomodoro completion notification
 */
export function showPomodoroCompleteNotification(): void {
  showNotification("Pomodoro Complete!", {
    body: "Time to take a break!",
    silent: false,
  });
}

/**
 * Show break completion notification
 */
export function showBreakCompleteNotification(): void {
  showNotification("Break Complete!", {
    body: "Ready to focus again?",
    silent: false,
  });
}
