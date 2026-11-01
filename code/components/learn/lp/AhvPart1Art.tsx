type Props = { step: number };

function PayAsYouGoSvg() {
  const workers = [
    [40, 110, "0.10s"],
    [66, 110, "0.18s"],
    [92, 110, "0.26s"],
    [118, 110, "0.34s"],
    [40, 138, "0.42s"],
    [66, 138, "0.50s"],
    [92, 138, "0.58s"],
    [118, 138, "0.66s"],
    [40, 166, "0.74s"],
    [66, 166, "0.82s"],
    [92, 166, "0.90s"],
    [118, 166, "0.98s"],
  ] as const;
  const retired = [
    [244, 124, "0.90s"],
    [272, 124, "0.98s"],
    [244, 154, "1.06s"],
    [272, 154, "1.14s"],
  ] as const;

  return (
    <svg className="lp" viewBox="0 0 340 300" aria-hidden="true">
      <text
        x="79"
        y="80"
        textAnchor="middle"
        fontFamily="var(--font-text)"
        fontWeight="600"
        fontSize="12"
        fill="var(--espressosatz)"
      >
        Working today
      </text>
      <text
        x="258"
        y="80"
        textAnchor="middle"
        fontFamily="var(--font-text)"
        fontWeight="600"
        fontSize="12"
        fill="var(--espressosatz)"
      >
        Retired today
      </text>
      {workers.map(([cx, cy, delay]) => (
        <circle
          key={`w-${cx}-${cy}`}
          className="lp-dot"
          style={{ animationDelay: delay }}
          cx={cx}
          cy={cy}
          r="9"
          fill="var(--espressosatz)"
        />
      ))}
      <path
        className="lp-arrow"
        d="M150 150 H214"
        stroke="var(--espressosatz)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        className="lp-arrow"
        d="M202 138 L216 150 L202 162"
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
          r="11"
          fill="var(--kaugummi)"
          stroke="var(--espressosatz)"
          strokeWidth="2"
        />
      ))}
      <text
        x="170"
        y="250"
        textAnchor="middle"
        fontFamily="var(--font-text)"
        fontSize="12"
        fill="var(--espressosatz)"
      >
        No pot with your name: a promise, set by law
      </text>
    </svg>
  );
}

function RateBig() {
  return (
    <div className="lp-big">
      <b>10.6 %</b>
      <span>of your salary for AHV, IV and EO</span>
      <i>
        Half is paid by your employer. Self-employed people pay it all, a bit
        less in percent.
      </i>
    </div>
  );
}

function PensionRangeSvg() {
  return (
    <svg className="lp" viewBox="0 0 340 300" aria-hidden="true">
      <text
        x="30"
        y="96"
        fontFamily="var(--font-text)"
        fontSize="12"
        fill="var(--espressosatz)"
      >
        A month, single, full contribution years
      </text>
      <rect
        x="30"
        y="120"
        width="280"
        height="22"
        rx="11"
        fill="var(--briefpapier)"
      />
      <rect
        className="lp-band"
        x="30"
        y="120"
        width="280"
        height="22"
        rx="11"
        fill="var(--neonweste)"
        stroke="var(--espressosatz)"
        strokeWidth="2"
      />
      <text
        x="30"
        y="176"
        fontFamily="var(--font-display)"
        fontWeight="700"
        fontSize="22"
        fill="var(--espressosatz)"
      >
        1&apos;260
      </text>
      <text
        x="310"
        y="176"
        textAnchor="end"
        fontFamily="var(--font-display)"
        fontWeight="700"
        fontSize="22"
        fill="var(--espressosatz)"
      >
        2&apos;520
      </text>
      <text
        x="30"
        y="196"
        fontFamily="var(--font-text)"
        fontSize="11"
        fill="var(--espressosatz)"
        opacity=".7"
      >
        at least
      </text>
      <text
        x="310"
        y="196"
        textAnchor="end"
        fontFamily="var(--font-text)"
        fontSize="11"
        fill="var(--espressosatz)"
        opacity=".7"
      >
        at most
      </text>
      <text
        x="170"
        y="240"
        textAnchor="middle"
        fontFamily="var(--font-text)"
        fontSize="12"
        fill="var(--espressosatz)"
      >
        CHF, 2026 · twice the minimum is the maximum
      </text>
    </svg>
  );
}

function GapsSvg() {
  const xs = [34, 60, 86, 112, 138, 164, 190, 216, 242, 268, 294];
  const ys = [70, 104, 138, 172];
  const gapKeys = new Set(["164-70", "190-70"]);

  const dots = ys.flatMap((cy, row) =>
    xs.map((cx, col) => {
      const i = row * xs.length + col;
      const key = `${cx}-${cy}`;
      const gap = gapKeys.has(key);
      return {
        key,
        cx,
        cy,
        delay: `${(i * 0.04).toFixed(2)}s`,
        gap,
      };
    }),
  );

  return (
    <svg className="lp" viewBox="0 0 340 300" aria-hidden="true">
      {dots.map(({ key, cx, cy, delay, gap }) =>
        gap ? (
          <circle
            key={key}
            className="lp-dot"
            style={{ animationDelay: delay }}
            cx={cx}
            cy={cy}
            r="9"
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
            r="9"
            fill="var(--espressosatz)"
            stroke="var(--espressosatz)"
            strokeWidth="0"
          />
        ),
      )}
      <text
        x="34"
        y="222"
        fontFamily="var(--font-text)"
        fontSize="12"
        fill="var(--espressosatz)"
      >
        44 years, 21 to 65. Two gaps (pink):
      </text>
      <text
        x="34"
        y="250"
        fontFamily="var(--font-display)"
        fontWeight="700"
        fontSize="22"
        fill="var(--espressosatz)"
      >
        −2 × 1/44 ≈ −4.5 %, for life
      </text>
    </svg>
  );
}

export function AhvPart1Art({ step }: Props) {
  if (step === 0) return <PayAsYouGoSvg />;
  if (step === 1) return <RateBig />;
  if (step === 2) return <PensionRangeSvg />;
  if (step === 3) return <GapsSvg />;
  return null;
}
