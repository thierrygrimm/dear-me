"use client";

import {
  fetchAudit,
  fetchLead,
  fetchLeads,
  fetchTrace,
} from "@/lib/engine";
import type { Lead, Suggestion, Trace } from "@/lib/engine/types";
import {
  advisorForPersona,
  getPersona,
  partnerNameFor,
  readPersonaId,
  type PersonaId,
} from "@/lib/personas";
import { readLeadId, readSharePax } from "@/lib/session";
import { useEffect, useState } from "react";

type Props = {
  personaId?: PersonaId;
  leadId?: string | null;
  className?: string;
};

/**
 * Build Spec E2 · one-page advisor brief (DS AdvisorView CRM).
 * Prefers the session lead from booking; falls back to persona fiction.
 */
export function AdvisorView({ personaId, leadId, className }: Props) {
  const [id, setId] = useState<PersonaId>(personaId ?? "lena");
  const [lead, setLead] = useState<Lead | null>(null);
  const [traces, setTraces] = useState<Trace[]>([]);
  const [audit, setAudit] = useState<
    { id: string; createdAt: string; ruleId: string; suggestion: Suggestion }[]
  >([]);
  const [shareOn, setShareOn] = useState(false);

  useEffect(() => {
    const pid = personaId ?? readPersonaId();
    setId(pid);
    setShareOn(readSharePax());

    let cancelled = false;
    async function load() {
      try {
        const wanted = leadId ?? readLeadId();
        let next: Lead | null = null;
        if (wanted) {
          try {
            next = await fetchLead(wanted);
          } catch {
            next = null;
          }
        }
        if (!next) {
          const list = await fetchLeads();
          next = list[0] ?? null;
        }
        if (cancelled) return;
        setLead(next);

        const ids = (next?.traceIds ?? []).slice(0, 3);
        if (ids.length) {
          const fetched = await Promise.all(
            ids.map((tid) => fetchTrace(tid).catch(() => null)),
          );
          if (!cancelled) {
            setTraces(fetched.filter((t): t is Trace => Boolean(t)));
          }
        }

        const entries = await fetchAudit().catch(() => []);
        if (!cancelled) setAudit(entries.slice(0, 5));
      } catch {
        if (!cancelled) setLead(null);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [personaId, leadId]);

  const persona = getPersona(id);
  const partner = partnerNameFor(id);
  const advisor = advisorForPersona(id);
  const first = persona.hi.replace(/\.$/, "");
  const questions =
    lead?.questions?.length ? lead.questions : persona.earlierChats;
  const gaps =
    lead?.gaps?.filter((g) => g.kind !== "handover") ??
    ([
      {
        ruleId: "P2",
        kind: "product" as const,
        title: id === "ruth" ? "Payout path" : "Disability",
        body:
          id === "ruth"
            ? "Lump vs pension sizing"
            : "Soft spot after the moment",
        traceIds: [],
      },
      {
        ruleId: "T1",
        kind: "product" as const,
        title: "3a room",
        body: "Tax year still open",
        traceIds: [],
      },
      {
        ruleId: "N3",
        kind: "not-needed" as const,
        title: "You don't need",
        body:
          id === "noah" || id === "sandra"
            ? "Death cover — nobody depends yet"
            : "Accident top-up — employer covers it",
        traceIds: [],
      },
    ] satisfies Suggestion[]);

  const gapSummary =
    gaps.find((g) => g.kind === "product")?.body ??
    (id === "ruth"
      ? "How the CHF 380'000 is taken decides how long it lasts."
      : "At 60 % after the baby, pension drops about CHF 620 / month for life; disability thins fastest.");

  return (
    <div
      className={
        className ? `dm-crm dm-crm--page ${className}` : "dm-crm dm-crm--page"
      }
    >
      <header>
        <span className="crumb">
          Leads / <b>
            {first}
            {partner ? ` & ${partner}` : ""}
          </b>
        </span>
        <span className="dm-sync">
          <i /> {lead ? `Lead ${lead.id.slice(0, 8)}` : "Synced just now"}
        </span>
      </header>
      <div className="body">
        <aside className="dm-recd">
          <div className="who">
            <span className="av">{persona.avatars[0]?.initial ?? "L"}</span>
            <span>
              <b>{persona.name}</b>
              <span>
                {persona.who} · {persona.tag}
              </span>
            </span>
          </div>
          <div className="dm-tags">
            <span className="hot">{persona.tag}</span>
            <span>{persona.side}</span>
          </div>
          <h6>Household</h6>
          <dl className="dm-kv">
            <dt>Planning</dt>
            <dd>{persona.side}</dd>
            <dt>Moment</dt>
            <dd>{persona.topic}</dd>
            <dt>Partner</dt>
            <dd className={partner ? undefined : "no"}>
              {partner ?? "Planning alone"}
            </dd>
            <dt>Consent</dt>
            <dd className={shareOn ? undefined : "no"}>
              {shareOn ? "Shared with Pax" : "Summary only until shared"}
            </dd>
          </dl>
          <h6>Handover</h6>
          <dl className="dm-kv">
            <dt>Advisor</dt>
            <dd>{advisor.name}</dd>
            <dt>Trigger</dt>
            <dd>
              {lead?.gaps.find((g) => g.kind === "handover")?.ruleId ?? "H5"} ·
              asked for a person
            </dd>
            <dt>Channel</dt>
            <dd>
              {lead?.contactPreference === "call"
                ? "Phone"
                : lead?.contactPreference === "office"
                  ? "In person"
                  : "Video"}{" "}
              · 30 min
            </dd>
          </dl>
        </aside>
        <main>
          <div className="tabs2" role="tablist">
            <button type="button" aria-selected>
              Brief
            </button>
            <button type="button" aria-selected={false}>
              Timeline
            </button>
          </div>
          <section>
            <h5>Summary</h5>
            <p className="dm-aisum">
              {first} wants clarity on <b>{persona.topic.toLowerCase()}</b>.{" "}
              {gapSummary} Safety net today:{" "}
              <b>{persona.net.toLowerCase()}</b>.
            </p>
          </section>
          <section>
            <h5>
              Open questions
              <a href="/ask">Open in chat</a>
            </h5>
            <div className="dm-talk">
              {questions.map((q, i) => (
                <div key={`${q}-${i}`}>
                  <i>{i + 1}</i>
                  <span>
                    <b>{q}</b>
                    <small>{lead ? "From booking" : "From Home / Ask"}</small>
                  </span>
                  <em>Open</em>
                </div>
              ))}
            </div>
          </section>
          <section>
            <h5>Gaps to cover</h5>
            <div className="dm-opps">
              {gaps.slice(0, 3).map((g) => (
                <div key={g.ruleId + g.title}>
                  <b>{g.title}</b>
                  <small>{g.body}</small>
                  <span
                    className={
                      g.kind === "product" ? "dm-fit h" : "dm-fit"
                    }
                  >
                    {g.ruleId}
                  </span>
                </div>
              ))}
            </div>
          </section>
          <section>
            <h5>Trace</h5>
            <div className="dm-tl">
              {traces.length ? (
                traces.map((t) => (
                  <div key={t.id}>
                    <time>
                      {new Date(t.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                    <i />
                    <span>
                      {t.label}: {t.explanation}
                    </span>
                  </div>
                ))
              ) : (
                <>
                  <div>
                    <time>Today</time>
                    <i />
                    <span>
                      Booked {advisor.name.split(" ")[0]} · question shared
                    </span>
                  </div>
                  <div>
                    <time>Today</time>
                    <i />
                    <span>Home · {persona.topic}</span>
                  </div>
                </>
              )}
            </div>
          </section>
          {audit.length ? (
            <section>
              <h5>Recommendation log</h5>
              <div className="dm-tl">
                {audit.map((a) => (
                  <div key={a.id}>
                    <time>
                      {new Date(a.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                    <i className="soft" />
                    <span>
                      {a.ruleId} · {a.suggestion.title}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </main>
      </div>
    </div>
  );
}
