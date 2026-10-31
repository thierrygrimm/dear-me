import { Button } from "@/components/ui/Button";
import { Squirrel } from "@/components/brand/Squirrel";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/cn";

export type StateKind = "empty" | "error" | "offline";

type Props = {
  kind: StateKind;
  title?: string;
  body?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
  className?: string;
};

const defaults: Record<
  StateKind,
  { title: string; body: string; primary: string; secondary?: string }
> = {
  empty: {
    title: copy.states.emptyTitle,
    body: copy.states.emptyBody,
    primary: copy.states.goHome,
  },
  error: {
    title: copy.states.errorTitle,
    body: copy.states.errorBody,
    primary: copy.states.retry,
    secondary: copy.states.goHome,
  },
  offline: {
    title: copy.states.offlineTitle,
    body: copy.states.offlineBody,
    primary: copy.states.retry,
  },
};

export function States({
  kind,
  title,
  body,
  onPrimary,
  onSecondary,
  className,
}: Props) {
  const d = defaults[kind];
  return (
    <div className={cn("dm-state", className)}>
      <Squirrel state={kind === "empty" ? "idle" : "peek"} size={64} />
      <h3>{title ?? d.title}</h3>
      <p>{body ?? d.body}</p>
      <div className="acts">
        {onPrimary ? (
          <Button variant="primary" block onClick={onPrimary}>
            {d.primary}
          </Button>
        ) : null}
        {onSecondary && d.secondary ? (
          <Button variant="tonal" block onClick={onSecondary}>
            {d.secondary}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
