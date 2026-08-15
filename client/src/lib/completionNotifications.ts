export type CompletionNotificationPreferences = {
  desktop: boolean;
  sound: boolean;
};

const STORAGE_KEY = "noiacore-completion-notifications";
const DEFAULT_PREFERENCES: CompletionNotificationPreferences = {
  desktop: false,
  sound: false,
};
const recentCompletions = new Map<string, number>();
const DEDUPE_WINDOW_MS = 1000;

function readPreferences(): CompletionNotificationPreferences {
  if (typeof window === "undefined") return DEFAULT_PREFERENCES;
  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(STORAGE_KEY) ?? "null"
    );
    return {
      desktop: parsed?.desktop === true,
      sound: parsed?.sound === true,
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

export function getCompletionNotificationPreferences() {
  return readPreferences();
}

export function setCompletionNotificationPreferences(
  preferences: CompletionNotificationPreferences
) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
}

export async function requestDesktopNotificationPermission() {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported" as const;
  }
  if (window.Notification.permission === "granted") return "granted" as const;
  if (window.Notification.permission === "denied") return "denied" as const;
  return window.Notification.requestPermission();
}

export function playCompletionSound() {
  if (typeof window === "undefined") return false;
  const AudioContextClass =
    window.AudioContext ??
    (window as typeof window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioContextClass) return false;

  try {
    const audioContext = new AudioContextClass();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const now = audioContext.currentTime;
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(587.33, now);
    oscillator.frequency.exponentialRampToValueAtTime(880, now + 0.1);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + 0.3);
    oscillator.addEventListener("ended", () => void audioContext.close());
    return true;
  } catch {
    return false;
  }
}

export function notifyCompletion(title = "Tarea completada", detail?: string) {
  const key = `${title}:${detail ?? ""}`;
  const now = Date.now();
  const previous = recentCompletions.get(key);
  if (previous && now - previous < DEDUPE_WINDOW_MS) return false;
  recentCompletions.set(key, now);
  if (recentCompletions.size > 100) {
    recentCompletions.forEach((timestamp, completionKey) => {
      if (now - timestamp >= DEDUPE_WINDOW_MS)
        recentCompletions.delete(completionKey);
    });
  }
  const preferences = readPreferences();
  if (preferences.sound) playCompletionSound();
  if (
    preferences.desktop &&
    typeof window !== "undefined" &&
    "Notification" in window &&
    window.Notification.permission === "granted"
  ) {
    try {
      new window.Notification("NOIACORE LAB", {
        body: detail ? `${title}: ${detail}` : title,
        icon: "/favicon.ico",
        tag: "noiacore-completion",
      });
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

export function resetCompletionNotificationDedupeForTests() {
  recentCompletions.clear();
}
