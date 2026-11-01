import type { MomentScript } from "@/lib/lifeMoments";
import { offerForMoment } from "@/lib/paxProducts";
import type { LifeMoment } from "@/lib/session";

function hi(name: string): string {
  return name && name !== "there" ? `Hallo ${name}.` : "Hallo.";
}

function withOffers(
  moment: LifeMoment,
  answers: Record<string, string>,
  base: Omit<
    ReturnType<MomentScript["reveal"]>,
    "offer" | "offerSecondary"
  >,
): ReturnType<MomentScript["reveal"]> {
  const { primary, secondary } = offerForMoment(moment, answers);
  return {
    ...base,
    offer: primary,
    offerSecondary: secondary,
  };
}

/** German scripts for the demo personas' primary moments. */
export const momentScriptsDe: Partial<Record<LifeMoment, MomentScript>> = {
  firstjob: {
    id: "firstjob",
    greeting: (name) =>
      `${hi(name)} Erster Job, schön. Eine kurze Frage, damit ich nicht raten muss:`,
    questions: [
      {
        id: "employer_pk",
        question: "Zahlt dein Arbeitgeber in eine Pensionskasse für dich ein?",
        options: [
          { id: "yes", label: "Ja" },
          { id: "no", label: "Nein" },
          { id: "unsure", label: "Weiss nicht" },
        ],
        note: "Oder tippe + und bring deinen Vorsorgeausweis.",
      },
    ],
    reveal: (answers) => {
      const has = answers.employer_pk === "yes";
      return withOffers("firstjob", answers, {
        sentence: has
          ? "Dann bist du gut gestartet. Eine Stelle ist dünn:"
          : "Das ist am Anfang üblich. Eine Stelle ist so oder so dünn:",
        big: {
          label: "Wenn du nicht arbeiten könntest",
          value: "CHF 1'900",
          meaning: "im Monat weniger als du jetzt verdienst",
        },
        note: has
          ? "Geschätzt aus deinem Lohn. Dein Ausweis macht es genau."
          : "Ohne Kasse lässt die AHV allein eine grössere Lücke. Ausweis oder Lohnausweis machen es genau.",
        next: ["Was könnte helfen?", "Wie kommt ihr auf diese Zahl?"],
      });
    },
    startersAfter: [
      "Was, wenn ich den Job wechsle?",
      "Wie viel sollte ich in die 3a sparen?",
      "Was deckt die Erwerbsunfähigkeit?",
    ],
  },

  selfemployed: {
    id: "selfemployed",
    greeting: (name) =>
      `${hi(name)} Eigenes Geschäft, gut für dich. Bevor ich etwas sage:`,
    questions: [
      {
        id: "pays_pk",
        question: "Zahlst du jetzt in eine Pensionskasse ein?",
        options: [
          { id: "yes", label: "Ja" },
          { id: "no", label: "Nein" },
          { id: "what", label: "Was ist das?" },
        ],
        note: "Oder tippe + und bring einen Auszug, falls du einen hast.",
      },
    ],
    reveal: (answers) => {
      const no = answers.pays_pk !== "yes";
      return withOffers("selfemployed", answers, {
        sentence: no
          ? "Dann ist die Lücke, falls du nicht arbeiten könntest, die wichtigste:"
          : "Gut. Auch mit Kasse ist oft eine Stelle dünn:",
        big: {
          label: "Wenn du nicht arbeiten könntest",
          value: "CHF 2'400",
          meaning: "im Monat weniger als du jetzt nach Hause bringst",
        },
        note: "Geschätzt für Selbständige. Deine Zahlen machen es genau.",
        next: ["Was könnte helfen?", "Wie kommt ihr auf diese Zahl?"],
      });
    },
    startersAfter: [
      "Wie viel 3a kann ich einzahlen?",
      "Was, wenn ich jemanden anstelle?",
      "Mit angestellter Absicherung vergleichen",
    ],
  },

  child: {
    id: "child",
    greeting: (name) =>
      `${hi(name)} Ein Baby kommt. Ein paar kurze Fragen, damit ich nicht raten muss:`,
    questions: [
      {
        id: "due",
        question: "Wann ist das Baby fällig?",
        options: [
          { id: "spring", label: "Diesen Frühling" },
          { id: "summer", label: "Diesen Sommer" },
          { id: "later", label: "Später dieses Jahr" },
          { id: "unsure", label: "Noch unklar" },
        ],
      },
      {
        id: "who_reduce",
        question: "Wer könnte die Arbeit reduzieren?",
        options: [
          { id: "me", label: "Ich" },
          { id: "partner", label: "Mein Partner / meine Partnerin" },
          { id: "both", label: "Wir beide" },
          { id: "undecided", label: "Noch nicht entschieden" },
        ],
      },
      {
        id: "married",
        question: "Seid ihr verheiratet?",
        options: [
          { id: "yes", label: "Ja" },
          { id: "together", label: "Nein, zusammenlebend" },
          { id: "unsure", label: "Weiss nicht, ob das zählt" },
        ],
      },
      {
        id: "kids_already",
        question: "Habt ihr schon Kinder?",
        options: [
          { id: "first", label: "Nein, das erste" },
          { id: "one", label: "Ja, eines" },
          { id: "more", label: "Ja, zwei oder mehr" },
        ],
      },
      {
        id: "salary_band",
        question: "Ungefähr was verdienst du im Jahr?",
        options: [
          { id: "under60", label: "Unter 60'000" },
          { id: "60to100", label: "60'000 bis 100'000" },
          { id: "over100", label: "Über 100'000" },
          { id: "prefer_not", label: "Lieber nicht sagen" },
        ],
        note: "Oder tippe + und bring deinen Vorsorgeausweis.",
      },
    ],
    reveal: (answers) => {
      const meCuts =
        answers.who_reduce === "me" || answers.who_reduce === "both";
      return withOffers("child", answers, {
        sentence: meCuts
          ? "Wenn du nach dem Baby auf 60 % gehst, sticht eine Zahl heraus:"
          : "Bevor ihr entscheidet, wer zu Hause bleibt, sticht eine Zahl heraus:",
        big: {
          label: "Mit 65, zusammen",
          value: "CHF 600",
          meaning: "weniger im Monat, wenn du auf 60 % gehst",
        },
        note: "Aus Lohn und Pensionskasse. Als Nächstes kannst du am Regler spielen.",
        next: [
          "Was könnte helfen?",
          "Kann ich nach dem Baby auf 60 % gehen?",
        ],
      });
    },
    startersAfter: [
      "Kann ich nach dem Baby auf 60 % gehen?",
      "Was wäre bei 80 %?",
      "Mit Marco vergleichen",
    ],
  },

  less: {
    id: "less",
    greeting: (name) =>
      `${hi(name)} Weniger arbeiten verändert die Rente stärker, als viele denken. Zuerst eine Frage:`,
    questions: [
      {
        id: "target_pensum",
        question: "Wie viel möchtest du arbeiten?",
        options: [
          { id: "80", label: "Etwa 80 %" },
          { id: "60", label: "Etwa 60 %" },
          { id: "50", label: "Etwa 50 %" },
          { id: "unsure", label: "Noch unklar" },
        ],
        note: "Oder tippe + und bring deinen Vorsorgeausweis.",
      },
    ],
    reveal: (answers) => {
      const pct = answers.target_pensum === "80" ? "300" : "600";
      return withOffers("less", answers, {
        sentence:
          "60 % Pensum. Lass es nicht 60 % Rente werden. Eine Zahl:",
        big: {
          label: "Mit 65",
          value: `CHF ${pct}`,
          meaning: "weniger im Monat als bei 100 %, ein Leben lang",
        },
        note: "Geschätzt aus deinem Ausweis. Der Regler macht es zu deinen Zahlen.",
        next: ["Was könnte helfen?", "Was wäre bei 80 %?"],
      });
    },
    startersAfter: [
      "Was wäre bei 80 %?",
      "Was wäre bei 60 %?",
      "Mit Marco vergleichen",
    ],
  },

  retire: {
    id: "retire",
    greeting: (name) =>
      `${hi(name)} Bald in Rente. Beginnen wir mit deiner Wahl:`,
    questions: [
      {
        id: "payout_choice",
        question: "Wie möchtest du das Pensionskassengeld beziehen?",
        options: [
          { id: "lump", label: "Als Kapital" },
          { id: "pension", label: "Als Rente" },
          { id: "mix", label: "Halb und halb" },
          { id: "unsure", label: "Noch nicht entschieden" },
        ],
        note: "Oder tippe + und bring dein Pensionsangebot.",
      },
    ],
    reveal: (answers) => {
      const lump =
        answers.payout_choice === "lump" || answers.payout_choice === "mix";
      return withOffers("retire", answers, {
        sentence: lump
          ? "Liebe ich, das Geld ist da. Jetzt soll es reichen. Eine Zahl:"
          : "Auch mit Rente braucht jedes Kapital einen Plan. Eine Zahl:",
        big: {
          label: "Dieses Kapital könnte zahlen",
          value: "CHF 2'100",
          meaning: "im Monat für etwa 20 Jahre in dieser Skizze",
        },
        note: "Fiktive Auszahlung aus CHF 350'000. Dein Angebot macht es genau.",
        next: ["Was könnte helfen?", "Wie kommt ihr auf diese Zahl?"],
      });
    },
    startersAfter: [
      "Kapital oder Rente?",
      "Was, wenn ich 95 werde?",
      "Kann ich später noch umentscheiden?",
    ],
  },
};
