"use client";

import {
  ChooseHowScreen,
  ConnectPaxScreen,
  MomentScreen,
  WelcomeInScreen,
  WelcomeScreen,
} from "@/components/auth/SignUp";
import { SigningIn, Splash } from "@/components/brand/Loading";
import {
  isSignedIn,
  markMoment,
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
  | "moment"
  | "welcomeIn";

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
  const [moment, setMoment] = useState<LifeMoment>("baby");

  useEffect(() => {
    if (isSignedIn()) {
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
    // router is stable enough for replace; omit from deps so the splash timer is not reset.
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
      setStep("moment");
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

  function finishOnboarding(dest: "/" | "/answer") {
    markMoment(moment);
    markOnboarded();
    router.replace(dest);
  }

  if (step === "splash") {
    return (
      <div className="dm-app-shell" style={{ padding: 0 }}>
        <Splash />
      </div>
    );
  }

  if (step === "signing") {
    return (
      <div className="dm-app-shell" style={{ padding: 0 }}>
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

  return (
    <div className="dm-app-shell" style={{ padding: 16 }}>
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

      {step === "moment" ? (
        <MomentScreen
          value={moment}
          onChange={setMoment}
          onBack={() => setStep("choose")}
          onContinue={() => setStep("welcomeIn")}
        />
      ) : null}

      {step === "welcomeIn" ? (
        <WelcomeInScreen
          name={provider === "pax" ? readName() : "there"}
          pax={provider === "pax"}
          onAsk={() => finishOnboarding(provider === "pax" ? "/answer" : "/")}
          onLater={() => finishOnboarding("/")}
        />
      ) : null}
    </div>
  );
}
