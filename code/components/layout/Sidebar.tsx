"use client";

import { Mark } from "@/components/brand/Logo";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/cn";
import { getPersona, readPersonaId, type Persona } from "@/lib/personas";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ClipboardList,
  Home,
  Mic,
  User,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

/** Match phone tab order: Home → Plan → Ask → Learn → Me. */
const nav: {
  href: string;
  id: keyof typeof copy.tabs;
  Icon: LucideIcon;
  ask?: boolean;
}[] = [
  { href: "/", id: "home", Icon: Home },
  { href: "/plan", id: "plan", Icon: ClipboardList },
  { href: "/ask", id: "ask", Icon: Mic, ask: true },
  { href: "/learn", id: "learn", Icon: BookOpen },
  { href: "/me", id: "me", Icon: User },
];

type Props = {
  className?: string;
};

export function Sidebar({ className }: Props) {
  const pathname = usePathname();
  const [persona, setPersona] = useState<Persona>(() => getPersona("lena"));

  useEffect(() => {
    function refresh() {
      setPersona(getPersona(readPersonaId()));
    }
    refresh();
    window.addEventListener("dm-persona", refresh);
    return () => window.removeEventListener("dm-persona", refresh);
  }, [pathname]);

  return (
    <aside className={cn("dm-side", className)} aria-label="Sidebar">
      <Link href="/" className="lk" aria-label={copy.brand}>
        <Mark />
        <span>{copy.brand}</span>
      </Link>

      <nav aria-label="Main">
        {nav.map(({ href, id, Icon, ask }) => {
          const label = copy.tabs[id];
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
        <small>{copy.chat.history}</small>
        {persona.earlierChats.map((q) => (
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
          {persona.avatars.map((a) => (
            <span
              key={a.initial}
              style={{ background: a.background, color: a.color }}
            >
              {a.initial}
            </span>
          ))}
        </span>
        <span>
          <b>{persona.name}</b>
          <small>{persona.side}</small>
        </span>
      </div>
    </aside>
  );
}
