export const ahvPart1Meta = {
  id: "ahv-part-1" as const,
  title: "The state pension (AHV)",
  time: "4 min · part 1",
  art: "ahv" as const,
  background: "var(--neonweste)",
  isNew: true,
};

const quizOptions = [
  "Nothing",
  "About 4.5 % less, for life",
  "I can pay them any time",
] as const;

const quizOk = "Right. Each missing year is 1/44, for life.";
const quizNo = "Not quite. Two gaps mean about 4.5 % less, for life.";

export const ahvPart1Content = {
  id: "ahv-part-1" as const,
  dataGen: "ahv1" as const,
  okFeedback: quizOk,
  noFeedback: quizNo,
  steps: [
    {
      kind: "lp" as const,
      artBg: "var(--neonweste)",
      headline: "Today's workers pay today's pensions.",
      body: "No pot with your name on it. Your right to a pension is set by law.",
      cta: "Next",
    },
    {
      kind: "lp" as const,
      artBg: "var(--rosa-brille)",
      headline: "Everyone who works pays in.",
      body: "For AHV, IV and EO. Your employer pays half.",
      cta: "Next",
    },
    {
      kind: "lp" as const,
      artBg: "var(--briefpapier)",
      headline: "A full pension: CHF 1'260 to 2'520.",
      body: "A month, single, in 2026. Where you land depends on your average income.",
      cta: "Next",
    },
    {
      kind: "lp" as const,
      artBg: "var(--rosa-brille)",
      headline: "Every missing year costs 1/44.",
      body: "That's about 2.3 % less, for life. You can fill a gap within five years.",
      cta: "Next",
    },
    {
      kind: "lq" as const,
      artBg: "var(--rosa-brille)",
      headline: "Two missing years. What happens?",
      body: "",
      cta: "Finish",
      options: [...quizOptions],
      correctIndex: 1,
    },
  ],
  quiz: {
    options: [...quizOptions],
    correctIndex: 1,
    ok: quizOk,
    no: quizNo,
  },
  doneTitle: "You know how the AHV works.",
  doneBody: "Next: couples, the 13th month, and age 65.",
  doneCta: "Continue",
  doneCtaHref: "/learn?lesson=ahv-part-2",
};
