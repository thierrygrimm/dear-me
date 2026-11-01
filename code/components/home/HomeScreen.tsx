"use client";

import { AskBar } from "@/components/answer/AskBar";
import { Logo } from "@/components/brand/Logo";
import { Squirrel } from "@/components/brand/Squirrel";
import { Coverage } from "@/components/data/Coverage";
import { MemoryFacts, MemoryGreeting } from "@/components/home/Memory";
import { NextStep } from "@/components/home/NextStep";
import { Opportunities } from "@/components/home/Opportunities";
import { copy } from "@/lib/copy";
import { hasCertificate, readIntake, readName } from "@/lib/session";
import { useRouter } from "next/navigation";
import { useState } from "react";

const coverage = [
  {
    id: "ret",
    label: "Retirement",
    score: 72,
    explain:
      "AHV plus your pension fund cover most of what you take home today. The rest is what pillar 3a and later savings can close.",
    source: "Certificate · AHV scale · what you told us",
  },
  {
    id: "dis",
    label: "Disability",
    score: 58,
    thin: true,
    explain:
      "If you could no longer work, your fund and AHV would pay less than you earn now. The gap is mostly because you plan to work part-time.",
    source: "Your certificate · AHV · salary you told us",
  },
  {
    id: "fam",
    label: "Family",
    score: 40,
    thin: true,
    explain:
      "If something happened to you, the cover for Marco and the baby looks thin. A small policy closes most of that soft spot.",
    source: "Family situation · what we know so far",
  },
  {
    id: "sav",
    label: "Savings",
    score: 65,
    explain:
      "Your 3a and reserves cover a few months. There is still room this year before the 3a limit.",
    source: "3a room · reserves estimate",
  },
  {
    id: "tax",
    label: "Taxes",
    score: 80,
    explain:
      "Buying into the fund and filling 3a already cut a useful amount. Nothing urgent on tax this year.",
    source: "Buy-in room · 3a · Basel-Stadt rules of thumb",
  },
];

const opps = [
  {
    id: "1",
    title: "Protect the family",
    body: "A small cover closes the soft spot if income drops.",
    impact: "Peace of mind",
    family: true,
  },
  {
    id: "2",
    title: "Save tax with 3a",
    body: "Room left this year before the limit.",
    impact: "About CHF 700",
  },
  {
    id: "learn-three-sources",
    title: "Two-minute lesson",
    body: "How the three pillars fit together.",
    impact: "2 min",
  },
];

export function HomeScreen() {
  const router = useRouter();
  const [hasCert] = useState(() => hasCertificate());
  const [name] = useState(() => readName());
  const [intake] = useState(() => readIntake());

  if (!hasCert) {
    return (
      <>
        <div className="dm-row" style={{ justifyContent: "space-between" }}>
          <Logo />
          <Squirrel state="idle" size={36} />
        </div>

        <MemoryGreeting
          name={name}
          line="Start with one document. An estimate works too."
        />

        <section className="dm-card">
          <p className="dm-muted" style={{ margin: "0 0 12px" }}>
            Your pension certificate (Pensionskassenausweis) is the fastest way
            in. We explain each line in plain words.
          </p>
          <button
            type="button"
            className="dm-btn dm-btn--signal dm-btn--block"
            onClick={() => router.push("/certificate")}
          >
            Add your certificate
          </button>
        </section>

        <NextStep
          title="Or look around with an estimate"
          duration="About 2 minutes"
          actionLabel="Use an estimate"
          onAction={() => router.push("/answer")}
        />

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

  return (
    <>
      <div className="dm-row" style={{ justifyContent: "space-between" }}>
        <Logo />
        <Squirrel state="idle" size={36} />
      </div>

      <MemoryGreeting
        name={name}
        line="One thought for this morning. Details live one tap deeper."
      />

      <MemoryFacts
        facts={[
          {
            id: "pensum",
            label: `${intake?.pensumAfter ?? 60} % after the baby`,
            source: "You told us",
            onEdit: () => router.push("/me/know"),
          },
          {
            id: "salary",
            label: `Salary about CHF ${(intake?.salary ?? 72000).toLocaleString("de-CH")}`,
            source: "myPax",
            onEdit: () => router.push("/me/know"),
          },
        ]}
      />

      <section
        className="dm-card"
        style={{ position: "relative", overflow: "hidden" }}
      >
        <p className="dm-muted" style={{ margin: "0 0 12px" }}>
          {copy.home.heroLine}
        </p>
        <button
          type="button"
          className="dm-btn dm-btn--signal"
          onClick={() => router.push("/answer")}
        >
          {copy.home.heroCta}
        </button>
      </section>

      <Coverage
        areas={coverage}
        headline="Your safety net looks mostly solid"
      />

      <NextStep
        title="Check what changes at 60 % after the baby"
        duration="About 3 minutes"
        actionLabel="Open the answer"
          onAction={() => router.push("/compare")}
        />

      <h2
        style={{
          margin: "8px 0 0",
          font: "700 20px/24px var(--font-display)",
          letterSpacing: "-0.01em",
        }}
      >
        {copy.home.feedHeading}
      </h2>
      <Opportunities
        items={opps}
        onSelect={(id) => {
          if (id === "1") {
            router.push("/me/book");
            return;
          }
          if (id === "2") {
            router.push("/learn?lesson=pillar-3a");
            return;
          }
          if (id === "learn-three-sources") {
            router.push("/learn?lesson=three-sources");
          }
        }}
      />

      <div
        className="dm-end"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          padding: "24px 0 8px",
        }}
      >
        <Squirrel state="idle" size={48} />
        <p className="dm-muted dm-small" style={{ margin: 0 }}>
          {copy.thatsAll}
        </p>
      </div>

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
