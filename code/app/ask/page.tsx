"use client";

import { Chat } from "@/components/chat/Chat";
import { Logo } from "@/components/brand/Logo";
import { copy } from "@/lib/copy";
import { ChevronLeft, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AskPage() {
  const router = useRouter();
  const [seed, setSeed] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const q = sessionStorage.getItem("dm-ask-q");
    if (q) {
      sessionStorage.removeItem("dm-ask-q");
      setSeed(q);
    }
    setReady(true);
  }, []);

  return (
    <div
      className="dm-app-shell"
      style={{
        minHeight: "100dvh",
        padding: "12px 16px 14px",
        gap: 12,
        boxSizing: "border-box",
      }}
    >
      <header className="dm-appbar">
        <button
          type="button"
          aria-label={copy.chat.back}
          onClick={() => {
            if (window.history.length > 1) router.back();
            else router.push("/");
          }}
        >
          <ChevronLeft strokeWidth={1.75} />
        </button>
        <Logo />
        <button type="button" aria-label={copy.chat.menu}>
          <MoreHorizontal strokeWidth={1.75} />
        </button>
      </header>

      {ready ? (
        <Chat
          initialQuestion={seed}
          onOpenAnswer={() => router.push("/answer")}
        />
      ) : null}
    </div>
  );
}
