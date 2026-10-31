"use client";

import { Button } from "@/components/ui/Button";
import { ShareConsent } from "@/components/auth/ShareConsent";
import { cn } from "@/lib/cn";
import { useState } from "react";

const slots = ["Tue 10:00", "Tue 14:30", "Wed 09:00", "Thu 16:00"];

type Props = {
  advisorName?: string;
  className?: string;
  onBooked?: () => void;
};

export function AdvisorBooking({
  advisorName = "Sara",
  className,
  onBooked,
}: Props) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [slot, setSlot] = useState(slots[0]);

  return (
    <div className={cn("dm-stack", className)}>
      {step === 1 ? (
        <>
          <h2 className="dm-hello" style={{ fontSize: 22 }}>
            Talk it through with {advisorName}
          </h2>
          <p className="dm-muted" style={{ margin: 0 }}>
            Four taps. You choose the time and what they see.
          </p>
          <Button variant="signal" block onClick={() => setStep(2)}>
            Continue
          </Button>
        </>
      ) : null}

      {step === 2 ? (
        <>
          <h2 className="dm-hello" style={{ fontSize: 22 }}>
            Pick a time
          </h2>
          <div className="dm-stack" style={{ gap: 0 }}>
            {slots.map((s) => (
              <button
                key={s}
                type="button"
                className="dm-opt"
                role="radio"
                aria-checked={slot === s}
                onClick={() => setSlot(s)}
              >
                <span>{s}</span>
                <i aria-hidden />
              </button>
            ))}
          </div>
          <Button variant="primary" block onClick={() => setStep(3)}>
            Next
          </Button>
        </>
      ) : null}

      {step === 3 ? (
        <ShareConsent
          onConfirm={() => setStep(4)}
        />
      ) : null}

      {step === 4 ? (
        <>
          <h2 className="dm-hello" style={{ fontSize: 22 }}>
            You&apos;re booked
          </h2>
          <p className="dm-muted" style={{ margin: 0 }}>
            {advisorName} · {slot}. A calendar file is ready when you want it.
          </p>
          <Button variant="primary" block onClick={onBooked}>
            Done
          </Button>
        </>
      ) : null}
    </div>
  );
}
