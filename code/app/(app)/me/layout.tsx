"use client";

import { SettingsYou } from "@/components/home/Settings";
import { cn } from "@/lib/cn";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Me hub: phone push-nav (list XOR detail); from 900px Mac Settings dual-pane
 * (You list in .pane-list, open page in .pane-detail).
 */
export default function MeLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHub = pathname === "/me";

  return (
    <div className={cn("me-panes", isHub ? "is-hub" : "is-sub")}>
      <div className="pane-list">
        <SettingsYou />
      </div>
      <div className="pane-detail">{children}</div>
    </div>
  );
}
