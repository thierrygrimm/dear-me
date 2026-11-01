import type { LifeMoment } from "@/lib/session";

export type MomentOption = {
  id: string;
  label: string;
};

export type MomentQuestion = {
  id: string;
  question: string;
  options: MomentOption[];
  /** Quiet line under the taps (bring in a document). */
  note?: string;
};

export type MomentOffer = {
  title: string;
  body: string;
  facts: { label: string; value: string }[];
};

export type MomentReveal = {
  sentence: string;
  big: { label: string; value: string; meaning: string };
  note: string;
  next: string[];
  offer: MomentOffer;
};

export type MomentScript = {
  id: LifeMoment;
  /** Greeting before the first bold question. */
  greeting: (name: string) => string;
  questions: MomentQuestion[];
  reveal: (answers: Record<string, string>) => MomentReveal;
  /** Research-style chips after the moment ask is done. */
  startersAfter: string[];
};

function hi(name: string): string {
  return name && name !== "there" ? `Hi ${name}.` : "Hi.";
}

/**
 * LifeMoments C1–C3 scripts from the design system.
 * Ask before telling: one (or a few) tap questions, then one number, then a
 * product only when asked.
 */
export const momentScripts: Record<LifeMoment, MomentScript> = {
  firstjob: {
    id: "firstjob",
    greeting: (name) =>
      `${hi(name)} A first job, nice. One quick question, so I don't have to guess:`,
    questions: [
      {
        id: "employer_pk",
        question: "Does your employer pay into a pension fund for you?",
        options: [
          { id: "yes", label: "Yes" },
          { id: "no", label: "No" },
          { id: "unsure", label: "Not sure" },
        ],
        note: "Or tap + and bring in your pension certificate.",
      },
    ],
    reveal: (answers) => {
      const has = answers.employer_pk === "yes";
      return {
        sentence: has
          ? "Then you're off to a good start. One spot is thin:"
          : "That's common at the start. One spot is thin either way:",
        big: {
          label: "If you couldn't work",
          value: "CHF 1'900",
          meaning: "a month less than you earn now",
        },
        note: has
          ? "Estimated from your salary. Your certificate makes it exact."
          : "Without a fund, AHV alone leaves a wider gap. A certificate or payslip makes it exact.",
        next: ["What could help?", "How did you get this?"],
        offer: {
          title: "Income protection for young people",
          body: "Pays a monthly income if illness or an accident stops you working. Made for ages 15 to 28.",
          facts: [
            { label: "Pays up to", value: "CHF 36'000 a year" },
            { label: "Price", value: "With an advisor" },
          ],
        },
      };
    },
    startersAfter: [
      "What if I change jobs?",
      "How much should I save in 3a?",
      "What does SIRjL cover?",
    ],
  },

  selfemployed: {
    id: "selfemployed",
    greeting: (name) =>
      `${hi(name)} Your own business, good for you. Before I say anything:`,
    questions: [
      {
        id: "pays_pk",
        question: "Do you pay into a pension fund now?",
        options: [
          { id: "yes", label: "Yes" },
          { id: "no", label: "No" },
          { id: "what", label: "What's that?" },
        ],
        note: "Or tap + and bring in a statement if you have one.",
      },
    ],
    reveal: (answers) => {
      const no = answers.pays_pk !== "yes";
      return {
        sentence: no
          ? "Then the gap if you couldn't work is the main one:"
          : "Good. Even with a fund, one spot is often thin:",
        big: {
          label: "If you couldn't work",
          value: "CHF 2'400",
          meaning: "a month less than you take home now",
        },
        note: "Estimated for self-employed cover. Your numbers make it exact.",
        next: ["What could help?", "How did you get this?"],
        offer: {
          title: "Income protection while you build",
          body: "A monthly income if illness or an accident stops you working — built for people without a classic employer fund.",
          facts: [
            { label: "Focus", value: "Income gap" },
            { label: "Next", value: "With an advisor" },
          ],
        },
      };
    },
    startersAfter: [
      "How much 3a can I pay?",
      "What if I hire someone?",
      "Compare with employed cover",
    ],
  },

  home: {
    id: "home",
    greeting: (name) =>
      `${hi(name)} A home of your own. One question first:`,
    questions: [
      {
        id: "mortgage_names",
        question: "Is the mortgage in both your names?",
        options: [
          { id: "both", label: "Both" },
          { id: "one", label: "One of us" },
          { id: "unsure", label: "Not sure" },
        ],
        note: "Or tap + and bring in the mortgage papers.",
      },
    ],
    reveal: () => ({
      sentence: "The flat is yours. One thing still protects it:",
      big: {
        label: "If one of you dies",
        value: "CHF 420'000",
        meaning: "still owed on the mortgage in this example",
      },
      note: "Estimated from a typical first home. Your contract makes it exact.",
      next: ["What could help?", "How did you get this?"],
      offer: {
        title: "Cover that follows the mortgage",
        body: "A decreasing sum that tracks what you still owe, so the home stays with the other person.",
        facts: [
          { label: "Idea", value: "FKF · decreasing capital" },
          { label: "Price", value: "With an advisor" },
        ],
      },
    }),
    startersAfter: [
      "What about amortisation?",
      "Can we use pillar 2 for the home?",
      "Compare both of us",
    ],
  },

  child: {
    id: "child",
    greeting: (name) =>
      `${hi(name)} A baby on the way. A few quick questions, so I don't have to guess:`,
    questions: [
      {
        id: "due",
        question: "When is the baby due?",
        options: [
          { id: "spring", label: "This spring" },
          { id: "summer", label: "This summer" },
          { id: "later", label: "Later this year" },
          { id: "unsure", label: "Not sure yet" },
        ],
      },
      {
        id: "who_reduce",
        question: "Who might reduce work?",
        options: [
          { id: "me", label: "Me" },
          { id: "partner", label: "My partner" },
          { id: "both", label: "Both of us" },
          { id: "undecided", label: "Not decided" },
        ],
      },
      {
        id: "married",
        question: "Are you married?",
        options: [
          { id: "yes", label: "Yes" },
          { id: "together", label: "No, living together" },
          { id: "unsure", label: "Not sure it matters" },
        ],
      },
      {
        id: "kids_already",
        question: "Do you have children already?",
        options: [
          { id: "first", label: "No, this is our first" },
          { id: "one", label: "Yes, one" },
          { id: "more", label: "Yes, two or more" },
        ],
      },
      {
        id: "salary_band",
        question: "Roughly what do you earn a year?",
        options: [
          { id: "under60", label: "Under 60'000" },
          { id: "60to100", label: "60'000 to 100'000" },
          { id: "over100", label: "Over 100'000" },
          { id: "prefer_not", label: "Rather not say" },
        ],
        note: "Or tap + and bring in your pension certificate.",
      },
    ],
    reveal: (answers) => {
      const meCuts =
        answers.who_reduce === "me" || answers.who_reduce === "both";
      return {
        sentence: meCuts
          ? "If you go to 60 % after the baby, one number stands out:"
          : "Before you decide who stays home, one number stands out:",
        big: {
          label: "At 65, together",
          value: "CHF 600",
          meaning: "less a month if you go to 60 %",
        },
        note: "From your salary and pension fund. We can play with the slider next.",
        next: ["What could help?", "Can I go to 60 % after the baby?"],
        offer: {
          title: "A pension for the family",
          body: "Monthly income for the people who depend on you, if the worst happens — plus room for a children's policy later.",
          facts: [
            { label: "Idea", value: "FR · family pension" },
            { label: "Also", value: "Kinderversicherung" },
          ],
        },
      };
    },
    startersAfter: [
      "Can I go to 60 % after the baby?",
      "What if 80 %?",
      "Compare with Marco",
    ],
  },

  less: {
    id: "less",
    greeting: (name) =>
      `${hi(name)} Working less changes the pension more than people think. One question first:`,
    questions: [
      {
        id: "target_pensum",
        question: "How much do you plan to work?",
        options: [
          { id: "80", label: "About 80 %" },
          { id: "60", label: "About 60 %" },
          { id: "50", label: "About 50 %" },
          { id: "unsure", label: "Not sure yet" },
        ],
        note: "Or tap + and bring in your pension certificate.",
      },
    ],
    reveal: (answers) => {
      const pct = answers.target_pensum === "80" ? "300" : "600";
      return {
        sentence: "60 % pensum. Let's not make it 60 % pension. One number:",
        big: {
          label: "At 65",
          value: `CHF ${pct}`,
          meaning: "less a month than at 100 %, for life",
        },
        note: "Estimated from your certificate. The slider makes it yours.",
        next: ["What could help?", "What if 80 %?"],
        offer: {
          title: "Keep saving while you work less",
          body: "A 3a that can rise automatically, so a lower pensum does not freeze your retirement savings.",
          facts: [
            { label: "Idea", value: "TerzaFondsStar" },
            { label: "Also", value: "Income cover (SIR)" },
          ],
        },
      };
    },
    startersAfter: [
      "What if 80 %?",
      "What if 60 %?",
      "Compare with Marco",
    ],
  },

  together: {
    id: "together",
    greeting: (name) =>
      `${hi(name)} Living together, not married. The law treats that differently. One question:`,
    questions: [
      {
        id: "shared_home",
        question: "Do you already share a home and bills?",
        options: [
          { id: "yes", label: "Yes" },
          { id: "soon", label: "We're about to" },
          { id: "no", label: "Not yet" },
        ],
      },
    ],
    reveal: () => ({
      sentence: "You're not married. The law has noticed. One gap:",
      big: {
        label: "If one of you dies",
        value: "CHF 0",
        meaning: "from the other's pension fund, by default",
      },
      note: "Partners outside marriage need to be named. A beneficiary form fixes that.",
      next: ["What could help?", "How do we name each other?"],
      offer: {
        title: "Cover for both of you",
        body: "A policy that pays the other person if one of you dies — made for couples who aren't married.",
        facts: [
          { label: "Idea", value: "FK2 · two lives" },
          { label: "Also", value: "Name each other on pillar 2" },
        ],
      },
    }),
    startersAfter: [
      "How do we name each other?",
      "What about taxes together?",
      "Compare both of us",
    ],
  },

  separating: {
    id: "separating",
    greeting: (name) =>
      `${hi(name)} A new start. New numbers. One question first:`,
    questions: [
      {
        id: "shared_pk",
        question: "Will you split a pension fund from the relationship?",
        options: [
          { id: "yes", label: "Yes" },
          { id: "no", label: "No" },
          { id: "unsure", label: "Not sure" },
        ],
        note: "Or tap + and bring in the divorce papers or a statement.",
      },
    ],
    reveal: () => ({
      sentence: "After a split, retirement often needs a restart. One number:",
      big: {
        label: "Typical gap to close",
        value: "CHF 280",
        meaning: "a month at 65, if 3a pauses for a few years",
      },
      note: "A rough guide. Your decree and certificates make it exact.",
      next: ["What could help?", "How did you get this?"],
      offer: {
        title: "Restart your 3a",
        body: "A clean 3a for the next chapter, with beneficiaries you choose — and room for new family cover if you need it.",
        facts: [
          { label: "Idea", value: "FondsStar or LifeStar" },
          { label: "Also", value: "Update beneficiaries" },
        ],
      },
    }),
    startersAfter: [
      "How do beneficiaries work now?",
      "Should I restart 3a?",
      "What about AHV years?",
    ],
  },

  bonus: {
    id: "bonus",
    greeting: (name) =>
      `${hi(name)} A bonus or inheritance. Nice problem. One question:`,
    questions: [
      {
        id: "amount_band",
        question: "Roughly how much is it?",
        options: [
          { id: "under20", label: "Under 20'000" },
          { id: "20to50", label: "20'000 to 50'000" },
          { id: "over50", label: "Over 50'000" },
          { id: "prefer_not", label: "Rather not say" },
        ],
      },
    ],
    reveal: () => ({
      sentence: "We didn't spend it all. One way it can work harder:",
      big: {
        label: "In 3a this year",
        value: "CHF 1'900",
        meaning: "tax you can still save in this example",
      },
      note: "Depends on your canton and what you've already paid in.",
      next: ["What could help?", "How did you get this?"],
      offer: {
        title: "Invest the windfall with a plan",
        body: "A one-off into funds or a guarantee share — so the money has a job before it drifts into spending.",
        facts: [
          { label: "Idea", value: "FondsStarInvest / LifeStarInvest" },
          { label: "Also", value: "Privileged top-up if you qualify" },
        ],
      },
    }),
    startersAfter: [
      "How much 3a is left this year?",
      "Guarantee or funds?",
      "What if I need the money later?",
    ],
  },

  caring: {
    id: "caring",
    greeting: (name) =>
      `${hi(name)} You're caring for someone. Who's caring for your pension? One question:`,
    questions: [
      {
        id: "cut_work",
        question: "Are you reducing work to care?",
        options: [
          { id: "yes", label: "Yes" },
          { id: "soon", label: "I might" },
          { id: "no", label: "Not for now" },
        ],
        note: "Or tap + and bring in your pension certificate.",
      },
    ],
    reveal: (answers) => {
      const cutting = answers.cut_work !== "no";
      return {
        sentence: cutting
          ? "Caring often means less pensum. One number to watch:"
          : "Even without a cut, care years matter. One number:",
        big: {
          label: "At 65",
          value: "CHF 420",
          meaning: "less a month if care years stay unfilled",
        },
        note: "A sketch from typical care cuts. Your certificate makes it exact.",
        next: ["What could help?", "How did you get this?"],
        offer: {
          title: "Keep a little saving going",
          body: "A small 3a so care years don't freeze retirement — and income cover if your workload drops.",
          facts: [
            { label: "Idea", value: "3a + SIR" },
            { label: "Price", value: "With an advisor" },
          ],
        },
      };
    },
    startersAfter: [
      "What about AHV care credits?",
      "Can I keep 3a small?",
      "What if I stop working?",
    ],
  },
};

/** Prefer child/less demo path, else first selected moment. */
export function primaryMoment(moments: LifeMoment[]): LifeMoment | null {
  if (moments.includes("child")) return "child";
  if (moments.includes("less")) return "less";
  return moments[0] ?? null;
}

export function scriptFor(moment: LifeMoment): MomentScript {
  return momentScripts[moment];
}

/** Moments that use the numeric IntakeCard (pensum type/speak) after plan. */
export function needsNumericIntake(moments: LifeMoment[]): boolean {
  return moments.includes("child") || moments.includes("less");
}
