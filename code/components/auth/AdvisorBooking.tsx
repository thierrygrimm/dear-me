"use client";

import { Button } from "@/components/ui/Button";
import { ShareConsent } from "@/components/auth/ShareConsent";
import { Squirrel } from "@/components/brand/Squirrel";
import { useToast } from "@/components/feedback/Toast";
import { cn } from "@/lib/cn";
import { copy } from "@/lib/copy";
import { createLeadClient, householdForDemo } from "@/lib/engine";
import {
  advisorForPersona,
  readPersonaId,
} from "@/lib/personas";
import { markLeadId } from "@/lib/session";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const days = [
  { label: "Mon", n: 2, disabled: true },
  { label: "Tue", n: 3 },
  { label: "Wed", n: 4 },
  { label: "Thu", n: 5 },
  { label: "Fri", n: 6 },
  { label: "Mon", n: 9 },
  { label: "Tue", n: 10 },
];

const slots = [
  "08:30",
  "09:00",
  "10:30",
  "11:00",
  "14:00",
  "16:30",
  "17:00",
  "18:00",
  "18:30",
];

type Props = {
  advisorName?: string;
  advisorRole?: string;
  about?: string;
  noteDefault?: string;
  className?: string;
  onBooked?: () => void;
  onBack?: () => void;
};

/**
 * Talk to Pax: advisor → pick a time → before you meet → booked.
 * `.bk-info` is the laptop left column (Calendly split); hidden on phone.
 */
export function AdvisorBooking({
  advisorName: advisorNameProp,
  advisorRole: advisorRoleProp,
  about: aboutProp,
  noteDefault: noteDefaultProp,
  className,
  onBooked,
  onBack,
}: Props) {
  const toast = useToast();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [day, setDay] = useState(3);
  const [slot, setSlot] = useState<string | null>(null);
  const [channel, setChannel] = useState<"Video" | "Phone" | "In person">(
    "Video",
  );
  const seed = advisorForPersona(
    typeof window !== "undefined" ? readPersonaId() : "lena",
  );
  const [advisorName, setAdvisorName] = useState(
    advisorNameProp ?? seed.name,
  );
  const [advisorRole, setAdvisorRole] = useState(
    advisorRoleProp ?? seed.role,
  );
  const [about, setAbout] = useState(aboutProp ?? seed.about);
  const [noteDefault, setNoteDefault] = useState(
    noteDefaultProp ?? seed.noteDefault,
  );
  const questionRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const a = advisorForPersona(readPersonaId());
    if (!advisorNameProp) setAdvisorName(a.name);
    if (!advisorRoleProp) setAdvisorRole(a.role);
    if (!aboutProp) setAbout(a.about);
    if (!noteDefaultProp) setNoteDefault(a.noteDefault);
  }, [advisorNameProp, advisorRoleProp, aboutProp, noteDefaultProp]);

  async function confirmBooking() {
    const question =
      questionRef.current?.value?.trim() || noteDefault || about;
    try {
      const personaId = readPersonaId();
      const preference =
        channel === "Phone"
          ? "call"
          : channel === "In person"
            ? "office"
            : "video";
      const lead = await createLeadClient({
        household: householdForDemo(personaId),
        personaId,
        entryPoint: "book",
        contactPreference: preference,
        questions: [question],
        askedForPerson: true,
      });
      markLeadId(lead.id);
    } catch {
      /* demo still continues without a server lead */
    }
    setStep(4);
  }

  const when = `Tue ${day} Nov · ${slot ?? "10:30"}`;
  const where =
    channel === "Phone"
      ? "Phone call"
      : channel === "In person"
        ? "At Pax, Basel"
        : "Video call or at Pax";
  const first = advisorName.split(/\s+/)[0] || "Sara";
  const initials = advisorName
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className={cn(className)} style={{ display: "contents" }}>
      <div className="bk-info">
        <span className="av">{initials || "SK"}</span>
        <b>{advisorName}</b>
        <span>Pax advisor, Basel</span>
        <dl>
          <div>
            <dt>Length</dt>
            <dd>30 minutes</dd>
          </div>
          <div>
            <dt>Where</dt>
            <dd>{where}</dd>
          </div>
          <div>
            <dt>About</dt>
            <dd>{about}</dd>
          </div>
        </dl>
      </div>

      {step === 1 ? (
        <>
          <div className="dm-appbar">
            <button type="button" aria-label="Back" onClick={onBack}>
              <svg viewBox="0 0 24 24" aria-hidden>
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>
            <b style={{ font: "600 16px/20px var(--font-text)" }}>Your advisor</b>
            <span style={{ width: 36 }} />
          </div>
          <div className="dm-pro">
            <span className="ph">{initials || "SK"}</span>
            <h3>{advisorName}</h3>
            <span>{advisorRole}</span>
          </div>
          <div className="dm-stats">
            <div>
              <b>12 yrs</b>
              <small>at Pax</small>
            </div>
            <div>
              <b>DE EN FR</b>
              <small>languages</small>
            </div>
            <div>
              <b>Families</b>
              <small>her focus</small>
            </div>
          </div>
          <ul className="dm-good">
            <li>Knows part-time and parental leave inside out</li>
            <li>Already sees your question, so you start right away</li>
          </ul>
          <div className="dm-seg3" role="group" aria-label="How to talk">
            {(["Video", "Phone", "In person"] as const).map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={channel === c}
                onClick={() => setChannel(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="dm-foot">
            <span>
              <b>Free · 30 min</b>
              <small>No obligation</small>
            </span>
            <Button variant="primary" onClick={() => setStep(2)}>
              Pick a time
            </Button>
          </div>
        </>
      ) : null}

      {step === 2 ? (
        <>
          <div className="dm-appbar">
            <button type="button" aria-label="Back" onClick={() => setStep(1)}>
              <svg viewBox="0 0 24 24" aria-hidden>
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>
            <b style={{ font: "600 16px/20px var(--font-text)" }}>Pick a time</b>
            <span style={{ width: 36 }} />
          </div>
          <span className="dm-label">November</span>
          <div className="dm-days">
            {days.map((d) => (
              <button
                key={`${d.label}-${d.n}`}
                type="button"
                className="dm-day"
                aria-pressed={day === d.n}
                disabled={d.disabled}
                onClick={() => setDay(d.n)}
              >
                {d.label}
                <b>{d.n}</b>
              </button>
            ))}
          </div>
          <span className="dm-label" style={{ marginTop: 4 }}>
            Tuesday {day} November
          </span>
          <div className="dm-slots">
            {slots.map((s) => (
              <button
                key={s}
                type="button"
                className="dm-slot"
                aria-pressed={slot === s}
                disabled={s === "09:00" || s === "14:00"}
                onClick={() => setSlot(s)}
              >
                {s}
              </button>
            ))}
          </div>
          <p className="dm-small dm-muted" style={{ margin: 0 }}>
            Swiss time. Evening slots for people who work.
          </p>
          <Button
            variant="primary"
            block
            className="dm-signup__cta"
            disabled={!slot}
            style={!slot ? { opacity: 0.4 } : undefined}
            onClick={() => setStep(3)}
          >
            {slot ? `Choose ${slot}` : "Choose a time"}
          </Button>
        </>
      ) : null}

      {step === 3 ? (
        <>
          <div className="dm-appbar">
            <button type="button" aria-label="Back" onClick={() => setStep(2)}>
              <svg viewBox="0 0 24 24" aria-hidden>
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>
            <b style={{ font: "600 16px/20px var(--font-text)" }}>
              Before you meet
            </b>
            <span style={{ width: 36 }} />
          </div>
          <span className="dm-label">What would you like to talk about?</span>
          <div className="dm-field2">
            <label>Your question</label>
            <textarea
              key={noteDefault}
              ref={questionRef}
              rows={2}
              defaultValue={noteDefault}
            />
          </div>
          <ShareConsent onConfirm={() => void confirmBooking()} />
          <p className="dm-small dm-muted" style={{ margin: 0 }}>
            So {first} doesn&apos;t start from zero. Documents and chats stay
            private.
          </p>
          <Button
            variant="signal"
            block
            className="dm-signup__cta"
            onClick={() => void confirmBooking()}
          >
            Book {when}
          </Button>
        </>
      ) : null}

      {step === 4 ? (
        <div className="dm-booked">
          <Squirrel state="done" size={72} />
          <span className="dm-label" style={{ marginTop: 6 }}>
            You&apos;re booked with {first}
          </span>
          <p className="when">
            Tue {day} Nov
            <br />
            {slot ?? "10:30"}
          </p>
          <span className="sub">{channel} · 30 min</span>
          <div
            className="dm-row"
            style={{ justifyContent: "center", marginTop: 6 }}
          >
            <Button
              variant="secondary"
              size="sm"
              onClick={() => toast.show({ message: copy.toast.saved })}
            >
              Add to calendar
            </Button>
            <Button variant="text" size="sm" onClick={() => setStep(2)}>
              Reschedule
            </Button>
          </div>
          <div className="dm-prep">
            <span className="dm-label">What happens next</span>
            <div>
              <svg viewBox="0 0 24 24" aria-hidden>
                <path d="M5 12.5l4.5 4.5L19 7" />
              </svg>
              <span>
                {first} already has your question and plan.
              </span>
            </div>
            <div>
              <svg viewBox="0 0 24 24" aria-hidden>
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M3 7l9 6 9-6" />
              </svg>
              <span>We email you the link and remind you the day before.</span>
            </div>
            <div>
              <svg viewBox="0 0 24 24" aria-hidden>
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M3 10h18M8 3v4M16 3v4" />
              </svg>
              <span>Afterwards, her advice lands in your plan as steps.</span>
            </div>
          </div>
          <Link
            href="/advisor"
            className="dm-btn dm-btn--text dm-small"
            style={{ alignSelf: "center" }}
          >
            What {first} sees
          </Link>
          <Button
            variant="primary"
            block
            className="dm-signup__cta"
            onClick={onBooked}
          >
            Back to my plan
          </Button>
        </div>
      ) : null}
    </div>
  );
}
