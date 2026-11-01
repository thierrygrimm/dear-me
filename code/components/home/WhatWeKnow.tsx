"use client";

import { BottomSheet } from "@/components/feedback/BottomSheet";
import { useToast } from "@/components/feedback/Toast";
import { Button } from "@/components/ui/Button";
import { NumberEdit } from "@/components/ui/NumberEdit";
import { cn } from "@/lib/cn";
import { formatSwiss } from "@/lib/format";
import { useMemo, useState, type ReactNode } from "react";

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
  question?: string;
  estimateNote?: string;
  conflict?: { a: string; aSource: string; b: string; bSource: string };
};

type QueueItem =
  | { kind: "estimate"; id: string }
  | { kind: "conflict"; id: string };

const SECTION_META: Record<
  string,
  { summary: (n: number) => string; icon: ReactNode }
> = {
  Plans: {
    summary: (n) => `${n} facts · you told us`,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 10h18M8 3v4M16 3v4" />
      </svg>
    ),
  },
  Work: {
    summary: (n) => `${n} facts · from myPax`,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M9 7V4h6v3" />
      </svg>
    ),
  },
  "Pension fund": {
    summary: (n) => `${n} facts · certificate 2026`,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M6 3h8l4 4v14H6z" />
        <path d="M14 3v4h4" />
      </svg>
    ),
  },
  "Pillar 3a": {
    summary: (n) => `${n} facts · from myPax`,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M6 10h12a6 7 0 0 1-6 10 6 7 0 0 1-6-10z" />
        <rect x="5" y="6" width="14" height="4" rx="2" />
      </svg>
    ),
  },
  You: {
    summary: (n) => `${n} facts`,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6" />
      </svg>
    ),
  },
  Cover: {
    summary: (n) => `${n} facts · certificate`,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M6 3h8l4 4v14H6z" />
        <path d="M14 3v4h4" />
      </svg>
    ),
  },
  Savings: {
    summary: (n) => `${n} facts · estimated`,
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M6 10h12a6 7 0 0 1-6 10 6 7 0 0 1-6-10z" />
        <rect x="5" y="6" width="14" height="4" rx="2" />
      </svg>
    ),
  },
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
  },
  {
    id: "after",
    label: "Workload after the baby",
    value: "60",
    unit: "%",
    source: "you",
    sourceLabel: "You said it · 26 Oct",
    section: "Plans",
    editable: true,
    numeric: true,
  },
  {
    id: "who",
    label: "Who reduces",
    value: "Lena",
    source: "you",
    sourceLabel: "You told us",
    section: "Plans",
  },
  {
    id: "salary",
    label: "Salary",
    value: "92000",
    unit: "CHF",
    source: "doc",
    sourceLabel: "From myPax",
    section: "Work",
    editable: true,
    numeric: true,
    conflict: {
      a: "92'000",
      aSource: "From myPax · updated 1 Oct",
      b: "88'400",
      bSource: "You said in a chat · 14 Oct",
    },
  },
  {
    id: "pensum",
    label: "Workload today",
    value: "100",
    unit: "%",
    source: "you",
    sourceLabel: "You told us · 26 Oct",
    section: "Work",
    editable: true,
    numeric: true,
  },
  {
    id: "employer",
    label: "Employer",
    value: "Novartis",
    source: "doc",
    sourceLabel: "From myPax",
    section: "Work",
  },
  {
    id: "since",
    label: "Since",
    value: "2019",
    source: "doc",
    sourceLabel: "From myPax",
    section: "Work",
  },
  {
    id: "marco",
    label: "Marco's salary",
    value: "95000",
    unit: "CHF",
    source: "est",
    sourceLabel: "Estimated",
    section: "Work",
    editable: true,
    numeric: true,
    estimated: true,
    question: "Does Marco earn about",
    estimateNote: "We estimated this from his job",
  },
  {
    id: "kids",
    label: "Children planned",
    value: "2",
    source: "est",
    sourceLabel: "You mentioned it once",
    section: "Plans",
    editable: true,
    numeric: true,
    estimated: true,
    question: "Is",
    estimateNote: "You mentioned it once",
  },
  {
    id: "savings",
    label: "Savings today",
    value: "84300",
    unit: "CHF",
    source: "doc",
    sourceLabel: "Certificate 2026",
    section: "Pension fund",
    editable: true,
    numeric: true,
  },
  {
    id: "insured",
    label: "Insured salary",
    value: "61365",
    unit: "CHF",
    source: "doc",
    sourceLabel: "Certificate 2026",
    section: "Pension fund",
    editable: true,
    numeric: true,
  },
  {
    id: "conversion",
    label: "Conversion rate",
    value: "6.0",
    unit: "%",
    source: "doc",
    sourceLabel: "Certificate 2026",
    section: "Pension fund",
    editable: true,
    numeric: true,
  },
  {
    id: "pension",
    label: "Pension at 65",
    value: "1680",
    unit: "/ mo",
    source: "calc",
    sourceLabel: "Your fund projects this",
    section: "Pension fund",
    numeric: true,
  },
  {
    id: "buyin",
    label: "Buy-in potential",
    value: "42800",
    unit: "CHF",
    source: "calc",
    sourceLabel: "Your fund calculates this",
    section: "Pension fund",
    numeric: true,
  },
  {
    id: "3a",
    label: "Balance",
    value: "18250",
    unit: "CHF",
    source: "doc",
    sourceLabel: "From myPax",
    section: "Pillar 3a",
    editable: true,
    numeric: true,
  },
  {
    id: "3a-paid",
    label: "Paid in this year",
    value: "3000",
    unit: "CHF",
    source: "doc",
    sourceLabel: "From myPax",
    section: "Pillar 3a",
    editable: true,
    numeric: true,
  },
  {
    id: "age",
    label: "Age",
    value: "34",
    unit: "years",
    source: "doc",
    sourceLabel: "From myPax",
    section: "You",
    editable: true,
    numeric: true,
  },
  {
    id: "partner",
    label: "Partner",
    value: "Marco",
    source: "you",
    sourceLabel: "You told us",
    section: "You",
  },
];

function buildQueue(facts: KnowFact[]): QueueItem[] {
  const items: QueueItem[] = [];
  for (const f of facts) {
    if (f.estimated) items.push({ kind: "estimate", id: f.id });
  }
  for (const f of facts) {
    if (f.conflict) items.push({ kind: "conflict", id: f.id });
  }
  return items.slice(0, 3);
}

function formatFactValue(fact: KnowFact) {
  if (fact.numeric && fact.unit !== "%" && fact.unit !== "years") {
    return formatSwiss(Number(fact.value) || 0);
  }
  return fact.value;
}

function questionFor(fact: KnowFact) {
  const amount = formatFactValue(fact);
  if (fact.id === "kids") {
    return (
      <>
        Is <b>{amount} children</b> your plan in the long run?
      </>
    );
  }
  if (fact.unit === "CHF" || fact.unit?.startsWith("CHF")) {
    return (
      <>
        {fact.question ?? `Is ${fact.label.toLowerCase()} about`}{" "}
        <b>CHF {amount}</b>?
      </>
    );
  }
  if (fact.unit === "%") {
    return (
      <>
        {fact.question ?? `Is ${fact.label.toLowerCase()}`} <b>{amount}%</b>?
      </>
    );
  }
  return (
    <>
      {fact.question ?? `Is ${fact.label.toLowerCase()}`} <b>{amount}</b>
      {fact.unit ? ` ${fact.unit}` : ""}?
    </>
  );
}

type Props = {
  facts?: KnowFact[];
  className?: string;
};

export function WhatWeKnow({ facts: initial = DEFAULT_FACTS, className }: Props) {
  const toast = useToast();
  const [facts, setFacts] = useState(initial);
  const [queue, setQueue] = useState<QueueItem[]>(() => buildQueue(initial));
  const [queueIndex, setQueueIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [thanks, setThanks] = useState<string | null>(null);
  const [editing, setEditing] = useState<KnowFact | null>(null);
  const [draft, setDraft] = useState("");
  const [flashId, setFlashId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [openSection, setOpenSection] = useState<string>("Plans");
  const [conflictOpen, setConflictOpen] = useState(false);
  const [conflictPick, setConflictPick] = useState<"a" | "b">("a");
  const [why, setWhy] = useState<"p65" | "buy" | null>(null);

  const queueTotal = queue.length;
  const current = queue[queueIndex] ?? null;
  const queueDone = queueTotal === 0 || queueIndex >= queueTotal;

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

  const anyResults = sections.length > 0;

  function advance(message: string) {
    setThanks(message);
    setLeaving(true);
    window.setTimeout(() => {
      setLeaving(false);
      setThanks(null);
      setQueueIndex((i) => i + 1);
    }, 700);
  }

  function openEdit(fact: KnowFact) {
    if (fact.source === "calc") {
      setWhy(fact.id === "buyin" ? "buy" : "p65");
      return;
    }
    if (!fact.editable && !fact.estimated) return;
    setEditing(fact);
    setDraft(fact.value);
  }

  function saveEdit() {
    if (!editing || draft === editing.value) return;
    const id = editing.id;
    setFacts((prev) =>
      prev.map((f) =>
        f.id === id
          ? {
              ...f,
              value: draft,
              source: "you",
              sourceLabel: "Corrected by you · Undo",
              estimated: false,
              conflict: undefined,
            }
          : f,
      ),
    );
    setFlashId(id);
    window.setTimeout(() => setFlashId(null), 700);
    setEditing(null);
    toast.show({
      message: "Updated · answers recalculated",
      undoLabel: "See",
    });
    if (current?.kind === "estimate" && current.id === id && !leaving) {
      advance("Thanks, updated.");
    }
  }

  function confirmEstimate(id: string) {
    setFacts((prev) =>
      prev.map((f) =>
        f.id === id
          ? {
              ...f,
              estimated: false,
              source: "you",
              sourceLabel: "Confirmed by you",
            }
          : f,
      ),
    );
    setFlashId(id);
    window.setTimeout(() => setFlashId(null), 700);
    advance("Thanks, confirmed.");
  }

  function resolveConflict() {
    const fact = facts.find((f) => f.id === current?.id);
    if (!fact?.conflict) return;
    const picked =
      conflictPick === "a"
        ? fact.conflict.a.replace(/'/g, "")
        : fact.conflict.b.replace(/'/g, "");
    setFacts((prev) =>
      prev.map((f) =>
        f.id === fact.id
          ? {
              ...f,
              value: picked,
              source: "you",
              sourceLabel: "Chosen by you",
              conflict: undefined,
            }
          : f,
      ),
    );
    setConflictOpen(false);
    setFlashId(fact.id);
    window.setTimeout(() => setFlashId(null), 700);
    toast.show({ message: "Salary set to your choice" });
    advance("Thanks, salary set.");
  }

  const conflictFact = facts.find((f) => f.id === current?.id && f.conflict);

  return (
    <section className={cn("dm-wwk", className)}>
      <h2>What we know</h2>
      <p className="intro">
        {facts.length} facts we use for your answers. Tap one to correct it.
      </p>

      {!queueDone ? (
        <>
          <div className="dm-qhead">
            <b>One quick question</b>
            <span>
              {Math.min(queueIndex + 1, queueTotal)} of {queueTotal}
            </span>
          </div>
          <div className="dm-queue">
            {queue.map((item, i) => {
              const fact = facts.find((f) => f.id === item.id);
              if (!fact) return null;
              const isCur = i === queueIndex;
              const isGone = i < queueIndex;

              if (item.kind === "conflict") {
                return (
                  <div
                    key={item.id}
                    className={cn(
                      "dm-fact dm-check",
                      isCur && "cur",
                      isGone && "gone",
                    )}
                    style={isCur && !leaving ? { cursor: "pointer" } : undefined}
                    onClick={() => {
                      if (!isCur || leaving) return;
                      setConflictPick("a");
                      setConflictOpen(true);
                    }}
                  >
                    <span className="q">
                      {thanks && isCur ? (
                        thanks
                      ) : (
                        <>
                          Your salary: <b>{fact.conflict?.a}</b> or{" "}
                          <b>{fact.conflict?.b}</b>?
                        </>
                      )}
                    </span>
                    <span className="s">myPax and a chat disagree</span>
                    {!(thanks && isCur) ? (
                      <span className="ok">
                        <button type="button" className="y">
                          Choose
                        </button>
                      </span>
                    ) : null}
                  </div>
                );
              }

              return (
                <div
                  key={item.id}
                  className={cn(
                    "dm-fact dm-check est",
                    isCur && "cur",
                    isGone && "gone",
                  )}
                >
                  <span className="q">
                    {thanks && isCur ? thanks : questionFor(fact)}
                  </span>
                  <span className="s">
                    {fact.estimateNote ?? fact.sourceLabel}
                  </span>
                  <span className="val" style={{ display: "none" }}>
                    {formatFactValue(fact)}
                  </span>
                  {!(thanks && isCur) ? (
                    <span className="ok">
                      <button
                        type="button"
                        className="y"
                        onClick={() => confirmEstimate(fact.id)}
                      >
                        Yes, right
                      </button>
                      <button type="button" onClick={() => openEdit(fact)}>
                        Change
                      </button>
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="dm-allgood show">
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M5 12.5l4.5 4.5L19 7" />
          </svg>
          All checked. Thanks!
        </div>
      )}

      <label className="dm-fsearch">
        <svg viewBox="0 0 24 24" aria-hidden>
          <circle cx="11" cy="11" r="6.5" />
          <path d="M16 16l4 4" />
        </svg>
        <input
          type="search"
          placeholder="Search facts, e.g. salary"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search facts"
        />
      </label>

      <div>
        {sections.map(([title, rows]) => {
          const open = openSection === title || !!query;
          const meta = SECTION_META[title];
          return (
            <section key={title} className={cn("dm-acc", open && "open")}>
              <button
                type="button"
                className="hd"
                aria-expanded={open}
                onClick={() => setOpenSection(open && !query ? "" : title)}
              >
                <span className="ic" aria-hidden>
                  {meta?.icon ?? (
                    <svg viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="7" />
                    </svg>
                  )}
                </span>
                <span>
                  <b>{title}</b>
                  <small>
                    {meta?.summary(rows.length) ?? `${rows.length} facts`}
                  </small>
                </span>
                <svg viewBox="0 0 16 16" aria-hidden>
                  <path d="M6 3l5 5-5 5" />
                </svg>
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
                        <span className="val">{formatFactValue(fact)}</span>
                        {fact.unit ? <small>{fact.unit}</small> : null}
                        {fact.source === "calc" ? (
                          <span className="calc">Calculated</span>
                        ) : null}
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
                      <svg viewBox="0 0 16 16" aria-hidden>
                        <path d="M6 3l5 5-5 5" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
        <p
          className="dm-nores"
          style={{ display: anyResults ? "none" : "block" }}
        >
          Nothing found. Ask in the chat and we&apos;ll add it.
        </p>
      </div>

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
            wasLabel={
              editing.estimated
                ? `We estimated: ${formatFactValue(editing)}${editing.unit === "CHF" ? "" : editing.unit ? ` ${editing.unit}` : ""}`
                : editing.source === "doc"
                  ? `On your certificate: ${formatFactValue(editing)}`
                  : `Was ${formatFactValue(editing)}${editing.unit ? ` ${editing.unit}` : ""}`
            }
            allowDecimal={editing.unit === "%" && editing.value.includes(".")}
            maxLength={editing.unit === "%" ? 4 : 10}
            onCancel={() => setEditing(null)}
            onSave={saveEdit}
            saveDisabled={draft === editing.value || !draft}
          />
        ) : null}
      </BottomSheet>

      <BottomSheet
        open={conflictOpen && !!conflictFact?.conflict}
        onClose={() => setConflictOpen(false)}
        title="Which salary is right?"
        description="Two sources say different things. Pick one; we keep the other in the history."
      >
        {conflictFact?.conflict ? (
          <div className="dm-stack" style={{ gap: 8 }} role="radiogroup">
            <button
              type="button"
              className="dm-pick"
              role="radio"
              aria-checked={conflictPick === "a"}
              onClick={() => setConflictPick("a")}
            >
              <b>{conflictFact.conflict.a}</b>
              <small>{conflictFact.conflict.aSource}</small>
              <i />
            </button>
            <button
              type="button"
              className="dm-pick"
              role="radio"
              aria-checked={conflictPick === "b"}
              onClick={() => setConflictPick("b")}
            >
              <b>{conflictFact.conflict.b}</b>
              <small>{conflictFact.conflict.bSource}</small>
              <i />
            </button>
            <Button variant="primary" block onClick={resolveConflict}>
              Use this one
            </Button>
            <Button
              variant="text"
              onClick={() => {
                setConflictOpen(false);
                openEdit(conflictFact);
              }}
            >
              Neither, type it
            </Button>
          </div>
        ) : null}
      </BottomSheet>

      <BottomSheet
        open={!!why}
        onClose={() => setWhy(null)}
        title={why === "buy" ? "Buy-in potential" : "Pension at 65"}
      >
        <div className="dm-why">
          <p className="d">
            {why === "buy"
              ? "Your fund calculates the gap between what you have and the maximum the rules allow."
              : "Your fund projects this. It is not a fact you can change, it follows from the numbers above."}
          </p>
          <div className="eq">
            {why === "buy" ? (
              <>
                <span>Maximum for your salary</span>
                <em>−</em>
                <span>84&apos;300 saved</span>
              </>
            ) : (
              <>
                <span>84&apos;300 saved</span>
                <em>+</em>
                <span>future savings</span>
                <em>+</em>
                <span>interest</span>
                <em>×</em>
                <span>6.0 %</span>
              </>
            )}
          </div>
          <p className="h" style={{ color: "var(--ink)" }}>
            {why === "buy"
              ? "It changes when your salary or savings change. Ask your fund if it looks wrong."
              : "Change your savings or conversion rate above and we recalculate. If your certificate is newer, scan it again."}
          </p>
          <Button variant="secondary" block onClick={() => setWhy(null)}>
            Got it
          </Button>
        </div>
      </BottomSheet>
    </section>
  );
}
