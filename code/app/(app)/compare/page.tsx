"use client";

import { ScenarioCompare } from "@/components/answer/ScenarioCompare";
import { PageColumn } from "@/components/layout/PageColumn";
import { WhoPlanning } from "@/components/ui/WhoPlanning";
import { getPersona, readPersonaId } from "@/lib/personas";
import {
  markPlanningScope,
  planningScopeHeading,
  readIntake,
  readPlanningScope,
  type PlanningScope,
} from "@/lib/session";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type CompareMode = "pensum" | "disability" | "retire";

function modeFromParam(raw: string | null): CompareMode | undefined {
  if (raw === "pensum" || raw === "disability" || raw === "retire") return raw;
  return undefined;
}

export default function ComparePage() {
  const router = useRouter();
  const params = useSearchParams();
  const [pensum] = useState(() => readIntake()?.pensumAfter ?? 60);
  const [scope, setScope] = useState<PlanningScope>(() => readPlanningScope());
  const [title] = useState(() => getPersona(readPersonaId()).topic);
  const mode = modeFromParam(params.get("mode"));

  function changeScope(next: PlanningScope) {
    setScope(next);
    markPlanningScope(next);
  }

  return (
    <PageColumn kind="cmp">
      <div className="dm-row" style={{ alignItems: "center", gap: 8 }}>
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
            <path
              d="M15 5l-7 7 7 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h1 className="dm-hello" style={{ fontSize: 20, margin: 0, flex: 1 }}>
          {title}
        </h1>
        <WhoPlanning variant="pill" value={scope} onChange={changeScope} />
      </div>
      <p className="dm-small dm-muted" style={{ margin: 0 }}>
        {planningScopeHeading(scope)}
      </p>
      <ScenarioCompare
        initialPensum={pensum}
        mode={mode}
        onTalk={() => router.push("/me/book")}
        onDone={() => router.push("/")}
      />
    </PageColumn>
  );
}
