"use client";

import { CertificateFlow } from "@/components/certificate/CertificateFlow";
import { useRouter } from "next/navigation";

export default function CertificatePage() {
  const router = useRouter();

  return (
    <div className="dm-cert-shell">
      <CertificateFlow
        onClose={() => router.push("/")}
        onDone={() => router.push("/answer")}
      />
    </div>
  );
}
