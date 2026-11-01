"use client";

import { Disclaimer } from "@/components/answer/Disclaimer";
import { OfferCard } from "@/components/answer/OfferCard";
import { Verdict } from "@/components/answer/Verdict";
import { Button } from "@/components/ui/Button";
import { copy } from "@/lib/copy";
import { readIntake } from "@/lib/session";
import { ChevronLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

/**
 * Guided answer screen after Home / chat "Open".
 * Matches Flows chat2 + Verdict: short sentence, one number in the note,
 * a money comparison, then optional Pax offer — not a dashboard of controls.
 */
export function AnswerScreen() {
  const router = useRouter();
  const params = useSearchParams();
  const topic = params.get("topic") ?? "disability";
  const [intake] = useState(() => readIntake());
  const after = intake?.pensumAfter ?? 60;

  const content = useMemo(() => {
    if (topic === "pensum" || topic === "baby") {
      return {
        question: copy.answer.pensumQuestion,
        answer: "Yes, that works.",
        note: (
          <>
            It costs you about <b>CHF 620 a month at 65, for life</b>.
          </>
        ),
        money: {
          leftLabel: "Income now / month",
          leftValue: "4'230",
          leftDelta: "−2'470",
          rightLabel: "Pension at 65 / month",
          rightValue: "1'060",
          rightDelta: "−620 for life",
        },
        insight: `At ${after} % your pension drops by CHF 620 a month, for life. Disability also thins — that is the bigger new gap.`,
        offer: false as const,
        compare: true,
      };
    }

    return {
      question: "What if I couldn't work?",
      answer: "Almost.",
      note: (
        <>
          You&apos;d have about <b>half your income</b>. The soft spot is
          disability cover.
        </>
      ),
      money: {
        leftLabel: "Income today / month",
        leftValue: "6'700",
        leftDelta: undefined as string | undefined,
        rightLabel: "If you couldn't work",
        rightValue: "3'100",
        rightDelta: "−3'600 / month",
      },
      insight:
        "Your fund and AHV would pay about CHF 3'100 a month. The gap is mostly because you plan to work part-time after the baby.",
      offer: true as const,
      compare: false,
    };
  }, [topic, after]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        flex: 1,
        minHeight: 0,
      }}
    >
      <header className="dm-appbar" style={{ margin: "0 -4px" }}>
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
        <span />
        <span style={{ width: 36 }} />
      </header>

      <Verdict
        question={content.question}
        answer={<span className="dm-mark-line">{content.answer}</span>}
        note={content.note}
        signal
      />

      <div className="dm-wcard" style={{ boxShadow: "none", padding: 0 }}>
        <h4 style={{ marginBottom: 4 }}>
          {topic === "pensum" || topic === "baby"
            ? `${after} % compared to today`
            : "Today vs if you couldn't work"}
        </h4>
        <div className="dm-money2">
          <div>
            <small>{content.money.leftLabel}</small>
            <b className="mn">{content.money.leftValue}</b>
            {content.money.leftDelta ? (
              <em className="neg">{content.money.leftDelta}</em>
            ) : null}
          </div>
          <div>
            <small>{content.money.rightLabel}</small>
            <b className="mp">{content.money.rightValue}</b>
            {content.money.rightDelta ? (
              <em className="neg">{content.money.rightDelta}</em>
            ) : null}
          </div>
        </div>
      </div>

      <p
        style={{
          margin: 0,
          font: "400 15px/22px var(--font-text)",
          color: "var(--ink)",
        }}
      >
        {content.insight}
      </p>

      <div className="dm-sugg" style={{ justifyContent: "stretch" }}>
        {content.compare ? (
          <button type="button" onClick={() => router.push("/compare")}>
            See all of it
          </button>
        ) : (
          <button
            type="button"
            onClick={() => router.push("/compare")}
          >
            See what changes at {after} %
          </button>
        )}
        <button type="button" onClick={() => router.push("/me/book")}>
          Talk to Sara from Pax
        </button>
      </div>

      {content.offer ? (
        <OfferCard
          pax
          title="A small cover for the soft spot"
          body="If income drops because you couldn't work, a Pax disability idea can close most of the gap. You choose what Pax sees."
          onBook={() => router.push("/me/book")}
        />
      ) : null}

      <Disclaimer variant="plain">{copy.answer.disclaimer}</Disclaimer>

      <Button variant="text" onClick={() => router.push("/")}>
        Back to Home
      </Button>
    </div>
  );
}
