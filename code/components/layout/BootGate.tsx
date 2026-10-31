"use client";

import { BrandLoader, HomeSkeleton, Splash } from "@/components/brand/Loading";
import { useEffect, useState, type ReactNode } from "react";

type Phase = "splash" | "brand" | "skeleton" | "ready";

const SPLASH_MS = 1200;
const BRAND_MS = 1600;
const SKELETON_MS = 900;

function initialPhase(): Phase {
  if (typeof window === "undefined") return "splash";
  return sessionStorage.getItem("dm-booted") === "1" ? "skeleton" : "splash";
}

/**
 * Cold-start sequence: Splash (C) → Brand loader (A) → Home skeleton (E) → app.
 * Skips splash/brand on return visits in the same tab session.
 */
export function BootGate({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>(initialPhase);

  useEffect(() => {
    if (phase === "ready") return;

    if (phase === "skeleton") {
      const t = window.setTimeout(() => setPhase("ready"), SKELETON_MS);
      return () => window.clearTimeout(t);
    }

    if (phase === "splash") {
      const t = window.setTimeout(() => setPhase("brand"), SPLASH_MS);
      return () => window.clearTimeout(t);
    }

    if (phase === "brand") {
      const t = window.setTimeout(() => {
        sessionStorage.setItem("dm-booted", "1");
        setPhase("skeleton");
      }, BRAND_MS);
      return () => window.clearTimeout(t);
    }
  }, [phase]);

  if (phase === "splash") {
    return (
      <div className="dm-app-shell" style={{ padding: 0 }}>
        <Splash />
      </div>
    );
  }

  if (phase === "brand") {
    return (
      <div className="dm-app-shell" style={{ padding: 0 }}>
        <BrandLoader />
      </div>
    );
  }

  if (phase === "skeleton") {
    return (
      <div className="dm-app-shell">
        <main className="dm-app-main">
          <HomeSkeleton />
        </main>
      </div>
    );
  }

  return <>{children}</>;
}
