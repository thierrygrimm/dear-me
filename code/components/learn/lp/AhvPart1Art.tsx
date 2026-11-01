type Props = { step: number };

function PayAsYouGoSvg() {
  const workers = [
    [44, 104, "0.10s"],
    [72, 104, "0.16s"],
    [100, 104, "0.22s"],
    [128, 104, "0.28s"],
    [44, 134, "0.34s"],
    [72, 134, "0.40s"],
    [100, 134, "0.46s"],
    [128, 134, "0.52s"],
    [44, 164, "0.58s"],
    [72, 164, "0.64s"],
    [100, 164, "0.70s"],
    [128, 164, "0.76s"],
  ] as const;
  const retired = [
    [252, 119, "0.90s"],
    [284, 119, "0.98s"],
    [252, 151, "1.06s"],
    [284, 151, "1.14s"],
  ] as const;

  return (
    <svg className="lp" viewBox="0 0 340 280" aria-hidden="true">
      <text
        x="86"
        y="72"
        textAnchor="middle"
        fontFamily="var(--font-text)"
        fontWeight="600"
        fontSize="15"
        fill="var(--espressosatz)"
      >
        Working
      </text>
      <text
        x="268"
        y="72"
        textAnchor="middle"
        fontFamily="var(--font-text)"
        fontWeight="600"
        fontSize="15"
        fill="var(--espressosatz)"
      >
        Retired
      </text>
      {workers.map(([cx, cy, delay]) => (
        <circle
          key={`w-${cx}-${cy}`}
          className="lp-dot"
          style={{ animationDelay: delay }}
          cx={cx}
          cy={cy}
          r="10"
          fill="var(--espressosatz)"
        />
      ))}
      <path
        className="lp-arrow"
        d="M162 134 H222"
        stroke="var(--espressosatz)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        className="lp-arrow"
        d="M210 122 L224 134 L210 146"
        fill="none"
        stroke="var(--espressosatz)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {retired.map(([cx, cy, delay]) => (
        <circle
          key={`r-${cx}-${cy}`}
          className="lp-dot"
          style={{ animationDelay: delay }}
          cx={cx}
          cy={cy}
          r="12"
          fill="var(--kaugummi)"
        />
      ))}
    </svg>
  );
}

function RateBig() {
  return (
    <div className="lp-big">
      <b>10.6 %</b>
      <span>of every salary</span>
    </div>
  );
}

function PensionRangeSvg() {
  return (
    <svg className="lp" viewBox="0 0 340 280" aria-hidden="true">
      <rect
        x="40"
        y="88"
        width="104"
        height="120"
        rx="14"
        fill="var(--briefpapier)"
        stroke="var(--espressosatz)"
        strokeWidth="2"
      />
      <rect
        className="lp-grow"
        x="196"
        y="48"
        width="104"
        height="160"
        rx="14"
        fill="var(--neonweste)"
        stroke="var(--espressosatz)"
        strokeWidth="2"
      />
      <text
        x="92"
        y="240"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontWeight="700"
        fontSize="22"
        fill="var(--espressosatz)"
      >
        1&apos;260
      </text>
      <text
        x="248"
        y="240"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontWeight="700"
        fontSize="22"
        fill="var(--espressosatz)"
      >
        2&apos;520
      </text>
    </svg>
  );
}

function GapsSvg() {
  const cols = 11;
  const rows = 4;
  const x0 = 34;
  const y0 = 60;
  const dx = 27.2;
  const dy = 36;
  const gapKeys = new Set(["5-0", "6-0"]);

  const dots = Array.from({ length: rows }, (_, row) =>
    Array.from({ length: cols }, (_, col) => {
      const i = row * cols + col;
      const key = `${col}-${row}`;
      return {
        key,
        cx: x0 + col * dx,
        cy: y0 + row * dy,
        delay: `${(i * 0.03).toFixed(2)}s`,
        gap: gapKeys.has(key),
      };
    }),
  ).flat();

  return (
    <svg className="lp" viewBox="0 0 340 280" aria-hidden="true">
      {dots.map(({ key, cx, cy, delay, gap }) =>
        gap ? (
          <circle
            key={key}
            className="lp-dot"
            style={{ animationDelay: delay }}
            cx={cx}
            cy={cy}
            r="10"
            fill="none"
            stroke="var(--kaugummi)"
            strokeWidth="3"
            strokeDasharray="4 3"
          />
        ) : (
          <circle
            key={key}
            className="lp-dot"
            style={{ animationDelay: delay }}
            cx={cx}
            cy={cy}
            r="10"
            fill="var(--espressosatz)"
          />
        ),
      )}
      <text
        x="34"
        y="232"
        textAnchor="start"
        fontFamily="var(--font-text)"
        fontWeight="600"
        fontSize="15"
        fill="var(--espressosatz)"
      >
        44 years, 2 missing
      </text>
    </svg>
  );
}

export function AhvPart1Art({ step }: Props) {
  if (step === 0) return <PayAsYouGoSvg />;
  if (step === 1) return <RateBig />;
  if (step === 2) return <PensionRangeSvg />;
  if (step === 3 || step === 4) return <GapsSvg />;
  return null;
}
