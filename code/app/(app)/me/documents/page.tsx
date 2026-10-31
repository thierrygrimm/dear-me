"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** Alias → canonical DocumentVault route */
export default function DocumentsAliasPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/me/docs");
  }, [router]);
  return null;
}
