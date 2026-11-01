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
import { primaryMoment } from "@/lib/lifeMoments";
import {
  momentsForPersona,
  readPersonaId,
  type PersonaId,
} from "@/lib/personas";
import {
  isSignedIn,
  readAskedMoments,
  readMoments,
  type LifeMoment,
} from "@/lib/session";
import { Clock, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const EARLIER = [
  "Can I go to 60 %?",
  "Who should reduce?",
  "Is Marco covered?",
];

function storyMoments(personaId: PersonaId): LifeMoment[] {
  const expected = momentsForPersona(personaId);
  const session = readMoments();
  if (session.length && session[0] === expected[0]) return session;
  if (expected.length) return expected;
  return session;
}

function askBootKey(personaId: PersonaId, primary: LifeMoment | null): string {
  return `${personaId}-${primary ?? "none"}`;
}

export default function AskPage() {
  const router = useRouter();
  const [seed, setSeed] = useState<string | null>(null);
  const [freeQuestion, setFreeQuestion] = useState(false);
  const [ready, setReady] = useState(false);
  const [chatKey, setChatKey] = useState("boot");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [netMin, setNetMin] = useState(false);

  useEffect(() => {
    if (!isSignedIn()) {
      router.replace("/signup");
      return;
    }

    const personaId = readPersonaId();
    const moments = storyMoments(personaId);
    const asked = readAskedMoments();
    const primary = primaryMoment(moments);
    const needsAsk = Boolean(primary && !asked.includes(primary));

    const q = sessionStorage.getItem("dm-ask-q");
    const free = sessionStorage.getItem("dm-ask-free") === "1";
    if (q) sessionStorage.removeItem("dm-ask-q");
    sessionStorage.removeItem("dm-ask-free");

    // Pending C1 wins over research seeds; free typed AskBar may keep seed.
    if (q && (!needsAsk || free)) {
      setSeed(q);
      setFreeQuestion(free);
    } else {
      setSeed(null);
      setFreeQuestion(false);
    }

    setChatKey(askBootKey(personaId, primary));
    setReady(true);
  }, [router]);

  function remountChat(nextSeed: string | null, free = false) {
    const personaId = readPersonaId();
    const primary = primaryMoment(storyMoments(personaId));
    setSeed(nextSeed);
    setFreeQuestion(free);
    setChatKey(`${askBootKey(personaId, primary)}-${Date.now()}`);
    setReady(false);
    window.setTimeout(() => setReady(true), 0);
  }

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
          key={chatKey}
          shell
          initialQuestion={seed}
          freeQuestion={freeQuestion}
          onThreadScroll={(top) =>
            setNetMin((was) => (top > 48 ? true : top < 8 ? false : was))
          }
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
              remountChat(q, true);
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
            remountChat(null);
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
