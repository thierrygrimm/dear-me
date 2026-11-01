"use client";

import { Disclaimer } from "@/components/answer/Disclaimer";
import { OfferCard } from "@/components/answer/OfferCard";
import { Verdict } from "@/components/answer/Verdict";
import { PageColumn } from "@/components/layout/PageColumn";
import { Button } from "@/components/ui/Button";
import { WhoPlanning } from "@/components/ui/WhoPlanning";
import { copy } from "@/lib/copy";
import { getPersona, readPersonaId } from "@/lib/personas";
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
 * WhoPlanning (Segmented C) switches Me / Us / Us + baby; copy follows persona.
 */
export function AnswerScreen() {
  const router = useRouter();
  const params = useSearchParams();
  const topic = params.get("topic") ?? "disability";
  const [intake] = useState(() => readIntake());
  const [scope, setScope] = useState<PlanningScope>(() => readPlanningScope());
  const [persona] = useState(() => getPersona(readPersonaId()));
  const after = intake?.pensumAfter ?? 60;
  const first = persona.hi.replace(/\.$/, "");
  const partner =
    persona.id === "ruth" ? "Peter" : persona.id === "lena" ? "Marco" : null;
  const together = Boolean(partner);

  function changeScope(next: PlanningScope) {
    setScope(next);
    markPlanningScope(next);
  }

  const content = useMemo(() => {
    const who =
      scope === "family"
        ? "the three of you"
        : scope === "us" && together
          ? "the two of you"
          : "you";

    if (topic === "pensum" || topic === "baby") {
      return {
        question: copy.answer.pensumQuestion,
        answer: "Yes, that works.",
        note:
          scope === "me" || !together ? (
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
          leftValue: scope === "me" || !together ? "4'230" : "9'100",
          leftDelta:
            scope === "me" || !together
              ? "−2'470"
              : `−2'470 (${first})`,
          rightLabel: planningScopeHeading(scope),
          rightValue: scope === "me" || !together ? "1'060" : "3'640",
          rightDelta:
            scope === "me" || !together
              ? "−620 for life"
              : `joint · −620 ${first}`,
        },
        insight: `At ${after} % ${who === "you" ? "your" : `${first}'s`} pension drops by CHF 620 a month, for life. Disability also thins — that is the bigger new gap for ${who}.`,
        offer: false as const,
        compare: true,
        moneyTitle: `${after} % compared to today`,
      };
    }

    if (topic === "retire") {
      return {
        question: "Lump sum or pension?",
        answer: "Both can work.",
        note: (
          <>
            Taking all CHF 380&apos;000 as cash can run out around{" "}
            <b>age 79</b>. A mixed plan lasts longer.
          </>
        ),
        money: {
          leftLabel: "All as cash",
          leftValue: "to ~79",
          leftDelta: undefined as string | undefined,
          rightLabel: "Mixed plan",
          rightValue: "to ~91",
          rightDelta: "part guaranteed",
        },
        insight:
          scope === "me" || !together
            ? "A part as pension covers the basics. The rest stays flexible for you."
            : `For ${who}, a part as pension covers the basics. The rest stays flexible for ${first} and ${partner}.`,
        offer: false as const,
        compare: true,
        moneyTitle: "How long the money lasts",
      };
    }

    return {
      question: "What if I couldn't work?",
      answer: persona.id === "noah" || persona.id === "sandra" ? "A gap." : "Almost.",
      note:
        scope === "me" || !together ? (
          <>
            You&apos;d have about <b>half your income</b>. The soft spot is
            disability cover.
          </>
        ) : (
          <>
            Together you&apos;d still cover most of life. Alone, {first} would have
            about <b>half her income</b>.
          </>
        ),
      money: {
        leftLabel:
          scope === "me" || !together
            ? "Income today / month"
            : "Household today / month",
        leftValue: scope === "me" || !together ? "6'700" : "11'900",
        leftDelta: undefined as string | undefined,
        rightLabel: `If ${first} couldn't work`,
        rightValue: scope === "me" || !together ? "3'100" : "8'300",
        rightDelta:
          scope === "me" || !together
            ? "−3'600 / month"
            : `−3'600 ${first}`,
      },
      insight:
        scope === "me" || !together
          ? persona.id === "noah"
            ? "In your first years the fund covers little. A small disability idea closes most of the CHF 1'900 gap."
            : persona.id === "sandra"
              ? "Without a pension fund, only AHV/IV would pay. That is the soft spot to close."
              : "Your fund and AHV would pay about CHF 3'100 a month. The gap is mostly because you plan to work part-time after the baby."
          : `For ${who}, ${partner}'s income still carries a lot. The open spot is ${first}'s disability cover.`,
      offer: true as const,
      compare: false,
      moneyTitle: "Today vs if you couldn't work",
    };
  }, [topic, after, scope, first, partner, together, persona.id]);

  return (
    <PageColumn kind="plan">
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
        {together ? (
          <WhoPlanning variant="pill" value={scope} onChange={changeScope} />
        ) : (
          <span />
        )}
        <span style={{ width: 36 }} />
      </header>

      <Verdict
        question={content.question}
        answer={<span className="dm-mark-line">{content.answer}</span>}
        note={content.note}
        signal
      />

      <div className="dm-wcard" style={{ boxShadow: "none", padding: 0 }}>
        <h4 style={{ marginBottom: 4 }}>{content.moneyTitle}</h4>
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
    </PageColumn>
  );
}
