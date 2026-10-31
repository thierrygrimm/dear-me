"use client";

import { ScenarioCompare } from "@/components/answer/ScenarioCompare";
import { readIntake } from "@/lib/session";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ComparePage() {
  const router = useRouter();
  const [pensum] = useState(() => readIntake()?.pensumAfter ?? 60);

  return (
    <>
      <div className="dm-row" style={{ alignItems: "center" }}>
        <button
          type="button"
          className="dm-cert-back"
          aria-label="Back"
          onClick={() => {
            if (window.history.length > 1) router.back();
            else router.push("/");
          }}
        >
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="dm-hello" style={{ fontSize: 22, margin: 0 }}>
          After the baby
        </h1>
      </div>
      <ScenarioCompare
        initialPensum={pensum}
        onTalk={() => router.push("/me/book")}
        onDone={() => router.push("/")}
      />
    </>
  );
}
