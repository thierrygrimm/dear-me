"use client";

import { AskBar } from "@/components/answer/AskBar";
import { Disclaimer } from "@/components/answer/Disclaimer";
import {
  AnswerWidget,
  ChatWidget,
  MemoryChip,
} from "@/components/chat/ChatWidgets";
import { ChatSteps, type StepLog } from "@/components/chat/ChatSteps";
import { LifeMomentAsk } from "@/components/chat/LifeMomentAsk";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import {
  resolveDemoAnswer,
  STARTER_REPLIES,
  type DemoAnswer,
} from "@/lib/chatDemo";
import { cn } from "@/lib/cn";
import { copy } from "@/lib/copy";
import { emphasizeMoney } from "@/lib/emphasizeMoney";
import { primaryMoment, scriptFor } from "@/lib/lifeMoments";
import {
  momentsForPersona,
  readPersonaId,
  type PersonaId,
} from "@/lib/personas";
import {
  markMomentAsked,
  readAskedMoments,
  readMoments,
  readName,
  type LifeMoment,
} from "@/lib/session";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/**
 * Prefer session moments when they already match the active persona’s
 * primary story; otherwise fall back to momentsForPersona so Noah never
 * boots Lena’s child script from a stale dm-moments list.
 */
function resolveStoryMoments(personaId: PersonaId): LifeMoment[] {
  const expected = momentsForPersona(personaId);
  const session = readMoments();
  if (session.length && session[0] === expected[0]) return session;
  if (expected.length) return expected;
  return session;
}

export type ChatMessage = {
  id: string;
  role: "me" | "assistant";
  content: ReactNode;
};

type TurnPhase = "thinking" | "steps" | "streaming" | "done";

type Turn = {
  id: string;
  question: string;
  phase: TurnPhase;
  answer: DemoAnswer;
  visibleText: string;
  liveSteps: StepLog[];
  stepsOpen: boolean;
  stepsSummary: string;
  usedSteps: boolean;
};

type Props = {
  /** Seed a first question (e.g. from Home AskBar) */
  initialQuestion?: string | null;
  /**
   * True when the seed came from a user-typed AskBar (may skip pending C1).
   * Research / topic seeds must leave this false so LifeMomentAsk wins.
   */
  freeQuestion?: boolean;
  onOpenAnswer?: (question?: string) => void;
  /** Navigate to advisor booking (suggestion chips) */
  onBook?: () => void;
  onAttach?: () => void;
  onSend?: (value: string) => void;
  className?: string;
  /**
   * Ask shell layout: render `.dm-thread` + `.dm-ask` as siblings
   * (direct children of `.dm-app.chat`) instead of a phone-frame wrapper.
   */
  shell?: boolean;
  /** Fired when the thread scrolls (used to collapse the safety net). */
  onThreadScroll?: (scrollTop: number) => void;
  /** @deprecated layout-only mode — prefer ChatScreen behaviour */
  messages?: ChatMessage[];
  footer?: ReactNode;
};

function isNavReply(text: string): "compare" | "book" | null {
  const t = text.toLowerCase();
  if (t.includes("see all") || t.startsWith("open")) return "compare";
  if (t.includes("sara") || t.includes("talk to") || t.includes("book")) {
    return "book";
  }
  return null;
}

function startersFor(moment: LifeMoment | null): string[] {
  if (!moment) return STARTER_REPLIES;
  return scriptFor(moment).startersAfter;
}

function ThinkingRow({ label }: { label: string }) {
  return (
    <div className="dm-thinking dm-fadein" aria-live="polite">
      <span className="dm-typing" aria-hidden>
        <i />
        <i />
        <i />
      </span>
      <span className="dm-thinking__step">{label}</span>
    </div>
  );
}

function clearTimers(timers: number[]) {
  timers.forEach((t) => window.clearTimeout(t));
  timers.length = 0;
}

/**
 * Full chat screen behaviour from the design system:
 * LifeMoments C1 ask-before-telling when a moment is pending, else
 * day tag → me bubble → thinking / ChatSteps → streamed answer →
 * one widget → short disclaimer → quick replies → AskBar.
 */
export function Chat({
  initialQuestion,
  freeQuestion = false,
  onOpenAnswer,
  onBook,
  onAttach,
  onSend,
  className,
  shell,
  onThreadScroll,
  messages: legacyMessages,
  footer,
}: Props) {
  const reducedMotion = usePrefersReducedMotion();
  const scrollRef = useRef<HTMLDivElement>(null);
  const timersRef = useRef<number[]>([]);
  const bootRef = useRef(false);
  const busyRef = useRef(false);

  const [turns, setTurns] = useState<Turn[]>([]);
  const [quickReplies, setQuickReplies] = useState<string[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [pendingMoment, setPendingMoment] = useState<LifeMoment | null>(null);
  const [personaId, setPersonaId] = useState<PersonaId>(() =>
    typeof window === "undefined" ? "lena" : readPersonaId(),
  );
  const [personName, setPersonName] = useState("there");
  const [ready, setReady] = useState(false);

  const setBusyBoth = useCallback((value: boolean) => {
    busyRef.current = value;
    setBusy(value);
  }, []);

  const scrollToEnd = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, []);

  useEffect(() => {
    scrollToEnd();
  }, [turns, quickReplies, pendingMoment, scrollToEnd]);

  useEffect(
    () => () => {
      clearTimers(timersRef.current);
    },
    [],
  );

  const runAnswer = useCallback(
    (question: string) => {
      const q = question.trim();
      if (!q || busyRef.current) return;

      clearTimers(timersRef.current);
      setBusyBoth(true);
      setQuickReplies(null);
      onSend?.(q);

      const answer = resolveDemoAnswer(q);
      const turnId = `t-${Date.now()}`;
      const useSteps = answer.totalSeconds >= 2 && answer.steps.length > 0;

      const waitingSteps: StepLog[] = answer.steps.map((s) => ({
        id: s.id,
        label: s.label,
        status: "wait" as const,
        duration: s.duration,
      }));

      setTurns((prev) => [
        ...prev,
        {
          id: turnId,
          question: q,
          phase: useSteps ? "steps" : "thinking",
          answer,
          visibleText: "",
          liveSteps: waitingSteps,
          stepsOpen: true,
          stepsSummary: "Working on it",
          usedSteps: useSteps,
        },
      ]);

      const timers = timersRef.current;
      const push = (fn: () => void, ms: number) => {
        timers.push(window.setTimeout(fn, ms));
      };

      const startStreaming = () => {
        const words = answer.text.split(/\s+/).filter(Boolean);
        const doneSteps = answer.steps.map((s) => ({
          id: s.id,
          label: s.label,
          status: "done" as const,
          duration: s.duration,
        }));
        const summary = `Worked it out in ${answer.totalSeconds} seconds`;

        if (reducedMotion) {
          setTurns((prev) =>
            prev.map((t) =>
              t.id === turnId
                ? {
                    ...t,
                    phase: "done",
                    visibleText: answer.text,
                    stepsOpen: false,
                    stepsSummary: summary,
                    liveSteps: doneSteps,
                  }
                : t,
            ),
          );
          setQuickReplies(answer.quickReplies);
          setBusyBoth(false);
          return;
        }

        setTurns((prev) =>
          prev.map((t) =>
            t.id === turnId
              ? {
                  ...t,
                  phase: "streaming",
                  visibleText: "",
                  stepsOpen: false,
                  stepsSummary: summary,
                  liveSteps: doneSteps,
                }
              : t,
          ),
        );

        let k = 0;
        const tick = () => {
          k += 1;
          const slice = words.slice(0, k).join(" ");
          setTurns((prev) =>
            prev.map((t) =>
              t.id === turnId ? { ...t, visibleText: slice } : t,
            ),
          );
          if (k < words.length) {
            push(tick, 60);
          } else {
            setTurns((prev) =>
              prev.map((t) =>
                t.id === turnId ? { ...t, phase: "done" } : t,
              ),
            );
            setQuickReplies(answer.quickReplies);
            setBusyBoth(false);
          }
        };
        push(tick, 40);
      };

      if (!useSteps) {
        const thinkMs = reducedMotion ? 0 : 900;
        push(startStreaming, thinkMs);
        return;
      }

      let elapsed = 0;
      answer.steps.forEach((step, index) => {
        const startAt = elapsed;
        const runFor = reducedMotion ? 0 : 650;
        push(() => {
          setTurns((prev) =>
            prev.map((t) => {
              if (t.id !== turnId) return t;
              const liveSteps = t.liveSteps.map((s, i) => {
                if (i < index) {
                  return {
                    ...s,
                    status: "done" as const,
                    duration: answer.steps[i]!.duration,
                  };
                }
                if (i === index) return { ...s, status: "run" as const };
                return { ...s, status: "wait" as const };
              });
              return { ...t, liveSteps, stepsOpen: true };
            }),
          );
        }, startAt);

        push(() => {
          setTurns((prev) =>
            prev.map((t) => {
              if (t.id !== turnId) return t;
              const liveSteps = t.liveSteps.map((s, i) =>
                i === index
                  ? {
                      ...s,
                      status: "done" as const,
                      duration: step.duration,
                    }
                  : s,
              );
              return { ...t, liveSteps };
            }),
          );
        }, startAt + runFor);

        elapsed += reducedMotion ? 0 : 700;
      });

      push(startStreaming, elapsed + (reducedMotion ? 0 : 400));
    },
    [onSend, reducedMotion, setBusyBoth],
  );

  /**
   * Boot decision tree:
   * 1. Resolve story moments for the active persona (Noah → firstjob, …).
   * 2. If primary C1 is unasked → LifeMomentAsk, unless freeQuestion seed.
   * 3. Else if seed → run research answer.
   * 4. Else → starter chips for the persona story.
   */
  useEffect(() => {
    if (bootRef.current) return;
    bootRef.current = true;

    const activePersona = readPersonaId();
    setPersonaId(activePersona);
    setPersonName(readName());

    const moments = resolveStoryMoments(activePersona);
    const asked = readAskedMoments();
    const primary = primaryMoment(moments);
    const needsAsk = Boolean(primary && !asked.includes(primary));
    const seed = initialQuestion?.trim() || null;

    // Pending C1 wins over research seeds; free typed AskBar may skip.
    if (needsAsk && primary && !(seed && freeQuestion)) {
      setPendingMoment(primary);
      setQuickReplies(null);
      setReady(true);
      return undefined;
    }

    if (seed) {
      setPendingMoment(null);
      setQuickReplies(null);
      setReady(true);
      const id = window.setTimeout(() => runAnswer(seed), 80);
      return () => window.clearTimeout(id);
    }

    setPendingMoment(null);
    setQuickReplies(startersFor(primary));
    setReady(true);
    return undefined;
  }, [initialQuestion, freeQuestion, runAnswer]);

  // Persona / moments changed (e.g. Try another life while Ask is open).
  useEffect(() => {
    function rebootFromStorage() {
      const next = readPersonaId();
      const moments = resolveStoryMoments(next);
      const primary = primaryMoment(moments);
      const asked = readAskedMoments();
      const needsAsk = Boolean(primary && !asked.includes(primary));

      setPersonaId(next);
      setPersonName(readName());
      clearTimers(timersRef.current);
      setTurns([]);
      setBusyBoth(false);
      bootRef.current = true;

      if (needsAsk && primary) {
        setPendingMoment(primary);
        setQuickReplies(null);
      } else {
        setPendingMoment(null);
        setQuickReplies(startersFor(primary));
      }
      setReady(true);
    }

    window.addEventListener("storage", rebootFromStorage);
    window.addEventListener("dm-persona", rebootFromStorage);
    return () => {
      window.removeEventListener("storage", rebootFromStorage);
      window.removeEventListener("dm-persona", rebootFromStorage);
    };
  }, [setBusyBoth]);

  function finishMomentAsk(starters: string[], followUp?: string) {
    setPendingMoment(null);
    if (followUp) {
      setQuickReplies(null);
      window.setTimeout(() => runAnswer(followUp), 80);
      return;
    }
    setQuickReplies(starters);
  }

  // Legacy layout-only mode for older call sites.
  if (legacyMessages) {
    return (
      <div
        className={cn("dm-chat", className)}
        style={{ flex: 1, minHeight: 0, overflow: "hidden" }}
      >
        <div className="dm-scroll" style={{ flex: 1, minHeight: 0 }}>
          {legacyMessages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "dm-bubble",
                m.role === "me" ? "dm-bubble--me" : "dm-bubble--us",
              )}
            >
              {m.role === "assistant" && typeof m.content === "string"
                ? emphasizeMoney(m.content)
                : m.content}
            </div>
          ))}
          {footer}
        </div>
        <AskBar onSubmit={onSend} onAttach={onAttach} sticky />
      </div>
    );
  }

  const showEmptyHint =
    ready &&
    !pendingMoment &&
    turns.length === 0 &&
    !busy &&
    Boolean(quickReplies?.length);

  const thread = (
    <div
      ref={scrollRef}
      className={shell ? "dm-thread" : "dm-scroll"}
      style={shell ? undefined : { flex: 1, minHeight: 0 }}
      onScroll={
        onThreadScroll
          ? (e) => onThreadScroll(e.currentTarget.scrollTop)
          : undefined
      }
    >
      <span className={shell ? "dm-daylbl" : "dm-daytag"}>Today</span>

      {pendingMoment ? (
        <LifeMomentAsk
          key={`${personaId}-${pendingMoment}`}
          moment={pendingMoment}
          name={personName}
          onAttach={onAttach}
          onBookAdvisor={onBook}
          onDone={finishMomentAsk}
        />
      ) : null}

      {showEmptyHint ? (
        <div className="dm-bubble dm-bubble--us">
          Ask in your own words. I&apos;ll answer first, then we can play with
          the numbers.
        </div>
      ) : null}

      {turns.map((turn) => (
        <TurnBlock
          key={turn.id}
          turn={turn}
          onOpenAnswer={onOpenAnswer}
          onStepsOpenChange={(open) =>
            setTurns((prev) =>
              prev.map((t) =>
                t.id === turn.id ? { ...t, stepsOpen: open } : t,
              ),
            )
          }
        />
      ))}

      {!pendingMoment && quickReplies && quickReplies.length > 0 && !busy ? (
        <div className="dm-sugg dm-fadein">
          {quickReplies.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => {
                const nav = isNavReply(r);
                const lastQ = turns[turns.length - 1]?.question;
                if (nav === "compare") {
                  onOpenAnswer?.(lastQ);
                  return;
                }
                if (nav === "book") {
                  onBook?.();
                  return;
                }
                runAnswer(r);
              }}
            >
              {r}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );

  const ask = (
    <AskBar
      sticky={!shell}
      disabled={busy}
      onAttach={onAttach}
      onSubmit={(value) => {
        if (pendingMoment) {
          markMomentAsked(pendingMoment);
          setPendingMoment(null);
        }
        runAnswer(value);
      }}
    />
  );

  /* Shell mode: siblings of appbar/netw under `.dm-app.chat`. */
  if (shell) {
    return (
      <>
        {thread}
        {ask}
      </>
    );
  }

  return (
    <div
      className={cn("dm-chat", className)}
      style={{
        flex: 1,
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {thread}
      {ask}
    </div>
  );
}

function TurnBlock({
  turn,
  onOpenAnswer,
  onStepsOpenChange,
}: {
  turn: Turn;
  onOpenAnswer?: (question?: string) => void;
  onStepsOpenChange: (open: boolean) => void;
}) {
  const { answer, phase } = turn;
  const showAnswer = phase === "streaming" || phase === "done";
  const showExtras = phase === "done";
  const showThinking = phase === "thinking";
  const showSteps =
    turn.usedSteps &&
    (phase === "steps" || phase === "streaming" || phase === "done");

  return (
    <>
      <div className="dm-bubble dm-bubble--me dm-fadein">{turn.question}</div>

      {showThinking ? (
        <ThinkingRow label={answer.thinkingLabel} />
      ) : null}

      {showSteps && answer.steps.length > 0 ? (
        <ChatSteps
          steps={turn.liveSteps}
          summary={turn.stepsSummary}
          open={turn.stepsOpen}
          onOpenChange={onStepsOpenChange}
        />
      ) : null}

      {showAnswer ? (
        <div className="dm-bubble dm-bubble--us">
          {emphasizeMoney(turn.visibleText)}
          {phase === "streaming" ? <span className="dm-caret" aria-hidden /> : null}
        </div>
      ) : null}

      {showExtras && answer.remembered ? (
        <MemoryChip text={answer.remembered} />
      ) : null}

      {showExtras && answer.widget ? (
        <AnswerWidget
          label={answer.widget.label}
          cue={answer.widget.cue}
          verdict={answer.widget.verdict}
          detail={answer.widget.detail}
          bars={answer.widget.bars}
          onOpen={() => onOpenAnswer?.(turn.question)}
        />
      ) : null}

      {showExtras ? (
        <Disclaimer className="dm-fadein">
          {copy.answer.disclaimerShort}
        </Disclaimer>
      ) : null}
    </>
  );
}

export { ChatWidget, AnswerWidget, MemoryChip };
