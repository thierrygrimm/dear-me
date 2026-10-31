"use client";

import { copy } from "@/lib/copy";
import { cn } from "@/lib/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ClipboardList,
  Home,
  Mic,
  User,
} from "lucide-react";

const tabs = [
  { href: "/", id: "home", label: copy.tabs.home, Icon: Home },
  { href: "/plan", id: "plan", label: copy.tabs.plan, Icon: ClipboardList },
  { href: "/ask", id: "ask", label: copy.tabs.ask, Icon: Mic, ask: true },
  { href: "/learn", id: "learn", label: copy.tabs.learn, Icon: BookOpen },
  { href: "/me", id: "me", label: copy.tabs.me, Icon: User },
] as const;

export function Navigation({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={cn("dm-tabbar dm-app-tabbar", className)} aria-label="Main">
      {tabs.map(({ href, id, label, Icon, ...rest }) => {
        const ask = "ask" in rest && rest.ask;
        const selected =
          href === "/"
            ? pathname === "/"
            : pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={id}
            href={href}
            role="tab"
            className={cn("dm-tab", ask && "dm-tab--ask")}
            aria-selected={selected}
            aria-label={label}
          >
            {ask ? (
              <span className="b">
                <Icon strokeWidth={selected ? 2.2 : 1.75} aria-hidden />
              </span>
            ) : (
              <Icon strokeWidth={selected ? 2.2 : 1.75} aria-hidden />
            )}
            {!ask ? (
              <span>{label}</span>
            ) : (
              <span
                style={{
                  position: "absolute",
                  width: 1,
                  height: 1,
                  padding: 0,
                  margin: -1,
                  overflow: "hidden",
                  clip: "rect(0,0,0,0)",
                  whiteSpace: "nowrap",
                  border: 0,
                }}
              >
                {label}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
