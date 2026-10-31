"use client";

import { SignUp } from "@/components/auth/SignUp";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const goHome = () => router.push("/");

  return (
    <div className="dm-app-shell" style={{ padding: 16 }}>
      <SignUp
        onPax={goHome}
        onApple={goHome}
        onGoogle={goHome}
        onEmail={goHome}
        onLookAround={goHome}
      />
    </div>
  );
}
