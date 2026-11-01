import { Navigation } from "@/components/layout/Navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  flush?: boolean;
  hideNav?: boolean;
  className?: string;
  /** Extra shell modifiers: chat | pgapp | set | onb | signapp | flowapp */
  variant?: "chat" | "pgapp" | "set" | "onb" | "signapp" | "flowapp" | string;
};

export function AppShell({
  children,
  flush,
  hideNav,
  className,
  variant,
}: Props) {
  /**
   * Chat / sign-up / onboarding / start-flow place panes as direct shell
   * children (no main), matching design-system selectors.
   */
  const bare =
    variant === "chat" ||
    variant === "signapp" ||
    variant === "onb" ||
    variant === "flowapp";

  return (
    <div
      className={cn(
        "dm-app-shell",
        "dm-app",
        variant,
        className,
      )}
    >
      {!hideNav ? <Sidebar /> : null}
      {bare ? (
        children
      ) : (
        <main className={cn("dm-app-main", flush && "dm-app-main--flush")}>
          {children}
        </main>
      )}
      {!hideNav ? <Navigation /> : null}
    </div>
  );
}
