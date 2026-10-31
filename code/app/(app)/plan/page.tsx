"use client";

import { ChatPlan } from "@/components/chat/ChatPlan";
import { States } from "@/components/feedback/States";
import { Segmented } from "@/components/ui/Segmented";
import { copy } from "@/lib/copy";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Mode = "actions" | "checklist" | "stepper";

const seed = [
  {
    id: "1",
    title: "Decide who reduces and by how much",
    detail: "Done with the workload slider",
    done: true,
    external: false,
  },
  {
    id: "2",
    title: "Name Marco as beneficiary",
    detail: "5 min · your pension fund's form",
    done: false,
    external: true,
  },
  {
    id: "3",
    title: "Top up Pillar 3a before 31 December",
    detail: "10 min · saves about CHF 1'900 tax",
    done: false,
    external: true,
  },
  {
    id: "4",
    title: "Check cover if one of you can't work",
    detail: "20 min · optional talk with an advisor",
    done: false,
    external: false,
  },
];

export default function PlanPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("actions");
  const [steps, setSteps] = useState(seed);

  const allDone = steps.every((s) => s.done);

  const wired = useMemo(
    () =>
      steps.map((s) => ({
        ...s,
        onToggle: () =>
          setSteps((prev) =>
            prev.map((x) => (x.id === s.id ? { ...x, done: !x.done } : x)),
          ),
        onOpen: () => {
          if (s.id === "1" || s.id === "4") {
            router.push("/answer");
            return;
          }
          setSteps((prev) =>
            prev.map((x) => (x.id === s.id ? { ...x, done: true } : x)),
          );
        },
        onSkip: () =>
          setSteps((prev) =>
            prev.map((x) => (x.id === s.id ? { ...x, done: true } : x)),
          ),
      })),
    [router, steps],
  );

  return (
    <>
      <h1 className="dm-hello">{copy.plan.title}</h1>
      <Segmented
        value={mode}
        onChange={(v) => setMode(v as Mode)}
        options={[
          { value: "actions", label: "List" },
          { value: "checklist", label: "Ticks" },
          { value: "stepper", label: "One by one" },
        ]}
      />
      {allDone ? (
        <States kind="empty" title={copy.plan.empty} />
      ) : (
        <ChatPlan
          title="Before March"
          subtitle={copy.plan.listHint}
          variant={mode}
          steps={wired}
        />
      )}
    </>
  );
}
