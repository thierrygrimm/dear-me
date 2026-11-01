"use client";

import { ChatPlan } from "@/components/chat/ChatPlan";
import { States } from "@/components/feedback/States";
import { PageColumn } from "@/components/layout/PageColumn";
import { copy } from "@/lib/copy";
import { getPersona, readPersonaId, type PersonaId } from "@/lib/personas";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Step = {
  id: string;
  title: string;
  detail: string;
  done: boolean;
  external: boolean;
};

function seedFor(id: PersonaId): Step[] {
  if (id === "noah") {
    return [
      {
        id: "1",
        title: "Open a pillar 3a",
        detail: "10 min · about CHF 100 a month to start",
        done: false,
        external: true,
      },
      {
        id: "2",
        title: "Bring in your certificate",
        detail: "Makes every number exact",
        done: false,
        external: false,
      },
      {
        id: "3",
        title: "Check cover if you couldn't work",
        detail: "15 min · optional talk with an advisor",
        done: false,
        external: false,
      },
    ];
  }
  if (id === "sandra") {
    return [
      {
        id: "1",
        title: "Use the bigger 3a ceiling",
        detail: "Self-employed limit this year",
        done: false,
        external: true,
      },
      {
        id: "2",
        title: "Close the income gap if you couldn't work",
        detail: "20 min · talk with Jonas",
        done: false,
        external: false,
      },
      {
        id: "3",
        title: "Name a beneficiary",
        detail: "5 min · your 3a provider's form",
        done: false,
        external: true,
      },
    ];
  }
  if (id === "ruth") {
    return [
      {
        id: "1",
        title: "Decide lump sum, pension, or both",
        detail: "Done with the compare screen",
        done: true,
        external: false,
      },
      {
        id: "2",
        title: "Check AHV for couples at 65",
        detail: "4 min · short lesson",
        done: false,
        external: false,
      },
      {
        id: "3",
        title: "Book Sara to confirm the mix",
        detail: "30 min · video or phone",
        done: false,
        external: false,
      },
    ];
  }
  return [
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
}

export default function PlanPage() {
  const router = useRouter();
  const [personaId, setPersonaId] = useState<PersonaId>("lena");
  const [steps, setSteps] = useState<Step[]>(() => seedFor("lena"));

  useEffect(() => {
    const id = readPersonaId();
    setPersonaId(id);
    setSteps(seedFor(id));
  }, []);

  const allDone = steps.every((s) => s.done);
  const title =
    personaId === "ruth"
      ? "Before you retire"
      : personaId === "noah"
        ? "First steps"
        : "Before March";

  const wired = useMemo(
    () =>
      steps.map((s) => ({
        ...s,
        onToggle: () =>
          setSteps((prev) =>
            prev.map((x) => (x.id === s.id ? { ...x, done: !x.done } : x)),
          ),
        onOpen: () => {
          if (s.id === "1" && personaId === "lena") {
            router.push("/answer?topic=pensum");
            return;
          }
          if (s.id === "1" && personaId === "ruth") {
            router.push("/compare");
            return;
          }
          if (
            s.title.toLowerCase().includes("3a") ||
            (s.id === "3" && personaId === "lena")
          ) {
            router.push("/learn?lesson=pillar-3a");
            return;
          }
          if (s.title.toLowerCase().includes("certificate")) {
            router.push("/certificate");
            return;
          }
          if (s.title.toLowerCase().includes("ahv")) {
            router.push("/learn?lesson=ahv-part-2");
            return;
          }
          if (
            s.title.toLowerCase().includes("book") ||
            s.title.toLowerCase().includes("cover") ||
            s.title.toLowerCase().includes("gap") ||
            s.title.toLowerCase().includes("jonas") ||
            s.title.toLowerCase().includes("sara")
          ) {
            router.push("/me/book");
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
    [router, steps, personaId],
  );

  return (
    <PageColumn
      kind="plan"
      title={copy.plan.title}
      subtitle={`${getPersona(personaId).tag} · ${copy.plan.listHint}`}
    >
      {allDone ? (
        <States kind="empty" title={copy.plan.empty} />
      ) : (
        <ChatPlan
          title={title}
          subtitle={copy.plan.listHint}
          variant="actions"
          steps={wired}
        />
      )}
    </PageColumn>
  );
}
