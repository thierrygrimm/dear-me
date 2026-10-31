export type DemoAnswer = {
  text: string;
  thinkingLabel: string;
  steps: { id: string; label: string; duration: string }[];
  totalSeconds: number;
  widget?: {
    label: string;
    cue: string;
    verdict: string;
    detail: string;
    bars: { height: number; gap?: boolean }[];
  };
  quickReplies: string[];
  remembered?: string;
};

const DEFAULT: DemoAnswer = {
  text: "Good question. Here is what I found, based on your details: you are on track, and nothing needs to change today.",
  thinkingLabel: "Checking your numbers",
  steps: [
    { id: "1", label: "Read your question", duration: "0.4 s" },
    { id: "2", label: "Found your salary in myPax", duration: "0.8 s" },
    { id: "3", label: "Checked your goal", duration: "0.3 s" },
  ],
  totalSeconds: 1.5,
  quickReplies: ["What if 80 %?", "Can I go to 60 % after the baby?"],
};

const ANSWERS: Record<string, DemoAnswer> = {
  "Can I go to 60 % after the baby?": {
    text: "Yes, that works. About CHF 600 less a month at 65, and together you stay above your goal.",
    thinkingLabel: "Checking your numbers",
    steps: [
      { id: "1", label: "Read your question", duration: "0.4 s" },
      { id: "2", label: "Found your salary in myPax", duration: "0.8 s" },
      { id: "3", label: "Read your pension certificate", duration: "1.2 s" },
      { id: "4", label: "Calculated 100 % and 60 % with Logismata", duration: "2.1 s" },
      { id: "5", label: "Checked your goal", duration: "0.3 s" },
    ],
    totalSeconds: 4.8,
    widget: {
      label: "60 % after the baby",
      cue: "at 65",
      verdict: "That works.",
      detail: "CHF 3'640 a month",
      bars: [{ height: 56 }, { height: 6, gap: true }, { height: 12 }],
    },
    quickReplies: ["What if 80 %?", "Compare with Marco"],
  },
  "What if 80 %?": {
    text: "At 80 %, about CHF 300 less a month at 65. Still comfortably above your goal.",
    thinkingLabel: "Recalculating at 80 %",
    steps: [
      { id: "1", label: "Read your question", duration: "0.3 s" },
      { id: "2", label: "Calculated 100 % and 80 % with Logismata", duration: "1.6 s" },
      { id: "3", label: "Checked your goal", duration: "0.3 s" },
    ],
    totalSeconds: 2.2,
    widget: {
      label: "80 % after the baby",
      cue: "at 65",
      verdict: "Still fine.",
      detail: "About CHF 300 less a month",
      bars: [{ height: 56 }, { height: 18, gap: true }, { height: 12 }],
    },
    quickReplies: ["What if 60 %?", "Compare with Marco"],
  },
  "What if 60 %?": {
    text: "Yes, that works. About CHF 600 less a month at 65, and together you stay above your goal.",
    thinkingLabel: "Recalculating at 60 %",
    steps: [
      { id: "1", label: "Read your question", duration: "0.3 s" },
      { id: "2", label: "Calculated 100 % and 60 % with Logismata", duration: "1.8 s" },
      { id: "3", label: "Checked your goal", duration: "0.3 s" },
    ],
    totalSeconds: 2.4,
    widget: {
      label: "60 % after the baby",
      cue: "at 65",
      verdict: "That works.",
      detail: "CHF 3'640 a month",
      bars: [{ height: 56 }, { height: 6, gap: true }, { height: 12 }],
    },
    quickReplies: ["What if 80 %?", "Compare with Marco"],
  },
  "Compare with Marco": {
    text: "If Marco reduces instead, the two of you lose about CHF 520 a month, because his pension fund grows faster.",
    thinkingLabel: "Comparing both of you",
    steps: [
      { id: "1", label: "Read your question", duration: "0.3 s" },
      { id: "2", label: "Found Marco's salary in myPax", duration: "0.7 s" },
      { id: "3", label: "Calculated both pensions with Logismata", duration: "2.0 s" },
    ],
    totalSeconds: 3.0,
    quickReplies: ["What if 80 %?", "Can I go to 60 % after the baby?"],
  },
  "We're expecting in March.": {
    text: "Noted. I'll keep March in mind when we look at parental leave and workload.",
    thinkingLabel: "Saving what you said",
    steps: [
      { id: "1", label: "Read your message", duration: "0.2 s" },
      { id: "2", label: "Saved to what we know", duration: "0.4 s" },
    ],
    totalSeconds: 0.6,
    remembered: "Saved: baby due March 2027",
    quickReplies: ["Can I go to 60 % after the baby?", "What if 80 %?"],
  },
};

export function resolveDemoAnswer(question: string): DemoAnswer {
  const exact = ANSWERS[question.trim()];
  if (exact) return exact;

  const lower = question.toLowerCase();
  if (lower.includes("marco") || lower.includes("compare")) {
    return ANSWERS["Compare with Marco"]!;
  }
  if (lower.includes("80")) return ANSWERS["What if 80 %?"]!;
  if (lower.includes("60") || lower.includes("baby") || lower.includes("pensum")) {
    return ANSWERS["Can I go to 60 % after the baby?"]!;
  }
  if (lower.includes("expect") || lower.includes("march") || lower.includes("baby due")) {
    return ANSWERS["We're expecting in March."]!;
  }
  return DEFAULT;
}

export const STARTER_REPLIES = [
  "Can I go to 60 % after the baby?",
  "What if 80 %?",
  "We're expecting in March.",
];
