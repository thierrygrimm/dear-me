"use client";

import { AskBar } from "@/components/answer/AskBar";
import { Logo } from "@/components/brand/Logo";
import { Squirrel } from "@/components/brand/Squirrel";
import { Coverage } from "@/components/data/Coverage";
import { MemoryGreeting } from "@/components/home/Memory";
import { NextStep } from "@/components/home/NextStep";
import { Opportunities } from "@/components/home/Opportunities";
import { copy } from "@/lib/copy";
import { hasCertificate } from "@/lib/session";
import { useRouter } from "next/navigation";
import { useState } from "react";

const coverage = [
  { id: "ret", label: "Retirement", score: 72 },
  { id: "dis", label: "Disability", score: 58, thin: true },
  { id: "fam", label: "Family", score: 40, thin: true },
  { id: "sav", label: "Savings", score: 65 },
  { id: "tax", label: "Taxes", score: 80 },
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
    id: "3",
    title: "Two-minute lesson",
    body: "How the three pillars fit together.",
    impact: "2 min",
  },
];

export function HomeScreen() {
  const router = useRouter();
  const [hasCert] = useState(() => hasCertificate());

  if (!hasCert) {
    return (
      <>
        <div className="dm-row" style={{ justifyContent: "space-between" }}>
          <Logo />
          <Squirrel state="idle" size={36} />
        </div>

        <MemoryGreeting
          name="there"
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
        name="Lena"
        line="One thought for this morning. Details live one tap deeper."
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
        onAction={() => router.push("/answer")}
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
      <Opportunities items={opps} />

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
