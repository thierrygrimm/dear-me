"use client";

import { AdvisorBooking } from "@/components/auth/AdvisorBooking";
import { PageColumn } from "@/components/layout/PageColumn";
import { useRouter } from "next/navigation";

export default function BookPage() {
  const router = useRouter();
  return (
    <PageColumn kind="book">
      <AdvisorBooking
        onBack={() => router.push("/me")}
        onBooked={() => router.push("/plan")}
      />
    </PageColumn>
  );
}
