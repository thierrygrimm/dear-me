"use client";

import { WhatWeKnow } from "@/components/home/WhatWeKnow";
import { copy } from "@/lib/copy";

export default function WhatWeKnowPage() {
  return (
    <>
      <h1 className="dm-hello" style={{ fontSize: 24 }}>
        {copy.me.whatWeKnow}
      </h1>
      <WhatWeKnow
        facts={[
          {
            id: "1",
            label: "Expecting a baby",
            source: "Said · confirmed",
          },
          {
            id: "2",
            label: "Lives with Marco",
            source: "Said · confirmed",
          },
          {
            id: "3",
            label: "Pensum today 100 %",
            source: "myPax",
          },
          {
            id: "4",
            label: "Pillar 3a about CHF 18'000",
            source: "Estimated",
          },
        ]}
      />
    </>
  );
}
