"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { useEffect, useId, useRef } from "react";

type Props = {
  value: string;
  onChange: (next: string) => void;
  unit?: string;
  wasLabel?: string;
  label?: string;
  allowDecimal?: boolean;
  maxLength?: number;
  onSave?: () => void;
  onCancel?: () => void;
  saveDisabled?: boolean;
  saveLabel?: string;
  cancelLabel?: string;
  className?: string;
  /** Auto-focus the field so hardware / OS keyboard works immediately */
  autoFocus?: boolean;
  /** Select the whole value on focus so the first key replaces it */
  selectOnFocus?: boolean;
};

function sanitize(
  raw: string,
  allowDecimal: boolean,
  maxLength: number,
): string {
  let next = raw.replace(allowDecimal ? /[^\d.]/g : /\D/g, "");
  if (allowDecimal) {
    const firstDot = next.indexOf(".");
    if (firstDot !== -1) {
      next =
        next.slice(0, firstDot + 1) +
        next.slice(firstDot + 1).replace(/\./g, "");
    }
  }
  // Drop leading zeros unless "0" or "0.…"
  if (next.length > 1 && next.startsWith("0") && next[1] !== ".") {
    next = next.replace(/^0+/, "") || "0";
  }
  return next.slice(0, maxLength);
}

export function NumberEdit({
  value,
  onChange,
  unit,
  wasLabel,
  label,
  allowDecimal = true,
  maxLength = 10,
  onSave,
  onCancel,
  saveDisabled,
  saveLabel = "Save",
  cancelLabel = "Keep it",
  className,
  autoFocus = true,
  selectOnFocus = true,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const id = useId();

  useEffect(() => {
    if (!autoFocus) return;
    const t = window.setTimeout(() => {
      const el = inputRef.current;
      if (!el) return;
      el.focus({ preventScroll: true });
      if (selectOnFocus) el.select();
      else {
        const len = el.value.length;
        el.setSelectionRange(len, len);
      }
    }, 40);
    return () => window.clearTimeout(t);
  }, [autoFocus, selectOnFocus]);

  function apply(next: string) {
    onChange(sanitize(next, allowDecimal, maxLength));
  }

  function tap(key: string) {
    if (key === "del") {
      apply(value.slice(0, -1));
      inputRef.current?.focus({ preventScroll: true });
      return;
    }
    if (key === "." && (!allowDecimal || value.includes("."))) {
      inputRef.current?.focus({ preventScroll: true });
      return;
    }
    apply(value === "0" && key !== "." ? key : `${value}${key}`);
    inputRef.current?.focus({ preventScroll: true });
  }

  return (
    <div className={cn("dm-ed", className)}>
      {label ? <span className="lab">{label}</span> : null}

      <label className="num" htmlFor={id}>
        <input
          id={id}
          ref={inputRef}
          className="dm-ed__input"
          type="text"
          inputMode={allowDecimal ? "decimal" : "numeric"}
          pattern={allowDecimal ? "[0-9]*[.]?[0-9]*" : "[0-9]*"}
          autoComplete="off"
          enterKeyHint="done"
          value={value}
          aria-label={label ?? "Value"}
          onChange={(e) => apply(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && onSave && !saveDisabled) {
              e.preventDefault();
              onSave();
            }
            if (e.key === "Escape" && onCancel) {
              e.preventDefault();
              onCancel();
            }
          }}
        />
        <i aria-hidden />
        {unit ? <small className="u">{unit}</small> : null}
      </label>

      {wasLabel ? (
        <span className="was">
          {wasLabel.startsWith("Was ") || wasLabel.startsWith("On ") ? (
            wasLabel
          ) : (
            <>
              Was <b>{wasLabel}</b>
            </>
          )}
        </span>
      ) : null}

      <div className="dm-keys" role="group" aria-label="Number pad">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "del"].map(
          (k) => (
            <button
              key={k}
              type="button"
              data-k={k}
              aria-label={k === "del" ? "Delete" : k === "." ? "Decimal point" : k}
              disabled={k === "." && !allowDecimal}
              onClick={() => tap(k)}
            >
              {k === "del" ? (
                <svg viewBox="0 0 24 24" width={22} height={22} aria-hidden>
                  <path d="M9 6h11v12H9l-5-6z" />
                  <path d="M12.5 9.5l5 5M17.5 9.5l-5 5" />
                </svg>
              ) : (
                k
              )}
            </button>
          ),
        )}
      </div>

      {onSave || onCancel ? (
        <div className="dm-edacts">
          {onCancel ? (
            <Button variant="secondary" onClick={onCancel}>
              {cancelLabel}
            </Button>
          ) : (
            <span />
          )}
          {onSave ? (
            <Button variant="primary" onClick={onSave} disabled={saveDisabled}>
              {saveLabel}
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
