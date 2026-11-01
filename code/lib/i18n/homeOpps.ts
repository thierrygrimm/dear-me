import type { PersonaId } from "@/lib/personas";
import type { AppLanguage } from "@/lib/settingsPrefs";

export type HomeOpp = {
  id: string;
  title: string;
  body: string;
  href: string;
};

const en: Record<PersonaId, HomeOpp[]> = {
  lena: [
    {
      id: "3a",
      title: "Top up pillar 3a",
      body: "Before 31 December — about CHF 1'900 tax saved.",
      href: "/learn?lesson=pillar-3a",
    },
    {
      id: "cover",
      title: "Check cover if you couldn't work",
      body: "The soft spot after going part-time.",
      href: "/answer?topic=disability",
    },
  ],
  noah: [
    {
      id: "3a",
      title: "Open a 3a while you're young",
      body: "CHF 100 a month compounds hard from 24.",
      href: "/learn?lesson=pillar-3a",
    },
    {
      id: "cert",
      title: "Bring in your certificate",
      body: "Makes every number exact.",
      href: "/certificate",
    },
  ],
  sandra: [
    {
      id: "3a",
      title: "Use the bigger 3a ceiling",
      body: "Self-employed saving without a fund.",
      href: "/learn?lesson=pillar-3a",
    },
    {
      id: "cover",
      title: "Income if you couldn't work",
      body: "AHV/IV alone leaves a gap.",
      href: "/answer?topic=disability",
    },
  ],
  ruth: [
    {
      id: "payout",
      title: "Lump sum or pension?",
      body: "How you take CHF 380'000 changes how long it lasts.",
      href: "/answer?topic=retire",
    },
    {
      id: "ahv",
      title: "AHV for couples at 65",
      body: "A four-minute lesson before you decide.",
      href: "/learn?lesson=ahv-part-2",
    },
  ],
};

const de: Record<PersonaId, HomeOpp[]> = {
  lena: [
    {
      id: "3a",
      title: "Säule 3a auffüllen",
      body: "Vor dem 31. Dezember — etwa CHF 1'900 Steuern gespart.",
      href: "/learn?lesson=pillar-3a",
    },
    {
      id: "cover",
      title: "Absicherung prüfen, falls du nicht arbeiten könntest",
      body: "Die weiche Stelle nach dem Teilzeit-Schritt.",
      href: "/answer?topic=disability",
    },
  ],
  noah: [
    {
      id: "3a",
      title: "Früh eine 3a eröffnen",
      body: "CHF 100 im Monat wirken stark ab 24.",
      href: "/learn?lesson=pillar-3a",
    },
    {
      id: "cert",
      title: "Vorsorgeausweis holen",
      body: "Macht jede Zahl genau.",
      href: "/certificate",
    },
  ],
  sandra: [
    {
      id: "3a",
      title: "Den höheren 3a-Maximalbetrag nutzen",
      body: "Sparen als Selbständige ohne Kasse.",
      href: "/learn?lesson=pillar-3a",
    },
    {
      id: "cover",
      title: "Einkommen, falls du nicht arbeiten könntest",
      body: "AHV/IV allein lassen eine Lücke.",
      href: "/answer?topic=disability",
    },
  ],
  ruth: [
    {
      id: "payout",
      title: "Kapital oder Rente?",
      body: "Wie ihr CHF 380'000 bezieht, entscheidet die Dauer.",
      href: "/answer?topic=retire",
    },
    {
      id: "ahv",
      title: "AHV für Paare mit 65",
      body: "Vier Minuten Lektion vor der Entscheidung.",
      href: "/learn?lesson=ahv-part-2",
    },
  ],
};

const fr: Record<PersonaId, HomeOpp[]> = {
  lena: [
    {
      id: "3a",
      title: "Compléter le pilier 3a",
      body: "Avant le 31 décembre — environ CHF 1'900 d'impôts économisés.",
      href: "/learn?lesson=pillar-3a",
    },
    {
      id: "cover",
      title: "Vérifier la couverture si tu ne pouvais plus travailler",
      body: "Le point fragile après le temps partiel.",
      href: "/answer?topic=disability",
    },
  ],
  noah: [
    {
      id: "3a",
      title: "Ouvrir un 3a tôt",
      body: "CHF 100 par mois compoundent fort dès 24 ans.",
      href: "/learn?lesson=pillar-3a",
    },
    {
      id: "cert",
      title: "Apporter ton certificat",
      body: "Rend chaque chiffre exact.",
      href: "/certificate",
    },
  ],
  sandra: [
    {
      id: "3a",
      title: "Utiliser le plafond 3a plus élevé",
      body: "Épargne indépendante sans caisse.",
      href: "/learn?lesson=pillar-3a",
    },
    {
      id: "cover",
      title: "Revenu si tu ne pouvais plus travailler",
      body: "AVS/AI seuls laissent un écart.",
      href: "/answer?topic=disability",
    },
  ],
  ruth: [
    {
      id: "payout",
      title: "Capital ou rente ?",
      body: "Comment vous prenez CHF 380'000 change la durée.",
      href: "/answer?topic=retire",
    },
    {
      id: "ahv",
      title: "AVS pour couples à 65 ans",
      body: "Une leçon de quatre minutes avant de décider.",
      href: "/learn?lesson=ahv-part-2",
    },
  ],
};

const it: Record<PersonaId, HomeOpp[]> = {
  lena: [
    {
      id: "3a",
      title: "Riempire il pilastro 3a",
      body: "Entro il 31 dicembre — circa CHF 1'900 di tasse risparmiate.",
      href: "/learn?lesson=pillar-3a",
    },
    {
      id: "cover",
      title: "Controllare la copertura se non potessi lavorare",
      body: "Il punto debole dopo il part-time.",
      href: "/answer?topic=disability",
    },
  ],
  noah: [
    {
      id: "3a",
      title: "Aprire un 3a da giovani",
      body: "CHF 100 al mese capitalizzano forte da 24 anni.",
      href: "/learn?lesson=pillar-3a",
    },
    {
      id: "cert",
      title: "Porta il certificato",
      body: "Rende ogni cifra esatta.",
      href: "/certificate",
    },
  ],
  sandra: [
    {
      id: "3a",
      title: "Usare il tetto 3a più alto",
      body: "Risparmio da indipendente senza cassa.",
      href: "/learn?lesson=pillar-3a",
    },
    {
      id: "cover",
      title: "Reddito se non potessi lavorare",
      body: "Solo AVS/AI lasciano un buco.",
      href: "/answer?topic=disability",
    },
  ],
  ruth: [
    {
      id: "payout",
      title: "Capitale o rendita?",
      body: "Come prendete CHF 380'000 cambia quanto durano.",
      href: "/answer?topic=retire",
    },
    {
      id: "ahv",
      title: "AVS per le coppie a 65 anni",
      body: "Lezione di quattro minuti prima di decidere.",
      href: "/learn?lesson=ahv-part-2",
    },
  ],
};

const BY_LANG: Record<AppLanguage, Record<PersonaId, HomeOpp[]>> = {
  English: en,
  Deutsch: de,
  Français: fr,
  Italiano: it,
};

export function homeOppsFor(
  id: PersonaId,
  language: AppLanguage = "English",
): HomeOpp[] {
  return BY_LANG[language][id] ?? en[id];
}
