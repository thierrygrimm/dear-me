import { cn } from "@/lib/cn";

export type SourceKind = "confirmed" | "estimated" | "mypax" | "partner";

type Props = {
  kind?: SourceKind;
  label: string;
  className?: string;
};

const kindClass: Record<SourceKind, string> = {
  confirmed: "",
  estimated: "dm-src--estimated",
  mypax: "dm-src--mypax",
  partner: "dm-src--partner",
};

export function SourceTag({ kind = "confirmed", label, className }: Props) {
  return (
    <span className={cn("dm-src", kindClass[kind], className)}>{label}</span>
  );
}
