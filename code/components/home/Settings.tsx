"use client";

import { cn } from "@/lib/cn";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

export type SettingsRow = {
  id: string;
  title: string;
  subtitle?: string;
  value?: string;
  icon?: ReactNode;
  danger?: boolean;
  switchChecked?: boolean;
  onClick?: () => void;
  onToggle?: (next: boolean) => void;
};

type Props = {
  sections: { id: string; title: string; rows: SettingsRow[] }[];
  className?: string;
};

export function SettingsList({ sections, className }: Props) {
  return (
    <div className={cn("dm-set", className)}>
      {sections.map((section) => (
        <section key={section.id}>
          <h6>{section.title}</h6>
          {section.rows.map((row) => {
            if (row.onToggle !== undefined) {
              return (
                <div key={row.id} className="dm-li">
                  {row.icon ? <span className="ic">{row.icon}</span> : null}
                  <span className="tx">
                    {row.title}
                    {row.subtitle ? <small>{row.subtitle}</small> : null}
                  </span>
                  <button
                    type="button"
                    className="dm-switch"
                    role="switch"
                    aria-checked={row.switchChecked ?? false}
                    aria-label={row.title}
                    onClick={() => row.onToggle?.(!(row.switchChecked ?? false))}
                  />
                </div>
              );
            }
            return (
              <button
                key={row.id}
                type="button"
                className={cn("dm-li", row.danger && "danger")}
                onClick={row.onClick}
              >
                {row.icon ? <span className="ic">{row.icon}</span> : null}
                <span className="tx">
                  {row.title}
                  {row.subtitle ? <small>{row.subtitle}</small> : null}
                </span>
                <em style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {row.value}
                  <ChevronRight size={14} strokeWidth={2} aria-hidden />
                </em>
              </button>
            );
          })}
        </section>
      ))}
    </div>
  );
}
