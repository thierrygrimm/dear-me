"use client";

import { useEffect, useRef, type RefObject } from "react";

const TARGET =
  "button, a, .dm-tile, .dm-way, .dm-slot, .dm-chip, .dm-li, .dm-tab, .dm-tcard, .dm-tsmall, .onhill, .dm-lm";

/**
 * Demo helper from the Flows design system: the next tap target
 * gets `.dm-pulse` (lime halo) so jurors know where to tap.
 */
export function useDemoPulse(
  hints: string[],
  deps: unknown[] = [],
): RefObject<HTMLDivElement | null> {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const clear = () => {
      root
        .querySelectorAll(".dm-pulse")
        .forEach((el) => el.classList.remove("dm-pulse"));
    };

    clear();

    for (const txt of hints) {
      if (!txt) continue;
      const match = Array.from(root.querySelectorAll<HTMLElement>(TARGET)).find(
        (el) =>
          (el.textContent || "").includes(txt) &&
          !el.closest(".dm-bs") &&
          !(el as HTMLButtonElement).disabled,
      );
      if (match) match.classList.add("dm-pulse");
    }

    return clear;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hints.join("\0"), ...deps]);

  return rootRef;
}
