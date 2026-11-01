"use client";

import { Button } from "@/components/ui/Button";
import { BottomSheet } from "@/components/feedback/BottomSheet";
import { MemoryChip } from "@/components/chat/ChatWidgets";
import { cn } from "@/lib/cn";
import {
  scriptFor,
  type MomentOffer,
  type MomentReveal,
} from "@/lib/lifeMoments";
import {
  markMomentAnswers,
  markMomentAsked,
  type LifeMoment,
} from "@/lib/session";
import { useEffect, useMemo, useState } from "react";

type Phase = "ask" | "reveal" | "done";

type Line =
  | { kind: "say"; id: string; text: string }
  | { kind: "q"; id: string; text: string }
  | { kind: "me"; id: string; text: string }
  | { kind: "note"; id: string; text: string };

type Props = {
  moment: LifeMoment;
  name: string;
  onAttach?: () => void;
  onBookAdvisor?: () => void;
  /**
   * Called when the person moves on to free-form chat.
   * `followUp` is a research question to answer immediately (optional).
   */
  onDone: (starters: string[], followUp?: string) => void;
  className?: string;
};

/**
 * LifeMoments C1–C3: ask before telling.
 * Greeting + bold tap question(s) → one sentence + one big number →
 * optional Pax idea sheet only when asked.
 */
export function LifeMomentAsk({
  moment,
  name,
  onAttach,
  onBookAdvisor,
  onDone,
  className,
}: Props) {
  const script = useMemo(() => scriptFor(moment), [moment]);
  const [phase, setPhase] = useState<Phase>("ask");
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [lines, setLines] = useState<Line[]>([]);
  const [reveal, setReveal] = useState<MomentReveal | null>(null);
  const [offerOpen, setOfferOpen] = useState(false);
  const [offer, setOffer] = useState<MomentOffer | null>(null);
  const [remembered, setRemembered] = useState<string | null>(null);
  const [booted, setBooted] = useState(false);

  const step = script.questions[qIndex];
  const showingChoices =
    phase === "ask" &&
    Boolean(step) &&
    lines.some((l) => l.id === `q-${step!.id}`) &&
    !lines.some((l) => l.id === `a-${step!.id}`);

  useEffect(() => {
    if (booted) return;
    setBooted(true);
    const first = script.questions[0];
    if (!first) {
      setPhase("done");
      return;
    }
    setLines([
      { kind: "say", id: "greet", text: script.greeting(name) },
      { kind: "q", id: `q-${first.id}`, text: first.question },
    ]);
  }, [booted, name, script]);

  function finishAsk(nextAnswers: Record<string, string>) {
    markMomentAnswers(moment, nextAnswers);
    markMomentAsked(moment);
    const nextReveal = script.reveal(nextAnswers);
    setReveal(nextReveal);
    setOffer(nextReveal.offer);
    setPhase("reveal");

    const labels = script.questions
      .map((q) => {
        const opt = q.options.find((o) => o.id === nextAnswers[q.id]);
        return opt ? `${q.question.replace(/\?$/, "")}: ${opt.label}` : null;
      })
      .filter(Boolean)
      .slice(0, 2);
    if (labels[0]) setRemembered(`Saved: ${labels[0]}`);

    window.setTimeout(() => {
      setLines((prev) => [
        ...prev,
        { kind: "say", id: "reveal-say", text: nextReveal.sentence },
      ]);
    }, 400);
  }

  function pick(optionId: string, label: string) {
    if (!step || phase !== "ask") return;
    const nextAnswers = { ...answers, [step.id]: optionId };
    setAnswers(nextAnswers);
    setLines((prev) => [
      ...prev,
      { kind: "me", id: `a-${step.id}`, text: label },
    ]);

    const nextIndex = qIndex + 1;
    window.setTimeout(() => {
      if (nextIndex < script.questions.length) {
        const next = script.questions[nextIndex]!;
        setQIndex(nextIndex);
        setLines((prev) => [
          ...prev,
          { kind: "q", id: `q-${next.id}`, text: next.question },
        ]);
        return;
      }
      finishAsk(nextAnswers);
    }, 480);
  }

  function onNextTap(label: string) {
    if (!reveal) return;
    setLines((prev) => [
      ...prev,
      { kind: "me", id: `next-${Date.now()}`, text: label },
    ]);

    if (label === "What could help?" && offer) {
      window.setTimeout(() => {
        setLines((prev) => [
          ...prev,
          {
            kind: "say",
            id: "offer-intro",
            text: "One idea fits this gap. Only if you want it.",
          },
        ]);
        setOfferOpen(true);
      }, 420);
      return;
    }

    if (label === "How did you get this?") {
      window.setTimeout(() => {
        setLines((prev) => [
          ...prev,
          {
            kind: "say",
            id: "how",
            text: reveal.note,
          },
        ]);
      }, 420);
      return;
    }

    // Hand off to free-form chat with this as the next research question.
    setPhase("done");
    onDone(
      [label, ...script.startersAfter.filter((s) => s !== label)],
      label,
    );
  }

  function continueToChat() {
    setOfferOpen(false);
    setPhase("done");
    onDone(script.startersAfter);
  }

  return (
    <div className={cn("dm-lmq", className)}>
      {lines.map((line) => {
        if (line.kind === "me") {
          return (
            <div key={line.id} className="dm-bubble dm-bubble--me dm-fadein">
              {line.text}
            </div>
          );
        }
        if (line.kind === "q") {
          return (
            <p key={line.id} className="lmq-q dm-fadein">
              {line.text}
            </p>
          );
        }
        if (line.kind === "note") {
          return (
            <p key={line.id} className="lmq-note dm-fadein">
              {line.text}
            </p>
          );
        }
        return (
          <p key={line.id} className="dm-say2 dm-fadein">
            {line.text}
          </p>
        );
      })}

      {showingChoices && step ? (
        <div className="dm-sugg lmq-a dm-fadein">
          {step.options.map((o) => (
            <button key={o.id} type="button" onClick={() => pick(o.id, o.label)}>
              {o.label}
            </button>
          ))}
        </div>
      ) : null}

      {showingChoices && step?.note ? (
        <p className="lmq-note dm-fadein">
          {onAttach ? (
            <button type="button" className="lmq-note__link" onClick={onAttach}>
              {step.note}
            </button>
          ) : (
            step.note
          )}
        </p>
      ) : null}

      {phase === "reveal" && reveal && lines.some((l) => l.id === "reveal-say") ? (
        <>
          <div className="lmq-big dm-fadein">
            <small>{reveal.big.label}</small>
            <b>{reveal.big.value}</b>
            <span>{reveal.big.meaning}</span>
          </div>
          <p className="lmq-note dm-fadein">{reveal.note}</p>
          {remembered ? <MemoryChip text={remembered} /> : null}
          <div className="dm-sugg dm-fadein">
            {reveal.next.map((label) => (
              <button key={label} type="button" onClick={() => onNextTap(label)}>
                {label}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="lmq-skip dm-fadein"
            onClick={continueToChat}
          >
            Ask something else
          </button>
        </>
      ) : null}

      <BottomSheet
        open={offerOpen}
        onClose={() => setOfferOpen(false)}
        title={offer?.title}
      >
        {offer ? (
          <div className="lmq-offer">
            <div className="lmq-offer__brand">
              <span className="lmq-offer__pax">Pax</span>
              <span className="dm-small dm-muted">Partner idea</span>
            </div>
            <p className="lmq-offer__body">{offer.body}</p>
            <ul className="lmq-offer__facts">
              {offer.facts.map((f) => (
                <li key={f.label}>
                  <span>{f.label}</span>
                  <b>{f.value}</b>
                </li>
              ))}
            </ul>
            <Button
              variant="pax"
              block
              onClick={() => {
                setOfferOpen(false);
                onBookAdvisor?.();
                continueToChat();
              }}
            >
              Talk to an advisor
            </Button>
            <Button variant="text" block onClick={continueToChat}>
              Not now
            </Button>
          </div>
        ) : null}
      </BottomSheet>
    </div>
  );
}
