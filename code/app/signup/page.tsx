"use client";

import { IntakeFlow } from "@/components/auth/IntakeFlow";
import {
  ChooseHowScreen,
  ConnectPaxScreen,
  WelcomeScreen,
  YourMomentsScreen,
  YourPlanScreen,
} from "@/components/auth/SignUp";
import { SigningIn, Splash } from "@/components/brand/Loading";
import { AppShell } from "@/components/layout/AppShell";
import { FlowShell } from "@/components/layout/FlowShell";
import { useDemoPulse } from "@/hooks/useDemoPulse";
import { needsNumericIntake } from "@/lib/lifeMoments";
import { getPersona, readPersonaId } from "@/lib/personas";
import {
  isOnboarded,
  isSignedIn,
  markMoments,
  markOnboarded,
  markSignedIn,
  momentLabels,
  momentsForAge,
  readName,
  type AuthProvider,
  type LifeMoment,
} from "@/lib/session";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

/** Demo ages from personas when myPax (or a try-another-life) name is known. */
const AGE_BY_NAME: Record<string, number> = {
  Lena: 34,
  Noah: 24,
  Sandra: 41,
  Ruth: 61,
};

function ageFromWho(who: string): number | null {
  const m = who.match(/(\d{2})\s*$/);
  return m ? Number(m[1]) : null;
}

function resolveSignupAge(name: string): number | null {
  if (name in AGE_BY_NAME) return AGE_BY_NAME[name];
  const fromPersona = ageFromWho(getPersona(readPersonaId()).who);
  if (name !== "there" && fromPersona != null) return fromPersona;
  return null;
}

type Step =
  | "splash"
  | "welcome"
  | "choose"
  | "connect"
  | "signing"
  | "moments"
  | "plan"
  | "intake";

const signingLabels: Record<AuthProvider, string> = {
  pax: "Signing you in with myPax",
  apple: "Signing you in with Apple",
  google: "Signing you in with Google",
  email: "Signing you in with email",
  guest: "Getting things ready",
};

/** DS Flows: next tap target pulses lime. */
function hintsFor(
  step: Step,
  moments: LifeMoment[],
  firstSuggestLabel?: string,
): string[] {
  switch (step) {
    case "welcome":
      return ["Get started"];
    case "choose":
      return ["myPax"];
    case "connect":
      return ["Continue to myPax"];
    case "moments":
      return moments.length === 0
        ? [firstSuggestLabel ?? "Expecting a child"]
        : ["Continue"];
    case "plan":
      return ["Let's start"];
    default:
      return [];
  }
}

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("splash");
  const [provider, setProvider] = useState<AuthProvider>("pax");
  const [moments, setMoments] = useState<LifeMoment[]>([]);

  const pulseHints = useMemo(() => {
    if (step !== "moments") return hintsFor(step, moments);
    const n = provider === "pax" ? readName() : "there";
    const first = momentsForAge(resolveSignupAge(n)).suggested[0];
    return hintsFor(step, moments, first ? momentLabels[first] : undefined);
  }, [step, moments, provider]);
  const pulseRef = useDemoPulse(pulseHints, [step, moments, provider]);

  useEffect(() => {
    if (isSignedIn() && isOnboarded()) {
      router.replace("/");
      return;
    }
    // Coming from BootGate: splash already played — land on welcome.
    if (sessionStorage.getItem("dm-booted") === "1") {
      setStep("welcome");
      return;
    }
    const t = window.setTimeout(() => {
      sessionStorage.setItem("dm-booted", "1");
      setStep("welcome");
    }, 1400);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (step !== "signing") return;
    const t = window.setTimeout(() => {
      markSignedIn(provider);
      if (provider === "guest") {
        markOnboarded();
        router.replace("/");
        return;
      }
      setStep("moments");
    }, 2400);
    return () => window.clearTimeout(t);
  }, [step, provider, router]);

  function begin(next: AuthProvider) {
    setProvider(next);
    if (next === "pax") {
      setStep("connect");
      return;
    }
    setStep("signing");
  }

  function startPlan() {
    markMoments(moments);
    // Child / working-less: numeric IntakeCard (pensum type/speak).
    if (provider === "pax" && needsNumericIntake(moments)) {
      setStep("intake");
      return;
    }
    markOnboarded();
    // Other life moments: ask before telling in chat (LifeMoments C1).
    if (moments.length > 0) {
      router.replace("/ask");
      return;
    }
    // Outside Pax with no moment: bring in a certificate first.
    if (provider !== "pax") {
      router.replace("/certificate");
      return;
    }
    router.replace("/");
  }

  function finishIntake() {
    markOnboarded();
    router.replace("/");
  }

  if (step === "splash") {
    return (
      <div className="dm-stage dm-app-shell--bleed">
        <Splash />
      </div>
    );
  }

  if (step === "signing") {
    return (
      <div className="dm-stage dm-app-shell--bleed">
        <SigningIn
          label={signingLabels[provider]}
          detail={
            provider === "guest"
              ? "You can look around without an account"
              : "This takes a few seconds"
          }
        />
      </div>
    );
  }

  if (step === "intake") {
    return (
      <IntakeFlow onBack={() => setStep("plan")} onDone={finishIntake} />
    );
  }

  const name = provider === "pax" ? readName() : "there";

  if (step === "choose") {
    return (
      <AppShell variant="signapp" hideNav flush>
        <div ref={pulseRef} style={{ display: "contents" }}>
          <ChooseHowScreen
            onBack={() => setStep("welcome")}
            onPax={() => begin("pax")}
            onApple={() => begin("apple")}
            onGoogle={() => begin("google")}
            onEmail={() => begin("email")}
            onLookAround={() => begin("guest")}
          />
        </div>
      </AppShell>
    );
  }

  if (step === "moments") {
    const age = resolveSignupAge(name);
    return (
      <AppShell variant="onb" hideNav flush>
        <div ref={pulseRef} style={{ display: "contents" }}>
          <YourMomentsScreen
            name={name}
            age={age}
            value={moments}
            onChange={setMoments}
            onBack={() => setStep("choose")}
            onContinue={() => setStep("plan")}
          />
        </div>
      </AppShell>
    );
  }

  function exitFlow() {
    markSignedIn("guest");
    markOnboarded();
    router.replace("/");
  }

  if (step === "welcome") {
    return (
      <AppShell variant="signapp" hideNav flush>
        <div ref={pulseRef} style={{ display: "contents" }}>
          <WelcomeScreen
            onGetStarted={() => setStep("choose")}
            onLogin={() => setStep("choose")}
          />
        </div>
      </AppShell>
    );
  }

  if (step === "connect") {
    return (
      <div ref={pulseRef}>
        <FlowShell
          step="Connect myPax"
          progress={66}
          pane="card"
          onExit={exitFlow}
        >
          <ConnectPaxScreen
            onBack={() => setStep("choose")}
            onContinue={() => setStep("signing")}
            onEmail={() => begin("email")}
          />
        </FlowShell>
      </div>
    );
  }

  if (step === "plan") {
    return (
      <div ref={pulseRef}>
        <FlowShell
          step="Set up your plan · 2 of 3"
          progress={66}
          pane="col"
          onExit={exitFlow}
        >
          <YourPlanScreen
            name={name}
            moments={moments}
            onBack={() => setStep("moments")}
            onStart={startPlan}
          />
        </FlowShell>
      </div>
    );
  }

  return null;
}
