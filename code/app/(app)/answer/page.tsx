"use client";

import { AnswerScreen } from "@/components/answer/AnswerScreen";
import { Suspense } from "react";

export default function AnswerPage() {
  return (
    <Suspense fallback={null}>
      <AnswerScreen />
    </Suspense>
  );
}
