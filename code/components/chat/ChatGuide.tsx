"use client";

import { Button } from "@/components/ui/Button";
import { ChatWidget } from "@/components/chat/ChatWidgets";
import { cn } from "@/lib/cn";
import { useEffect, useState } from "react";

export type GuideStep = {
  id: string;
  question: string;
  options: { id: string; label: string }[];
};

type Props = {
  title?: string;
  intro?: string;
  steps: GuideStep[];
  resultTitle?: string;
  resultBody?: string;
  resultActionLabel?: string;
  onComplete?: (answers: Record<string, string>) => void;
  onResultAction?: () => void;
  className?: string;
};

type Line =
  | { kind: "us"; id: string; text: string }
  | { kind: "me"; id: string; text: string };

/**
 * Guided flow inside chat: one question at a time, tap answers that feel
 * like user bubbles, ends in a result widget.
 */
export function ChatGuide({
  title = "Guided plan",
  intro,
  steps,
  resultTitle = "Your plan",
  resultBody = "Based on what you told me.",
  resultActionLabel = "Open my plan",
  onComplete,
  onResultAction,
  className,
}: Props) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [lines, setLines] = useState<Line[]>([]);
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (started) return;
    setStarted(true);
    if (intro) {
      setLines([{ kind: "us", id: "intro", text: intro }]);
      const t = window.setTimeout(() => {
        if (!steps[0]) return;
        setLines((prev) => [
          ...prev,
          { kind: "us", id: `q-${steps[0]!.id}`, text: steps[0]!.question },
        ]);
      }, 700);
      return () => window.clearTimeout(t);
    }
    if (steps[0]) {
      setLines([
        { kind: "us", id: `q-${steps[0].id}`, text: steps[0].question },
      ]);
    }
    return undefined;
  }, [intro, started, steps]);

  const step = steps[index];
  const showingChoices =
    !done &&
    Boolean(step) &&
    lines.some((l) => l.id === `q-${step!.id}`) &&
    !lines.some((l) => l.id === `a-${step!.id}`);

  const stepLabel = done
    ? `${title} · done`
    : `${title} · step ${Math.min(index + 1, steps.length)} of ${steps.length}`;

  function pick(optionId: string, label: string) {
    if (!step || done) return;
    const nextAnswers = { ...answers, [step.id]: optionId };
    setAnswers(nextAnswers);
    setLines((prev) => [
      ...prev,
      { kind: "me", id: `a-${step.id}`, text: label },
    ]);

    const nextIndex = index + 1;
    window.setTimeout(() => {
      if (nextIndex < steps.length) {
        const next = steps[nextIndex]!;
        setIndex(nextIndex);
        setLines((prev) => [
          ...prev,
          { kind: "us", id: `q-${next.id}`, text: next.question },
        ]);
        return;
      }
      setDone(true);
      setLines((prev) => [
        ...prev,
        {
          kind: "us",
          id: "thanks",
          text: "Thank you. Here is your plan, based on what you told me.",
        },
      ]);
      onComplete?.(nextAnswers);
    }, 500);
  }

  function reset() {
    setIndex(0);
    setAnswers({});
    setDone(false);
    setStarted(false);
    setLines([]);
  }

  return (
    <div className={cn("dm-chat", className)}>
      <span className="dm-guide-pill">{stepLabel}</span>

      {lines.map((line) => (
        <div
          key={line.id}
          className={cn(
            "dm-bubble dm-fadein",
            line.kind === "me" ? "dm-bubble--me" : "dm-bubble--us",
          )}
        >
          {line.text}
        </div>
      ))}

      {showingChoices && step ? (
        <div className="dm-choices dm-fadein">
          {step.options.map((o) => (
            <button key={o.id} type="button" onClick={() => pick(o.id, o.label)}>
              {o.label}
            </button>
          ))}
        </div>
      ) : null}

      {done ? (
        <ChatWidget className="dm-fadein">
          <div className="dm-widget__head">
            <span className="dm-label">{resultTitle}</span>
            <span className="dm-small dm-muted">ready</span>
          </div>
          <span className="dm-small">{resultBody}</span>
          <div className="dm-row">
            <Button variant="primary" size="sm" onClick={onResultAction}>
              {resultActionLabel}
            </Button>
            <Button variant="text" size="sm" onClick={reset}>
              Start again
            </Button>
          </div>
        </ChatWidget>
      ) : null}
    </div>
  );
}
