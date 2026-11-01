"use client";

import { copy } from "@/lib/copy";

/** Desktop empty detail when You list is open; hidden on phone (list-only). */
export default function MePage() {
  return (
    <div className="me-desk-empty">
      <p className="dm-muted" style={{ margin: 0 }}>
        {copy.settings.meDeskEmpty}
      </p>
    </div>
  );
}
