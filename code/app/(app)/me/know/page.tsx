"use client";

import { WhatWeKnow } from "@/components/home/WhatWeKnow";
import { useRouter } from "next/navigation";

export default function WhatWeKnowPage() {
  const router = useRouter();

  return (
    <>
      <button
        type="button"
        className="dm-cert-back"
        aria-label="Back"
        onClick={() => router.push("/me")}
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
      <WhatWeKnow />
    </>
  );
}
