import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { Clock } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  title: string;
  duration?: string;
  nothingElse?: boolean;
  actionLabel?: string;
  onAction?: () => void;
  children?: ReactNode;
  className?: string;
};

export function NextStep({
  title,
  duration,
  nothingElse,
  actionLabel = "Continue",
  onAction,
  children,
  className,
}: Props) {
  if (nothingElse) {
    return (
      <div className={cn("dm-next dm-card", className)}>
        <p className="dm-label">{title}</p>
      </div>
    );
  }

  return (
    <div className={cn("dm-next dm-card", className)}>
      <div>
        <p style={{ margin: 0, font: "600 16px/22px var(--font-text)" }}>
          {title}
        </p>
        {duration ? (
          <span className="dm-next__time">
            <Clock size={14} strokeWidth={1.75} aria-hidden />
            {duration}
          </span>
        ) : null}
      </div>
      {children}
      {onAction ? (
        <Button variant="primary" block onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
