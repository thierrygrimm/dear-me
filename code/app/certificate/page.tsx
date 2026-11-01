"use client";

import {
  CertificateFlow,
  type CertificateStep,
} from "@/components/certificate/CertificateFlow";
import { FlowShell } from "@/components/layout/FlowShell";
import { useRouter } from "next/navigation";
import { useState } from "react";

const STEP_META: Record<
  CertificateStep,
  {
    label: string;
    progress: number;
    pane: "col" | "full";
    bleed?: boolean;
  }
> = {
  choose: { label: "Your certificate", progress: 12, pane: "col" },
  scan: { label: "Scanning", progress: 36, pane: "full", bleed: true },
  explain: { label: "What we read", progress: 60, pane: "col" },
  confirm: { label: "Looks right?", progress: 84, pane: "col" },
};

export default function CertificatePage() {
  const router = useRouter();
  const [step, setStep] = useState<CertificateStep>("choose");
  const meta = STEP_META[step];

  return (
    <FlowShell
      step={meta.label}
      progress={meta.progress}
      pane={meta.pane}
      bleed={meta.bleed}
      onExit={() => router.push("/")}
    >
      <div className="dm-cert-shell dm-cert-shell--flow">
        <CertificateFlow
          onStepChange={setStep}
          onClose={() => router.push("/")}
          onDone={() => router.push("/answer?topic=pensum")}
        />
      </div>
    </FlowShell>
  );
}
