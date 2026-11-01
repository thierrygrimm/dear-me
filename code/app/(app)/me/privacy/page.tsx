"use client";

import { BottomSheet } from "@/components/feedback/BottomSheet";
import { useToast } from "@/components/feedback/Toast";
import { PageColumn } from "@/components/layout/PageColumn";
import { useRouter } from "next/navigation";
import { useState, type ReactNode, type SVGProps } from "react";

function Icon({ children, ...rest }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...rest}>
      {children}
    </svg>
  );
}

function Chevron() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden>
      <path d="M6 3l5 5-5 5" />
    </svg>
  );
}

function SwitchRow({
  icon,
  title,
  subtitle,
  checked,
  onToggle,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  checked: boolean;
  onToggle: (next: boolean) => void;
}) {
  return (
    <div className="dm-li">
      <span className="ic">{icon}</span>
      <span className="tx">
        {title}
        <small>{subtitle}</small>
      </span>
      <span className="rt">
        <button
          type="button"
          className="dm-switch"
          role="switch"
          aria-checked={checked}
          aria-label={title}
          onClick={() => onToggle(!checked)}
        />
      </span>
    </div>
  );
}

/** DS Settings B · Privacy and data (opens from A). */
export default function PrivacyPage() {
  const router = useRouter();
  const toast = useToast();
  const [advisor, setAdvisor] = useState(false);
  const [partner, setPartner] = useState(true);
  const [chats, setChats] = useState(true);
  const [analytics, setAnalytics] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  return (
    <PageColumn kind="plan">
      <header className="dm-appbar" style={{ margin: "0 -4px" }}>
        <button
          type="button"
          aria-label="Back"
          onClick={() => router.push("/me")}
        >
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <b style={{ font: "600 16px/20px var(--font-text)" }}>
          Privacy and data
        </b>
        <span style={{ width: 36 }} />
      </header>

      <p style={{ margin: 0, font: "700 22px/27px var(--font-display)" }}>
        Your data stays yours.
      </p>
      <p className="dm-small dm-muted" style={{ margin: "4px 0 0" }}>
        We never sell it. Sharing is off until you turn it on.
      </p>

      <p className="dm-lgroup">Who sees it</p>
      <SwitchRow
        title="Your advisor"
        subtitle="Only the summary you share"
        checked={advisor}
        onToggle={setAdvisor}
        icon={
          <Icon>
            <path d="M4 5h16v11H9l-5 4z" />
          </Icon>
        }
      />
      <SwitchRow
        title="Marco"
        subtitle="Shared plans, not your salary"
        checked={partner}
        onToggle={setPartner}
        icon={
          <Icon>
            <circle cx="9" cy="8" r="3.5" />
            <circle cx="17" cy="9" r="2.5" />
            <path d="M3 20c1-3.5 3.5-5 6-5s5 1.5 6 5M15 15c2.5 0 4.5 1.5 5.5 4" />
          </Icon>
        }
      />

      <p className="dm-lgroup">How we use it</p>
      <SwitchRow
        title="Remember chats"
        subtitle="For faster answers"
        checked={chats}
        onToggle={setChats}
        icon={
          <Icon>
            <path d="M4 5h16v11H9l-5 4z" />
          </Icon>
        }
      />
      <SwitchRow
        title="Anonymous usage"
        subtitle="Never your numbers"
        checked={analytics}
        onToggle={setAnalytics}
        icon={
          <Icon>
            <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
            <circle cx="12" cy="12" r="3" />
          </Icon>
        }
      />

      <p className="dm-lgroup">Your data</p>
      <button
        type="button"
        className="dm-li"
        onClick={() => router.push("/me/know")}
      >
        <span className="ic">
          <Icon>
            <path d="M12 3l9 9-9 9-9-9z" />
          </Icon>
        </span>
        <span className="tx">
          See and correct
          <small>18 facts</small>
        </span>
        <span className="rt">
          <Chevron />
        </span>
      </button>
      <button
        type="button"
        className="dm-li"
        disabled={downloading}
        onClick={() => {
          setDownloading(true);
          toast.show({ message: "Preparing your PDF…" });
          window.setTimeout(() => {
            try {
              const blob = new Blob(
                [
                  "dear me · your data export\n\nDemo PDF. In the real app this is your facts and documents.",
                ],
                { type: "application/pdf" },
              );
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "dear-me-data.pdf";
              a.click();
              URL.revokeObjectURL(url);
            } catch {
              /* ignore */
            }
            setDownloading(false);
            toast.show({ message: "PDF downloaded." });
          }, 900);
        }}
      >
        <span className="ic">
          <Icon>
            <path d="M12 4v11M7 10l5 5 5-5M5 20h14" />
          </Icon>
        </span>
        <span className="tx">
          Download
          {downloading ? <small>Preparing…</small> : null}
        </span>
        <span className="rt">
          PDF
          <Chevron />
        </span>
      </button>
      <button
        type="button"
        className="dm-li danger"
        onClick={() => setDeleteOpen(true)}
      >
        <span className="ic">
          <Icon>
            <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
          </Icon>
        </span>
        <span className="tx">
          Delete everything
          <small>Account, facts, documents, chats</small>
        </span>
        <span className="rt">
          <Chevron />
        </span>
      </button>

      <BottomSheet
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete everything?"
      >
        <p style={{ margin: "0 0 8px" }}>
          This removes your 18 facts, 4 documents, your chats and your account.
          Marco keeps his own data.
        </p>
        <p style={{ margin: "0 0 16px" }}>
          You have 7 days to change your mind. After that it&apos;s gone for
          good, also at Pax.
        </p>
        <button
          type="button"
          className="dm-btn dm-btn--danger dm-btn--block"
          onClick={() => {
            setDeleteOpen(false);
            toast.show({
              message: "Deleting on 7 Nov",
              undoLabel: "Undo",
              onUndo: () => toast.show({ message: "Undone" }),
            });
          }}
        >
          Delete everything
        </button>
        <button
          type="button"
          className="dm-btn dm-btn--secondary dm-btn--block"
          style={{ marginTop: 8 }}
          onClick={() => setDeleteOpen(false)}
        >
          Keep my data
        </button>
      </BottomSheet>
    </PageColumn>
  );
}
