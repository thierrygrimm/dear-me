"use client";

import { Button } from "@/components/ui/Button";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/cn";
import { useState } from "react";

type Props = {
  title: string;
  body: string;
  why?: string;
  pax?: boolean;
  onBook?: () => void;
  className?: string;
};

export function OfferCard({
  title,
  body,
  why,
  pax,
  onBook,
  className,
}: Props) {
  const [open, setOpen] = useState(false);

  if (pax) {
    return (
      <article className={cn("dm-pax", className)}>
        <div className="dm-pax__brand">
          <span className="dm-pax__logo">Pax</span>
          <span className="dm-pax__label">Partner idea</span>
        </div>
        <b style={{ font: "700 18px/24px var(--font-display)" }}>{title}</b>
        <p style={{ margin: 0, font: "400 14px/20px var(--font-text)" }}>
          {body}
        </p>
        {onBook ? (
          <Button variant="pax" block onClick={onBook}>
            {copy.offer.book}
          </Button>
        ) : null}
      </article>
    );
  }

  return (
    <article className={cn("dm-offer dm-card", open && "is-open", className)}>
      <div className="dm-offer__head">
        <b style={{ font: "600 16px/22px var(--font-text)" }}>{title}</b>
        {why ? (
          <Button variant="text" onClick={() => setOpen((v) => !v)}>
            {copy.offer.why}
          </Button>
        ) : null}
      </div>
      <p className="dm-small dm-muted" style={{ margin: 0 }}>
        {body}
      </p>
      {why ? <div className="dm-offer__why dm-small">{why}</div> : null}
      {onBook ? (
        <Button variant="secondary" block onClick={onBook}>
          {copy.offer.book}
        </Button>
      ) : null}
    </article>
  );
}
