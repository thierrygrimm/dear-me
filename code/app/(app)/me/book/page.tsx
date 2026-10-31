"use client";

import { AdvisorBooking } from "@/components/auth/AdvisorBooking";
import { useRouter } from "next/navigation";

export default function BookPage() {
  const router = useRouter();
  return <AdvisorBooking onBooked={() => router.push("/plan")} />;
}
