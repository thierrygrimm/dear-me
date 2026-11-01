import { readLanguage, type AppLanguage } from "@/lib/settingsPrefs";

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

type AnswerKey =
  | "default"
  | "disability"
  | "pensum60"
  | "pensum80"
  | "pensum60alt"
  | "compare"
  | "expecting";

const PACK: Record<AppLanguage, Record<AnswerKey, DemoAnswer>> = {
  English: {
    default: {
      text: "Good question. Here is what I found, based on your details: you are on track, and nothing needs to change today.",
      thinkingLabel: "Checking your numbers",
      steps: [
        { id: "1", label: "Read your question", duration: "0.4 s" },
        { id: "2", label: "Found your salary in myPax", duration: "0.8 s" },
        { id: "3", label: "Checked your goal", duration: "0.3 s" },
      ],
      totalSeconds: 1.5,
      quickReplies: ["What if 80 %?", "Can I go to 60 % after the baby?"],
    },
    disability: {
      text: "Almost. If you couldn't work, your fund and AHV would pay about CHF 3'100 a month — roughly half of what you take home today.",
      thinkingLabel: "Checking your cover",
      steps: [
        { id: "1", label: "Read your question", duration: "0.4 s" },
        { id: "2", label: "Read your pension certificate", duration: "1.0 s" },
        { id: "3", label: "Checked AHV disability scale", duration: "0.9 s" },
        { id: "4", label: "Compared with your salary", duration: "0.7 s" },
      ],
      totalSeconds: 3.0,
      widget: {
        label: "If you couldn't work",
        cue: "per month",
        verdict: "Almost.",
        detail: "About half your income",
        bars: [{ height: 56 }, { height: 22, gap: true }, { height: 12 }],
      },
      quickReplies: [
        "See all of it",
        "Talk to Sara from Pax",
        "Can I go to 60 % after the baby?",
      ],
    },
    pensum60: {
      text: "Yes, that works. About CHF 600 less a month at 65, and together you stay above your goal.",
      thinkingLabel: "Checking your numbers",
      steps: [
        { id: "1", label: "Read your question", duration: "0.4 s" },
        { id: "2", label: "Found your salary in myPax", duration: "0.8 s" },
        { id: "3", label: "Read your pension certificate", duration: "1.2 s" },
        {
          id: "4",
          label: "Calculated 100 % and 60 % with Logismata",
          duration: "2.1 s",
        },
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
    pensum80: {
      text: "At 80 %, about CHF 300 less a month at 65. Still comfortably above your goal.",
      thinkingLabel: "Recalculating at 80 %",
      steps: [
        { id: "1", label: "Read your question", duration: "0.3 s" },
        {
          id: "2",
          label: "Calculated 100 % and 80 % with Logismata",
          duration: "1.6 s",
        },
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
    pensum60alt: {
      text: "Yes, that works. About CHF 600 less a month at 65, and together you stay above your goal.",
      thinkingLabel: "Recalculating at 60 %",
      steps: [
        { id: "1", label: "Read your question", duration: "0.3 s" },
        {
          id: "2",
          label: "Calculated 100 % and 60 % with Logismata",
          duration: "1.8 s",
        },
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
    compare: {
      text: "If Marco reduces instead, the two of you lose about CHF 520 a month, because his pension fund grows faster.",
      thinkingLabel: "Comparing both of you",
      steps: [
        { id: "1", label: "Read your question", duration: "0.3 s" },
        { id: "2", label: "Found Marco's salary in myPax", duration: "0.7 s" },
        {
          id: "3",
          label: "Calculated both pensions with Logismata",
          duration: "2.0 s",
        },
      ],
      totalSeconds: 3.0,
      quickReplies: ["What if 80 %?", "Can I go to 60 % after the baby?"],
    },
    expecting: {
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
  },
  Deutsch: {
    default: {
      text: "Gute Frage. Das habe ich gefunden: du bist auf Kurs, und heute muss sich nichts ändern.",
      thinkingLabel: "Deine Zahlen werden geprüft",
      steps: [
        { id: "1", label: "Frage gelesen", duration: "0,4 s" },
        { id: "2", label: "Lohn in myPax gefunden", duration: "0,8 s" },
        { id: "3", label: "Dein Ziel geprüft", duration: "0,3 s" },
      ],
      totalSeconds: 1.5,
      quickReplies: [
        "Was wäre bei 80 %?",
        "Kann ich nach dem Baby auf 60 % gehen?",
      ],
    },
    disability: {
      text: "Fast. Wenn du nicht mehr arbeiten könntest, zahlten Kasse und AHV etwa CHF 3'100 im Monat — ungefähr die Hälfte von dem, was du heute nach Hause bringst.",
      thinkingLabel: "Deine Absicherung wird geprüft",
      steps: [
        { id: "1", label: "Frage gelesen", duration: "0,4 s" },
        { id: "2", label: "Vorsorgeausweis gelesen", duration: "1,0 s" },
        { id: "3", label: "AHV-Invalidenskala geprüft", duration: "0,9 s" },
        { id: "4", label: "Mit deinem Lohn verglichen", duration: "0,7 s" },
      ],
      totalSeconds: 3.0,
      widget: {
        label: "Wenn du nicht arbeiten könntest",
        cue: "pro Monat",
        verdict: "Fast.",
        detail: "Etwa die Hälfte deines Einkommens",
        bars: [{ height: 56 }, { height: 22, gap: true }, { height: 12 }],
      },
      quickReplies: [
        "Alles anzeigen",
        "Mit Sara von Pax sprechen",
        "Kann ich nach dem Baby auf 60 % gehen?",
      ],
    },
    pensum60: {
      text: "Ja, das geht. Etwa CHF 600 weniger im Monat mit 65, und zusammen bleibt ihr über eurem Ziel.",
      thinkingLabel: "Deine Zahlen werden geprüft",
      steps: [
        { id: "1", label: "Frage gelesen", duration: "0,4 s" },
        { id: "2", label: "Lohn in myPax gefunden", duration: "0,8 s" },
        { id: "3", label: "Vorsorgeausweis gelesen", duration: "1,2 s" },
        {
          id: "4",
          label: "100 % und 60 % mit Logismata gerechnet",
          duration: "2,1 s",
        },
        { id: "5", label: "Dein Ziel geprüft", duration: "0,3 s" },
      ],
      totalSeconds: 4.8,
      widget: {
        label: "60 % nach dem Baby",
        cue: "mit 65",
        verdict: "Das geht.",
        detail: "CHF 3'640 im Monat",
        bars: [{ height: 56 }, { height: 6, gap: true }, { height: 12 }],
      },
      quickReplies: ["Was wäre bei 80 %?", "Mit Marco vergleichen"],
    },
    pensum80: {
      text: "Bei 80 % etwa CHF 300 weniger im Monat mit 65. Immer noch klar über eurem Ziel.",
      thinkingLabel: "Neu berechnet bei 80 %",
      steps: [
        { id: "1", label: "Frage gelesen", duration: "0,3 s" },
        {
          id: "2",
          label: "100 % und 80 % mit Logismata gerechnet",
          duration: "1,6 s",
        },
        { id: "3", label: "Dein Ziel geprüft", duration: "0,3 s" },
      ],
      totalSeconds: 2.2,
      widget: {
        label: "80 % nach dem Baby",
        cue: "mit 65",
        verdict: "Immer noch gut.",
        detail: "Etwa CHF 300 weniger im Monat",
        bars: [{ height: 56 }, { height: 18, gap: true }, { height: 12 }],
      },
      quickReplies: ["Was wäre bei 60 %?", "Mit Marco vergleichen"],
    },
    pensum60alt: {
      text: "Ja, das geht. Etwa CHF 600 weniger im Monat mit 65, und zusammen bleibt ihr über eurem Ziel.",
      thinkingLabel: "Neu berechnet bei 60 %",
      steps: [
        { id: "1", label: "Frage gelesen", duration: "0,3 s" },
        {
          id: "2",
          label: "100 % und 60 % mit Logismata gerechnet",
          duration: "1,8 s",
        },
        { id: "3", label: "Dein Ziel geprüft", duration: "0,3 s" },
      ],
      totalSeconds: 2.4,
      widget: {
        label: "60 % nach dem Baby",
        cue: "mit 65",
        verdict: "Das geht.",
        detail: "CHF 3'640 im Monat",
        bars: [{ height: 56 }, { height: 6, gap: true }, { height: 12 }],
      },
      quickReplies: ["Was wäre bei 80 %?", "Mit Marco vergleichen"],
    },
    compare: {
      text: "Wenn Marco statt dir reduziert, verliert ihr etwa CHF 520 im Monat, weil seine Pensionskasse schneller wächst.",
      thinkingLabel: "Beide werden verglichen",
      steps: [
        { id: "1", label: "Frage gelesen", duration: "0,3 s" },
        { id: "2", label: "Marcos Lohn in myPax gefunden", duration: "0,7 s" },
        {
          id: "3",
          label: "Beide Renten mit Logismata gerechnet",
          duration: "2,0 s",
        },
      ],
      totalSeconds: 3.0,
      quickReplies: [
        "Was wäre bei 80 %?",
        "Kann ich nach dem Baby auf 60 % gehen?",
      ],
    },
    expecting: {
      text: "Notiert. Ich behalte den März im Blick, wenn wir Elternzeit und Pensum anschauen.",
      thinkingLabel: "Wird gespeichert",
      steps: [
        { id: "1", label: "Nachricht gelesen", duration: "0,2 s" },
        { id: "2", label: "Unter Was wir wissen gespeichert", duration: "0,4 s" },
      ],
      totalSeconds: 0.6,
      remembered: "Gespeichert: Baby fällig März 2027",
      quickReplies: [
        "Kann ich nach dem Baby auf 60 % gehen?",
        "Was wäre bei 80 %?",
      ],
    },
  },
  Français: {
    default: {
      text: "Bonne question. Voici ce que j'ai trouvé : tu es sur la bonne voie, rien ne doit changer aujourd'hui.",
      thinkingLabel: "Vérification de tes chiffres",
      steps: [
        { id: "1", label: "Question lue", duration: "0,4 s" },
        { id: "2", label: "Salaire trouvé dans myPax", duration: "0,8 s" },
        { id: "3", label: "Objectif vérifié", duration: "0,3 s" },
      ],
      totalSeconds: 1.5,
      quickReplies: [
        "Et à 80 % ?",
        "Puis-je passer à 60 % après le bébé ?",
      ],
    },
    disability: {
      text: "Presque. Si tu ne pouvais plus travailler, ta caisse et l'AVS paieraient environ CHF 3'100 par mois — à peu près la moitié de ton revenu actuel.",
      thinkingLabel: "Vérification de ta couverture",
      steps: [
        { id: "1", label: "Question lue", duration: "0,4 s" },
        { id: "2", label: "Certificat de prévoyance lu", duration: "1,0 s" },
        { id: "3", label: "Échelle AI/AVS vérifiée", duration: "0,9 s" },
        { id: "4", label: "Comparé à ton salaire", duration: "0,7 s" },
      ],
      totalSeconds: 3.0,
      widget: {
        label: "Si tu ne pouvais plus travailler",
        cue: "par mois",
        verdict: "Presque.",
        detail: "Environ la moitié de ton revenu",
        bars: [{ height: 56 }, { height: 22, gap: true }, { height: 12 }],
      },
      quickReplies: [
        "Tout voir",
        "Parler à Sara de Pax",
        "Puis-je passer à 60 % après le bébé ?",
      ],
    },
    pensum60: {
      text: "Oui, ça marche. Environ CHF 600 de moins par mois à 65 ans, et ensemble vous restez au-dessus de votre objectif.",
      thinkingLabel: "Vérification de tes chiffres",
      steps: [
        { id: "1", label: "Question lue", duration: "0,4 s" },
        { id: "2", label: "Salaire trouvé dans myPax", duration: "0,8 s" },
        { id: "3", label: "Certificat lu", duration: "1,2 s" },
        {
          id: "4",
          label: "100 % et 60 % calculés avec Logismata",
          duration: "2,1 s",
        },
        { id: "5", label: "Objectif vérifié", duration: "0,3 s" },
      ],
      totalSeconds: 4.8,
      widget: {
        label: "60 % après le bébé",
        cue: "à 65 ans",
        verdict: "Ça marche.",
        detail: "CHF 3'640 par mois",
        bars: [{ height: 56 }, { height: 6, gap: true }, { height: 12 }],
      },
      quickReplies: ["Et à 80 % ?", "Comparer avec Marco"],
    },
    pensum80: {
      text: "À 80 %, environ CHF 300 de moins par mois à 65 ans. Toujours confortablement au-dessus de l'objectif.",
      thinkingLabel: "Recalcul à 80 %",
      steps: [
        { id: "1", label: "Question lue", duration: "0,3 s" },
        {
          id: "2",
          label: "100 % et 80 % calculés avec Logismata",
          duration: "1,6 s",
        },
        { id: "3", label: "Objectif vérifié", duration: "0,3 s" },
      ],
      totalSeconds: 2.2,
      widget: {
        label: "80 % après le bébé",
        cue: "à 65 ans",
        verdict: "Toujours bon.",
        detail: "Environ CHF 300 de moins par mois",
        bars: [{ height: 56 }, { height: 18, gap: true }, { height: 12 }],
      },
      quickReplies: ["Et à 60 % ?", "Comparer avec Marco"],
    },
    pensum60alt: {
      text: "Oui, ça marche. Environ CHF 600 de moins par mois à 65 ans, et ensemble vous restez au-dessus de votre objectif.",
      thinkingLabel: "Recalcul à 60 %",
      steps: [
        { id: "1", label: "Question lue", duration: "0,3 s" },
        {
          id: "2",
          label: "100 % et 60 % calculés avec Logismata",
          duration: "1,8 s",
        },
        { id: "3", label: "Objectif vérifié", duration: "0,3 s" },
      ],
      totalSeconds: 2.4,
      widget: {
        label: "60 % après le bébé",
        cue: "à 65 ans",
        verdict: "Ça marche.",
        detail: "CHF 3'640 par mois",
        bars: [{ height: 56 }, { height: 6, gap: true }, { height: 12 }],
      },
      quickReplies: ["Et à 80 % ?", "Comparer avec Marco"],
    },
    compare: {
      text: "Si Marco réduit à ta place, vous perdez environ CHF 520 par mois, car sa caisse croît plus vite.",
      thinkingLabel: "Comparaison des deux",
      steps: [
        { id: "1", label: "Question lue", duration: "0,3 s" },
        { id: "2", label: "Salaire de Marco trouvé dans myPax", duration: "0,7 s" },
        {
          id: "3",
          label: "Les deux pensions calculées avec Logismata",
          duration: "2,0 s",
        },
      ],
      totalSeconds: 3.0,
      quickReplies: [
        "Et à 80 % ?",
        "Puis-je passer à 60 % après le bébé ?",
      ],
    },
    expecting: {
      text: "Noté. Je garderai mars en tête pour le congé parental et le taux d'activité.",
      thinkingLabel: "Enregistrement",
      steps: [
        { id: "1", label: "Message lu", duration: "0,2 s" },
        { id: "2", label: "Sauvé dans ce que nous savons", duration: "0,4 s" },
      ],
      totalSeconds: 0.6,
      remembered: "Enregistré : bébé prévu mars 2027",
      quickReplies: [
        "Puis-je passer à 60 % après le bébé ?",
        "Et à 80 % ?",
      ],
    },
  },
  Italiano: {
    default: {
      text: "Buona domanda. Ecco cosa ho trovato: sei in linea, e oggi non serve cambiare nulla.",
      thinkingLabel: "Controllo dei tuoi numeri",
      steps: [
        { id: "1", label: "Domanda letta", duration: "0,4 s" },
        { id: "2", label: "Stipendio trovato in myPax", duration: "0,8 s" },
        { id: "3", label: "Obiettivo controllato", duration: "0,3 s" },
      ],
      totalSeconds: 1.5,
      quickReplies: [
        "E all'80 %?",
        "Posso passare al 60 % dopo il bambino?",
      ],
    },
    disability: {
      text: "Quasi. Se non potessi più lavorare, cassa e AVS pagherebbero circa CHF 3'100 al mese — circa la metà di ciò che porti a casa oggi.",
      thinkingLabel: "Controllo della copertura",
      steps: [
        { id: "1", label: "Domanda letta", duration: "0,4 s" },
        { id: "2", label: "Certificato di previdenza letto", duration: "1,0 s" },
        { id: "3", label: "Scala AI/AVS controllata", duration: "0,9 s" },
        { id: "4", label: "Confrontato con lo stipendio", duration: "0,7 s" },
      ],
      totalSeconds: 3.0,
      widget: {
        label: "Se non potessi lavorare",
        cue: "al mese",
        verdict: "Quasi.",
        detail: "Circa metà del tuo reddito",
        bars: [{ height: 56 }, { height: 22, gap: true }, { height: 12 }],
      },
      quickReplies: [
        "Vedi tutto",
        "Parla con Sara di Pax",
        "Posso passare al 60 % dopo il bambino?",
      ],
    },
    pensum60: {
      text: "Sì, funziona. Circa CHF 600 in meno al mese a 65 anni, e insieme restate sopra l'obiettivo.",
      thinkingLabel: "Controllo dei tuoi numeri",
      steps: [
        { id: "1", label: "Domanda letta", duration: "0,4 s" },
        { id: "2", label: "Stipendio trovato in myPax", duration: "0,8 s" },
        { id: "3", label: "Certificato letto", duration: "1,2 s" },
        {
          id: "4",
          label: "100 % e 60 % calcolati con Logismata",
          duration: "2,1 s",
        },
        { id: "5", label: "Obiettivo controllato", duration: "0,3 s" },
      ],
      totalSeconds: 4.8,
      widget: {
        label: "60 % dopo il bambino",
        cue: "a 65 anni",
        verdict: "Funziona.",
        detail: "CHF 3'640 al mese",
        bars: [{ height: 56 }, { height: 6, gap: true }, { height: 12 }],
      },
      quickReplies: ["E all'80 %?", "Confronta con Marco"],
    },
    pensum80: {
      text: "All'80 %, circa CHF 300 in meno al mese a 65 anni. Ancora comodamente sopra l'obiettivo.",
      thinkingLabel: "Ricalcolo all'80 %",
      steps: [
        { id: "1", label: "Domanda letta", duration: "0,3 s" },
        {
          id: "2",
          label: "100 % e 80 % calcolati con Logismata",
          duration: "1,6 s",
        },
        { id: "3", label: "Obiettivo controllato", duration: "0,3 s" },
      ],
      totalSeconds: 2.2,
      widget: {
        label: "80 % dopo il bambino",
        cue: "a 65 anni",
        verdict: "Ancora bene.",
        detail: "Circa CHF 300 in meno al mese",
        bars: [{ height: 56 }, { height: 18, gap: true }, { height: 12 }],
      },
      quickReplies: ["E al 60 %?", "Confronta con Marco"],
    },
    pensum60alt: {
      text: "Sì, funziona. Circa CHF 600 in meno al mese a 65 anni, e insieme restate sopra l'obiettivo.",
      thinkingLabel: "Ricalcolo al 60 %",
      steps: [
        { id: "1", label: "Domanda letta", duration: "0,3 s" },
        {
          id: "2",
          label: "100 % e 60 % calcolati con Logismata",
          duration: "1,8 s",
        },
        { id: "3", label: "Obiettivo controllato", duration: "0,3 s" },
      ],
      totalSeconds: 2.4,
      widget: {
        label: "60 % dopo il bambino",
        cue: "a 65 anni",
        verdict: "Funziona.",
        detail: "CHF 3'640 al mese",
        bars: [{ height: 56 }, { height: 6, gap: true }, { height: 12 }],
      },
      quickReplies: ["E all'80 %?", "Confronta con Marco"],
    },
    compare: {
      text: "Se riduce Marco al posto tuo, perdete circa CHF 520 al mese, perché la sua cassa cresce più in fretta.",
      thinkingLabel: "Confronto di entrambi",
      steps: [
        { id: "1", label: "Domanda letta", duration: "0,3 s" },
        { id: "2", label: "Stipendio di Marco trovato in myPax", duration: "0,7 s" },
        {
          id: "3",
          label: "Entrambe le pensioni calcolate con Logismata",
          duration: "2,0 s",
        },
      ],
      totalSeconds: 3.0,
      quickReplies: [
        "E all'80 %?",
        "Posso passare al 60 % dopo il bambino?",
      ],
    },
    expecting: {
      text: "Annotato. Terrò marzo presente per congedo parentale e pensum.",
      thinkingLabel: "Salvataggio",
      steps: [
        { id: "1", label: "Messaggio letto", duration: "0,2 s" },
        { id: "2", label: "Salvato in cosa sappiamo", duration: "0,4 s" },
      ],
      totalSeconds: 0.6,
      remembered: "Salvato: bambino previsto marzo 2027",
      quickReplies: [
        "Posso passare al 60 % dopo il bambino?",
        "E all'80 %?",
      ],
    },
  },
};

function pack(language: AppLanguage) {
  return PACK[language] ?? PACK.English;
}

function keyFor(question: string): AnswerKey {
  const lower = question.toLowerCase();
  if (
    lower.includes("marco") ||
    lower.includes("compare") ||
    lower.includes("vergleich") ||
    lower.includes("comparer") ||
    lower.includes("confront")
  ) {
    return "compare";
  }
  if (lower.includes("80")) return "pensum80";
  if (
    lower.includes("expect") ||
    lower.includes("march") ||
    lower.includes("baby due") ||
    lower.includes("fällig") ||
    lower.includes("erwartet") ||
    lower.includes("prévu") ||
    lower.includes("previsto")
  ) {
    return "expecting";
  }
  if (
    lower.includes("couldn't work") ||
    lower.includes("could not work") ||
    lower.includes("disability") ||
    lower.includes("covered") ||
    lower.includes("nicht arbeiten") ||
    lower.includes("absicher") ||
    lower.includes("ne pouvais") ||
    lower.includes("non potessi") ||
    lower.includes("invalid")
  ) {
    return "disability";
  }
  if (
    lower.includes("60") ||
    lower.includes("baby") ||
    lower.includes("pensum") ||
    lower.includes("bébé") ||
    lower.includes("bambino")
  ) {
    return lower.includes("was wäre bei 60") || lower.includes("what if 60")
      ? "pensum60alt"
      : "pensum60";
  }
  return "default";
}

export function resolveDemoAnswer(
  question: string,
  language: AppLanguage = readLanguage(),
): DemoAnswer {
  return pack(language)[keyFor(question.trim())];
}

const STARTERS: Record<AppLanguage, string[]> = {
  English: [
    "Can I go to 60 % after the baby?",
    "What if 80 %?",
    "We're expecting in March.",
  ],
  Deutsch: [
    "Kann ich nach dem Baby auf 60 % gehen?",
    "Was wäre bei 80 %?",
    "Wir erwarten im März.",
  ],
  Français: [
    "Puis-je passer à 60 % après le bébé ?",
    "Et à 80 % ?",
    "Nous attendons en mars.",
  ],
  Italiano: [
    "Posso passare al 60 % dopo il bambino?",
    "E all'80 %?",
    "Aspettiamo a marzo.",
  ],
};

/** Default child-demo chips when no life-moment script applies. */
export function starterReplies(
  language: AppLanguage = readLanguage(),
): string[] {
  return STARTERS[language] ?? STARTERS.English;
}

/** @deprecated Prefer starterReplies() so language switches apply. */
export const STARTER_REPLIES = STARTERS.English;
