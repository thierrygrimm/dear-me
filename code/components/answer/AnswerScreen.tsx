"use client";

import { AskBar } from "@/components/answer/AskBar";
import { Disclaimer } from "@/components/answer/Disclaimer";
import { OfferCard } from "@/components/answer/OfferCard";
import { Verdict } from "@/components/answer/Verdict";
import { PillarChart } from "@/components/data/PillarChart";
import { SourcedNumber } from "@/components/data/SourcedNumber";
import { Segmented } from "@/components/ui/Segmented";
import { PensumSlider } from "@/components/ui/PensumSlider";
import { copy } from "@/lib/copy";
import { formatCHF } from "@/lib/format";
import { readIntake } from "@/lib/session";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export function AnswerScreen() {
  const router = useRouter();
  const [who, setWho] = useState("me");
  const [pensum, setPensum] = useState(() => readIntake()?.pensumAfter ?? 60);

  const monthlyGap = useMemo(() => {
    // Demo curve: 100% → 0 gap, 60% → ~620
    return Math.round(((100 - pensum) / 40) * 620);
  }, [pensum]);

  const pillars = useMemo(
    () => [
      { id: "ahv", label: "AHV", amount: 2100, max: 3200, tone: "ahv" as const },
      {
        id: "pk",
        label: "Pension fund",
        amount: Math.round(1400 * (pensum / 100)),
        max: 1600,
        tone: "pk" as const,
        gap: pensum < 100,
      },
      {
        id: "3a",
        label: "Pillar 3a",
        amount: 420,
        max: 700,
        tone: "3a" as const,
        gap: true,
      },
    ],
    [pensum],
  );

  return (
    <>
      <Verdict
        question={copy.answer.pensumQuestion}
        answer={
          <span className="dm-num">
            {formatCHF(monthlyGap)}
            <small
              style={{
                display: "block",
                font: "400 14px/18px var(--font-text)",
                letterSpacing: 0,
                marginTop: 6,
              }}
            >
              a month, for life
            </small>
          </span>
        }
        note={
          <>
            At {pensum} %, about{" "}
            <b className="dm-mark-line">{formatCHF(monthlyGap)}</b> less later
            on.
          </>
        }
      />
      <SourcedNumber
        amount={monthlyGap}
        cue="tap for sources"
        sources={[
          {
            label: "Pension fund drop",
            detail: "Calculated from pensum",
            amount: monthlyGap,
          },
        ]}
      />

      <PillarChart pillars={pillars} />

      <Segmented
        aria-label="Who this is for"
        value={who}
        onChange={setWho}
        options={[
          { value: "me", label: "Me" },
          { value: "us", label: "Us" },
          { value: "family", label: "Family" },
        ]}
      />

      <PensumSlider value={pensum} onChange={setPensum} />

      <button
        type="button"
        className="dm-btn dm-btn--secondary dm-btn--block"
        onClick={() => router.push("/compare")}
      >
        See all of it
      </button>

      <Disclaimer variant="plain">{copy.answer.disclaimer}</Disclaimer>

      {monthlyGap > 0 ? (
        <OfferCard
          pax
          title="A Pax idea that softens the soft spot"
          body="If something is still missing after you play with the lever, we can show one clear option — you choose what Pax sees."
          onBook={() => router.push("/me/book")}
        />
      ) : (
        <p className="dm-label">{copy.nothingElse}</p>
      )}

      <AskBar
        sticky
        onAttach={() => router.push("/certificate")}
        onSubmit={(value) => {
          sessionStorage.setItem("dm-ask-q", value);
          router.push("/ask");
        }}
      />
    </>
  );
}
