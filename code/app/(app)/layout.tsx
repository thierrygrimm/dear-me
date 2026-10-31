"use client";

import { AppShell } from "@/components/layout/AppShell";
import { BootGate } from "@/components/layout/BootGate";
import type { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <BootGate>
      <AppShell>{children}</AppShell>
    </BootGate>
  );
}
