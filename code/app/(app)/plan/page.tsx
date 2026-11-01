"use client";

import { ChatPlan } from "@/components/chat/ChatPlan";
import { States } from "@/components/feedback/States";
import { PageColumn } from "@/components/layout/PageColumn";
import { useLocale } from "@/components/locale/LocaleProvider";
import { planPackFor, type PlanStepSeed } from "@/lib/i18n/planCopy";
import { getPersona, readPersonaId, type PersonaId } from "@/lib/personas";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type Step = PlanStepSeed;

function routeFor(action: PlanStepSeed["action"], router: ReturnType<typeof useRouter>) {
  switch (action) {
    case "pensum":
      router.push("/answer?topic=pensum");
      return;
    case "compare":
      router.push("/compare");
      return;
    case "learn-3a":
      router.push("/learn?lesson=pillar-3a");
      return;
    case "certificate":
      router.push("/certificate");
      return;
    case "learn-ahv":
      router.push("/learn?lesson=ahv-part-2");
      return;
    case "book":
      router.push("/me/book");
      return;
    default:
      break;
  }
}

export default function PlanPage() {
  const router = useRouter();
  const { language, copy } = useLocale();
  const [personaId, setPersonaId] = useState<PersonaId>("lena");
  const [steps, setSteps] = useState<Step[]>(() => planPackFor("lena", language).steps);

  useEffect(() => {
    const id = readPersonaId();
    const pack = planPackFor(id, language);
    setPersonaId(id);
    setSteps(pack.steps);
  }, [language]);

  const pack = planPackFor(personaId, language);
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
          routeFor(s.action, router);
        },
        onSkip: () =>
          setSteps((prev) =>
            prev.map((x) => (x.id === s.id ? { ...x, done: true } : x)),
          ),
      })),
    [router, steps],
  );

  return (
    <PageColumn
      kind="plan"
      title={copy.plan.title}
      subtitle={`${getPersona(personaId, language).tag} · ${copy.plan.listHint}`}
    >
      {allDone ? (
        <States kind="empty" title={copy.plan.empty} />
      ) : (
        <ChatPlan
          title={pack.title}
          subtitle={copy.plan.listHint}
          variant="actions"
          steps={wired}
        />
      )}
    </PageColumn>
  );
}
