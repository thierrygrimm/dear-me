"use client";

import { AskBar } from "@/components/answer/AskBar";
import { Disclaimer } from "@/components/answer/Disclaimer";
import { OfferCard } from "@/components/answer/OfferCard";
import { Verdict } from "@/components/answer/Verdict";
import { Calculating, Skeleton, Splash } from "@/components/brand/Loading";
import { Logo } from "@/components/brand/Logo";
import { Squirrel } from "@/components/brand/Squirrel";
import { Coverage } from "@/components/data/Coverage";
import { Estimate } from "@/components/data/Estimate";
import { PillarChart } from "@/components/data/PillarChart";
import { SourcedNumber } from "@/components/data/SourcedNumber";
import { SourceTag } from "@/components/data/SourceTag";
import {
  BottomSheet,
  SheetOption,
} from "@/components/feedback/BottomSheet";
import { States } from "@/components/feedback/States";
import { useToast } from "@/components/feedback/Toast";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { PensumSlider } from "@/components/ui/PensumSlider";
import { Segmented } from "@/components/ui/Segmented";
import { copy } from "@/lib/copy";
import { useState } from "react";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="dm-stack" style={{ gap: 12, paddingBottom: 28 }}>
      <h2
        style={{
          margin: 0,
          font: "700 20px/24px var(--font-display)",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function DevUiPage() {
  const toast = useToast();
  const [chipOn, setChipOn] = useState(true);
  const [seg, setSeg] = useState("me");
  const [pensum, setPensum] = useState(80);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [opt, setOpt] = useState("a");

  return (
    <div className="dm-app-shell" style={{ maxWidth: 520, padding: 20 }}>
      <Logo />
      <p className="dm-muted">Component gallery — local only.</p>

      <Section title="Button">
        <div className="dm-row">
          <Button variant="primary">Primary</Button>
          <Button variant="signal">Signal</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="tonal">Tonal</Button>
        </div>
        <div className="dm-row">
          <Button variant="family">Family</Button>
          <Button variant="family-soft">Soft</Button>
          <Button variant="joy">Joy</Button>
          <Button variant="text">Text</Button>
        </div>
      </Section>

      <Section title="Chip / Segmented / Slider">
        <div className="dm-row">
          <Chip pressed={chipOn} onClick={() => setChipOn((v) => !v)}>
            Expecting
          </Chip>
          <Chip pressed={!chipOn} onClick={() => setChipOn((v) => !v)}>
            First job
          </Chip>
        </div>
        <Segmented
          value={seg}
          onChange={setSeg}
          options={[
            { value: "me", label: "Me" },
            { value: "us", label: "Us" },
            { value: "family", label: "Family" },
          ]}
        />
        <PensumSlider value={pensum} onChange={setPensum} />
      </Section>

      <Section title="Source / Number">
        <div className="dm-row">
          <SourceTag label="Said" />
          <SourceTag kind="estimated" label="Estimated" />
          <SourceTag kind="mypax" label="myPax" />
          <SourceTag kind="partner" label="Partner" />
        </div>
        <SourcedNumber
          amount={3640}
          cue="a month"
          showSources
          sources={[
            { label: "AHV", detail: "Calculated", amount: 2100 },
            { label: "Pension fund", detail: "myPax", amount: 1120 },
            { label: "Pillar 3a", detail: "Estimated", amount: 420 },
          ]}
        />
        <Estimate low={2800} high={3400} label="Range while we confirm" />
      </Section>

      <Section title="Verdict / Coverage / Chart">
        <Verdict
          question="What if I work less?"
          answer="About CHF 620"
          note="A month later on, for life."
        />
        <Coverage
          areas={[
            { id: "1", label: "Retirement", score: 70 },
            { id: "2", label: "Family", score: 35, thin: true },
          ]}
        />
        <PillarChart
          pillars={[
            { id: "a", label: "AHV", amount: 2100, max: 3000, tone: "ahv" },
            { id: "b", label: "PK", amount: 900, max: 1600, tone: "pk", gap: true },
            { id: "c", label: "3a", amount: 400, max: 700, tone: "3a", gap: true },
          ]}
        />
        <Disclaimer />
      </Section>

      <Section title="Ask / Offer">
        <AskBar />
        <OfferCard
          title="A quiet option"
          body="Only when a real gap remains."
          why="Shown because family cover is thin at your pensum."
        />
        <OfferCard
          pax
          title="Pax partner idea"
          body="Official partner colours only here."
        />
      </Section>

      <Section title="Feedback">
        <div className="dm-row">
          <Button
            variant="secondary"
            onClick={() =>
              toast.show({ message: copy.toast.saved, onUndo: () => undefined })
            }
          >
            Toast
          </Button>
          <Button variant="secondary" onClick={() => setSheetOpen(true)}>
            Bottom sheet
          </Button>
        </div>
        <div style={{ height: 220, position: "relative", background: "var(--surface-card)" }}>
          <States kind="empty" onPrimary={() => undefined} />
        </div>
      </Section>

      <Section title="Brand / Loading">
        <div className="dm-row" style={{ alignItems: "flex-end" }}>
          {(
            ["idle", "listening", "thinking", "progress", "done", "peek"] as const
          ).map((s) => (
            <div key={s} style={{ textAlign: "center" }}>
              <Squirrel state={s} size={56} />
              <div className="dm-tag">{s}</div>
            </div>
          ))}
        </div>
        <div style={{ height: 220, borderRadius: 16, overflow: "hidden" }}>
          <Splash />
        </div>
        <div style={{ height: 220, borderRadius: 16, overflow: "hidden" }}>
          <Calculating detail="Step 2 of 3" />
        </div>
        <Skeleton height={48} />
      </Section>

      <BottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Choose a source"
        description="Every number keeps its source."
      >
        <SheetOption
          label="Said by you"
          detail="Confirmed with a tap"
          checked={opt === "a"}
          onSelect={() => setOpt("a")}
        />
        <SheetOption
          label="From myPax"
          detail="Imported profile"
          checked={opt === "b"}
          onSelect={() => setOpt("b")}
        />
        <Button variant="primary" block onClick={() => setSheetOpen(false)}>
          Done
        </Button>
      </BottomSheet>
    </div>
  );
}
