"use client";

import { AppShell } from "@/components/layout/AppShell";
import { BootGate } from "@/components/layout/BootGate";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

function shellVariant(pathname: string): string | undefined {
  if (pathname === "/" || pathname === "") return undefined;
  if (pathname === "/me" || pathname.startsWith("/me/")) return "set";
  return "pgapp";
}

function shellFlush(pathname: string): boolean {
  return pathname === "/" || pathname === "";
}

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <BootGate>
      <AppShell flush={shellFlush(pathname)} variant={shellVariant(pathname)}>
        {children}
      </AppShell>
    </BootGate>
  );
}
