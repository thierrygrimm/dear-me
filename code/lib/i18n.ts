import { copyEn, type Copy } from "@/lib/copy";
import { copyDe } from "@/lib/copy-de";
import { copyFr } from "@/lib/copy-fr";
import { copyIt } from "@/lib/copy-it";
import type { AppLanguage } from "@/lib/settingsPrefs";

export type LocaleCode = "en" | "de" | "fr" | "it";

const BY_LANGUAGE: Record<AppLanguage, Copy> = {
  English: copyEn,
  Deutsch: copyDe,
  Français: copyFr,
  Italiano: copyIt,
};

const HTML_LANG: Record<AppLanguage, LocaleCode> = {
  English: "en",
  Deutsch: "de",
  Français: "fr",
  Italiano: "it",
};

export function getCopy(language: AppLanguage = "English"): Copy {
  return BY_LANGUAGE[language] ?? copyEn;
}

export function htmlLangFor(language: AppLanguage): LocaleCode {
  return HTML_LANG[language] ?? "en";
}

export function applyDocumentLang(language: AppLanguage): void {
  if (typeof document === "undefined") return;
  document.documentElement.lang = htmlLangFor(language);
}
