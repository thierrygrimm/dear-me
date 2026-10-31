/** English product copy — keep strings here so German can follow. */
export const copy = {
  brand: "dear me",
  askPlaceholder: "What's on your mind?",
  askWriting: "Writing it down…",
  askCancel: "Cancel",
  askStop: "Stop listening",
  askSpeak: "Speak",
  askSend: "Send",
  askAttach: "Add a document",
  waiting: "One moment, we're doing the maths with you.",
  nothingElse: "You don't need anything else.",
  allSet: "All set for now",
  thatsAll: "That's all for today.",
  tabs: {
    home: "Home",
    plan: "Plan",
    ask: "Ask",
    learn: "Learn",
    me: "Me",
  },
  home: {
    greeting: (name: string) => `Good morning, ${name}`,
    heroLine: "We're expecting a baby. Let's see what that changes.",
    heroCta: "Start with the safety net",
    feedHeading: "Worth a look",
    letterTitle: "A letter to future you",
  },
  answer: {
    pensumQuestion: "What if I work less after the baby?",
    pensumSentence: (chf: string) =>
      `About ${chf} less a month later on, for life.`,
    disclaimer:
      "Figures are calculated from what we know. Tap any number for its source.",
  },
  plan: {
    title: "Your plan",
    empty: "No open steps right now.",
  },
  learn: {
    title: "Learn",
    empty: "Two-minute lessons will land here.",
  },
  me: {
    title: "You",
    whatWeKnow: "What we know",
    documents: "Documents",
    privacy: "Privacy and data",
    reminders: "Reminders",
    partner: "Partner",
    help: "Help",
  },
  signup: {
    welcome: "Welcome to dear me",
    welcomeSub: "A planner for life's big moments.",
    continuePax: "Continue with myPax",
    continueApple: "Continue with Apple",
    continueGoogle: "Continue with Google",
    continueEmail: "Continue with email",
    or: "or",
    lookAround: "Just look around",
  },
  chat: {
    title: "Ask",
    history: "Earlier chats",
    close: "Close",
  },
  states: {
    emptyTitle: "All set for now",
    emptyBody: "Nothing waiting. Ask whenever something comes up.",
    errorTitle: "Something went wrong",
    errorBody: "Your data is safe. Try again in a moment.",
    offlineTitle: "You're offline",
    offlineBody: "We'll sync when you're back. What you typed is still here.",
    retry: "Try again",
    goHome: "Back home",
  },
  toast: {
    saved: "Saved",
    undo: "Undo",
  },
  offer: {
    why: "Why this?",
    book: "Talk it through with Pax",
  },
} as const;

export type Copy = typeof copy;
