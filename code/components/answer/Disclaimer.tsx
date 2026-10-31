import { copy } from "@/lib/copy";
import { cn } from "@/lib/cn";

type Props = {
  children?: string;
  /** Short chat line uses dm-note; long answer copy stays muted text */
  variant?: "note" | "plain";
  className?: string;
};

export function Disclaimer({
  children,
  variant = "note",
  className,
}: Props) {
  const text =
    children ??
    (variant === "plain" ? copy.answer.disclaimer : copy.answer.disclaimerShort);

  if (variant === "plain") {
    return <p className={cn("dm-small dm-muted", className)}>{text}</p>;
  }

  return (
    <p className={cn("dm-note", className)}>
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="8" cy="8" r="6.5" />
        <path d="M8 7.5v4" />
        <circle className="dot" cx="8" cy="5.1" r=".9" />
      </svg>
      <span>{text}</span>
    </p>
  );
}
