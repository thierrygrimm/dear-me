import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type Props = {
  question?: string;
  answer: ReactNode;
  note?: ReactNode;
  signal?: boolean;
  className?: string;
};

export function Verdict({
  question,
  answer,
  note,
  signal = true,
  className,
}: Props) {
  return (
    <section
      className={cn(
        "dm-verdict",
        signal ? "dm-verdict--signal" : "dm-verdict--plain",
        className,
      )}
    >
      {question ? <p className="dm-verdict__q">{question}</p> : null}
      <h1 className="dm-verdict__a">{answer}</h1>
      {note ? <p className="dm-verdict__n">{note}</p> : null}
    </section>
  );
}
