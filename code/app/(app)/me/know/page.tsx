"use client";

import { WhatWeKnow } from "@/components/home/WhatWeKnow";
import { PageColumn } from "@/components/layout/PageColumn";
import { useRouter } from "next/navigation";

export default function WhatWeKnowPage() {
  const router = useRouter();

  return (
    <PageColumn kind="wwk">
      <header className="dm-appbar" style={{ margin: "0 -4px" }}>
        <button
          type="button"
          aria-label="Back"
          onClick={() => router.push("/me")}
        >
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <b style={{ font: "600 16px/20px var(--font-text)" }}>What we know</b>
        <span style={{ width: 36 }} />
      </header>
      <WhatWeKnow />
    </PageColumn>
  );
}
