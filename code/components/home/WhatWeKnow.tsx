"use client";

import { MemoryFacts, type Fact } from "@/components/home/Memory";
import { SourceTag } from "@/components/data/SourceTag";
import { cn } from "@/lib/cn";

type Props = {
  facts: Fact[];
  className?: string;
};

export function WhatWeKnow({ facts, className }: Props) {
  return (
    <section className={cn("dm-stack", className)}>
      <div className="dm-know">
        <div>
          <b>{facts.length}</b>
          <span>facts</span>
        </div>
        <div>
          <b>{facts.filter((f) => f.source.toLowerCase().includes("estim")).length}</b>
          <span>estimates</span>
        </div>
        <div>
          <b>0</b>
          <span>to confirm</span>
        </div>
      </div>
      <div className="dm-row">
        <SourceTag label="Said" />
        <SourceTag kind="estimated" label="Estimated" />
        <SourceTag kind="mypax" label="myPax" />
      </div>
      <MemoryFacts facts={facts} />
    </section>
  );
}
