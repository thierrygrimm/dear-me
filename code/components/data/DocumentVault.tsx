"use client";

import { BottomSheet } from "@/components/feedback/BottomSheet";
import { useToast } from "@/components/feedback/Toast";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/cn";
import { copy } from "@/lib/copy";
import {
  FILTERS,
  REQUESTED_DOCS,
  SEED_DOCS,
  TYPE_STRIP,
  UPCOMING_DOCS,
  type DocType,
  type VaultDoc,
} from "@/lib/vaultDocs";
import {
  ArrowLeftRight,
  Camera,
  FileUp,
  KeyRound,
  ScanSearch,
  Share,
  Trash2,
} from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";

function statusClass(doc: VaultDoc): string | undefined {
  if (doc.status === "new") return "new";
  if (doc.status === "old") return "old";
  return undefined;
}

function DocRow({
  doc,
  onClick,
}: {
  doc: VaultDoc;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className={cn(
        "dm-doc",
        doc.missing && "missing",
        doc.reading && "is-reading",
      )}
      data-type={doc.type}
      onClick={onClick}
    >
      <span className="th" aria-hidden>
        {doc.missing ? "+" : null}
        <i style={{ background: doc.strip }} />
      </span>
      <span>
        <b>{doc.title}</b>
        <small>{doc.detail}</small>
      </span>
      {doc.statusLabel ? (
        <em className={statusClass(doc)}>{doc.statusLabel}</em>
      ) : null}
    </button>
  );
}

function AddChoice({
  icon,
  label,
  detail,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  detail: string;
  onClick: () => void;
}) {
  return (
    <button type="button" className="dm-choice" onClick={onClick}>
      {icon}
      <span>
        {label}
        <small>{detail}</small>
      </span>
    </button>
  );
}

type ListProps = {
  docs: VaultDoc[];
  onOpen: (id: string) => void;
  onDocsChange: (docs: VaultDoc[]) => void;
};

/** A · Filterable document list with Add FAB and sheet. */
export function DocumentVaultList({
  docs,
  onOpen,
  onDocsChange,
}: ListProps) {
  const toast = useToast();
  const [filter, setFilter] = useState<DocType | "all">("all");
  const [addOpen, setAddOpen] = useState(false);

  const visible = useMemo(
    () =>
      docs.filter((d) => !d.upcoming && !d.requested).filter((d) => {
        if (filter === "all") return true;
        return d.type === filter;
      }),
    [docs, filter],
  );

  function startAdd(kind: "scan" | "pdf" | "mypax") {
    setAddOpen(false);
    const id = `new-${Date.now()}`;
    const reading: VaultDoc = {
      id,
      type: "ins",
      title: "New document",
      detail: "Reading…",
      statusLabel: "…",
      strip: "var(--line)",
      reading: true,
    };
    onDocsChange([reading, ...docs]);
    void kind;

    window.setTimeout(() => {
      onDocsChange([
        {
          id,
          type: "ins",
          title: "Insurance policy",
          detail: "2026 · 4 values read",
          status: "new",
          statusLabel: "New",
          strip: TYPE_STRIP.ins,
          scannedAt: "scanned just now",
          values: [
            { label: "Cover", value: "CHF 200'000" },
            { label: "Premium / year", value: "480" },
            { label: "Beneficiary", value: "Marco" },
            { label: "Starts", value: "1 Mar 2026" },
          ],
        },
        ...docs,
      ]);
      toast.show({ message: "4 values read" });
    }, 2200);
  }

  async function copyMailbox() {
    const addr = copy.vault.mailbox;
    try {
      await navigator.clipboard.writeText(addr);
    } catch {
      /* demo */
    }
    setAddOpen(false);
    toast.show({ message: copy.vault.copied });
  }

  return (
    <>
      <header className="dm-appbar" style={{ margin: "0 -4px" }}>
        <span style={{ width: 36 }} />
        <b style={{ font: "600 16px/20px var(--font-text)" }}>
          {copy.me.documents}
        </b>
        <span style={{ width: 36 }} />
      </header>

      <div className="dm-filt" role="tablist" aria-label="Document type">
        {FILTERS.map((f) => (
          <Chip
            key={f.id}
            pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </Chip>
        ))}
      </div>

      <div className="dm-stack" style={{ gap: 0 }}>
        {visible.map((d) => (
          <DocRow
            key={d.id}
            doc={d}
            onClick={() => {
              if (!d.missing && !d.reading) onOpen(d.id);
              else if (d.missing) setAddOpen(true);
            }}
          />
        ))}
        {visible.length === 0 ? (
          <p className="dm-docempty">{copy.vault.empty}</p>
        ) : null}
      </div>

      <p className="dm-small dm-muted" style={{ margin: "6px 0 0" }}>
        {copy.vault.stored}
      </p>

      <span className="dm-label" style={{ marginTop: 18 }}>
        {copy.vault.comingUp}
      </span>
      <div className="dm-stack" style={{ gap: 0 }}>
        {UPCOMING_DOCS.map((d) => (
          <DocRow key={d.id} doc={d} onClick={() => setAddOpen(true)} />
        ))}
      </div>

      <span className="dm-label" style={{ marginTop: 14 }}>
        {copy.vault.askedForYou}
      </span>
      <div className="dm-stack" style={{ gap: 0 }}>
        {REQUESTED_DOCS.map((d) => (
          <DocRow key={d.id} doc={d} />
        ))}
      </div>
      <p className="dm-small dm-muted" style={{ margin: "6px 0 72px" }}>
        {copy.vault.remindersNote}
      </p>

      {/* Phone: fixed FAB. Laptop (.pg.docs): CSS lifts this into the header. */}
      <button
        type="button"
        className="dm-fab dm-fab--app"
        onClick={() => setAddOpen(true)}
      >
        <svg viewBox="0 0 24 24" aria-hidden>
          <path d="M12 5v14M5 12h14" />
        </svg>
        {copy.vault.add}
      </button>

      <BottomSheet
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title={copy.vault.addTitle}
      >
        <div className="dm-stack" style={{ gap: 8 }}>
          <AddChoice
            icon={<Camera strokeWidth={1.75} />}
            label={copy.vault.scan}
            detail={copy.vault.scanDetail}
            onClick={() => startAdd("scan")}
          />
          <AddChoice
            icon={<FileUp strokeWidth={1.75} />}
            label={copy.vault.upload}
            detail={copy.vault.uploadDetail}
            onClick={() => startAdd("pdf")}
          />
          <AddChoice
            icon={<KeyRound strokeWidth={1.75} />}
            label={copy.vault.mypax}
            detail={copy.vault.mypaxDetail}
            onClick={() => startAdd("mypax")}
          />
        </div>
        <span className="dm-label" style={{ marginTop: 4 }}>
          {copy.vault.orEmail}
        </span>
        <div className="dm-mailbox">
          <span>{copy.vault.mailbox}</span>
          <Button variant="text" size="sm" onClick={() => void copyMailbox()}>
            {copy.vault.copy}
          </Button>
        </div>
      </BottomSheet>
    </>
  );
}

type DetailProps = {
  doc: VaultDoc;
  onBack: () => void;
  onDeletedPhoto?: () => void;
  className?: string;
};

/** B · One document: preview, actions, values. */
export function DocumentDetail({
  doc,
  onBack,
  onDeletedPhoto,
  className,
}: DetailProps) {
  const router = useRouter();
  const toast = useToast();
  const [delOpen, setDelOpen] = useState(false);
  const [photoGone, setPhotoGone] = useState(false);

  const lines = [70, null, "hl", null, "hl80", null, 60, "hl", null] as const;

  return (
    <div className={cn("dm-vault dm-vault--detail", className)}>
      <header className="dm-appbar" style={{ margin: "0 -4px" }}>
        <button type="button" aria-label={copy.chat.back} onClick={onBack}>
          <svg viewBox="0 0 24 24">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
        <b style={{ font: "600 16px/20px var(--font-text)" }}>{doc.title}</b>
        <span style={{ width: 36 }} />
      </header>

      {!photoGone ? (
        <div className="dm-docview" aria-hidden>
          {doc.title} {doc.detail.split("·")[0]?.trim()}
          {lines.map((l, i) =>
            l === null ? (
              <i key={i} />
            ) : l === "hl" ? (
              <i key={i} className="hl" />
            ) : l === "hl80" ? (
              <i key={i} className="hl" style={{ width: "80%" }} />
            ) : (
              <i key={i} style={{ width: `${l}%` }} />
            ),
          )}
        </div>
      ) : (
        <p className="dm-docempty" style={{ padding: "40px 0" }}>
          {copy.vault.photoDeleted}
        </p>
      )}

      <div className="dm-actions">
        <button type="button" onClick={() => router.push("/certificate")}>
          <span>
            <ScanSearch strokeWidth={1.75} />
          </span>
          {copy.vault.explain}
        </button>
        <button
          type="button"
          onClick={() => toast.show({ message: copy.vault.shareSoon })}
        >
          <span>
            <Share strokeWidth={1.75} />
          </span>
          {copy.vault.share}
        </button>
        <button
          type="button"
          onClick={() => toast.show({ message: copy.vault.replaceSoon })}
        >
          <span>
            <ArrowLeftRight strokeWidth={1.75} />
          </span>
          {copy.vault.replace}
        </button>
        <button
          type="button"
          onClick={() => setDelOpen(true)}
          disabled={photoGone}
        >
          <span>
            <Trash2 strokeWidth={1.75} />
          </span>
          {copy.vault.deletePhoto}
        </button>
      </div>

      {doc.values && doc.values.length > 0 ? (
        <div>
          <span className="dm-label">
            {copy.vault.whatWeRead}
            {doc.scannedAt ? ` · ${doc.scannedAt}` : ""}
          </span>
          <div className="dm-vals">
            {doc.values.map((v) => (
              <div key={v.label}>
                {v.label}
                <b>{v.value}</b>
              </div>
            ))}
          </div>
          <Button variant="text" size="sm" style={{ marginTop: 6 }}>
            {copy.vault.seeAll(doc.values.length)}
          </Button>
        </div>
      ) : null}

      <BottomSheet
        open={delOpen}
        onClose={() => setDelOpen(false)}
        title={copy.vault.deleteTitle}
        description={copy.vault.deleteBody}
      >
        <Button
          variant="danger"
          block
          onClick={() => {
            setDelOpen(false);
            setPhotoGone(true);
            onDeletedPhoto?.();
            toast.show({ message: copy.vault.deleteDone });
          }}
        >
          {copy.vault.deletePhoto}
        </Button>
        <Button variant="secondary" block onClick={() => setDelOpen(false)}>
          {copy.vault.keepPhoto}
        </Button>
      </BottomSheet>
    </div>
  );
}

/** Full vault screen: list or detail. */
export function DocumentVault({ className }: { className?: string }) {
  const [docs, setDocs] = useState<VaultDoc[]>(SEED_DOCS);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = docs.find((d) => d.id === selectedId) ?? null;

  if (selected) {
    return (
      <DocumentDetail
        doc={selected}
        onBack={() => setSelectedId(null)}
        className={className}
      />
    );
  }

  return (
    <DocumentVaultList
      docs={docs}
      onOpen={setSelectedId}
      onDocsChange={setDocs}
    />
  );
}
