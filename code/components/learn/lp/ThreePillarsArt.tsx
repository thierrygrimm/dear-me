type Props = { step: number };

type PillarId = "state" | "job" | "you";

const PILLARS: {
  id: PillarId;
  label: string;
  color: string;
  delays: string[];
}[] = [
  {
    id: "state",
    label: "The state",
    color: "var(--espressosatz)",
    delays: ["0.15s", "0.24s", "0.33s", "0.42s", "0.51s", "0.60s", "0.69s"],
  },
  {
    id: "job",
    label: "Your job",
    color: "var(--neonweste)",
    delays: ["0.20s", "0.29s", "0.38s", "0.47s", "0.56s"],
  },
  {
    id: "you",
    label: "You",
    color: "var(--kaugummi)",
    delays: ["0.25s", "0.34s", "0.43s"],
  },
];

/** Step → which pillar stays bright; undefined = all equal. */
const EMPHASIS: (PillarId | undefined)[] = [
  undefined, // intro — three equal stacks
  "state",
  "job",
  "you",
  undefined, // 60 % punchline (SVG)
  undefined, // quiz — three equal stacks
];

function PillarStacks({ emphasize }: { emphasize?: PillarId }) {
  return (
    <div className="ig-stacks ig-stacks--lg">
      {PILLARS.map((pillar) => {
        const dim = emphasize !== undefined && emphasize !== pillar.id;
        return (
          <div key={pillar.id} className={dim ? "dim" : undefined}>
            {/* First in DOM + column-reverse ⇒ label sits under the stack */}
            <span>{pillar.label}</span>
            {pillar.delays.map((delay, i) => (
              <i
                key={`${pillar.id}-${i}`}
                style={{
                  background: pillar.color,
                  animationDelay: delay,
                }}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}

function SalarySixtySvg() {
  return (
    <svg className="lp" viewBox="0 0 340 280" aria-hidden="true">
      <text
        x="40"
        y="96"
        textAnchor="start"
        fontFamily="var(--font-text)"
        fontWeight="600"
        fontSize="15"
        fill="var(--espressosatz)"
      >
        Your salary
      </text>
      <rect
        x="40"
        y="108"
        width="260"
        height="40"
        rx="12"
        fill="var(--briefpapier)"
      />
      <text
        x="40"
        y="190"
        textAnchor="start"
        fontFamily="var(--font-text)"
        fontWeight="600"
        fontSize="15"
        fill="var(--espressosatz)"
      >
        Pillars 1 + 2
      </text>
      <rect
        className="lp-grow"
        x="40"
        y="202"
        width="156"
        height="40"
        rx="12"
        fill="var(--espressosatz)"
      />
      <text
        x="212"
        y="232"
        textAnchor="start"
        fontFamily="var(--font-display)"
        fontWeight="700"
        fontSize="28"
        fill="var(--espressosatz)"
      >
        60 %
      </text>
    </svg>
  );
}

export function ThreePillarsArt({ step }: Props) {
  if (step === 4) return <SalarySixtySvg />;
  return <PillarStacks emphasize={EMPHASIS[step]} />;
}
