"use client";

import { CertificateFlow } from "@/components/certificate/CertificateFlow";
import { useRouter } from "next/navigation";

export default function CertificatePage() {
  const router = useRouter();

  return (
    <div className="dm-app-shell">
      <main className="dm-app-main" style={{ paddingBottom: 24 }}>
        <CertificateFlow
          onClose={() => router.push("/")}
          onEstimate={() => {
            sessionStorage.setItem("dm-estimate-ok", "1");
            router.push("/answer");
          }}
          onDone={() => router.push("/answer")}
        />
      </main>
    </div>
  );
}
