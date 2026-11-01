"use client";

import {
  PERSONA_ORDER,
  PERSONAS,
  type PersonaId,
} from "@/lib/personas";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/** Full-width shells — not the legacy 360 `.dm-phone` frame. */
const HOST_SELECTOR =
  ".dm-app-shell, .dm-app, .dm-signup-shell, .dm-cert-shell, .dm-cert-pane, .dm-app-full";

const DROPDOWN_MQ = "(min-width: 900px)";

type Props = {
  open: boolean;
  current: PersonaId;
  onClose: () => void;
  onSelect: (id: PersonaId) => void;
};

/**
 * DS Home · `.dm-psheet` — "Try another life".
 * Bottom sheet on phone; dropdown near `.dm-pair` on ≥900px.
 */
export function LifeSheet({ open, current, onClose, onSelect }: Props) {
  const titleId = useId();
  const anchorRef = useRef<HTMLSpanElement>(null);
  const panRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const [host, setHost] = useState<Element | null>(null);
  const [mounted, setMounted] = useState(false);
  const [present, setPresent] = useState(false);
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    setMounted(true);
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    const el = anchorRef.current;
    if (!el) return;
    const found = el.closest(HOST_SELECTOR);
    setHost(found);
    triggerRef.current =
      (el.parentElement?.querySelector(
        'button.dm-pair[data-ps], button.dm-pair',
      ) as HTMLElement | null) ??
      (document.querySelector(
        'button.dm-pair[data-ps="1"]',
      ) as HTMLElement | null);
  }, [open]);

  /** Pin dropdown under the pair trigger on laptop. */
  useLayoutEffect(() => {
    const pan = panRef.current;
    if (!pan || !present) return;

    const place = () => {
      if (!window.matchMedia(DROPDOWN_MQ).matches) {
        pan.style.top = "";
        pan.style.right = "";
        pan.style.left = "";
        return;
      }
      const trigger = triggerRef.current;
      const root = (host as HTMLElement | null) ?? document.body;
      if (!trigger) return;
      const tr = trigger.getBoundingClientRect();
      const hr = root.getBoundingClientRect();
      pan.style.top = `${Math.round(tr.bottom - hr.top + 8)}px`;
      pan.style.right = `${Math.round(hr.right - tr.right)}px`;
      pan.style.left = "auto";
    };

    place();
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("resize", place);
      pan.style.top = "";
      pan.style.right = "";
      pan.style.left = "";
    };
  }, [present, visible, host]);

  useEffect(() => {
    if (open) {
      setPresent(true);
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    }
    setVisible(false);
    const t = window.setTimeout(() => setPresent(false), 300);
    return () => window.clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const focus = panRef.current?.querySelector<HTMLElement>(
      '[aria-pressed="true"]',
    );
    focus?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const portalTarget = host ?? (mounted ? document.body : null);

  const sheet =
    present && portalTarget ? (
      <div className={`dm-psheet${visible ? " open" : ""}`}>
        <div className="scr" onClick={onClose} aria-hidden />
        <div
          ref={panRef}
          className="pan"
          role="dialog"
          aria-label="Switch profile"
          aria-labelledby={titleId}
        >
          <span className="grab" aria-hidden />
          <h4 id={titleId}>Try another life</h4>
          <p>Same app, a different person. Everything on Home follows.</p>
          <div className="rows">
            {PERSONA_ORDER.map((id) => {
              const p = PERSONAS[id];
              return (
                <button
                  key={id}
                  type="button"
                  data-k={id}
                  aria-pressed={id === current}
                  onClick={() => {
                    onSelect(id);
                    onClose();
                  }}
                >
                  <span className="dm-pair">
                    {p.avatars.map((a) => (
                      <span
                        key={a.initial}
                        style={{ background: a.background, color: a.color }}
                      >
                        {a.initial}
                      </span>
                    ))}
                  </span>
                  <span>
                    <b>{p.who}</b>
                    <small>{p.tag}</small>
                  </span>
                  <i aria-hidden />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    ) : null;

  return (
    <>
      <span ref={anchorRef} hidden aria-hidden />
      {mounted && sheet && portalTarget
        ? createPortal(sheet, portalTarget)
        : null}
    </>
  );
}
