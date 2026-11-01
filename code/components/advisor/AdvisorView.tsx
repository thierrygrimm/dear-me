"use client";

import {
  advisorForPersona,
  getPersona,
  partnerNameFor,
  readPersonaId,
  type PersonaId,
} from "@/lib/personas";
import { useEffect, useState } from "react";

type Props = {
  personaId?: PersonaId;
  className?: string;
};

/**
 * Build Spec E2 · one-page advisor brief (DS AdvisorView CRM).
 * Fictional lead filled from the active demo persona.
 */
export function AdvisorView({ personaId, className }: Props) {
  const [id, setId] = useState<PersonaId>(personaId ?? "lena");

  useEffect(() => {
    setId(personaId ?? readPersonaId());
  }, [personaId]);

  const persona = getPersona(id);
  const partner = partnerNameFor(id);
  const advisor = advisorForPersona(id);
  const first = persona.hi.replace(/\.$/, "");
  const gap =
    id === "ruth"
      ? "How the CHF 380'000 is taken decides how long it lasts."
      : id === "noah"
        ? "Disability cover is thin in the first years — about CHF 1'900 / month missing."
        : id === "sandra"
          ? "No pension fund any more; only AHV/IV if she couldn't work."
          : "At 60 % after the baby, pension drops about CHF 620 / month for life; disability thins fastest.";

  return (
    <div className={className ? `dm-crm dm-crm--page ${className}` : "dm-crm dm-crm--page"}>
      <header>
        <span className="crumb">
          Leads / <b>{first}{partner ? ` & ${partner}` : ""}</b>
        </span>
        <span className="dm-sync">
          <i /> Synced just now
        </span>
      </header>
      <div className="body">
        <aside className="dm-recd">
          <div className="who">
            <span className="av">{persona.avatars[0]?.initial ?? "L"}</span>
            <span>
              <b>{persona.name}</b>
              <span>{persona.who} · {persona.tag}</span>
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
            <dt>Certificate</dt>
            <dd>On file (demo)</dd>
          </dl>
          <h6>Handover</h6>
          <dl className="dm-kv">
            <dt>Advisor</dt>
            <dd>{advisor.name}</dd>
            <dt>Trigger</dt>
            <dd>H5 · asked for a person</dd>
            <dt>Channel</dt>
            <dd>Video · 30 min</dd>
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
              {gap} Safety net today: <b>{persona.net.toLowerCase()}</b>.
            </p>
          </section>
          <section>
            <h5>
              Open questions
              <a href="/ask">Open in chat</a>
            </h5>
            <div className="dm-talk">
              {persona.earlierChats.map((q, i) => (
                <div key={q}>
                  <i>{i + 1}</i>
                  <span>
                    <b>{q}</b>
                    <small>From Home / Ask</small>
                  </span>
                  <em>Open</em>
                </div>
              ))}
            </div>
          </section>
          <section>
            <h5>Gaps to cover</h5>
            <div className="dm-opps">
              <div>
                <b>{id === "ruth" ? "Payout path" : "Disability"}</b>
                <small>
                  {id === "ruth"
                    ? "Lump vs pension sizing"
                    : "Soft spot after the moment"}
                </small>
                <span className="dm-fit h">Look first</span>
              </div>
              <div>
                <b>3a room</b>
                <small>Tax year still open</small>
                <span className="dm-fit">Optional</span>
              </div>
              <div>
                <b>You don&apos;t need</b>
                <small>
                  {id === "noah" || id === "sandra"
                    ? "Death cover — nobody depends yet"
                    : "Accident top-up — employer covers it"}
                </small>
                <span className="dm-fit">N-rule</span>
              </div>
            </div>
          </section>
          <section>
            <h5>Trace</h5>
            <div className="dm-tl">
              <div>
                <time>Today</time>
                <i />
                <span>Booked {advisor.name.split(" ")[0]} · question shared</span>
              </div>
              <div>
                <time>Today</time>
                <i />
                <span>Home · {persona.topic}</span>
              </div>
              <div>
                <time>Earlier</time>
                <i className="soft" />
                <span>Certificate on file · demo fixture</span>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
