"use client";

import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/brand/Logo";
import { Squirrel } from "@/components/brand/Squirrel";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/cn";
import {
  momentLabels,
  type LifeMoment,
} from "@/lib/session";

function BackButton({ onClick }: { onClick?: () => void }) {
  return (
    <button type="button" aria-label="Back" onClick={onClick}>
      <svg viewBox="0 0 24 24" aria-hidden>
        <path d="M15 5l-7 7 7 7" />
      </svg>
    </button>
  );
}

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

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden>
      <path d="M3 8.5l3 3 7-7" />
    </svg>
  );
}

/** 1 · Welcome */
export function WelcomeScreen({
  onGetStarted,
  onLogin,
  className,
}: {
  onGetStarted?: () => void;
  onLogin?: () => void;
  className?: string;
}) {
  return (
    <div className={cn("dm-signup", className)}>
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
      <div className="dm-signup__body">
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
    </div>
  );
}

/** 2 · Choose how */
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
  return (
    <div className={cn("dm-signup", className)}>
      <div className="dm-appbar">
        <BackButton onClick={onBack} />
        <span className="dm-small dm-muted">{copy.signup.createAccount}</span>
        <span style={{ width: 36 }} />
      </div>
      <p className="dm-q">{copy.signup.chooseHow}</p>
      <span className="dm-small dm-muted">{copy.signup.chooseHowSub}</span>
      <div className="dm-stack" style={{ gap: 10 }}>
        <button type="button" className="dm-sso dm-sso--pax" onClick={onPax}>
          <b>Pax</b>
          {copy.signup.continuePax}
        </button>
        <div className="dm-or">{copy.signup.or}</div>
        <button type="button" className="dm-sso dm-sso--dark" onClick={onApple}>
          <AppleIcon />
          {copy.signup.continueApple}
        </button>
        <button type="button" className="dm-sso" onClick={onGoogle}>
          <GoogleIcon />
          {copy.signup.continueGoogle}
        </button>
        <button type="button" className="dm-sso" onClick={onEmail}>
          <MailIcon />
          {copy.signup.continueEmail}
        </button>
      </div>
      <Button
        variant="text"
        className="dm-small"
        style={{ alignSelf: "center" }}
        onClick={onLookAround}
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

/** 6 · What brings you here */
export function MomentScreen({
  onBack,
  onContinue,
  value,
  onChange,
  className,
}: {
  onBack?: () => void;
  onContinue?: () => void;
  value: LifeMoment;
  onChange?: (m: LifeMoment) => void;
  className?: string;
}) {
  const options = Object.entries(momentLabels) as [LifeMoment, string][];

  return (
    <div className={cn("dm-signup", className)}>
      <div className="dm-appbar">
        <BackButton onClick={onBack} />
        <span className="dm-small dm-muted">3 of 3</span>
        <span style={{ width: 36 }} />
      </div>
      <p className="dm-q">{copy.signup.momentTitle}</p>
      <span className="dm-small dm-muted">{copy.signup.momentSub}</span>
      <div className="dm-tiles-a">
        {options.map(([id, label]) => (
          <button
            key={id}
            type="button"
            className="dm-tile"
            aria-pressed={value === id}
            onClick={() => onChange?.(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <Button
        variant="primary"
        size="lg"
        block
        className="dm-signup__cta"
        onClick={onContinue}
      >
        {copy.signup.continue}
      </Button>
    </div>
  );
}

/** 7 · Welcome in */
export function WelcomeInScreen({
  name = "Lena",
  pax,
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
    <div className={cn("dm-signup dm-signup--lime", className)}>
      <div style={{ flex: 1, display: "grid", placeItems: "center" }}>
        <div className="ig-done">
          <div className="medal">
            <Squirrel state="done" size={72} />
          </div>
        </div>
      </div>
      <h4
        style={{
          margin: 0,
          font: "700 30px/34px var(--font-display)",
          letterSpacing: "-.02em",
        }}
      >
        {copy.signup.welcomeIn(name)}
      </h4>
      <p style={{ margin: 0, font: "400 15px/22px var(--font-text)" }}>
        {pax ? copy.signup.welcomeInPax : copy.signup.welcomeInGuest}
      </p>
      {pax ? (
        <div className="dm-row" style={{ gap: 6 }}>
          <span className="dm-srcpill is-ok">
            <CheckIcon />
            myPax connected
          </span>
          <span className="dm-srcpill is-ok">
            <CheckIcon />
            Cover ready
          </span>
        </div>
      ) : null}
      <Button variant="primary" size="lg" block onClick={onAsk}>
        {copy.signup.askFirst}
      </Button>
      <Button
        variant="text"
        className="dm-small"
        style={{ alignSelf: "center" }}
        onClick={onLater}
      >
        {copy.signup.finishLater}
      </Button>
    </div>
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
    <ChooseHowScreen
      className={className}
      onPax={onPax}
      onApple={onApple}
      onGoogle={onGoogle}
      onEmail={onEmail}
      onLookAround={onLookAround}
    />
  );
}
