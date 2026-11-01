"use client";

import { setActiveCopy, type Copy } from "@/lib/copy";
import { getCopy, applyDocumentLang } from "@/lib/i18n";
import {
  markLanguage,
  readLanguage,
  type AppLanguage,
} from "@/lib/settingsPrefs";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type LocaleApi = {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  copy: Copy;
};

const LocaleContext = createContext<LocaleApi | null>(null);

export function useLocale(): LocaleApi {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}

/** Localized product copy for the active language. */
export function useCopy(): Copy {
  return useLocale().copy;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<AppLanguage>("English");

  useEffect(() => {
    const saved = readLanguage();
    setActiveCopy(getCopy(saved));
    setLanguageState(saved);
    applyDocumentLang(saved);
  }, []);

  const setLanguage = useCallback((next: AppLanguage) => {
    const nextCopy = getCopy(next);
    setActiveCopy(nextCopy);
    markLanguage(next);
    setLanguageState(next);
    applyDocumentLang(next);
  }, []);

  const copy = useMemo(() => getCopy(language), [language]);

  const api = useMemo(
    () => ({ language, setLanguage, copy }),
    [language, setLanguage, copy],
  );

  return (
    <LocaleContext.Provider value={api}>{children}</LocaleContext.Provider>
  );
}

/**
 * Remounts children when the language changes so screens that read `copy`
 * via the live Proxy refresh without threading useCopy everywhere.
 * Keep ToastProvider outside this gate so toasts survive a switch.
 */
export function LocaleGate({ children }: { children: ReactNode }) {
  const { language } = useLocale();
  return (
    <div key={language} className="contents">
      {children}
    </div>
  );
}
