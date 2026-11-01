"use client";

import { cn } from "@/lib/cn";
import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type TouchEvent,
} from "react";
import { createPortal } from "react-dom";

const SWIPE_CLOSE = 96;
const SWIPE_COLLAPSE = 48;
const DIALOG_MQ = "(min-width: 900px)";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  /** External heading id when the visible title lives in children. */
  labelledBy?: string;
  description?: string;
  /** Start (or force) full-height explain mode. Grab still toggles on phone. */
  full?: boolean;
  children: ReactNode;
  className?: string;
};

function focusables(root: HTMLElement) {
  return Array.from(
    root.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((el) => !el.hasAttribute("disabled") && el.offsetParent !== null);
}

function isDialogViewport() {
  return (
    typeof window !== "undefined" && window.matchMedia(DIALOG_MQ).matches
  );
}

export function BottomSheet({
  open,
  onClose,
  title,
  labelledBy,
  description,
  full: fullProp = false,
  children,
  className,
}: Props) {
  const reactId = useId();
  const titleId = `${reactId}-title`;
  const descId = `${reactId}-desc`;
  const labelId = labelledBy ?? (title ? titleId : undefined);

  const sheetRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const startY = useRef(0);
  const dragYRef = useRef(0);
  const dragging = useRef(false);

  const [mounted, setMounted] = useState(false);
  const [full, setFull] = useState(fullProp);
  const [dragY, setDragY] = useState(0);

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      setFull(fullProp);
      setDragY(0);
      dragging.current = false;
    }
  }, [open, fullProp]);

  useEffect(() => {
    if (!open) return;
    triggerRef.current = document.activeElement as HTMLElement | null;
    const sheet = sheetRef.current;
    if (!sheet) return;

    const nodes = focusables(sheet).filter(
      (el) => !el.classList.contains("grab") && !el.classList.contains("scrim"),
    );
    const target = nodes[0] ?? sheet;
    const t = window.setTimeout(() => target.focus(), 30);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const list = focusables(sheet);
      if (list.length === 0) {
        e.preventDefault();
        sheet.focus();
        return;
      }
      const first = list[0];
      const last = list[list.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (active === first || active === sheet)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      const prev = triggerRef.current;
      if (prev && typeof prev.focus === "function") {
        try {
          prev.focus();
        } catch {
          /* ignore */
        }
      }
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const endDrag = () => {
    dragging.current = false;
    const dy = dragYRef.current;
    dragYRef.current = 0;
    setDragY(0);
    if (dy >= SWIPE_CLOSE) {
      onClose();
      return;
    }
    if (full && dy >= SWIPE_COLLAPSE) {
      setFull(false);
    }
  };

  const onTouchStart = (e: TouchEvent) => {
    if (!open || isDialogViewport()) return;
    const sheet = sheetRef.current;
    const t = e.target as HTMLElement | null;
    const fromGrab = !!t?.closest(".grab");
    const y = e.touches[0]?.clientY ?? 0;
    const top = sheet?.getBoundingClientRect().top ?? 0;
    const fromHandleZone = y - top <= 52 && (sheet?.scrollTop ?? 0) <= 0;
    if (!fromGrab && !fromHandleZone) return;
    startY.current = y;
    dragging.current = true;
  };

  const onTouchMove = (e: TouchEvent) => {
    if (!dragging.current) return;
    const y = e.touches[0]?.clientY ?? startY.current;
    const dy = Math.max(0, y - startY.current);
    if (dy > 8 && e.cancelable) e.preventDefault();
    dragYRef.current = dy;
    setDragY(dy);
  };

  const onTouchEnd = () => {
    if (!dragging.current) return;
    endDrag();
  };

  /* Inline translateY fights centred-dialog CSS at ≥900px — only apply on phone. */
  const sheetStyle =
    dragY > 0 && !isDialogViewport()
      ? {
          transform: `translateY(${dragY}px)`,
          transition: "none" as const,
        }
      : undefined;

  const sheet = (
    <div
      className={cn("dm-bs", "dm-bs--fixed", open && "open", className)}
      aria-hidden={!open}
    >
      <button
        type="button"
        className="scrim"
        tabIndex={open ? 0 : -1}
        aria-label="Close"
        onClick={onClose}
      />
      <div
        ref={sheetRef}
        className={cn("sheet", full && "full")}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        style={sheetStyle}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
      >
        <button
          type="button"
          className="grab"
          tabIndex={open ? 0 : -1}
          aria-label={full ? "Collapse" : "Expand"}
          onClick={() => setFull((v) => !v)}
        />
        {title ? <h4 id={titleId}>{title}</h4> : null}
        {description ? <p id={descId}>{description}</p> : null}
        {children}
      </div>
    </div>
  );

  return mounted ? createPortal(sheet, document.body) : null;
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
