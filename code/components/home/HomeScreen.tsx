"use client";

import { AskBar } from "@/components/answer/AskBar";
import { Logo } from "@/components/brand/Logo";
import { Squirrel } from "@/components/brand/Squirrel";
import { HomeHero } from "@/components/home/HomeHero";
import { NextStep } from "@/components/home/NextStep";
import { copy } from "@/lib/copy";
import { starterReplies } from "@/lib/chatDemo";
import { seedForAsk } from "@/lib/lifeMoments";
import { lessonPathForPersona } from "@/lib/personas";
import {
  hasCertificate,
  readAskedMoments,
  readMoments,
  readName,
} from "@/lib/session";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function goAsk(router: ReturnType<typeof useRouter>, research?: string) {
  const seed = seedForAsk(readMoments(), readAskedMoments(), research);
  if (seed) {
    sessionStorage.setItem("dm-ask-q", seed);
    sessionStorage.removeItem("dm-ask-free");
  } else {
    sessionStorage.removeItem("dm-ask-q");
    sessionStorage.removeItem("dm-ask-free");
  }
  router.push("/ask");
}

export function HomeScreen() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [hasCert, setHasCert] = useState(false);
  const [name, setName] = useState("there");

  useEffect(() => {
    setHasCert(hasCertificate());
    setName(readName());
    setReady(true);
  }, []);

  if (!ready) {
    return <div className="dm-morn" aria-hidden />;
  }

  if (!hasCert) {
    return (
      <div className="home-nocert">
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
          actionLabel={copy.home.useEstimate}
          onAction={() => goAsk(router, starterReplies()[0])}
        />

        <AskBar
          sticky
          onAttach={() => router.push("/certificate")}
          onSubmit={(value) => {
            const trimmed = value.trim();
            if (!trimmed) return;
            sessionStorage.setItem("dm-ask-q", trimmed);
            sessionStorage.setItem("dm-ask-free", "1");
            router.push("/ask");
          }}
        />
      </div>
    );
  }

  return (
    <HomeHero
      onBook={() => router.push("/me/book")}
      onLesson={() => router.push(lessonPathForPersona())}
    />
  );
}
