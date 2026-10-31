"use client";

import { SignUp } from "@/components/auth/SignUp";
import { SigningIn } from "@/components/brand/Loading";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Provider = "pax" | "apple" | "google" | "email" | "guest";

const labels: Record<Provider, string> = {
  pax: "Signing you in with myPax",
  apple: "Signing you in with Apple",
  google: "Signing you in with Google",
  email: "Signing you in with email",
  guest: "Getting things ready",
};

export default function SignUpPage() {
  const router = useRouter();
  const [signing, setSigning] = useState<Provider | null>(null);

  function begin(provider: Provider) {
    setSigning(provider);
    window.setTimeout(() => {
      sessionStorage.setItem("dm-booted", "1");
      sessionStorage.setItem("dm-signed-in", "1");
      router.push("/");
    }, 2400);
  }

  if (signing) {
    return (
      <div className="dm-app-shell" style={{ padding: 0 }}>
        <SigningIn
          label={labels[signing]}
          detail={
            signing === "guest"
              ? "You can look around without an account"
              : "This takes a few seconds"
          }
        />
      </div>
    );
  }

  return (
    <div className="dm-app-shell" style={{ padding: 16 }}>
      <SignUp
        onPax={() => begin("pax")}
        onApple={() => begin("apple")}
        onGoogle={() => begin("google")}
        onEmail={() => begin("email")}
        onLookAround={() => begin("guest")}
      />
    </div>
  );
}
