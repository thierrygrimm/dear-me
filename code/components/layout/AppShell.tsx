import { Navigation } from "@/components/layout/Navigation";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  flush?: boolean;
  hideNav?: boolean;
  className?: string;
};

export function AppShell({ children, flush, hideNav, className }: Props) {
  return (
    <div className={cn("dm-app-shell", className)}>
      <main className={cn("dm-app-main", flush && "dm-app-main--flush")}>
        {children}
      </main>
      {!hideNav ? <Navigation /> : null}
    </div>
  );
}
