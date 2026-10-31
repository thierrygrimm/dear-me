"use client";

import { ChatPlan } from "@/components/chat/ChatPlan";
import { States } from "@/components/feedback/States";
import { copy } from "@/lib/copy";
import { useState } from "react";

export default function PlanPage() {
  const [steps, setSteps] = useState([
    {
      id: "1",
      title: "Play with the 60 % scenario",
      done: false,
      external: false,
    },
    {
      id: "2",
      title: "Confirm what we know about Marco",
      done: false,
      external: false,
    },
    {
      id: "3",
      title: "Book a chat with Sara at Pax",
      done: false,
      external: true,
    },
  ]);

  const allDone = steps.every((s) => s.done);

  return (
    <>
      <h1 className="dm-hello">{copy.plan.title}</h1>
      {allDone ? (
        <States kind="empty" title={copy.plan.empty} />
      ) : (
        <ChatPlan
          title="Expecting a baby"
          steps={steps.map((s) => ({
            ...s,
            onToggle: () =>
              setSteps((prev) =>
                prev.map((x) =>
                  x.id === s.id ? { ...x, done: !x.done } : x,
                ),
              ),
            onOpen: () =>
              setSteps((prev) =>
                prev.map((x) =>
                  x.id === s.id ? { ...x, done: true } : x,
                ),
              ),
          }))}
        />
      )}
    </>
  );
}
