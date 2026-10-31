"use client";

import { LearnScreen } from "@/components/learn/LearnScreen";
import { Suspense } from "react";

export default function LearnPage() {
  return (
    <Suspense fallback={null}>
      <LearnScreen />
    </Suspense>
  );
}
