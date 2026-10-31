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
import {
  isSignedIn,
  markMoments,
  markOnboarded,
  markSignedIn,
  readName,
  type AuthProvider,
  type LifeMoment,
} from "@/lib/session";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("splash");
  const [provider, setProvider] = useState<AuthProvider>("pax");
  const [moments, setMoments] = useState<LifeMoment[]>(["child", "less"]);

  useEffect(() => {
    if (isSignedIn() && sessionStorage.getItem("dm-onboarded") === "1") {
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
    if (provider === "pax") {
      setStep("intake");
      return;
    }
    // Outside Pax: bring in a certificate first, then the answer path.
    markOnboarded();
    router.replace("/certificate");
  }

  function finishIntake() {
    markOnboarded();
    router.replace("/compare");
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

  return (
    <div className="dm-signup-shell">
      {step === "welcome" ? (
        <WelcomeScreen
          onGetStarted={() => setStep("choose")}
          onLogin={() => setStep("choose")}
        />
      ) : null}

      {step === "choose" ? (
        <ChooseHowScreen
          onBack={() => setStep("welcome")}
          onPax={() => begin("pax")}
          onApple={() => begin("apple")}
          onGoogle={() => begin("google")}
          onEmail={() => begin("email")}
          onLookAround={() => begin("guest")}
        />
      ) : null}

      {step === "connect" ? (
        <ConnectPaxScreen
          onBack={() => setStep("choose")}
          onContinue={() => setStep("signing")}
          onEmail={() => begin("email")}
        />
      ) : null}

      {step === "moments" ? (
        <YourMomentsScreen
          name={name}
          value={moments}
          onChange={setMoments}
          onBack={() => setStep("choose")}
          onContinue={() => setStep("plan")}
        />
      ) : null}

      {step === "plan" ? (
        <YourPlanScreen
          name={name}
          moments={moments}
          onBack={() => setStep("moments")}
          onStart={startPlan}
        />
      ) : null}
    </div>
  );
}
