/** Settings A prefs — Appearance, Text size, Language, Reminders (DS Settings). */

export type Appearance = "Light" | "Dark" | "System";
export type TextSize = "Smaller" | "Standard" | "Larger";
export type AppLanguage = "English" | "Deutsch" | "Français" | "Italiano";

const THEME_KEY = "dm-appearance";
const SIZE_KEY = "dm-text-size";
const LANG_KEY = "dm-language";
const REM_DEADLINES_KEY = "dm-rem-deadlines";
const REM_WEEKLY_KEY = "dm-rem-weekly";

export function readAppearance(): Appearance {
  if (typeof window === "undefined") return "System";
  const v = sessionStorage.getItem(THEME_KEY);
  if (v === "Light" || v === "Dark" || v === "System") return v;
  return "System";
}

export function markAppearance(v: Appearance): void {
  sessionStorage.setItem(THEME_KEY, v);
  applyAppearance(v);
}

export function applyAppearance(v: Appearance = readAppearance()): void {
  if (typeof document === "undefined") return;
  const dark =
    v === "Dark" ||
    (v === "System" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  if (dark) document.documentElement.setAttribute("data-theme", "dark");
  else document.documentElement.removeAttribute("data-theme");
}

export function readTextSize(): TextSize {
  if (typeof window === "undefined") return "Standard";
  const v = sessionStorage.getItem(SIZE_KEY);
  if (v === "Smaller" || v === "Standard" || v === "Larger") return v;
  return "Standard";
}

export function textSizeZoom(v: TextSize): string {
  if (v === "Smaller") return "0.92";
  if (v === "Larger") return "1.12";
  return "1";
}

export function markTextSize(v: TextSize): void {
  sessionStorage.setItem(SIZE_KEY, v);
}

export function readLanguage(): AppLanguage {
  if (typeof window === "undefined") return "English";
  const v = sessionStorage.getItem(LANG_KEY);
  if (
    v === "English" ||
    v === "Deutsch" ||
    v === "Français" ||
    v === "Italiano"
  ) {
    return v;
  }
  return "English";
}

export function markLanguage(v: AppLanguage): void {
  sessionStorage.setItem(LANG_KEY, v);
}

export function languageToast(v: AppLanguage): string {
  const T: Record<AppLanguage, string> = {
    English: "Language: English",
    Deutsch: "Sprache: Deutsch",
    Français: "Langue : français",
    Italiano: "Lingua: italiano",
  };
  return T[v];
}

export function readReminders(): { deadlines: boolean; weekly: boolean } {
  if (typeof window === "undefined") {
    return { deadlines: true, weekly: false };
  }
  return {
    deadlines: sessionStorage.getItem(REM_DEADLINES_KEY) !== "0",
    weekly: sessionStorage.getItem(REM_WEEKLY_KEY) === "1",
  };
}

export function markReminders(next: {
  deadlines: boolean;
  weekly: boolean;
}): void {
  sessionStorage.setItem(REM_DEADLINES_KEY, next.deadlines ? "1" : "0");
  sessionStorage.setItem(REM_WEEKLY_KEY, next.weekly ? "1" : "0");
}

export function remindersLabel(r: {
  deadlines: boolean;
  weekly: boolean;
}): "On" | "Off" {
  return r.deadlines || r.weekly ? "On" : "Off";
}
