import { formatCHF } from "@/lib/format";
import { cn } from "@/lib/cn";

type Props = {
  low: number;
  high: number;
  label?: string;
  className?: string;
};

/** Range shown by form, not blur — dashed certainty. */
export function Estimate({ low, high, label, className }: Props) {
  return (
    <div className={cn(className)}>
      <div className="dm-prec__v">
        {formatCHF(low)} – {formatCHF(high)}
      </div>
      {label ? <div className="dm-prec__l">{label}</div> : null}
      <div className="dm-range" aria-hidden>
        <span className="dm-range__band" style={{ left: "18%", width: "52%" }} />
      </div>
    </div>
  );
}
