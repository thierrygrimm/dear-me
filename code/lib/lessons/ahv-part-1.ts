export const ahvPart1Meta = {
  id: "ahv-part-1" as const,
  title: "The state pension (AHV)",
  time: "4 min · part 1",
  art: "ahv" as const,
  background: "var(--neonweste)",
  isNew: true,
};

const quizOptions = [
  "Gaps don't matter",
  "About 2.3 % less per year",
  "Pay them any time",
] as const;

const quizOk = "Right. Each missing year is 1/44, for life.";
const quizNo =
  "Not quite. Each missing year cuts the pension by about 2.3 %, for life.";

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
      body: "The AHV is no savings pot with your name on it. What everyone pays now goes straight to today's pensioners; in return you earn a right to a pension, set by law.",
      cta: "Next",
    },
    {
      kind: "lp" as const,
      artBg: "var(--rosa-brille)",
      headline: "Everyone who lives or works here pays.",
      body: "Employees from the January after their 17th birthday, everyone else from 20. Couples where one partner doesn't work: the other's contributions can cover both.",
      cta: "Next",
    },
    {
      kind: "lp" as const,
      artBg: "var(--briefpapier)",
      headline: "Between CHF 1'260 and 2'520 a month.",
      body: "That's a full single pension in 2026. Where you land depends on your average income over the years, plus credits for raising children or caring for family.",
      cta: "Next",
    },
    {
      kind: "lq" as const,
      artBg: "var(--rosa-brille)",
      headline: "Every missing year costs 1/44.",
      body: "A full pension needs 44 contribution years. Each gap cuts it by about 2.3 %, for life. Missed contributions can only be paid within five years.",
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
