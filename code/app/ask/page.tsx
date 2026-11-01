"use client";

import { Chat } from "@/components/chat/Chat";
import {
  SafetyNetCard,
  SafetyNetPill,
} from "@/components/chat/SafetyNetCard";
import { BottomSheet } from "@/components/feedback/BottomSheet";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { copy } from "@/lib/copy";
import { isSignedIn } from "@/lib/session";
import { Clock, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const EARLIER = [
  "Can I go to 60 %?",
  "Who should reduce?",
  "Is Marco covered?",
];

export default function AskPage() {
  const router = useRouter();
  const [seed, setSeed] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [netMin, setNetMin] = useState(false);

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

  function closeChat() {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  }

  return (
    <AppShell variant="chat" hideNav={false}>
      <header className="dm-appbar" style={{ margin: "-4px -8px 0" }}>
        <button type="button" aria-label={copy.chat.close} onClick={closeChat}>
          <X strokeWidth={1.75} />
        </button>
        <SafetyNetPill show={netMin} onClick={() => setNetMin(false)} />
        <button
          type="button"
          aria-label={copy.chat.history}
          onClick={() => setHistoryOpen(true)}
        >
          <Clock strokeWidth={1.75} />
        </button>
      </header>

      <SafetyNetCard
        minimized={netMin}
        onActivate={() => setNetMin(false)}
      />

      {ready ? (
        <Chat
          shell
          initialQuestion={seed}
          onThreadScroll={(top) => setNetMin((was) => (top > 48 ? true : top < 8 ? false : was))}
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
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        title={copy.chat.history}
      >
        {EARLIER.map((q) => (
          <Button
            key={q}
            variant="secondary"
            block
            onClick={() => {
              setHistoryOpen(false);
              setSeed(q);
              setReady(false);
              window.setTimeout(() => setReady(true), 0);
            }}
          >
            {q}
          </Button>
        ))}
        <Button
          variant="text"
          block
          onClick={() => {
            setHistoryOpen(false);
            setSeed(null);
            setReady(false);
            window.setTimeout(() => setReady(true), 0);
          }}
        >
          Clear chat
        </Button>
        <Button variant="text" block onClick={closeChat}>
          {copy.chat.close}
        </Button>
      </BottomSheet>
    </AppShell>
  );
}
