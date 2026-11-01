"use client";

import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/brand/Logo";
import { Squirrel, type SquirrelState } from "@/components/brand/Squirrel";
import { BottomSheet } from "@/components/feedback/BottomSheet";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/cn";
import {
  momentLabels,
  momentsForAge,
  planHeadline,
  type LifeMoment,
} from "@/lib/session";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";

const AUTH_SAY_DEFAULT = "Pick one on the right. You can change it later.";
const AUTH_SAY_HI = "Hi. I keep an eye on your nuts.";

type AuthHoverKey = "pax" | "apple" | "google" | "email" | "look";

const AUTH_HOVER: Record<
  AuthHoverKey,
  { state: SquirrelState; say: string }
> = {
  pax: {
    state: "listening",
    say: "Fastest if you're with Pax. Your certificate comes along.",
  },
  apple: {
    state: "done",
    say: "One tap. No new password to remember.",
  },
  google: {
    state: "done",
    say: "One tap. No new password to remember.",
  },
  email: {
    state: "thinking",
    say: "Email works too. We send you one link.",
  },
  look: {
    state: "peek",
    say: "Have a look first. No account needed.",
  },
};

function BackButton({ onClick }: { onClick?: () => void }) {
  return (
    <button type="button" aria-label="Back" onClick={onClick}>
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M15 5l-7 7 7 7" />
      </svg>
    </button>
  );
}

function StepProg({
  step,
  of = 3,
  onBack,
}: {
  step: number;
  of?: number;
  onBack?: () => void;
}) {
  const pct = Math.round((step / of) * 100);
  return (
    <div className="dm-qprog">
      <button type="button" className="bk" aria-label="Back" onClick={onBack}>
        <svg viewBox="0 0 24 24" aria-hidden>
          <path d="M15 5l-7 7 7 7" />
        </svg>
      </button>
      <div className="dm-qprog__bar">
        <i style={{ width: `${pct}%` }} />
      </div>
      <span>
        {step} of {of}
      </span>
    </div>
  );
}

const momentIcons: Record<LifeMoment, ReactNode> = {
  child: (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M3 10h12a6 6 0 0 1-6 6H9a6 6 0 0 1-6-6z" />
      <path d="M15 10a6 6 0 0 0-6-6v6" />
      <path d="M15 10l3-4h3" />
      <circle cx="6" cy="19.5" r="1.5" />
      <circle cx="13" cy="19.5" r="1.5" />
    </svg>
  ),
  less: (
    <svg viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 3.5a8.5 8.5 0 0 1 0 17z" fill="currentColor" stroke="none" />
    </svg>
  ),
  home: (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M4 11l8-7 8 7" />
      <path d="M6 9.5V20h7" />
      <circle cx="17" cy="15.5" r="2.5" />
      <path d="M18.8 17.3l2.7 2.7M20.3 18.8l-1.2 1.2" />
    </svg>
  ),
  together: (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M4 11l8-7 8 7v9H4z" />
      <path d="M12 17.5s-3.2-1.9-3.2-4a1.6 1.6 0 0 1 3.2-.7 1.6 1.6 0 0 1 3.2.7c0 2.1-3.2 4-3.2 4z" />
    </svg>
  ),
  firstjob: (
    <svg viewBox="0 0 24 24" aria-hidden>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 12h18" />
    </svg>
  ),
  selfemployed: (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M4 9l2-5h12l2 5" />
      <path d="M4 9a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0" />
      <path d="M5 11v9h14v-9M10 20v-5h4v5" />
    </svg>
  ),
  separating: (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M12 21v-8M12 13L6 6M12 13l6-7M6 6h4M6 6v4M18 6h-4M18 6v4" />
    </svg>
  ),
  bonus: (
    <svg viewBox="0 0 24 24" aria-hidden>
      <rect x="4" y="9" width="16" height="11" rx="1" />
      <path d="M12 9v11M4 13h16M12 9c-2-4-6-3-5 0M12 9c2-4 6-3 5 0" />
    </svg>
  ),
  caring: (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M12 11.5s-3.6-2.2-3.6-4.6a1.8 1.8 0 0 1 3.6-.8 1.8 1.8 0 0 1 3.6.8c0 2.4-3.6 4.6-3.6 4.6z" />
      <path d="M3 15.5h3.5l3 1.8h4.3a1.7 1.7 0 0 1 0 3.4H8.5" />
      <path d="M13.8 17.3l4.4-2.2a1.6 1.6 0 0 1 1.9 2.5L15.5 21H3" />
    </svg>
  ),
  grandchild: (
    <svg viewBox="0 0 24 24" aria-hidden>
      <circle cx="8" cy="6" r="2.5" />
      <path d="M4 21v-6a4 4 0 0 1 8 0v6" />
      <circle cx="17" cy="11.5" r="2" />
      <path d="M14 21v-3a3 3 0 0 1 6 0v3" />
    </svg>
  ),
  catchup: (
    <svg viewBox="0 0 24 24" aria-hidden>
      <ellipse cx="12" cy="6" rx="6" ry="2.5" />
      <path d="M6 6v4c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V6M6 10v4c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-4M6 14v4c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-4" />
    </svg>
  ),
  retire: (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M3 18h18M6.5 18a5.5 5.5 0 0 1 11 0M12 6.5v2.5M5.6 10.6l1.6 1.6M18.4 10.6l-1.6 1.6M8 21h8" />
    </svg>
  ),
};

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.4 12.6c0-2.4 2-3.6 2.1-3.6-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8-1.6 0-3.1 1-4 2.4-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.1-.8 1.5 0 1.9.8 3.2.8 1.3 0 2.1-1.2 2.9-2.4.9-1.3 1.3-2.7 1.3-2.8-.1 0-2.4-.9-2.4-4zM14 5.4c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1.1.1 2.1-.6 2.8-1.4z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.6a4.8 4.8 0 0 1-2.1 3.1v2.6h3.4c2-1.8 3.1-4.5 3.1-7.5z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.8 0 5.2-.9 6.9-2.5l-3.4-2.6c-.9.6-2.1 1-3.5 1-2.7 0-5-1.8-5.8-4.3H2.7v2.7A10 10 0 0 0 12 22z"
      />
      <path
        fill="#FBBC05"
        d="M6.2 13.6a6 6 0 0 1 0-3.8V7.1H2.7a10 10 0 0 0 0 9.2l3.5-2.7z"
      />
      <path
        fill="#EA4335"
        d="M12 5.9c1.5 0 2.9.5 4 1.6l3-3A10 10 0 0 0 2.7 7.1l3.5 2.7C7 7.7 9.3 5.9 12 5.9z"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}

const AUTH_WELCOME_SAY =
  "A letter to later starts here. Tap the squirrel, or get started on the right.";

/** Lime art column — DS signapp left pane (hidden under 900px). */
function AuthArtPanel({
  say,
  sqState,
  className,
  headline = "Plan life's big moments.",
  onSayHi,
}: {
  say: string;
  sqState: SquirrelState;
  className?: string;
  headline?: string;
  onSayHi?: () => void;
}) {
  const reduced = usePrefersReducedMotion();
  const artRef = useRef<HTMLDivElement>(null);
  const [jumping, setJumping] = useState(false);
  const [lean, setLean] = useState<CSSProperties>({});
  const [sunShift, setSunShift] = useState<CSSProperties>({});
  const [saySwap, setSaySwap] = useState(false);
  const [shownSay, setShownSay] = useState(say);
  const sayKey = useRef(say);

  useEffect(() => {
    if (say === sayKey.current) return;
    sayKey.current = say;
    setSaySwap(true);
    const t = window.setTimeout(() => {
      setShownSay(say);
      setSaySwap(false);
    }, 120);
    return () => window.clearTimeout(t);
  }, [say]);

  const onArtPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (reduced) return;
      const art = artRef.current;
      if (!art) return;
      const r = art.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      setLean({ transform: `rotate(${(x * 10).toFixed(1)}deg)` });
      setSunShift({
        transform: `translate(${(x * -14).toFixed(1)}px, ${(y * -10).toFixed(1)}px)`,
      });
    },
    [reduced],
  );

  const onArtPointerLeave = useCallback(() => {
    setLean({});
    setSunShift({});
  }, []);

  const onSqClick = useCallback(() => {
    onSayHi?.();
    if (!reduced) {
      setJumping(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setJumping(true));
      });
      window.setTimeout(() => setJumping(false), 700);
    }
  }, [onSayHi, reduced]);

  return (
    <div
      ref={artRef}
      className={cn("auth-art", className)}
      onPointerMove={onArtPointerMove}
      onPointerLeave={onArtPointerLeave}
    >
      <Logo className="auth-lk" />
      <div className="auth-stage">
        <svg
          className="auth-scene"
          viewBox="0 0 600 300"
          preserveAspectRatio="xMidYMax slice"
          aria-hidden
        >
          <circle
            className="sun"
            cx="440"
            cy="92"
            r="40"
            fill="var(--briefpapier)"
            style={sunShift}
          />
          <path
            d="M0 215 Q150 160 300 205 T600 190 V300 H0Z"
            fill="var(--kaugummi)"
          />
          <path
            d="M0 250 Q170 215 330 242 T600 236 V300 H0Z"
            fill="var(--pflaumenkuchen)"
          />
          <g
            className="nut"
            transform="translate(132 140) scale(.9) rotate(-12 20 30)"
          >
            <path
              d="M20 9 V2"
              stroke="var(--espressosatz)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M6 21 H34 V30 Q34 45 20 52 Q6 45 6 30 Z"
              fill="var(--briefpapier)"
            />
            <path
              d="M3 21 Q3 9 20 9 Q37 9 37 21 Z"
              fill="var(--espressosatz)"
            />
          </g>
        </svg>
        <button
          type="button"
          className={cn("auth-sq", jumping && "jump")}
          aria-label="Say hello to the squirrel"
          style={lean}
          onClick={onSqClick}
        >
          <Squirrel state={sqState} className="auth-sq__mark" />
        </button>
      </div>
      <div className="auth-copy">
        <h2>{headline}</h2>
        <p
          className={cn("say", saySwap && "is-swap")}
          aria-live="polite"
        >
          {shownSay}
        </p>
      </div>
    </div>
  );
}

/** 1 · Welcome — phone illustration; from 900px: lime art + promise column */
export function WelcomeScreen({
  onGetStarted,
  onLogin,
  className,
}: {
  onGetStarted?: () => void;
  onLogin?: () => void;
  className?: string;
}) {
  const sayTimer = useRef<number | null>(null);
  const [sqState, setSqState] = useState<SquirrelState>("idle");
  const [say, setSay] = useState(AUTH_WELCOME_SAY);

  useEffect(
    () => () => {
      if (sayTimer.current != null) window.clearTimeout(sayTimer.current);
    },
    [],
  );

  const onSayHi = useCallback(() => {
    if (sayTimer.current != null) window.clearTimeout(sayTimer.current);
    setSqState("done");
    setSay(AUTH_SAY_HI);
    sayTimer.current = window.setTimeout(() => {
      setSqState("idle");
      setSay(AUTH_WELCOME_SAY);
    }, 2200);
  }, []);

  return (
    <>
      <AuthArtPanel
        className={className}
        say={say}
        sqState={sqState}
        onSayHi={onSayHi}
      />
      <div className="pg auth wel">
        <div className="dm-welcome" aria-hidden>
          <span className="sun" />
          <span className="hill" />
          <span className="home" />
          <span className="sq-lg">
            <Squirrel state="idle" size={120} />
          </span>
          <span className="sq-sm">
            <Squirrel state="done" size={48} />
          </span>
        </div>
        <Logo className="dm-signup__logo" />
        <p className="dm-q">{copy.signup.promise}</p>
        <Button
          variant="primary"
          size="lg"
          block
          className="dm-signup__cta"
          onClick={onGetStarted}
        >
          {copy.signup.getStarted}
        </Button>
        <p className="dm-small" style={{ textAlign: "center", margin: 0 }}>
          {copy.signup.haveAccount}{" "}
          <button type="button" className="dm-signup__link" onClick={onLogin}>
            {copy.signup.logIn}
          </button>
        </p>
      </div>
    </>
  );
}

/** 2 · Choose how — split from 900px: lime art + SSO column */
export function ChooseHowScreen({
  onBack,
  onPax,
  onApple,
  onGoogle,
  onEmail,
  onLookAround,
  className,
}: {
  onBack?: () => void;
  onPax?: () => void;
  onApple?: () => void;
  onGoogle?: () => void;
  onEmail?: () => void;
  onLookAround?: () => void;
  className?: string;
}) {
  const sayTimer = useRef<number | null>(null);
  const [sqState, setSqState] = useState<SquirrelState>("idle");
  const [say, setSay] = useState(AUTH_SAY_DEFAULT);

  useEffect(
    () => () => {
      if (sayTimer.current != null) window.clearTimeout(sayTimer.current);
    },
    [],
  );

  const resetHover = useCallback(() => {
    if (sayTimer.current != null) {
      window.clearTimeout(sayTimer.current);
      sayTimer.current = null;
    }
    setSqState("idle");
    setSay(AUTH_SAY_DEFAULT);
  }, []);

  const onOptionEnter = useCallback((key: AuthHoverKey) => {
    if (sayTimer.current != null) {
      window.clearTimeout(sayTimer.current);
      sayTimer.current = null;
    }
    const next = AUTH_HOVER[key];
    setSqState(next.state);
    setSay(next.say);
  }, []);

  const onSayHi = useCallback(() => {
    if (sayTimer.current != null) window.clearTimeout(sayTimer.current);
    setSqState("done");
    setSay(AUTH_SAY_HI);
    sayTimer.current = window.setTimeout(() => {
      setSqState("idle");
      setSay(AUTH_SAY_DEFAULT);
    }, 2200);
  }, []);

  const hoverHandlers = (key: AuthHoverKey) => ({
    onPointerEnter: () => onOptionEnter(key),
    onFocus: () => onOptionEnter(key),
    onPointerLeave: resetHover,
    onBlur: resetHover,
  });

  return (
    <>
      <AuthArtPanel
        className={className}
        say={say}
        sqState={sqState}
        onSayHi={onSayHi}
      />

      <div className="pg auth">
        <div className="dm-appbar" style={{ margin: "-4px -8px 0" }}>
          <BackButton onClick={onBack} />
          <span className="dm-small dm-muted">{copy.signup.createAccount}</span>
          <span style={{ width: 36 }} />
        </div>
        <p className="dm-q" style={{ fontSize: 24, lineHeight: "28px" }}>
          {copy.signup.chooseHow}
        </p>
        <span className="dm-small dm-muted">{copy.signup.chooseHowSub}</span>
        <div className="dm-stack" style={{ gap: 10 }}>
          <button
            type="button"
            className="dm-sso dm-sso--pax"
            onClick={onPax}
            {...hoverHandlers("pax")}
          >
            <b>Pax</b>
            {copy.signup.continuePax}
          </button>
          <div className="dm-or">{copy.signup.or}</div>
          <button
            type="button"
            className="dm-sso dm-sso--dark"
            onClick={onApple}
            {...hoverHandlers("apple")}
          >
            <AppleIcon />
            {copy.signup.continueApple}
          </button>
          <button
            type="button"
            className="dm-sso"
            onClick={onGoogle}
            {...hoverHandlers("google")}
          >
            <GoogleIcon />
            {copy.signup.continueGoogle}
          </button>
          <button
            type="button"
            className="dm-sso"
            onClick={onEmail}
            {...hoverHandlers("email")}
          >
            <MailIcon />
            {copy.signup.continueEmail}
          </button>
        </div>
        <Button
          variant="text"
          className="dm-small"
          style={{ alignSelf: "center" }}
          onClick={onLookAround}
          {...hoverHandlers("look")}
        >
          {copy.signup.lookAround}
        </Button>
        <p
          className="dm-small dm-muted"
          style={{ margin: "auto 0 0", fontSize: 11, lineHeight: "15px" }}
        >
          {copy.signup.terms}
        </p>
      </div>
    </>
  );
}

/** 4 · Connect myPax */
export function ConnectPaxScreen({
  onBack,
  onContinue,
  onEmail,
  className,
}: {
  onBack?: () => void;
  onContinue?: () => void;
  onEmail?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("dm-signup", className)}>
      <div className="dm-appbar">
        <BackButton onClick={onBack} />
        <span className="dm-small dm-muted">{copy.signup.connectTitle}</span>
        <span style={{ width: 36 }} />
      </div>

      <div className="dm-link-anim" aria-hidden>
        <span
          className="a"
          style={{
            background: "var(--pax-purpur)",
            color: "var(--pax-limette)",
            font: "800 14px/1 var(--font-display)",
          }}
        >
          Pax
        </span>
        <span className="dash">
          <i />
        </span>
        <span className="a" style={{ background: "var(--neonweste)" }}>
          <Squirrel state="idle" size={26} />
        </span>
      </div>

      <div className="dm-paxsheet" style={{ marginTop: 12 }}>
        <span className="logo" style={{ width: 80, height: 80, borderRadius: 22, fontSize: 24 }}>
          Pax
        </span>
        <h4 style={{ font: "700 26px/30px var(--font-display)", marginTop: 14 }}>
          {copy.signup.continuePax}
        </h4>
        <p style={{ fontSize: 15, lineHeight: "22px" }}>{copy.signup.connectBody}</p>
      </div>

      <div
        style={{
          marginTop: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <button
          type="button"
          className="dm-btn dm-btn--paxfill dm-btn--block dm-btn--lg"
          onClick={onContinue}
        >
          {copy.signup.continueToPax}
        </button>
        <Button variant="text" onClick={onEmail}>
          {copy.signup.useEmail}
        </Button>
      </div>
    </div>
  );
}

function toggleMoment(list: LifeMoment[], id: LifeMoment): LifeMoment[] {
  return list.includes(id) ? list.filter((m) => m !== id) : [...list, id];
}

/** Your moments — multi-select; from 900px: onb top bar + 4-col grid */
export function YourMomentsScreen({
  name = "Lena",
  age = null,
  onBack,
  onContinue,
  value,
  onChange,
  className,
}: {
  name?: string;
  /** Years; null when unknown → Lena-like defaults. */
  age?: number | null;
  onBack?: () => void;
  onContinue?: () => void;
  value: LifeMoment[];
  onChange?: (m: LifeMoment[]) => void;
  className?: string;
}) {
  const [moreOpen, setMoreOpen] = useState(false);

  const { suggested, more } = useMemo(() => {
    const split = momentsForAge(age ?? null);
    return {
      suggested: split.suggested
        .slice(0, 4)
        .map((id) => ({ id, label: momentLabels[id] })),
      more: split.more.map((id) => ({ id, label: momentLabels[id] })),
    };
  }, [age]);

  return (
    <>
      <div className={cn("onb-top", className)}>
        <Logo className="dm-signup__logo" />
        <span className="dm-small dm-muted">Set up your plan</span>
      </div>
      <div className="onb-col">
        <StepProg step={1} onBack={onBack} />
        <p
          className="dm-q"
          style={{ fontSize: 24, lineHeight: "28px", margin: 0 }}
        >
          {copy.signup.momentsTitle(name)}
        </p>
        <span className="dm-small dm-muted" style={{ marginTop: -8 }}>
          {copy.signup.momentsSub}
        </span>
        <div className="dm-lmgrid">
          {suggested.map((m) => (
            <button
              key={m.id}
              type="button"
              className="dm-lm"
              aria-pressed={value.includes(m.id)}
              onClick={() => onChange?.(toggleMoment(value, m.id))}
            >
              {momentIcons[m.id]}
              {m.label}
            </button>
          ))}
        </div>
        {more.length > 0 ? (
          <button
            type="button"
            className="dm-more2"
            onClick={() => setMoreOpen(true)}
          >
            {copy.signup.somethingElse}
            <svg viewBox="0 0 16 16" aria-hidden>
              <path d="M6 3l5 5-5 5" />
            </svg>
          </button>
        ) : null}
        <Button
          variant="primary"
          block
          className="dm-signup__cta"
          style={{ flex: "none", marginTop: "auto" }}
          disabled={value.length === 0}
          onClick={onContinue}
        >
          {copy.signup.continue}
        </Button>

        <BottomSheet
          open={moreOpen}
          onClose={() => setMoreOpen(false)}
          title={copy.signup.somethingElse}
        >
          <div className="dm-lmlist">
            {more.map((m) => (
              <button
                key={m.id}
                type="button"
                aria-pressed={value.includes(m.id)}
                onClick={() => onChange?.(toggleMoment(value, m.id))}
              >
                {momentIcons[m.id]}
                <span>{m.label}</span>
                <i />
              </button>
            ))}
          </div>
          <Button variant="primary" block onClick={() => setMoreOpen(false)}>
            {copy.signup.done}
          </Button>
        </BottomSheet>
      </div>
    </>
  );
}

/** Your plan — ready path after moments */
export function YourPlanScreen({
  name = "Lena",
  moments,
  onBack,
  onStart,
  className,
}: {
  name?: string;
  moments: LifeMoment[];
  onBack?: () => void;
  onStart?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("dm-signup", className)}>
      <StepProg step={2} onBack={onBack} />
      <div className="dm-planart" aria-hidden>
        <svg viewBox="0 0 320 170" preserveAspectRatio="xMidYMid slice">
          <circle cx="62" cy="44" r="22" fill="var(--neonweste)" />
          <path
            d="M0 120 Q90 80 180 108 T320 96 V170 H0Z"
            fill="var(--kaugummi)"
          />
          <path
            d="M0 146 Q120 116 210 136 T320 134 V170 H0Z"
            fill="var(--pflaumenkuchen)"
          />
          <path
            className="trail"
            d="M40 140 C90 130 110 110 160 104 S230 84 250 70"
            fill="none"
            stroke="var(--espressosatz)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="2 9"
          />
          <circle
            cx="40"
            cy="140"
            r="7"
            fill="var(--neuschnee)"
            stroke="var(--espressosatz)"
            strokeWidth="3"
          />
          <circle
            cx="160"
            cy="104"
            r="6"
            fill="var(--neuschnee)"
            stroke="var(--espressosatz)"
            strokeWidth="3"
          />
          <g transform="translate(236 30) scale(0.72)">
            <path
              d="M6 21 H34 V30 Q34 45 20 52 Q6 45 6 30 Z"
              fill="var(--neonweste)"
            />
            <path
              d="M3 21 Q3 9 20 9 Q37 9 37 21 Z"
              fill="var(--espressosatz)"
            />
          </g>
        </svg>
      </div>
      <div className="dm-ready">
        <h2>{planHeadline(name, moments)}</h2>
        <p>{copy.signup.planSub}</p>
      </div>
      <ol className="dm-path3">
        <li className="on">
          <i>1</i>
          {copy.signup.planStep1}
        </li>
        <li>
          <i>2</i>
          {copy.signup.planStep2}
        </li>
        <li>
          <i>3</i>
          {copy.signup.planStep3}
        </li>
      </ol>
      <Button
        variant="primary"
        block
        className="dm-signup__cta"
        onClick={onStart}
      >
        {copy.signup.letsStart}
      </Button>
    </div>
  );
}

/** @deprecated use YourMomentsScreen */
export function MomentScreen(
  props: Parameters<typeof YourMomentsScreen>[0] & {
    value: LifeMoment | LifeMoment[];
    onChange?: (m: LifeMoment | LifeMoment[]) => void;
  },
) {
  const value = Array.isArray(props.value) ? props.value : [props.value];
  return (
    <YourMomentsScreen
      {...props}
      value={value}
      onChange={(m) => props.onChange?.(m)}
    />
  );
}

/** @deprecated removed from the live flow — use YourPlanScreen */
export function WelcomeInScreen({
  onAsk,
  onLater,
  className,
}: {
  name?: string;
  pax?: boolean;
  onAsk?: () => void;
  onLater?: () => void;
  className?: string;
}) {
  return (
    <YourPlanScreen
      className={className}
      moments={["child", "less"]}
      onStart={onAsk}
      onBack={onLater}
    />
  );
}

/** @deprecated Prefer the step screens; kept for /dev/ui */
export function SignUp({
  onPax,
  onApple,
  onGoogle,
  onEmail,
  onLookAround,
  className,
}: {
  onPax?: () => void;
  onApple?: () => void;
  onGoogle?: () => void;
  onEmail?: () => void;
  onLookAround?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("dm-app signapp", className)}>
      <ChooseHowScreen
        onPax={onPax}
        onApple={onApple}
        onGoogle={onGoogle}
        onEmail={onEmail}
        onLookAround={onLookAround}
      />
    </div>
  );
}
