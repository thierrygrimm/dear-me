import { cn } from "@/lib/cn";

export type CoverageArea = {
  id: string;
  label: string;
  score: number; // 0–100
  thin?: boolean;
};

type Props = {
  areas: CoverageArea[];
  headline?: string;
  className?: string;
};

export function Coverage({ areas, headline, className }: Props) {
  return (
    <section className={cn("dm-cov", className)}>
      {headline ? (
        <p className="dm-covhead">
          <b>{headline}</b>
        </p>
      ) : null}
      {areas.map((a) => (
        <div key={a.id} className={cn("dm-covr", a.thin && "thin")}>
          <span>{a.label}</span>
          <span className="tr">
            <i style={{ width: `${Math.max(0, Math.min(100, a.score))}%` }} />
          </span>
          <em>
            {a.score >= 80 ? "Good" : a.score >= 50 ? "Okay" : "Thin"}
          </em>
        </div>
      ))}
    </section>
  );
}
