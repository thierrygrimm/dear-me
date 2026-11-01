"use client";

import { BottomSheet } from "@/components/feedback/BottomSheet";
import { useToast } from "@/components/feedback/Toast";
import { Button } from "@/components/ui/Button";
import { NumberEdit } from "@/components/ui/NumberEdit";
import { cn } from "@/lib/cn";
import { formatSwiss } from "@/lib/format";
import { ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

export type KnowFact = {
  id: string;
  label: string;
  value: string;
  unit?: string;
  source: "you" | "doc" | "est" | "calc";
  sourceLabel: string;
  section: string;
  editable?: boolean;
  estimated?: boolean;
  numeric?: boolean;
};

const DEFAULT_FACTS: KnowFact[] = [
  {
    id: "baby",
    label: "Baby due",
    value: "March",
    unit: "2027",
    source: "you",
    sourceLabel: "You told us",
    section: "Plans",
    editable: false,
  },
  {
    id: "after",
    label: "Workload after the baby",
    value: "60",
    unit: "%",
    source: "you",
    sourceLabel: "You told us",
    section: "Plans",
    editable: true,
    numeric: true,
  },
  {
    id: "pensum",
    label: "Pensum today",
    value: "100",
    unit: "%",
    source: "doc",
    sourceLabel: "myPax",
    section: "Cover",
    editable: true,
    numeric: true,
  },
  {
    id: "salary",
    label: "Insured salary",
    value: "61365",
    unit: "CHF",
    source: "doc",
    sourceLabel: "Certificate",
    section: "Cover",
    editable: true,
    numeric: true,
  },
  {
    id: "pension",
    label: "Pension at 65",
    value: "1680",
    unit: "CHF / month",
    source: "calc",
    sourceLabel: "Calculated",
    section: "Cover",
    editable: false,
  },
  {
    id: "3a",
    label: "Pillar 3a saved",
    value: "18000",
    unit: "CHF",
    source: "est",
    sourceLabel: "Estimated",
    section: "Savings",
    editable: true,
    numeric: true,
    estimated: true,
  },
];

type Props = {
  facts?: KnowFact[];
  className?: string;
};

export function WhatWeKnow({ facts: initial = DEFAULT_FACTS, className }: Props) {
  const toast = useToast();
  const [facts, setFacts] = useState(initial);
  const [queue, setQueue] = useState(
    () => initial.filter((f) => f.estimated).map((f) => f.id),
  );
  const [editing, setEditing] = useState<KnowFact | null>(null);
  const [draft, setDraft] = useState("");
  const [flashId, setFlashId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [openSection, setOpenSection] = useState<string>("Plans");

  const sections = useMemo(() => {
    const map = new Map<string, KnowFact[]>();
    for (const f of facts) {
      if (
        query &&
        !`${f.label} ${f.value} ${f.sourceLabel}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ) {
        continue;
      }
      const list = map.get(f.section) ?? [];
      list.push(f);
      map.set(f.section, list);
    }
    return Array.from(map.entries());
  }, [facts, query]);

  const pending = facts.find((f) => f.id === queue[0]);

  function openEdit(fact: KnowFact) {
    if (fact.source === "calc") {
      toast.show({
        message: "Calculated by the fund. Change salary or pensum instead.",
      });
      return;
    }
    if (!fact.editable && !fact.estimated) return;
    setEditing(fact);
    setDraft(fact.value);
  }

  function saveEdit() {
    if (!editing || draft === editing.value) return;
    setFacts((prev) =>
      prev.map((f) =>
        f.id === editing.id
          ? {
              ...f,
              value: draft,
              source: "you",
              sourceLabel: "Corrected by you · Undo",
              estimated: false,
            }
          : f,
      ),
    );
    setQueue((q) => q.filter((id) => id !== editing.id));
    setFlashId(editing.id);
    window.setTimeout(() => setFlashId(null), 700);
    setEditing(null);
    toast.show({
      message: "Answers recalculated",
      undoLabel: "See",
    });
  }

  function confirmEstimate(id: string, yes: boolean) {
    if (!yes) {
      const fact = facts.find((f) => f.id === id);
      if (fact) openEdit(fact);
      return;
    }
    setFacts((prev) =>
      prev.map((f) =>
        f.id === id
          ? { ...f, estimated: false, source: "you", sourceLabel: "You confirmed" }
          : f,
      ),
    );
    setQueue((q) => q.filter((x) => x !== id));
  }

  return (
    <section className={cn("dm-wwk", className)}>
      <h2>What we know</h2>
      <p className="intro">
        {facts.length} facts. Correct anything — we keep the original.
      </p>

      {pending ? (
        <>
          <h3>One quick question</h3>
          <div className="dm-queue">
            <div className="dm-check cur dm-card" style={{ display: "flex", flexDirection: "column", gap: 10, padding: 14 }}>
              <span className="dm-small dm-muted">
                1 of {Math.max(queue.length, 1)}
              </span>
              <b style={{ font: "600 16px/22px var(--font-text)" }}>
                Is {pending.label.toLowerCase()} about{" "}
                {pending.unit === "CHF" || pending.unit?.startsWith("CHF")
                  ? `CHF ${formatSwiss(Number(pending.value) || 0)}`
                  : `${pending.value}${pending.unit ? ` ${pending.unit}` : ""}`}
                ?
              </b>
              <div className="dm-row" style={{ gap: 8 }}>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => confirmEstimate(pending.id, true)}
                >
                  Yes
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => confirmEstimate(pending.id, false)}
                >
                  Fix
                </Button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p className="dm-small dm-muted" style={{ margin: "8px 0 0" }}>
          All checked for now.
        </p>
      )}

      <input
        className="dm-fsearch"
        type="search"
        placeholder="Search facts"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          marginTop: 12,
          width: "100%",
          boxSizing: "border-box",
          padding: "12px 14px",
          borderRadius: 14,
          border: "none",
          background: "var(--tonal)",
          font: "500 15px/20px var(--font-text)",
        }}
      />

      {sections.map(([title, rows]) => {
        const open = openSection === title || !!query;
        return (
          <section key={title} className={cn("dm-acc", open && "open")}>
            <button
              type="button"
              className="hd"
              aria-expanded={open}
              onClick={() => setOpenSection(open && !query ? "" : title)}
            >
              <span className="ic" aria-hidden />
              <span>
                <b>{title}</b>
                <small>
                  {rows.length} facts · {rows[0]?.sourceLabel}
                </small>
              </span>
              <ChevronRight strokeWidth={2} />
            </button>
            <div className="bd">
              <div>
                {rows.map((fact) => (
                  <button
                    key={fact.id}
                    type="button"
                    className={cn(
                      "dm-fact",
                      "dm-fx",
                      fact.estimated && "est",
                      fact.source === "calc" && "is-calc",
                      flashId === fact.id && "flash",
                    )}
                    onClick={() => openEdit(fact)}
                  >
                    <span className="l">{fact.label}</span>
                    <span className="v">
                      <span>
                        {fact.numeric && fact.unit !== "%"
                          ? formatSwiss(Number(fact.value) || 0)
                          : fact.value}
                      </span>
                      {fact.unit ? <small>{fact.unit}</small> : null}
                    </span>
                    <span className="s">
                      <i
                        className={
                          fact.source === "you"
                            ? "you"
                            : fact.source === "doc"
                              ? "doc"
                              : fact.source === "est"
                                ? "est"
                                : undefined
                        }
                      />
                      {fact.sourceLabel}
                    </span>
                    {fact.source === "calc" ? (
                      <span className="calc">Calculated</span>
                    ) : fact.editable || fact.estimated ? (
                      <ChevronRight strokeWidth={2} aria-hidden />
                    ) : (
                      <span />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <BottomSheet
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.label}
      >
        {editing ? (
          <NumberEdit
            value={draft}
            onChange={setDraft}
            unit={editing.unit}
            wasLabel={`${editing.value}${editing.unit ? ` ${editing.unit}` : ""}`}
            allowDecimal={editing.unit !== "%"}
            maxLength={editing.unit === "%" ? 3 : 10}
            onCancel={() => setEditing(null)}
            onSave={saveEdit}
            saveDisabled={draft === editing.value || !draft}
          />
        ) : null}
      </BottomSheet>
    </section>
  );
}
