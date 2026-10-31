"use client";

import { AdvisorBooking } from "@/components/auth/AdvisorBooking";
import { useRouter } from "next/navigation";

export default function BookPage() {
  const router = useRouter();
  return (
    <div className="dm-signup-shell">
      <AdvisorBooking
        onBack={() => router.back()}
        onBooked={() => router.push("/plan")}
      />
    </div>
  );
}
