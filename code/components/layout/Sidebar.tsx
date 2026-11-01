"use client";

import { Mark } from "@/components/brand/Logo";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/cn";
import { readName } from "@/lib/session";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ClipboardList,
  Home,
  Mic,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";

const nav = [
  { href: "/", id: "home", label: copy.tabs.home, Icon: Home },
  { href: "/ask", id: "ask", label: copy.tabs.ask, Icon: Mic, ask: true },
  { href: "/plan", id: "plan", label: copy.tabs.plan, Icon: ClipboardList },
  { href: "/learn", id: "learn", label: copy.tabs.learn, Icon: BookOpen },
  { href: "/me", id: "me", label: copy.tabs.me, Icon: User },
] as const;

const EARLIER = [
  "Can I go to 60 %?",
  "Who should reduce?",
  "Is Marco covered?",
];

type Props = {
  className?: string;
};

export function Sidebar({ className }: Props) {
  const pathname = usePathname();
  const [name, setName] = useState("Lena");

  useEffect(() => {
    const n = readName();
    if (n && n !== "there") setName(n);
  }, []);

  const initial = name.slice(0, 1).toUpperCase();

  return (
    <aside className={cn("dm-side", className)} aria-label="Sidebar">
      <Link href="/" className="lk" aria-label={copy.brand}>
        <Mark />
        <span>{copy.brand}</span>
      </Link>

      <nav aria-label="Main">
        {nav.map(({ href, id, label, Icon, ...rest }) => {
          const ask = "ask" in rest && rest.ask;
          const selected =
            href === "/"
              ? pathname === "/"
              : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={id}
              href={href}
              className={cn(selected && "on", ask && "ak")}
              aria-current={selected ? "page" : undefined}
            >
              <Icon strokeWidth={selected ? 2.2 : 1.75} aria-hidden />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="rec">
        <small>Earlier chats</small>
        {EARLIER.map((q) => (
          <Link
            key={q}
            href="/ask"
            onClick={() => {
              try {
                sessionStorage.setItem("dm-ask-q", q);
                sessionStorage.setItem("dm-ask-free", "1");
              } catch {
                /* ignore */
              }
            }}
          >
            {q}
          </Link>
        ))}
      </div>

      <div className="who">
        <span className="dm-pair" aria-hidden>
          <span style={{ background: "var(--neonweste)" }}>{initial}</span>
          <span
            style={{
              background: "var(--rosa-brille)",
              color: "var(--pflaumenkuchen)",
            }}
          >
            M
          </span>
        </span>
        <span>
          <b>
            {name} and Marco
          </b>
          <small>Planning together</small>
        </span>
      </div>
    </aside>
  );
}
