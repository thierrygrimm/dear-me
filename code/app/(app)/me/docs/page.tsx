"use client";

import { DocumentVault } from "@/components/data/DocumentVault";
import { PageColumn } from "@/components/layout/PageColumn";

export default function DocumentsPage() {
  return (
    <PageColumn kind="docs">
      <DocumentVault />
    </PageColumn>
  );
}
