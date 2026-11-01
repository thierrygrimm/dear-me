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
  getPersona,
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
import { useEffect, useMemo, useState } from "react";

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

function answerHrefFor(question: string, personaId: PersonaId): string {
  const q = (question || "").toLowerCase();
  const primary = primaryMoment(momentsForPersona(personaId));

  if (
    q.includes("couldn't work") ||
    q.includes("could not work") ||
    q.includes("disab") ||
    q.includes("cover") ||
    q.includes("can't work") ||
    q.includes("sick")
  ) {
    return "/answer?topic=disability";
  }
  if (
    q.includes("60") ||
    q.includes("80") ||
    q.includes("baby") ||
    q.includes("reduce") ||
    primary === "child" ||
    primary === "less"
  ) {
    if (
      q.includes("60") ||
      q.includes("80") ||
      q.includes("baby") ||
      q.includes("reduce") ||
      q.includes("work less")
    ) {
      return "/answer?topic=pensum";
    }
  }
  if (
    q.includes("lump") ||
    q.includes("380") ||
    q.includes("retir") ||
    primary === "retire"
  ) {
    return "/answer?topic=retire";
  }
  if (primary === "firstjob" || primary === "selfemployed") {
    return "/answer?topic=disability";
  }
  return "/compare";
}

export default function AskPage() {
  const router = useRouter();
  const [seed, setSeed] = useState<string | null>(null);
  const [freeQuestion, setFreeQuestion] = useState(false);
  const [ready, setReady] = useState(false);
  const [chatKey, setChatKey] = useState("boot");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyQuery, setHistoryQuery] = useState("");
  const [netMin, setNetMin] = useState(false);
  const [personaId, setPersonaId] = useState<PersonaId>("lena");

  const earlier = useMemo(
    () => getPersona(personaId).earlierChats,
    [personaId],
  );
  const filteredEarlier = useMemo(() => {
    const q = historyQuery.trim().toLowerCase();
    if (!q) return earlier;
    return earlier.filter((item) => item.toLowerCase().includes(q));
  }, [earlier, historyQuery]);

  useEffect(() => {
    if (!isSignedIn()) {
      router.replace("/signup");
      return;
    }

    const id = readPersonaId();
    setPersonaId(id);
    const moments = storyMoments(id);
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

    setChatKey(askBootKey(id, primary));
    setReady(true);
  }, [router]);

  function remountChat(nextSeed: string | null, free = false) {
    const id = readPersonaId();
    const primary = primaryMoment(storyMoments(id));
    setSeed(nextSeed);
    setFreeQuestion(free);
    setChatKey(`${askBootKey(id, primary)}-${Date.now()}`);
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
    <AppShell variant="chat" hideNav>
      <header className="dm-appbar" style={{ margin: "-4px -8px 0" }}>
        <button type="button" aria-label={copy.chat.close} onClick={closeChat}>
          <X strokeWidth={1.75} />
        </button>
        <SafetyNetPill show={netMin} onClick={() => setNetMin(false)} />
        <button
          type="button"
          aria-label={copy.chat.history}
          onClick={() => {
            setHistoryQuery("");
            setHistoryOpen(true);
          }}
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
            router.push(answerHrefFor(question ?? "", personaId));
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
        <label className="dm-fsearch" style={{ marginTop: 0, marginBottom: 12 }}>
          <svg viewBox="0 0 24 24" aria-hidden>
            <circle cx="11" cy="11" r="6.5" />
            <path d="M16 16l4 4" />
          </svg>
          <input
            type="search"
            placeholder="Find an earlier chat"
            value={historyQuery}
            onChange={(e) => setHistoryQuery(e.target.value)}
            aria-label="Find an earlier chat"
          />
        </label>
        {filteredEarlier.map((q) => (
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
        {filteredEarlier.length === 0 ? (
          <p className="dm-small dm-muted" style={{ margin: "8px 0" }}>
            No earlier chats match.
          </p>
        ) : null}
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
