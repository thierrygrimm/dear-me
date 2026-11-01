import type { PersonaId } from "@/lib/personas";
import type { AppLanguage } from "@/lib/settingsPrefs";

export type PlanStepSeed = {
  id: string;
  title: string;
  detail: string;
  done: boolean;
  external: boolean;
  /** Stable routing key — never match translated titles. */
  action:
    | "pensum"
    | "compare"
    | "learn-3a"
    | "certificate"
    | "learn-ahv"
    | "book"
    | "external";
};

type PlanPack = {
  title: string;
  steps: PlanStepSeed[];
};

const en: Record<PersonaId, PlanPack> = {
  lena: {
    title: "Before March",
    steps: [
      {
        id: "1",
        title: "Decide who reduces and by how much",
        detail: "Done with the workload slider",
        done: true,
        external: false,
        action: "pensum",
      },
      {
        id: "2",
        title: "Name Marco as beneficiary",
        detail: "5 min · your pension fund's form",
        done: false,
        external: true,
        action: "external",
      },
      {
        id: "3",
        title: "Top up Pillar 3a before 31 December",
        detail: "10 min · saves about CHF 1'900 tax",
        done: false,
        external: true,
        action: "learn-3a",
      },
      {
        id: "4",
        title: "Check cover if one of you can't work",
        detail: "20 min · optional talk with an advisor",
        done: false,
        external: false,
        action: "book",
      },
    ],
  },
  noah: {
    title: "First steps",
    steps: [
      {
        id: "1",
        title: "Open a pillar 3a",
        detail: "10 min · about CHF 100 a month to start",
        done: false,
        external: true,
        action: "learn-3a",
      },
      {
        id: "2",
        title: "Bring in your certificate",
        detail: "Makes every number exact",
        done: false,
        external: false,
        action: "certificate",
      },
      {
        id: "3",
        title: "Check cover if you couldn't work",
        detail: "15 min · optional talk with an advisor",
        done: false,
        external: false,
        action: "book",
      },
    ],
  },
  sandra: {
    title: "First steps",
    steps: [
      {
        id: "1",
        title: "Use the bigger 3a ceiling",
        detail: "Self-employed limit this year",
        done: false,
        external: true,
        action: "learn-3a",
      },
      {
        id: "2",
        title: "Close the income gap if you couldn't work",
        detail: "20 min · talk with Jonas",
        done: false,
        external: false,
        action: "book",
      },
      {
        id: "3",
        title: "Name a beneficiary",
        detail: "5 min · your 3a provider's form",
        done: false,
        external: true,
        action: "external",
      },
    ],
  },
  ruth: {
    title: "Before you retire",
    steps: [
      {
        id: "1",
        title: "Decide lump sum, pension, or both",
        detail: "Done with the compare screen",
        done: true,
        external: false,
        action: "compare",
      },
      {
        id: "2",
        title: "Check AHV for couples at 65",
        detail: "4 min · short lesson",
        done: false,
        external: false,
        action: "learn-ahv",
      },
      {
        id: "3",
        title: "Book Sara to confirm the mix",
        detail: "30 min · video or phone",
        done: false,
        external: false,
        action: "book",
      },
    ],
  },
};

const de: Record<PersonaId, PlanPack> = {
  lena: {
    title: "Vor dem März",
    steps: [
      {
        id: "1",
        title: "Entscheiden, wer reduziert und wie stark",
        detail: "Erledigt mit dem Pensum-Regler",
        done: true,
        external: false,
        action: "pensum",
      },
      {
        id: "2",
        title: "Marco als Begünstigten eintragen",
        detail: "5 Min · Formular deiner Pensionskasse",
        done: false,
        external: true,
        action: "external",
      },
      {
        id: "3",
        title: "Säule 3a vor dem 31. Dezember auffüllen",
        detail: "10 Min · spart etwa CHF 1'900 Steuern",
        done: false,
        external: true,
        action: "learn-3a",
      },
      {
        id: "4",
        title: "Absicherung prüfen, falls einer nicht arbeiten kann",
        detail: "20 Min · optional mit einer Beraterin",
        done: false,
        external: false,
        action: "book",
      },
    ],
  },
  noah: {
    title: "Erste Schritte",
    steps: [
      {
        id: "1",
        title: "Eine Säule 3a eröffnen",
        detail: "10 Min · etwa CHF 100 im Monat zum Start",
        done: false,
        external: true,
        action: "learn-3a",
      },
      {
        id: "2",
        title: "Vorsorgeausweis holen",
        detail: "Macht jede Zahl genau",
        done: false,
        external: false,
        action: "certificate",
      },
      {
        id: "3",
        title: "Absicherung prüfen, falls du nicht arbeiten könntest",
        detail: "15 Min · optional mit einer Beraterin",
        done: false,
        external: false,
        action: "book",
      },
    ],
  },
  sandra: {
    title: "Erste Schritte",
    steps: [
      {
        id: "1",
        title: "Den höheren 3a-Maximalbetrag nutzen",
        detail: "Limit für Selbständige in diesem Jahr",
        done: false,
        external: true,
        action: "learn-3a",
      },
      {
        id: "2",
        title: "Einkommenslücke schliessen, falls du nicht arbeiten könntest",
        detail: "20 Min · Gespräch mit Jonas",
        done: false,
        external: false,
        action: "book",
      },
      {
        id: "3",
        title: "Begünstigte Person eintragen",
        detail: "5 Min · Formular deines 3a-Anbieters",
        done: false,
        external: true,
        action: "external",
      },
    ],
  },
  ruth: {
    title: "Vor der Pensionierung",
    steps: [
      {
        id: "1",
        title: "Kapital, Rente oder beides entscheiden",
        detail: "Erledigt mit dem Vergleich",
        done: true,
        external: false,
        action: "compare",
      },
      {
        id: "2",
        title: "AHV für Paare mit 65 prüfen",
        detail: "4 Min · kurze Lektion",
        done: false,
        external: false,
        action: "learn-ahv",
      },
      {
        id: "3",
        title: "Sara buchen, um den Mix zu bestätigen",
        detail: "30 Min · Video oder Telefon",
        done: false,
        external: false,
        action: "book",
      },
    ],
  },
};

const fr: Record<PersonaId, PlanPack> = {
  lena: {
    title: "Avant mars",
    steps: [
      {
        id: "1",
        title: "Décider qui réduit et de combien",
        detail: "Fait avec le curseur de taux d'activité",
        done: true,
        external: false,
        action: "pensum",
      },
      {
        id: "2",
        title: "Nommer Marco comme bénéficiaire",
        detail: "5 min · formulaire de ta caisse",
        done: false,
        external: true,
        action: "external",
      },
      {
        id: "3",
        title: "Compléter le pilier 3a avant le 31 décembre",
        detail: "10 min · environ CHF 1'900 d'impôts économisés",
        done: false,
        external: true,
        action: "learn-3a",
      },
      {
        id: "4",
        title: "Vérifier la couverture si l'un ne peut plus travailler",
        detail: "20 min · entretien optionnel avec un conseiller",
        done: false,
        external: false,
        action: "book",
      },
    ],
  },
  noah: {
    title: "Premiers pas",
    steps: [
      {
        id: "1",
        title: "Ouvrir un pilier 3a",
        detail: "10 min · environ CHF 100 par mois pour commencer",
        done: false,
        external: true,
        action: "learn-3a",
      },
      {
        id: "2",
        title: "Apporter ton certificat",
        detail: "Rend chaque chiffre exact",
        done: false,
        external: false,
        action: "certificate",
      },
      {
        id: "3",
        title: "Vérifier la couverture si tu ne pouvais plus travailler",
        detail: "15 min · entretien optionnel",
        done: false,
        external: false,
        action: "book",
      },
    ],
  },
  sandra: {
    title: "Premiers pas",
    steps: [
      {
        id: "1",
        title: "Utiliser le plafond 3a plus élevé",
        detail: "Limite indépendants cette année",
        done: false,
        external: true,
        action: "learn-3a",
      },
      {
        id: "2",
        title: "Combler l'écart de revenu si tu ne pouvais plus travailler",
        detail: "20 min · parler avec Jonas",
        done: false,
        external: false,
        action: "book",
      },
      {
        id: "3",
        title: "Nommer un bénéficiaire",
        detail: "5 min · formulaire de ton fournisseur 3a",
        done: false,
        external: true,
        action: "external",
      },
    ],
  },
  ruth: {
    title: "Avant la retraite",
    steps: [
      {
        id: "1",
        title: "Choisir capital, rente, ou les deux",
        detail: "Fait avec l'écran de comparaison",
        done: true,
        external: false,
        action: "compare",
      },
      {
        id: "2",
        title: "Vérifier l'AVS pour couples à 65 ans",
        detail: "4 min · courte leçon",
        done: false,
        external: false,
        action: "learn-ahv",
      },
      {
        id: "3",
        title: "Réserver Sara pour confirmer le mix",
        detail: "30 min · vidéo ou téléphone",
        done: false,
        external: false,
        action: "book",
      },
    ],
  },
};

const it: Record<PersonaId, PlanPack> = {
  lena: {
    title: "Prima di marzo",
    steps: [
      {
        id: "1",
        title: "Decidere chi riduce e di quanto",
        detail: "Fatto con il cursore del pensum",
        done: true,
        external: false,
        action: "pensum",
      },
      {
        id: "2",
        title: "Nominare Marco come beneficiario",
        detail: "5 min · modulo della cassa pensione",
        done: false,
        external: true,
        action: "external",
      },
      {
        id: "3",
        title: "Riempire il pilastro 3a entro il 31 dicembre",
        detail: "10 min · risparmia circa CHF 1'900 di tasse",
        done: false,
        external: true,
        action: "learn-3a",
      },
      {
        id: "4",
        title: "Controllare la copertura se uno non può lavorare",
        detail: "20 min · colloquio opzionale con una consulente",
        done: false,
        external: false,
        action: "book",
      },
    ],
  },
  noah: {
    title: "Primi passi",
    steps: [
      {
        id: "1",
        title: "Aprire un pilastro 3a",
        detail: "10 min · circa CHF 100 al mese per iniziare",
        done: false,
        external: true,
        action: "learn-3a",
      },
      {
        id: "2",
        title: "Porta il certificato",
        detail: "Rende ogni cifra esatta",
        done: false,
        external: false,
        action: "certificate",
      },
      {
        id: "3",
        title: "Controllare la copertura se non potessi lavorare",
        detail: "15 min · colloquio opzionale",
        done: false,
        external: false,
        action: "book",
      },
    ],
  },
  sandra: {
    title: "Primi passi",
    steps: [
      {
        id: "1",
        title: "Usare il tetto 3a più alto",
        detail: "Limite per indipendenti quest'anno",
        done: false,
        external: true,
        action: "learn-3a",
      },
      {
        id: "2",
        title: "Chiudere il buco di reddito se non potessi lavorare",
        detail: "20 min · parla con Jonas",
        done: false,
        external: false,
        action: "book",
      },
      {
        id: "3",
        title: "Nominare un beneficiario",
        detail: "5 min · modulo del fornitore 3a",
        done: false,
        external: true,
        action: "external",
      },
    ],
  },
  ruth: {
    title: "Prima della pensione",
    steps: [
      {
        id: "1",
        title: "Decidere capitale, rendita o entrambi",
        detail: "Fatto con la schermata di confronto",
        done: true,
        external: false,
        action: "compare",
      },
      {
        id: "2",
        title: "Controllare l'AVS per le coppie a 65 anni",
        detail: "4 min · lezione breve",
        done: false,
        external: false,
        action: "learn-ahv",
      },
      {
        id: "3",
        title: "Prenotare Sara per confermare il mix",
        detail: "30 min · video o telefono",
        done: false,
        external: false,
        action: "book",
      },
    ],
  },
};

const BY_LANG: Record<AppLanguage, Record<PersonaId, PlanPack>> = {
  English: en,
  Deutsch: de,
  Français: fr,
  Italiano: it,
};

export function planPackFor(
  id: PersonaId,
  language: AppLanguage = "English",
): PlanPack {
  return BY_LANG[language][id] ?? en[id];
}
