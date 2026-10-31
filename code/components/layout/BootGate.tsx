"use client";

import { Splash } from "@/components/brand/Loading";
import { useEffect, useState, type ReactNode } from "react";

/**
 * Cold start only: short splash, then the app.
 * Brand loader, signing-in, calculating and skeletons stay contextual
 * (sign-in, certificate read, screen fetch) — not chained here.
 */
export function BootGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem("dm-booted") === "1";
  });

  useEffect(() => {
    if (ready) return;
    const t = window.setTimeout(() => {
      sessionStorage.setItem("dm-booted", "1");
      setReady(true);
    }, 1200);
    return () => window.clearTimeout(t);
  }, [ready]);

  if (!ready) {
    return (
      <div className="dm-app-shell" style={{ padding: 0 }}>
        <Splash />
      </div>
    );
  }

  return <>{children}</>;
}
