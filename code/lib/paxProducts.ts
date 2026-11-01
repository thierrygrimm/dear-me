import type { LifeMoment } from "@/lib/session";

/**
 * Pax QuickSale ideas used in LifeMoments C3.
 * Tariff names and families from documentation/pax-products/catalogue.md.
 * Shape matches MomentOffer in lifeMoments (title/body/facts/whyShown).
 */
export type PaxIdea = {
  id: string;
  tariffCodes: string[];
  family: string;
  shortTitle: string;
  body: string;
  facts: { label: string; value: string }[];
  whyShown: string;
};

/** C3 sheet payload — same fields as MomentOffer. */
export type PaxOfferSheet = {
  title: string;
  body: string;
  facts: { label: string; value: string }[];
  whyShown: string;
};

export type MomentProductOffer = {
  primary: PaxOfferSheet;
  secondary?: PaxOfferSheet;
};

function toOffer(idea: PaxIdea): PaxOfferSheet {
  return {
    title: idea.shortTitle,
    body: idea.body,
    facts: idea.facts,
    whyShown: idea.whyShown,
  };
}

/** Structured catalog of Pax ideas the prototype may surface. */
export const paxCatalog: Record<string, PaxIdea> = {
  sirjl: {
    id: "sirjl",
    tariffCodes: ["SIRjL"],
    family: "Erwerbsunfähigkeitsversicherung",
    shortTitle: "Income protection for young people",
    body: "Pays a monthly income if illness or an accident stops you working. SIRjL is made for ages 15 to 28, with an extra surplus in the first two years.",
    facts: [
      { label: "Tariff", value: "SIRjL" },
      { label: "Pays up to", value: "CHF 36'000 a year" },
    ],
    whyShown: "First job often leaves a thin income gap if you couldn't work.",
  },
  sir: {
    id: "sir",
    tariffCodes: ["SIR"],
    family: "Erwerbsunfähigkeitsversicherung",
    shortTitle: "Income protection (SIR)",
    body: "A monthly income if illness or an accident stops you working — for ages 29 to 60, in pillar 3a or 3b.",
    facts: [
      { label: "Tariff", value: "SIR" },
      { label: "Pays up to", value: "CHF 36'000 a year" },
    ],
    whyShown: "Pension-fund disability cover often falls when salary or pensum drops.",
  },
  fk2: {
    id: "fk2",
    tariffCodes: ["FK2"],
    family: "Todesfallversicherung",
    shortTitle: "Cover for both of you",
    body: "A term-life policy on two lives that pays the other person if one of you dies — made for couples who aren't married.",
    facts: [
      { label: "Tariff", value: "FK2 · two lives" },
      { label: "Sum", value: "From CHF 10'000" },
    ],
    whyShown: "Unmarried partners get nothing from the other's pension fund by default.",
  },
  fr: {
    id: "fr",
    tariffCodes: ["FR"],
    family: "Todesfallversicherung",
    shortTitle: "A pension for the family",
    body: "Monthly income for the people who depend on you if the worst happens — FR replaces the earner's pay as a pension, not a lump sum.",
    facts: [
      { label: "Tariff", value: "FR · family pension" },
      { label: "Term", value: "From 10 years" },
    ],
    whyShown: "A child opens a family gap: who replaces income if you die?",
  },
  kinderversicherung: {
    id: "kinderversicherung",
    tariffCodes: ["FirstStep", "FondsStar FR", "LifeStar FR"],
    family: "Kinderversicherung",
    shortTitle: "FirstStep children's cover",
    body: "Savings for a child, with disability cover for them and protection if the paying parent or grandparent dies or can't work. Packages: Basic, Medium, Premium.",
    facts: [
      { label: "Tariff", value: "FirstStep" },
      { label: "Payer age", value: "Up to 65" },
    ],
    whyShown: "Child and grandchild moments open a child gap the catalogue maps to FirstStep.",
  },
  terzafondsstar: {
    id: "terzafondsstar",
    tariffCodes: ["TerzaFondsStar"],
    family: "FondsStar",
    shortTitle: "Keep saving in 3a (funds)",
    body: "A pillar 3a that can rise automatically with the legal maximum, so a lower pensum does not freeze your retirement savings. Full funds, 10+ year horizon.",
    facts: [
      { label: "Tariff", value: "TerzaFondsStar" },
      { label: "Pillar", value: "3a · periodic" },
    ],
    whyShown: "Working less shrinks retirement savings unless 3a keeps moving.",
  },
  sir_secondary: {
    id: "sir_secondary",
    tariffCodes: ["SIR"],
    family: "Erwerbsunfähigkeitsversicherung",
    shortTitle: "Income cover while pensum drops",
    body: "SIR tops up disability income when pension-fund cover falls with salary — useful when you cut pensum for care or a child.",
    facts: [
      { label: "Tariff", value: "SIR" },
      { label: "Focus", value: "Income gap" },
    ],
    whyShown: "Pensum cuts lower 2nd-pillar disability cover.",
  },
  fkf: {
    id: "fkf",
    tariffCodes: ["FKF"],
    family: "Todesfallversicherung",
    shortTitle: "Cover that follows the mortgage",
    body: "Decreasing capital that tracks what you still owe, so the home stays with the other person if one of you dies.",
    facts: [
      { label: "Tariff", value: "FKF · decreasing capital" },
      { label: "Term", value: "From 10 years" },
    ],
    whyShown: "A mortgage opens a family gap that shrinks as you amortise.",
  },
  terzalifestar: {
    id: "terzalifestar",
    tariffCodes: ["TerzaLifeStar"],
    family: "LifeStar",
    shortTitle: "3a with a guarantee share",
    body: "Pillar 3a that splits premiums between a guaranteed part and funds. Strong when the horizon is under 15 years or you want more certainty.",
    facts: [
      { label: "Tariff", value: "TerzaLifeStar" },
      { label: "Pillar", value: "3a · periodic" },
    ],
    whyShown: "Shorter horizons and catch-up at 50+ favour LifeStar over pure funds.",
  },
  sir_selfemployed: {
    id: "sir_selfemployed",
    tariffCodes: ["SIR"],
    family: "Erwerbsunfähigkeitsversicherung",
    shortTitle: "Income protection while you build",
    body: "A monthly income if illness or an accident stops you working — built for people without a classic employer fund.",
    facts: [
      { label: "Tariff", value: "SIR" },
      { label: "Focus", value: "Income gap" },
    ],
    whyShown: "Self-employed people often lack 2nd-pillar disability cover.",
  },
  large_3a: {
    id: "large_3a",
    tariffCodes: ["TerzaFondsStar", "TerzaLifeStar"],
    family: "FondsStar / LifeStar",
    shortTitle: "A larger 3a for the self-employed",
    body: "Self-employed people can pay more into 3a. TerzaFondsStar for a long horizon, TerzaLifeStar when you want a guarantee share.",
    facts: [
      { label: "Tariffs", value: "TerzaFondsStar / TerzaLifeStar" },
      { label: "Pillar", value: "3a" },
    ],
    whyShown: "Going self-employed opens a retirement gap without a large 2nd pillar.",
  },
  restart_3a: {
    id: "restart_3a",
    tariffCodes: ["FondsStar", "LifeStar"],
    family: "FondsStar / LifeStar",
    shortTitle: "Restart your 3a",
    body: "A clean 3a for the next chapter: FondsStar when you have 10+ years, LifeStar when you want more certainty — with beneficiaries you choose.",
    facts: [
      { label: "Tariffs", value: "FondsStar / LifeStar" },
      { label: "Pillar", value: "3a or 3b" },
    ],
    whyShown: "Separation often pauses 3a; a restart closes the retirement gap.",
  },
  fr_fk_new: {
    id: "fr_fk_new",
    tariffCodes: ["FR", "FK"],
    family: "Todesfallversicherung",
    shortTitle: "New family cover, new beneficiaries",
    body: "After a split, name who should receive a family pension (FR) or constant capital (FK) — beneficiaries reset with the chapter.",
    facts: [
      { label: "Tariffs", value: "FR / FK" },
      { label: "Also", value: "Update pillar 2 forms" },
    ],
    whyShown: "Divorce opens a family gap until beneficiaries are rewritten.",
  },
  fondsstarinvest: {
    id: "fondsstarinvest",
    tariffCodes: ["FondsStarInvest", "LifeStarInvest"],
    family: "FondsStar / LifeStar",
    shortTitle: "Invest the windfall with a plan",
    body: "A one-off into funds (FondsStarInvest) or with a guarantee share (LifeStarInvest) — so the money has a job before it drifts into spending.",
    facts: [
      { label: "Tariffs", value: "FondsStarInvest / LifeStarInvest" },
      { label: "Premium", value: "Single" },
    ],
    whyShown: "A bonus or inheritance opens a retirement gap you can close with a single premium.",
  },
  fondsstar_3b: {
    id: "fondsstar_3b",
    tariffCodes: ["FondsStar"],
    family: "FondsStar",
    shortTitle: "FondsStar 3b",
    body: "Free-pillar fund savings for a long horizon — useful once the main gap is closed, or beside family cover for unmarried couples.",
    facts: [
      { label: "Tariff", value: "FondsStar · 3b" },
      { label: "Horizon", value: "10+ years" },
    ],
    whyShown: "Second idea after the primary family or child cover.",
  },
  fondsstar_3b_child: {
    id: "fondsstar_3b_child",
    tariffCodes: ["FondsStar"],
    family: "FondsStar",
    shortTitle: "FondsStar 3b in the child's name",
    body: "Free-pillar fund savings that can sit in the grandchild's name for a long horizon — alongside FirstStep if you want payer protection too.",
    facts: [
      { label: "Tariff", value: "FondsStar · 3b" },
      { label: "Horizon", value: "10+ years" },
    ],
    whyShown: "A second child-gap idea when FirstStep is already on the table.",
  },
  lifestarinvest: {
    id: "lifestarinvest",
    tariffCodes: ["LifeStarInvest"],
    family: "LifeStar",
    shortTitle: "Park savings already there",
    body: "A single premium into LifeStar with a guarantee share — useful when money is already saved and the horizon to 65 is under 15 years.",
    facts: [
      { label: "Tariff", value: "LifeStarInvest" },
      { label: "Premium", value: "Single · from CHF 10'000" },
    ],
    whyShown: "Catch-up at 50+ often means putting existing capital to work with more certainty.",
  },
  auszahlungsplan: {
    id: "auszahlungsplan",
    tariffCodes: ["Auszahlungsplan"],
    family: "Auszahlungsplan",
    shortTitle: "Turn capital into monthly income",
    body: "Splits a lump sum between a guaranteed-interest part and funds, then pays you a regular income. From CHF 25'000.",
    facts: [
      { label: "Tariff", value: "Auszahlungsplan" },
      { label: "Minimum", value: "CHF 25'000" },
    ],
    whyShown: "A retirement lump sum opens a payout gap: make the money last.",
  },
  terza_3a_care: {
    id: "terza_3a_care",
    tariffCodes: ["TerzaFondsStar", "TerzaLifeStar"],
    family: "FondsStar / LifeStar",
    shortTitle: "Keep a little 3a going",
    body: "A small pillar 3a so care years don't freeze retirement — TerzaFondsStar or TerzaLifeStar, depending on how long you have.",
    facts: [
      { label: "Tariffs", value: "TerzaFondsStar / TerzaLifeStar" },
      { label: "Pillar", value: "3a" },
    ],
    whyShown: "Caring often cuts pensum; 3a keeps retirement saving alive.",
  },
};

type OfferPair = { primary: PaxIdea; secondary?: PaxIdea };

/**
 * First (and optional second) Pax idea per life moment, from scenarios.md.
 * Second only for later “show more” — never on the first C3 screen.
 */
const OFFERS_BY_MOMENT: Record<LifeMoment, OfferPair> = {
  firstjob: {
    primary: paxCatalog.sirjl,
    secondary: paxCatalog.terzafondsstar,
  },
  together: {
    primary: paxCatalog.fk2,
    secondary: paxCatalog.fondsstar_3b,
  },
  child: {
    primary: paxCatalog.fr,
    secondary: paxCatalog.kinderversicherung,
  },
  less: {
    primary: paxCatalog.terzafondsstar,
    secondary: paxCatalog.sir_secondary,
  },
  home: {
    primary: paxCatalog.fkf,
    secondary: paxCatalog.terzalifestar,
  },
  selfemployed: {
    primary: paxCatalog.sir_selfemployed,
    secondary: paxCatalog.large_3a,
  },
  separating: {
    primary: paxCatalog.restart_3a,
    secondary: paxCatalog.fr_fk_new,
  },
  bonus: {
    primary: paxCatalog.fondsstarinvest,
  },
  grandchild: {
    primary: paxCatalog.kinderversicherung,
    secondary: paxCatalog.fondsstar_3b_child,
  },
  catchup: {
    primary: paxCatalog.terzalifestar,
    secondary: paxCatalog.lifestarinvest,
  },
  retire: {
    primary: paxCatalog.auszahlungsplan,
  },
  caring: {
    primary: paxCatalog.terza_3a_care,
    secondary: paxCatalog.sir_secondary,
  },
};

/**
 * C3 product offer for a life moment.
 * Optional answers reserved for later personalisation; catalogue mapping is fixed.
 */
export function offerForMoment(
  moment: LifeMoment,
  _answers?: Record<string, string>,
): MomentProductOffer {
  const pair = OFFERS_BY_MOMENT[moment];
  return {
    primary: toOffer(pair.primary),
    secondary: pair.secondary ? toOffer(pair.secondary) : undefined,
  };
}
