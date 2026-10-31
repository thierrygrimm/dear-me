"use client";

import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/brand/Logo";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/cn";

type Props = {
  onPax?: () => void;
  onApple?: () => void;
  onGoogle?: () => void;
  onEmail?: () => void;
  onLookAround?: () => void;
  className?: string;
};

export function SignUp({
  onPax,
  onApple,
  onGoogle,
  onEmail,
  onLookAround,
  className,
}: Props) {
  return (
    <div className={cn("dm-stack", className)} style={{ gap: 16 }}>
      <div className="dm-welcome" aria-hidden>
        <span className="sun" />
        <span className="hill" />
        <span className="home" />
      </div>
      <Logo />
      <div>
        <h1 className="dm-hello">{copy.signup.welcome}</h1>
        <p className="dm-muted" style={{ margin: "8px 0 0" }}>
          {copy.signup.welcomeSub}
        </p>
      </div>
      <button type="button" className="dm-sso dm-sso--pax" onClick={onPax}>
        <b>Pax</b>
        {copy.signup.continuePax}
      </button>
      <button type="button" className="dm-sso dm-sso--dark" onClick={onApple}>
        {copy.signup.continueApple}
      </button>
      <button type="button" className="dm-sso" onClick={onGoogle}>
        {copy.signup.continueGoogle}
      </button>
      <div className="dm-or">{copy.signup.or}</div>
      <Button variant="secondary" block onClick={onEmail}>
        {copy.signup.continueEmail}
      </Button>
      <Button variant="text" onClick={onLookAround}>
        {copy.signup.lookAround}
      </Button>
    </div>
  );
}
