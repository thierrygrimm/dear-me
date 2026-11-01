import { cn } from "@/lib/cn";
import { copy } from "@/lib/copy";
import { useEffect, useState } from "react";

type Props = {
  name: string;
  line?: string;
  className?: string;
};

export function MemoryGreeting({ name, line, className }: Props) {
  const [hour, setHour] = useState<number | undefined>(undefined);
  useEffect(() => {
    setHour(new Date().getHours());
  }, []);
  const parts = copy.home.greeting(name, hour).split("\n");
  return (
    <header className={cn(className)}>
      <h1 className="dm-hello">
        {parts.map((part, i) => (
          <span key={`${i}-${part}`}>
            {i > 0 ? <br /> : null}
            {part}
          </span>
        ))}
      </h1>
      {line ? <p className="dm-muted" style={{ margin: "6px 0 0" }}>{line}</p> : null}
    </header>
  );
}

export type Fact = {
  id: string;
  label: string;
  source: string;
  onEdit?: () => void;
};

export function MemoryFacts({
  facts,
  className,
}: {
  facts: Fact[];
  className?: string;
}) {
  return (
    <div className={cn(className)}>
      {facts.map((f) => (
        <div key={f.id} className="dm-fact">
          <b>{f.label}</b>
          <span>{f.source}</span>
          {f.onEdit ? (
            <button type="button" onClick={f.onEdit}>
              Edit
            </button>
          ) : null}
        </div>
      ))}
    </div>
  );
}
