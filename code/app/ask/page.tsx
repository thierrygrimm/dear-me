"use client";

import { Chat } from "@/components/chat/Chat";
import { Logo } from "@/components/brand/Logo";
import { BottomSheet } from "@/components/feedback/BottomSheet";
import { Button } from "@/components/ui/Button";
import { copy } from "@/lib/copy";
import { isSignedIn } from "@/lib/session";
import { ChevronLeft, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AskPage() {
  const router = useRouter();
  const [seed, setSeed] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!isSignedIn()) {
      router.replace("/signup");
      return;
    }
    const q = sessionStorage.getItem("dm-ask-q");
    if (q) {
      sessionStorage.removeItem("dm-ask-q");
      setSeed(q);
    }
    setReady(true);
  }, [router]);

  return (
    <div
      className="dm-app-shell"
      style={{
        padding: "12px 16px 14px",
        gap: 12,
        boxSizing: "border-box",
      }}
    >
      <header className="dm-appbar" style={{ flexShrink: 0 }}>
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
        <button
          type="button"
          aria-label={copy.chat.menu}
          onClick={() => setMenuOpen(true)}
        >
          <MoreHorizontal strokeWidth={1.75} />
        </button>
      </header>

      {ready ? (
        <Chat
          initialQuestion={seed}
          onOpenAnswer={(question) => {
            const q = (question || "").toLowerCase();
            if (
              q.includes("couldn't work") ||
              q.includes("could not work") ||
              q.includes("disab") ||
              q.includes("cover")
            ) {
              router.push("/answer?topic=disability");
              return;
            }
            if (q.includes("60") || q.includes("80") || q.includes("baby")) {
              router.push("/answer?topic=pensum");
              return;
            }
            router.push("/compare");
          }}
          onBook={() => router.push("/me/book")}
          onAttach={() => router.push("/certificate")}
        />
      ) : null}

      <BottomSheet
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        title="Chat"
      >
        <Button
          variant="secondary"
          block
          onClick={() => {
            setMenuOpen(false);
            setSeed(null);
            setReady(false);
            window.setTimeout(() => setReady(true), 0);
          }}
        >
          Clear chat
        </Button>
        <Button
          variant="text"
          block
          onClick={() => {
            setMenuOpen(false);
            router.push("/");
          }}
        >
          Close
        </Button>
      </BottomSheet>
    </div>
  );
}
