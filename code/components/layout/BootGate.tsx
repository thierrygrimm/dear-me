"use client";

import { Splash } from "@/components/brand/Loading";
import { applyAppearance } from "@/lib/settingsPrefs";
import { isOnboarded, isSignedIn } from "@/lib/session";
import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

/**
 * Cold start: short splash overlay, then the app — or redirect to /signup.
 * Children always mount so Next instant-navigation can validate segments.
 */
export function BootGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    applyAppearance();
    if (!isSignedIn() || !isOnboarded()) {
      router.replace("/signup");
      return;
    }

    const booted = sessionStorage.getItem("dm-booted") === "1";
    if (booted) {
      setShowSplash(false);
      setReady(true);
      return;
    }

    const t = window.setTimeout(() => {
      sessionStorage.setItem("dm-booted", "1");
      setShowSplash(false);
      setReady(true);
    }, 1200);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div
        style={{ visibility: ready ? "visible" : "hidden" }}
        aria-hidden={!ready}
      >
        {children}
      </div>
      {showSplash || !ready ? (
        <div
          className="dm-stage dm-app-shell--bleed"
          style={{ position: "fixed", inset: 0, zIndex: 80 }}
        >
          <Splash />
        </div>
      ) : null}
    </>
  );
}
