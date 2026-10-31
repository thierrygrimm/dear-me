"use client";

import { cn } from "@/lib/cn";
import { useEffect, type ReactNode } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  full?: boolean;
  children: ReactNode;
  className?: string;
};

export function BottomSheet({
  open,
  onClose,
  title,
  description,
  full,
  children,
  className,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div className={cn("dm-bs", open && "open", className)} aria-hidden={!open}>
      <button
        type="button"
        className="scrim"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        className={cn("sheet", full && "full")}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "dm-bs-title" : undefined}
      >
        <button type="button" className="grab" aria-label="Dismiss" onClick={onClose} />
        {title ? <h4 id="dm-bs-title">{title}</h4> : null}
        {description ? <p>{description}</p> : null}
        {children}
      </div>
    </div>
  );
}

type OptionProps = {
  label: string;
  detail?: string;
  checked?: boolean;
  onSelect?: () => void;
};

export function SheetOption({ label, detail, checked, onSelect }: OptionProps) {
  return (
    <button
      type="button"
      className="dm-opt"
      role="radio"
      aria-checked={checked ?? false}
      onClick={onSelect}
    >
      <span>
        {label}
        {detail ? <small>{detail}</small> : null}
      </span>
      <i aria-hidden />
    </button>
  );
}
