"use client";

import { BottomSheet } from "@/components/feedback/BottomSheet";
import { useToast } from "@/components/feedback/Toast";
import { Button } from "@/components/ui/Button";
import { copy } from "@/lib/copy";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PrivacyPage() {
  const router = useRouter();
  const toast = useToast();
  const [share, setShare] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <div className="dm-row" style={{ alignItems: "center" }}>
        <button
          type="button"
          className="dm-cert-back"
          aria-label="Back"
          onClick={() => router.push("/me")}
        >
          <svg viewBox="0 0 24 24" aria-hidden>
            <path
              d="M15 5l-7 7 7 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h1 className="dm-hello" style={{ fontSize: 24, margin: 0 }}>
          {copy.me.privacy}
        </h1>
      </div>
      <p className="dm-muted" style={{ margin: 0 }}>
        Every share starts off. You turn things on.
      </p>

      <div className="dm-stack" style={{ gap: 0 }}>
        {(
          [
            {
              id: "share",
              title: "Share with Pax",
              sub: "Off by default",
              checked: share,
              onToggle: setShare,
            },
            {
              id: "analytics",
              title: "Anonymous product analytics",
              sub: "Helps us improve, never sold",
              checked: analytics,
              onToggle: setAnalytics,
            },
          ] as const
        ).map((row) => (
          <label
            key={row.id}
            className="dm-li"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 12,
              alignItems: "center",
              padding: "14px 0",
              borderBottom: "1px solid var(--line)",
            }}
          >
            <span>
              <b style={{ display: "block", font: "600 15px/20px var(--font-text)" }}>
                {row.title}
              </b>
              <small className="dm-muted">{row.sub}</small>
            </span>
            <input
              type="checkbox"
              role="switch"
              checked={row.checked}
              onChange={(e) => row.onToggle(e.target.checked)}
              style={{ width: 44, height: 28 }}
            />
          </label>
        ))}
      </div>

      <Button variant="danger" block onClick={() => setDeleteOpen(true)}>
        Delete everything
      </Button>

      <BottomSheet
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete everything?"
        description="You have 7 days to Undo. After that, it's gone for good."
      >
        <Button
          variant="danger"
          block
          onClick={() => {
            setDeleteOpen(false);
            toast.show({
              message: "Deletion scheduled · 7 days",
              undoLabel: copy.toast.undo,
              onUndo: () =>
                toast.show({ message: "Kept. Nothing was deleted." }),
            });
          }}
        >
          Schedule deletion
        </Button>
        <Button variant="text" block onClick={() => setDeleteOpen(false)}>
          Keep my data
        </Button>
      </BottomSheet>
    </>
  );
}
