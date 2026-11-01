type Props = { step: number };

function PillarsEqualSvg() {
  return (
    <svg className="lp" viewBox="0 0 340 300" aria-hidden="true">
      <rect
        x="14"
        y="52"
        width="312"
        height="14"
        rx="4"
        fill="var(--pflaumenkuchen)"
      />
      <rect
        x="14"
        y="240"
        width="312"
        height="16"
        rx="4"
        fill="var(--pflaumenkuchen)"
      />
      <g className="lp-col" style={{ animationDelay: "0.15s" }}>
        <rect
          x="26"
          y="70"
          width="80"
          height="170"
          rx="10"
          fill="var(--espressosatz)"
        />
        <text
          x="66"
          y="118"
          textAnchor="middle"
          fontFamily="var(--font-display)"
          fontWeight="700"
          fontSize="34"
          fill="var(--briefpapier)"
        >
          1
        </text>
        <text
          x="66"
          y="150"
          textAnchor="middle"
          fontFamily="var(--font-text)"
          fontWeight="600"
          fontSize="12"
          fill="var(--briefpapier)"
        >
          The state
        </text>
        <text
          x="66"
          y="168"
          textAnchor="middle"
          fontFamily="var(--font-text)"
          fontSize="10.5"
          fill="var(--briefpapier)"
          opacity=".8"
        >
          AHV · IV
        </text>
      </g>
      <g className="lp-col" style={{ animationDelay: "0.33s" }}>
        <rect
          x="122"
          y="70"
          width="80"
          height="170"
          rx="10"
          fill="var(--neonweste)"
        />
        <text
          x="162"
          y="118"
          textAnchor="middle"
          fontFamily="var(--font-display)"
          fontWeight="700"
          fontSize="34"
          fill="var(--espressosatz)"
        >
          2
        </text>
        <text
          x="162"
          y="150"
          textAnchor="middle"
          fontFamily="var(--font-text)"
          fontWeight="600"
          fontSize="12"
          fill="var(--espressosatz)"
        >
          Your job
        </text>
        <text
          x="162"
          y="168"
          textAnchor="middle"
          fontFamily="var(--font-text)"
          fontSize="10.5"
          fill="var(--espressosatz)"
          opacity=".8"
        >
          Pension fund
        </text>
      </g>
      <g className="lp-col" style={{ animationDelay: "0.51s" }}>
        <rect
          x="218"
          y="70"
          width="80"
          height="170"
          rx="10"
          fill="var(--kaugummi)"
        />
        <text
          x="258"
          y="118"
          textAnchor="middle"
          fontFamily="var(--font-display)"
          fontWeight="700"
          fontSize="34"
          fill="var(--espressosatz)"
        >
          3
        </text>
        <text
          x="258"
          y="150"
          textAnchor="middle"
          fontFamily="var(--font-text)"
          fontWeight="600"
          fontSize="12"
          fill="var(--espressosatz)"
        >
          You
        </text>
        <text
          x="258"
          y="168"
          textAnchor="middle"
          fontFamily="var(--font-text)"
          fontSize="10.5"
          fill="var(--espressosatz)"
          opacity=".8"
        >
          3a · 3b
        </text>
      </g>
    </svg>
  );
}

function SalarySixtySvg() {
  return (
    <svg className="lp" viewBox="0 0 340 300" aria-hidden="true">
      <text
        x="40"
        y="58"
        fontFamily="var(--font-text)"
        fontSize="12"
        fill="var(--espressosatz)"
      >
        Your last salary
      </text>
      <rect
        x="40"
        y="68"
        width="260"
        height="34"
        rx="8"
        fill="var(--espressosatz)"
      />
      <text
        x="40"
        y="146"
        fontFamily="var(--font-text)"
        fontSize="12"
        fill="var(--espressosatz)"
      >
        Pillars 1 and 2 together, roughly
      </text>
      <g className="lp-grow">
        <rect
          x="40"
          y="156"
          width="88"
          height="34"
          rx="8"
          fill="var(--briefpapier)"
          stroke="var(--espressosatz)"
          strokeWidth="2"
        />
        <rect
          x="128"
          y="156"
          width="68"
          height="34"
          fill="var(--neonweste)"
          stroke="var(--espressosatz)"
          strokeWidth="2"
        />
      </g>
      <text
        x="206"
        y="179"
        fontFamily="var(--font-display)"
        fontWeight="700"
        fontSize="20"
        fill="var(--espressosatz)"
      >
        ≈ 60 %
      </text>
      <rect
        x="40"
        y="206"
        width="260"
        height="34"
        rx="8"
        fill="none"
        stroke="var(--espressosatz)"
        strokeWidth="2"
        strokeDasharray="6 6"
        opacity=".5"
      />
      <text
        x="48"
        y="262"
        fontFamily="var(--font-text)"
        fontSize="12"
        fill="var(--espressosatz)"
      >
        The rest: your 3a, or a smaller life
      </text>
    </svg>
  );
}

function ProtectionSvg() {
  return (
    <svg className="lp" viewBox="0 0 340 300" aria-hidden="true">
      <text
        x="182"
        y="74"
        textAnchor="middle"
        fontFamily="var(--font-text)"
        fontSize="11"
        fill="var(--espressosatz)"
        opacity=".7"
      >
        Pillar 1
      </text>
      <text
        x="276"
        y="74"
        textAnchor="middle"
        fontFamily="var(--font-text)"
        fontSize="11"
        fill="var(--espressosatz)"
        opacity=".7"
      >
        Pillar 2
      </text>
      <g className="lp-row" style={{ animationDelay: "0.15s" }}>
        <text
          x="20"
          y="104"
          fontFamily="var(--font-text)"
          fontWeight="600"
          fontSize="13"
          fill="var(--espressosatz)"
        >
          If you can&apos;t work
        </text>
        <rect
          x="140"
          y="84"
          width="84"
          height="32"
          rx="8"
          fill="var(--espressosatz)"
        />
        <text
          x="182"
          y="104"
          textAnchor="middle"
          fontFamily="var(--font-text)"
          fontSize="10"
          fill="var(--briefpapier)"
        >
          IV pension
        </text>
        <rect
          x="232"
          y="84"
          width="88"
          height="32"
          rx="8"
          fill="var(--neonweste)"
          stroke="var(--espressosatz)"
          strokeWidth="1.5"
        />
        <text
          x="276"
          y="104"
          textAnchor="middle"
          fontFamily="var(--font-text)"
          fontSize="10"
          fill="var(--espressosatz)"
        >
          Disability
        </text>
      </g>
      <g className="lp-row" style={{ animationDelay: "0.33s" }}>
        <text
          x="20"
          y="174"
          fontFamily="var(--font-text)"
          fontWeight="600"
          fontSize="13"
          fill="var(--espressosatz)"
        >
          If you die
        </text>
        <rect
          x="140"
          y="154"
          width="84"
          height="32"
          rx="8"
          fill="var(--espressosatz)"
        />
        <text
          x="182"
          y="174"
          textAnchor="middle"
          fontFamily="var(--font-text)"
          fontSize="10"
          fill="var(--briefpapier)"
        >
          Survivors
        </text>
        <rect
          x="232"
          y="154"
          width="88"
          height="32"
          rx="8"
          fill="var(--neonweste)"
          stroke="var(--espressosatz)"
          strokeWidth="1.5"
        />
        <text
          x="276"
          y="174"
          textAnchor="middle"
          fontFamily="var(--font-text)"
          fontSize="10"
          fill="var(--espressosatz)"
        >
          Partner, kids
        </text>
      </g>
      <g className="lp-row" style={{ animationDelay: "0.51s" }}>
        <text
          x="20"
          y="244"
          fontFamily="var(--font-text)"
          fontWeight="600"
          fontSize="13"
          fill="var(--espressosatz)"
        >
          At 65
        </text>
        <rect
          x="140"
          y="224"
          width="84"
          height="32"
          rx="8"
          fill="var(--espressosatz)"
        />
        <text
          x="182"
          y="244"
          textAnchor="middle"
          fontFamily="var(--font-text)"
          fontSize="10"
          fill="var(--briefpapier)"
        >
          Old age
        </text>
        <rect
          x="232"
          y="224"
          width="88"
          height="32"
          rx="8"
          fill="var(--neonweste)"
          stroke="var(--espressosatz)"
          strokeWidth="1.5"
        />
        <text
          x="276"
          y="244"
          textAnchor="middle"
          fontFamily="var(--font-text)"
          fontSize="10"
          fill="var(--espressosatz)"
        >
          Pension, capital
        </text>
      </g>
    </svg>
  );
}

export function ThreePillarsArt({ step }: Props) {
  if (step === 1) return <SalarySixtySvg />;
  if (step === 2) return <ProtectionSvg />;
  // steps 0 and 3 (quiz) share the equal pillars columns
  return <PillarsEqualSvg />;
}
