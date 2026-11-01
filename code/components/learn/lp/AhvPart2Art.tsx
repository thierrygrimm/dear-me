type Props = {
  step: number;
};

function CapBars() {
  return (
    <svg className="lp" viewBox="0 0 340 280" aria-hidden="true">
      <g className="lp-grow">
        <rect
          x={40}
          y={70}
          width={80}
          height={170}
          rx={12}
          fill="var(--espressosatz)"
        />
        <rect
          x={134}
          y={70}
          width={80}
          height={170}
          rx={12}
          fill="var(--espressosatz)"
        />
      </g>
      <rect
        className="lp-cut"
        x={40}
        y={70}
        width={174}
        height={56}
        fill="var(--rosa-brille)"
      />
      <path
        d="M28 126 H226"
        stroke="var(--kaugummi)"
        strokeWidth={4}
        strokeDasharray="8 6"
      />
      <text
        x={236}
        y={134}
        textAnchor="start"
        fontFamily="var(--font-display)"
        fontWeight={700}
        fontSize={24}
        fill="var(--espressosatz)"
      >
        150 %
      </text>
    </svg>
  );
}

function ThirteenCalendar() {
  const tiles = [
    [34, 56],
    [81, 56],
    [128, 56],
    [175, 56],
    [222, 56],
    [269, 56],
    [34, 108],
    [81, 108],
    [128, 108],
    [175, 108],
    [222, 108],
    [269, 108],
  ] as const;

  return (
    <svg className="lp" viewBox="0 0 340 280" aria-hidden="true">
      {tiles.map(([x, y]) => (
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width={38}
          height={42}
          rx={9}
          fill="var(--briefpapier)"
        />
      ))}
      <g className="lp-pop">
        <rect
          x={122}
          y={176}
          width={96}
          height={76}
          rx={14}
          fill="var(--espressosatz)"
        />
        <text
          x={170}
          y={226}
          textAnchor="middle"
          fontFamily="var(--font-display)"
          fontWeight={700}
          fontSize={34}
          fill="var(--neonweste)"
        >
          13
        </text>
      </g>
    </svg>
  );
}

function AgeStrip({ withTradeoff }: { withTradeoff?: boolean }) {
  const ages = [63, 64, 65, 66, 67, 68, 69, 70] as const;
  const xs = [30, 70, 110, 150, 190, 230, 270, 310] as const;

  return (
    <svg className="lp" viewBox="0 0 340 280" aria-hidden="true">
      {withTradeoff ? (
        <>
          <text
            x={30}
            y={100}
            textAnchor="start"
            fontFamily="var(--font-display)"
            fontWeight={700}
            fontSize={17}
            fill="var(--espressosatz)"
          >
            −6.8 % a year
          </text>
          <text
            x={310}
            y={100}
            textAnchor="end"
            fontFamily="var(--font-display)"
            fontWeight={700}
            fontSize={17}
            fill="var(--espressosatz)"
          >
            more
          </text>
          <rect
            x={30}
            y={124}
            width={80}
            height={14}
            rx={7}
            fill="var(--kaugummi)"
          />
          <rect
            className="lp-band"
            x={110}
            y={124}
            width={200}
            height={14}
            rx={7}
            fill="var(--neonweste)"
            stroke="var(--espressosatz)"
            strokeWidth={1.5}
          />
        </>
      ) : (
        <rect
          x={30}
          y={124}
          width={280}
          height={14}
          rx={7}
          fill="var(--briefpapier)"
        />
      )}
      {ages.map((age, i) => (
        <text
          key={age}
          x={xs[i]}
          y={176}
          textAnchor="middle"
          fontFamily="var(--font-text)"
          fontWeight={age === 65 ? 600 : 400}
          fontSize={14}
          fill="var(--espressosatz)"
        >
          {age}
        </text>
      ))}
      <g className="lp-pin">
        <circle cx={110} cy={131} r={20} fill="var(--espressosatz)" />
        <text
          x={110}
          y={137}
          textAnchor="middle"
          fontFamily="var(--font-display)"
          fontWeight={700}
          fontSize={15}
          fill="var(--neonweste)"
        >
          65
        </text>
      </g>
    </svg>
  );
}

export function AhvPart2Art({ step }: Props) {
  if (step === 0 || step === 4) return <CapBars />;
  if (step === 1) return <ThirteenCalendar />;
  if (step === 2) return <AgeStrip />;
  if (step === 3) return <AgeStrip withTradeoff />;
  return null;
}
