"use client";

import { copy } from "@/lib/copy";
import { cn } from "@/lib/cn";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Check } from "lucide-react";

type ToastTone = "default" | "error" | "light";

type ToastItem = {
  id: number;
  message: string;
  undoLabel?: string;
  onUndo?: () => void;
  tone?: ToastTone;
  leaving?: boolean;
};

type ToastApi = {
  show: (opts: {
    message: string;
    undoLabel?: string;
    onUndo?: () => void;
    tone?: ToastTone;
    durationMs?: number;
  }) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setItems((prev) =>
      prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)),
    );
    window.setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 240);
  }, []);

  const show = useCallback<ToastApi["show"]>(
    ({ message, undoLabel, onUndo, tone = "default", durationMs = 3200 }) => {
      const id = Date.now() + Math.random();
      setItems((prev) => [
        ...prev,
        { id, message, undoLabel, onUndo, tone },
      ]);
      window.setTimeout(() => dismiss(id), durationMs);
    },
    [dismiss],
  );

  const api = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="dm-toastzone" aria-live="polite">
        {items.map((t) => (
          <div
            key={t.id}
            className={cn(
              "dm-toast",
              t.tone === "error" && "dm-toast--error",
              t.tone === "light" && "dm-toast--light",
              t.leaving && "out",
            )}
            role="status"
          >
            <Check strokeWidth={1.75} aria-hidden />
            <span>{t.message}</span>
            {t.onUndo ? (
              <button
                type="button"
                onClick={() => {
                  t.onUndo?.();
                  dismiss(t.id);
                }}
              >
                {t.undoLabel ?? copy.toast.undo}
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
