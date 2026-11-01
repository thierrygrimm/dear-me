"use client";

import { Button } from "@/components/ui/Button";
import { BottomSheet } from "@/components/feedback/BottomSheet";
import { MemoryChip } from "@/components/chat/ChatWidgets";
import { cn } from "@/lib/cn";
import { copy } from "@/lib/copy";
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
import { useEffect, useId, useMemo, useState } from "react";

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

/** Cap facts at two; fill whyShown from the gap if the script omitted it. */
function prepareOffer(
  offer: MomentOffer,
  reveal: MomentReveal,
): MomentOffer {
  return {
    ...offer,
    facts: offer.facts.slice(0, 2),
    whyShown:
      offer.whyShown ??
      `Shown because ${reveal.big.label}: ${reveal.big.value} ${reveal.big.meaning}.`,
  };
}

/**
 * LifeMoments C1–C3: ask before telling.
 * Greeting + bold tap question(s) → one sentence + one big number →
 * optional Pax idea sheet only when asked (one idea; second on request).
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
  const [primaryOffer, setPrimaryOffer] = useState<MomentOffer | null>(null);
  const [secondaryOffer, setSecondaryOffer] = useState<MomentOffer | null>(
    null,
  );
  /** Which Pax idea the sheet is showing — never both. */
  const [sheetOffer, setSheetOffer] = useState<MomentOffer | null>(null);
  const [showedSecondary, setShowedSecondary] = useState(false);
  const [whyOpen, setWhyOpen] = useState(false);
  const [choseNext, setChoseNext] = useState(false);
  const [remembered, setRemembered] = useState<string | null>(null);
  const [booted, setBooted] = useState(false);
  const offerTitleId = useId();

  const step = script.questions[qIndex];
  const showingChoices =
    phase === "ask" &&
    Boolean(step) &&
    lines.some((l) => l.id === `q-${step!.id}`) &&
    !lines.some((l) => l.id === `a-${step!.id}`);

  const canShowAnother =
    Boolean(secondaryOffer) && !showedSecondary && sheetOffer === primaryOffer;

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
    const primary = prepareOffer(nextReveal.offer, nextReveal);
    const secondary = nextReveal.offerSecondary
      ? prepareOffer(nextReveal.offerSecondary, nextReveal)
      : null;
    setReveal(nextReveal);
    setPrimaryOffer(primary);
    setSecondaryOffer(secondary);
    setSheetOffer(primary);
    setShowedSecondary(false);
    setWhyOpen(false);
    setChoseNext(false);
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

  function openPrimarySheet() {
    if (!primaryOffer) return;
    setSheetOffer(primaryOffer);
    setShowedSecondary(false);
    setWhyOpen(false);
    setOfferOpen(true);
  }

  function onNextTap(label: string) {
    if (!reveal) return;
    setChoseNext(true);
    setLines((prev) => [
      ...prev,
      { kind: "me", id: `next-${Date.now()}`, text: label },
    ]);

    if (label === "What could help?" && primaryOffer) {
      window.setTimeout(() => {
        setLines((prev) => [
          ...prev,
          {
            kind: "say",
            id: "offer-intro",
            text: "One idea fits this gap. Only if you want it.",
          },
        ]);
        openPrimarySheet();
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
        setChoseNext(false);
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
    setWhyOpen(false);
    setPhase("done");
    onDone(script.startersAfter);
  }

  function onAdvisor() {
    setOfferOpen(false);
    setWhyOpen(false);
    onBookAdvisor?.();
    setPhase("done");
    onDone(script.startersAfter);
  }

  function onShowAnother() {
    if (!secondaryOffer || showedSecondary) return;
    setWhyOpen(false);
    setSheetOffer(secondaryOffer);
    setShowedSecondary(true);
  }

  const offer = sheetOffer;

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
          {/* C2: one sentence + one big number. No product here. */}
          <div className="lmq-big dm-fadein">
            <small>{reveal.big.label}</small>
            <b>{reveal.big.value}</b>
            <span>{reveal.big.meaning}</span>
          </div>
          <p className="lmq-note dm-fadein">{reveal.note}</p>
          {remembered ? <MemoryChip text={remembered} /> : null}
          {!choseNext ? (
            <div className="dm-sugg dm-fadein">
              {reveal.next.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => onNextTap(label)}
                >
                  {label}
                </button>
              ))}
            </div>
          ) : null}
          {!choseNext ? (
            <button
              type="button"
              className="lmq-skip dm-fadein"
              onClick={continueToChat}
            >
              Ask something else
            </button>
          ) : null}
        </>
      ) : null}

      <BottomSheet
        open={offerOpen}
        labelledBy={offer ? offerTitleId : undefined}
        onClose={() => {
          setOfferOpen(false);
          setWhyOpen(false);
          // Scrim dismiss keeps them on C2 so they can ask again.
          if (phase === "reveal") setChoseNext(false);
        }}
      >
        {offer ? (
          <div className="lmq-offer">
            <div className="lmq-offer__brand">
              <span className="lmq-offer__pax" aria-label="Pax">
                Pax
              </span>
              <span className="dm-small dm-muted">
                {copy.offer.recommendationsFromPax}
              </span>
            </div>
            <h4 id={offerTitleId} className="lmq-offer__title">
              {offer.title}
            </h4>
            <p className="lmq-offer__body">{offer.body}</p>
            <ul className="lmq-offer__facts">
              {offer.facts.map((f) => (
                <li key={f.label}>
                  <span>{f.label}</span>
                  <b>{f.value}</b>
                </li>
              ))}
            </ul>
            {offer.whyShown ? (
              <div className={cn("lmq-offer__why", whyOpen && "is-open")}>
                <button
                  type="button"
                  className="lmq-offer__why-btn"
                  aria-expanded={whyOpen}
                  onClick={() => setWhyOpen((v) => !v)}
                >
                  Why am I seeing this?
                </button>
                {whyOpen ? (
                  <p className="lmq-offer__why-body">{offer.whyShown}</p>
                ) : null}
              </div>
            ) : null}
            <Button variant="pax" block onClick={onAdvisor}>
              Talk to an advisor
            </Button>
            <Button variant="text" block onClick={continueToChat}>
              Not now
            </Button>
            {canShowAnother ? (
              <button
                type="button"
                className="lmq-offer__another"
                onClick={onShowAnother}
              >
                Show another idea
              </button>
            ) : null}
          </div>
        ) : null}
      </BottomSheet>
    </div>
  );
}
