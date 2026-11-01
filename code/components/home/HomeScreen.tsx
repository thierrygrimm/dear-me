"use client";

import { AskBar } from "@/components/answer/AskBar";
import { Logo } from "@/components/brand/Logo";
import { Squirrel } from "@/components/brand/Squirrel";
import { HomeHero } from "@/components/home/HomeHero";
import { NextStep } from "@/components/home/NextStep";
import { copy } from "@/lib/copy";
import { hasCertificate, readName } from "@/lib/session";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function HomeScreen() {
  const router = useRouter();
  const [hasCert] = useState(() => hasCertificate());
  const [name] = useState(() => readName());

  if (!hasCert) {
    return (
      <>
        <div className="dm-row" style={{ justifyContent: "space-between" }}>
          <Logo />
          <Squirrel state="idle" size={36} />
        </div>

        <h1
          className="hh-h"
          style={{ marginTop: 12, whiteSpace: "pre-line" }}
        >
          {copy.home.greeting(name === "there" ? "there" : name, 9)}
        </h1>
        <p className="dm-muted" style={{ margin: "8px 0 0", maxWidth: 280 }}>
          {copy.home.noCertSay}
        </p>

        <button
          type="button"
          className="dm-btn dm-btn--signal dm-btn--block"
          style={{ marginTop: 16 }}
          onClick={() => router.push("/certificate")}
        >
          {copy.home.noCertCta}
        </button>

        <NextStep
          title={copy.home.estimateTitle}
          duration={copy.home.estimateMeta}
          actionLabel="Use an estimate"
          onAction={() => router.push("/answer")}
        />

        <AskBar
          sticky
          onAttach={() => router.push("/certificate")}
          onSubmit={(value) => {
            sessionStorage.setItem("dm-ask-q", value);
            router.push("/ask");
          }}
        />
      </>
    );
  }

  return (
    <HomeHero
      name={name}
      onLook={() => {
        sessionStorage.setItem("dm-ask-q", "What if I couldn't work?");
        router.push("/ask");
      }}
      onBook={() => router.push("/me/book")}
      onLesson={() => router.push("/learn?lesson=part-time")}
    />
  );
}
