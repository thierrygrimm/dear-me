/** Product copy — English source of truth; DE / FR / IT live beside it. */

export const copyEn = {
  brand: "dear me",
  askPlaceholder: "What's on your mind?",
  askWriting: "Writing it down…",
  askCancel: "Cancel",
  askStop: "Stop listening",
  askSpeak: "Speak",
  askSend: "Send",
  askAttach: "Add a document",
  waiting: "One moment, we're doing the maths with you.",
  gettingReady: "Getting things ready",
  signingInPax: "Signing you in with myPax",
  signingInDetail: "This takes a few seconds",
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
    /** Words-first HomeHero C. Pass `hour` from the client (avoid `new Date()` at module default). */
    greeting: (name: string, hour?: number) => {
      const h = hour ?? 9;
      const hello =
        h >= 18 ? "Good evening," : h >= 12 ? "Good afternoon," : "Good morning,";
      return `${hello}\n${name}.`;
    },
    say: "Your safety net is strong. One spot is thin:",
    sayMark: "if you couldn't work.",
    heroCta: "Let's look at it",
    appointmentTitle: "Tuesday with Sara",
    appointmentMeta: "10:30 · video call",
    lessonTitle: "Why part-time costs more",
    lessonMeta: "A short lesson",
    noCertSay: "Start with one document. An estimate works too.",
    noCertCta: "Add your certificate",
    estimateTitle: "Look around with an estimate",
    estimateMeta: "About 2 minutes",
    feedHeading: "Worth a look",
    letterTitle: "A letter to future you",
  },
  answer: {
    pensumQuestion: "What if I work less after the baby?",
    pensumSentence: (chf: string) =>
      `About ${chf} less a month later on, for life.`,
    disclaimer:
      "Figures are calculated from what we know. Tap any number for its source.",
    disclaimerShort: "Guidance, not advice.",
    whoLabel: "Who is planning",
  },
  plan: {
    title: "Your plan",
    empty: "No open steps right now.",
    listHint: "Tap a step and we take you there.",
    doNow: "Do it now",
    skip: "Skip for now",
  },
  learn: {
    title: "Learn in a few minutes",
    subtitle: "Start with how Swiss pensions work, then your own numbers.",
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
  vault: {
    empty: "Nothing here yet. Tap Add to bring one in.",
    stored: "Stored encrypted in Switzerland. Only you can open them.",
    comingUp: "Coming up",
    askedForYou: "Asked for you",
    remindersNote:
      "These reminders come by email and in your plan, so nothing depends on push.",
    add: "Add",
    addTitle: "Add a document",
    scan: "Scan with your camera",
    scanDetail: "Paper or screen",
    upload: "Upload a PDF",
    uploadDetail: "From files or email",
    mypax: "Get it from myPax",
    mypaxDetail: "If you're insured with Pax",
    orEmail: "Or forward it by email",
    mailbox: "lena.7kq@docs.dearme.ch",
    copy: "Copy",
    copied: "Address copied",
    explain: "Explain it",
    share: "Share",
    replace: "Replace",
    deletePhoto: "Delete photo",
    deleteTitle: "Delete the photo?",
    deleteBody:
      "We keep the numbers we read, so your plan doesn't change. The image itself is gone for good.",
    deleteDone: "Photo deleted. Numbers kept.",
    keepPhoto: "Keep it",
    photoDeleted: "Photo removed. The numbers stay in your plan.",
    whatWeRead: "What we read",
    seeAll: (n: number) => `See all ${n} values`,
    seeLess: "Show fewer values",
    shareSoon: "Sharing comes next.",
    replaceSoon: "Replace with a newer scan next.",
    shareTitle: "Share this document",
    shareBody: "Choose what the other person sees.",
    shareHideAmounts: "Hide amounts",
    shareConfirm: "Copy a share link",
    shareDone: "Link copied. Amounts stay hidden.",
    shareDoneOpen: "Link copied with amounts.",
    replaceTitle: "Replace with a newer scan?",
    replaceBody: "We'll read the new file and keep your plan up to date.",
    replaceConfirm: "Scan again",
    replaceReading: "Reading the new scan…",
    replaceDone: "Numbers refreshed from the new scan.",
  },
  signup: {
    welcome: "Welcome to dear me",
    welcomeSub: "A planner for life's big moments.",
    promise: "Plan life's big moments. We'll handle the numbers.",
    getStarted: "Get started",
    haveAccount: "Already have an account?",
    logIn: "Log in",
    createAccount: "Create your account",
    chooseHow: "How would you like to continue?",
    chooseHowSub: "Pax customers: your cover is ready to use.",
    continuePax: "Continue with myPax",
    continueApple: "Continue with Apple",
    continueGoogle: "Continue with Google",
    continueEmail: "Continue with email",
    or: "or",
    lookAround: "Look around first, no account",
    terms:
      "By continuing you agree to the terms and privacy notice. Your data is stored in Switzerland.",
    connectTitle: "Connect myPax",
    connectBody:
      "You log in on myPax. We only read your pension certificate.",
    continueToPax: "Continue to myPax",
    useEmail: "Use email instead",
    momentsTitle: (name: string) =>
      name === "there"
        ? "What's going on in your life?"
        : `What's going on in your life, ${name}?`,
    momentsSub: "Pick what fits. You can change it any time.",
    somethingElse: "Something else",
    done: "Done",
    continue: "Continue",
    planSub: "Three steps. About five minutes.",
    planStep1: "Bring in your numbers",
    planStep2: "See what changes",
    planStep3: "Decide what's next",
    letsStart: "Let's start",
  },
  chat: {
    title: "Ask",
    history: "Earlier chats",
    close: "Close",
    back: "Back",
    menu: "More",
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
  settings: {
    groupUse: "What we use",
    groupPeople: "People",
    groupApp: "App",
    groupPrivacy: "Privacy",
    groupMore: "More",
    whatWeKnow: "What we know",
    factsCount: (n: number) => `${n} facts`,
    documents: "Documents",
    papersCount: (n: number) => `${n} papers`,
    connected: "Connected",
    mypaxConnected: "myPax is connected.",
    sharesPlans: "Shares your plans",
    partnerSees: (name: string) =>
      `${name} sees shared plans, not your salary.`,
    yourAdvisor: "Your advisor",
    advisorMeta: "Sara Keller, Pax",
    reminders: "Reminders",
    appearance: "Appearance",
    textSize: "Text size",
    language: "Language",
    privacy: "Privacy and data",
    privacySub: "Sharing is off unless you turn it on",
    help: "Help",
    helpToast: "For demo help, ask in chat or book Sara.",
    logOut: "Log out",
    logOutToast: "Signed out of the demo.",
    remDeadlines: "Deadlines and next steps",
    remDeadlinesSub: "By email and in the chat",
    remWeekly: "Weekly summary",
    remWeeklySub: "Sunday evening",
    remOn: "Reminders on",
    remOff: "Reminders off",
    remLabelOn: "On",
    remLabelOff: "Off",
    appearanceLight: "Light",
    appearanceDark: "Dark",
    appearanceSystem: "System",
    appearanceSystemSub: "Follows your phone",
    appearanceDarkOn: "Dark mode on",
    appearanceToast: (v: string) => `Appearance: ${v}`,
    sizeSmaller: "Smaller",
    sizeStandard: "Standard",
    sizeLarger: "Larger",
    sizeLargerSub: "Easier to read",
    sizeToast: (v: string) => `Text size: ${v}`,
    done: "Done",
    planningWith: (partner: string) => `Planning with ${partner} · since Oct 2026`,
    planningAlone: "Planning alone · since Oct 2026",
    meDeskEmpty: "Choose something from the list.",
  },
} as const;

type DeepWritable<T> = T extends (...args: infer A) => infer R
  ? (...args: A) => R
  : T extends string
    ? string
    : T extends number
      ? number
      : T extends boolean
        ? boolean
        : T extends readonly (infer U)[]
          ? DeepWritable<U>[]
          : T extends object
            ? { -readonly [K in keyof T]: DeepWritable<T[K]> }
            : T;

export type Copy = DeepWritable<typeof copyEn>;

/** Active dictionary — LocaleProvider updates this when the language changes. */
let activeCopy: Copy = copyEn;

export function setActiveCopy(next: Copy): void {
  activeCopy = next;
}

export function getActiveCopy(): Copy {
  return activeCopy;
}

/**
 * Live product copy. Always reads the active language (Proxy), so existing
 * `import { copy }` call sites pick up DE / FR / IT after a language switch.
 */
export const copy: Copy = new Proxy(copyEn as Copy, {
  get(_target, prop, receiver) {
    return Reflect.get(activeCopy, prop, receiver);
  },
}) as Copy;
