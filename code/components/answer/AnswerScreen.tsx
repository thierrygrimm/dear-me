"use client";

import { Disclaimer } from "@/components/answer/Disclaimer";
import { OfferCard } from "@/components/answer/OfferCard";
import { Verdict } from "@/components/answer/Verdict";
import { Button } from "@/components/ui/Button";
import { WhoPlanning } from "@/components/ui/WhoPlanning";
import { copy } from "@/lib/copy";
import {
  markPlanningScope,
  planningScopeHeading,
  readIntake,
  readPlanningScope,
  type PlanningScope,
} from "@/lib/session";
import { ChevronLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

/**
 * Guided answer screen after Home / chat "Open".
 * WhoPlanning (Segmented C) switches Me / Us / Us + baby; copy follows.
 */
export function AnswerScreen() {
  const router = useRouter();
  const params = useSearchParams();
  const topic = params.get("topic") ?? "disability";
  const [intake] = useState(() => readIntake());
  const [scope, setScope] = useState<PlanningScope>(() => readPlanningScope());
  const after = intake?.pensumAfter ?? 60;

  function changeScope(next: PlanningScope) {
    setScope(next);
    markPlanningScope(next);
  }

  const content = useMemo(() => {
    const who =
      scope === "family"
        ? "the three of you"
        : scope === "us"
          ? "the two of you"
          : "you";

    if (topic === "pensum" || topic === "baby") {
      return {
        question: copy.answer.pensumQuestion,
        answer: "Yes, that works.",
        note:
          scope === "me" ? (
            <>
              It costs you about <b>CHF 620 a month at 65, for life</b>.
            </>
          ) : (
            <>
              Together you stay above your goal. The drop is about{" "}
              <b>CHF 620 a month at 65, for life</b>.
            </>
          ),
        money: {
          leftLabel: "Income now / month",
          leftValue: scope === "me" ? "4'230" : "9'100",
          leftDelta: scope === "me" ? "−2'470" : "−2'470 (Lena)",
          rightLabel: planningScopeHeading(scope),
          rightValue: scope === "me" ? "1'060" : "3'640",
          rightDelta: scope === "me" ? "−620 for life" : "joint · −620 Lena",
        },
        insight: `At ${after} % ${who === "you" ? "your" : "Lena's"} pension drops by CHF 620 a month, for life. Disability also thins — that is the bigger new gap for ${who}.`,
        offer: false as const,
        compare: true,
      };
    }

    return {
      question: "What if I couldn't work?",
      answer: "Almost.",
      note:
        scope === "me" ? (
          <>
            You&apos;d have about <b>half your income</b>. The soft spot is
            disability cover.
          </>
        ) : (
          <>
            Together you&apos;d still cover most of life. Alone, Lena would have
            about <b>half her income</b>.
          </>
        ),
      money: {
        leftLabel:
          scope === "me" ? "Income today / month" : "Household today / month",
        leftValue: scope === "me" ? "6'700" : "11'900",
        leftDelta: undefined as string | undefined,
        rightLabel: "If Lena couldn't work",
        rightValue: scope === "me" ? "3'100" : "8'300",
        rightDelta: scope === "me" ? "−3'600 / month" : "−3'600 Lena",
      },
      insight:
        scope === "me"
          ? "Your fund and AHV would pay about CHF 3'100 a month. The gap is mostly because you plan to work part-time after the baby."
          : `For ${who}, Marco's income still carries a lot. The open spot is Lena's disability cover.`,
      offer: true as const,
      compare: false,
    };
  }, [topic, after, scope]);

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
        <WhoPlanning variant="pill" value={scope} onChange={changeScope} />
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
          <button type="button" onClick={() => router.push("/compare")}>
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
