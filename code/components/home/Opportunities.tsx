import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export type Opportunity = {
  id: string;
  title: string;
  body: string;
  impact?: string;
  family?: boolean;
  glyph?: ReactNode;
};

type Props = {
  items: Opportunity[];
  layout?: "list" | "cards";
  className?: string;
};

function DefaultGlyph() {
  return (
    <svg className="dm-glyph" viewBox="0 0 20 20" aria-hidden>
      <path d="M10 2 L18 10 L10 18 L2 10 Z" />
    </svg>
  );
}

export function Opportunities({ items, layout = "list", className }: Props) {
  if (layout === "cards") {
    return (
      <div className={cn("dm-oppcards", className)}>
        {items.map((item) => (
          <div key={item.id} className={item.family ? "fam" : undefined}>
            {item.glyph ?? <DefaultGlyph />}
            <b>{item.title}</b>
            <p className="dm-small" style={{ margin: 0 }}>
              {item.body}
            </p>
            {item.impact ? <em>{item.impact}</em> : null}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={className}>
      {items.map((item) => (
        <div key={item.id} className="dm-opp">
          {item.glyph ?? <DefaultGlyph />}
          <b>{item.title}</b>
          {item.impact ? <em>{item.impact}</em> : null}
          <p>{item.body}</p>
        </div>
      ))}
    </div>
  );
}
