"use client";

import { AdvisorView } from "@/components/advisor/AdvisorView";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";

/** Desktop advisor brief — Build Spec E2. */
export default function AdvisorPage() {
  const router = useRouter();

  return (
    <div className="dm-advisor-page">
      <div className="dm-advisor-page__bar">
        <Button variant="text" onClick={() => router.back()}>
          Back
        </Button>
        <b>Advisor brief</b>
        <span />
      </div>
      <AdvisorView />
    </div>
  );
}
