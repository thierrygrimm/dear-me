# Build spec

Oct 31, 2026 · @Thierry

## Scope

The demo must prove one thing in three minutes: a parent-to-be asks a life question, sees its real pension consequence, understands where the number comes from, and reaches an advisor who already knows her situation.

**Demo persona.** Lea (32) and her partner, both employed, first child due. She earns CHF 90,000 at 100% and plans to go to 60%.

**Principles**

- Clickable prototype with mock data first, live Logismata second. The pitch matters more than the backend.
- Every number comes from Logismata or a written rule, never from the AI.
- English copy, mobile web, no real customer data.
- Build the demo path deep, everything else shallow or cut.

## User stories

The eleven Must stories carry the demo; the rest are cut first if time runs short. Effort is for a team of four over the weekend: S under 3 hours, M up to 6, L a day.

| ID | As a user, I want to... | Done when | Priority | Effort |
| --- | --- | --- | --- | --- |
| A1 | pick a life question to start | Start screen shows 4 to 6 questions; tapping one opens its flow | Must | S |
| A2 | answer one question per screen, in ranges | Cards with progress, "why we ask", skip; answers fill the household model | Must | M |
| A3 | type or say my situation instead | Free text or voice is parsed into household fields, shown for confirmation | Should | M |
| A4 | arrive from a life-event message with data prefilled | Deep link with a persona id opens the flow with known fields filled | Should | S |
| B1 | see what working less after the baby does to my pension | Slider over 100% to 40%; salary and pension fund pension per month update instantly | Must | M |
| B2 | see if my family is covered if I get sick or have an accident | Income bars per situation with need line and gap, for both partners | Must | M |
| B3 | see when I can stop working | Retirement age slider 60 to 70 with income and gap per age | Could | M |
| B4 | know how much tax I save with 3a this year | Tax saving for the maximum contribution, with remaining days to 31 December | Should | S |
| C1 | tap any number and see where it comes from | Sheet with plain explanation, inputs, assumption and source operation | Must | M |
| D1 | see what would close my gap, and what I do not need | Rule-based suggestions per gap, sized from the result, labelled "Recommendations from Pax" | Must | M |
| D2 | check if a fund-based product suits me | Suitability questions scored to a strategy band, with result explained | Could | M |
| E1 | talk to an advisor without repeating myself | Contact choice creates a lead with situation, gaps and suggestions | Must | S |
| E2 | (advisor) read a one-page brief before calling | Desktop view of the lead: household, gaps, questions, trace | Must | M |
| E3 | (Pax) see how leads arrive and where people drop out | Simple dashboard: leads by entry point, funnel per step | Could | M |
| F1 | (team) call Logismata without exposing the token | Server routes proxy all API calls; token in environment variables | Must | S |
| F2 | (team) keep the demo working without network | Persona responses cached; a flag switches to cache | Must | S |
| F3 | (team) never send personal data to the AI | Names and contact data stripped before model calls; no health questions | Must | S |
| F4 | (team) see an audit log of each recommendation | Every suggestion stored with inputs, rule id, timestamp | Should | S |

## Data model

One household object is the single source of truth. Intake fills it, every simulation reads it, and the AI may only propose changes to it, which the user confirms.

```ts
type Household = {
  relationship: 'single' | 'married' | 'partnership' | 'cohabiting';
  sinceYear?: number;
  persons: [Person] | [Person, Person];
  children: { birthYear: number }[];   // expected child = next year
  postcode?: string;                   // -> TaxLocationID via searchLocation
  churchTax?: boolean;                 // yes/no only, mapped to Confession
  assets?: number;                     // CurrentFortune
  needs: { disabilityPc: number; deathPc: number; retirementPc: number };
};

type Person = {
  sex: 1 | 2;
  birthYear: number;
  fullTimeIncome: number;              // gross at 100%
  workloadPc: number;                  // GrossIncome = fullTimeIncome * workloadPc / 100
  withBVG: boolean;
  retirementAge?: number;              // DesiredRetirementAge
  pillar2?: Pillar2;                   // from statement upload, else API estimates
  source: Record<string, 'estimate' | 'user' | 'document'>;
};

type Pillar2 = {                       // fields printed on a pension fund statement
  pensionAt65?: number; currentCapital?: number;          // RetirementPillar2
  disability?: number; disabilityChildren?: number;       // RiskPensionPillar2
  widow?: number; orphan?: number; coverageCapital?: number;
};
```

The `source` map drives the soft-to-sharp visuals: a value marked `estimate` renders with an uncertainty band, `document` renders crisp.

Defaults when unknown: needs 80% of income for disability and retirement, 70% for death if someone depends on you, 0% for death if single without children. All three are shown and editable.

## Calculation engine

Every simulation is a set of Logismata calls with one input varied, fired in parallel when the screen opens, so sliders only switch between results already loaded. We never compute pensions ourselves; we only derive differences and ratios from API outputs.

**Request path**

1. The client sends the household to our route, for example `POST /api/simulate/workload`.
2. The route builds the variant requests (one per slider step) from the household.
3. Each request is looked up by a hash of its normalised body: cache hit returns at once, miss calls Logismata with the server-side token.
4. The route returns one result per step plus a trace record per number (see Traceability).
5. The client renders and keeps the map; slider moves never hit the network.

| Simulation | Logismata operations | Varied input | What we show | Calls |
| --- | --- | --- | --- | --- |
| B1 Workload after a child | `calculateRetirementBase`, `calculateRisk` | Partner 2 `GrossIncome` = full-time income x 100, 90 ... 40% | Salary per year, pension fund pension per month, drop in % vs 100% | 7 + 7 |
| B2 Illness vs accident | `calculateRisk` | none | Income vs need per scenario, monthly gap, capital gap | 1 |
| B3 Retirement age | `calculateRetirement` | `DesiredRetirementAge` 60 ... 70 | AHV and pension fund income, gap per age | 11 |
| B4 3a tax this year | `getSaving3aLimits`, `searchLocation`, `calculateSaving3a` | none | Tax saved with the maximum contribution, days left | 3 |

### B1 Workload after a child

For each step p, set `GrossIncome = fullTimeIncome x p`, keep everything else, and read `Person2.Pension` from `calculateRetirementBase`. Derived values:

- salary drop = 1 - p
- pension drop = 1 - pension(p) / pension(100%)
- monthly difference = (pension(100%) - pension(p)) / 12
- "over a retirement" = monthly difference x 12 x 20 years, labelled as undiscounted

Verified with the API for a couple (him CHF 100,000, her CHF 90,000 at 100%): her pension fund pension falls from CHF 26,506 to 19,107 / 11,666 / 4,224 a year at 80 / 60 / 40%. The reason is the coordination deduction: the insured salary is the salary minus a fixed amount, so smaller salaries lose disproportionately. The explanation sheet says exactly that.

Run `calculateRisk` per step too: lower income also lowers her disability cover, which is the second half of the story.

### B2 Illness vs accident

One `calculateRisk` call with both partners, children and needs returns eight scenarios. Verified mapping: 1 partner 1 disabled by illness, 2 by accident, 3 dies of illness, 4 dies in an accident; 5 to 8 the same for partner 2. Per scenario we use `IncomeNeed`, `IncomeTotal`, `IncomeGap` (divided by 12 for monthly) and `CapitalGap` for product sizing.

### B3 Retirement age

`calculateRetirement` with `DesiredRetirementAge` per step returns `IncomePillar1`, `IncomePillar2`, `IncomeGap` and the capital needed. Precompute ages 60 to 70.

### B4 3a tax saving

`getSaving3aLimits` returns this year's maximum (CHF 7,258 with a pension fund, 36,288 without; verified). `searchLocation` turns the postcode into a `TaxLocationID`. `calculateSaving3a` requires `Duration, IncomeType, Income, TaxLocationID, Relationship, Confession1, NumberOfChildren, Sex, BirthYear`; church tax is asked as yes/no and mapped to the confession code. Days to 31 December are computed in the client.

### Performance and robustness

- All variants of a screen in one `Promise.all`; cache by request hash in memory, plus JSON fixtures for the demo personas.
- A `DEMO_CACHE=1` flag serves fixtures only, for the stage.
- Logismata errors (for example a person too close to retirement) map to a friendly message, never a blank screen.

## Rules layer

Suggestions and handovers come from a small, versioned rule file in TypeScript. Each rule has an id, a condition on the household and API results, and an output; the id is what the audit log and the trace sheet show.

**Product suggestions**

| Rule | When | Suggest | Sized as |
| --- | --- | --- | --- |
| P1 | Death by illness leaves a gap and someone depends on the person | Pax risk cover for death (3b) | Lump sum = `CapitalGap`, rounded up to CHF 10,000 |
| P2 | Disability by illness leaves a gap after day 720 | Pax disability cover (3b) | Annual pension = `IncomeGap`, rounded to CHF 1,000, 24-month waiting period |
| P3 | Retirement gap > 0 and contribution room left | 3a with FondsStar or LifeStar | Up to the 3a limit; fund share needs D2 or a handover |
| P4 | Workload drops below 100% | 3a top-up | Monthly amount that offsets the pension drop, capped at the limit |
| T1 | Employed and no 3a this year | 3a for tax | Maximum contribution, tax saving from B4 |

**"You don't need this" rules**

| Rule | When | Message |
| --- | --- | --- |
| N1 | Single, no children | No death cover needed: nobody depends on your income |
| N2 | Retirement gap = 0 | Your retirement is on track; no savings product needed for that |
| N3 | Accident scenarios fully covered | Accident is covered by your employer's insurance; no extra cover needed |

**Handover triggers** (any one sends the case to a person)

| Rule | When |
| --- | --- |
| H1 | A fund-based product is suggested (suitability check is legally required) |
| H2 | Suggested death or disability cover exceeds CHF 200,000 (Pax's provisional cover limit) |
| H3 | Self-employed, or age 55 or older |
| H4 | More than half the inputs are still estimates |
| H5 | The user asks for a person |
| H6 | Any application step (health questions are handled only by people) |

**Prices.** There is no pricing API, so the demo shows no computed premiums. The suggestion says "Your advisor calculates the exact premium"; if QuickSale access works, show one real proposal for the persona.

## AI layer

The AI has three jobs: understand, route, explain. It never calculates, recommends or decides; those come from Logismata and the rules.

**1. Understand (intake).** Free text or a voice transcript goes to the model with a JSON schema of the household. The model returns a patch (for example `{"children":[{"birthYear":2027}],"persons":[{},{"workloadPc":60}]}`) plus a confidence per field. The patch is validated with zod and shown as prefilled cards the user confirms. Nothing enters the household without confirmation.

**2. Route (tool calling).** The model may only call these tools, each a thin wrapper over our simulation routes:

| Tool | Arguments | Returns |
| --- | --- | --- |
| `simulateWorkload` | person index, steps | B1 results + trace ids |
| `checkCoverage` | none | B2 scenarios + trace ids |
| `simulateRetirementAge` | person index, ages | B3 results + trace ids |
| `taxSaving3a` | person index | B4 result + trace ids |
| `explainNumber` | trace id | the trace record |

An open question like "We're expecting and I want to work 60%" becomes an intake patch plus a `simulateWorkload` call; the app then opens the matching screen.

**3. Explain.** Given tool results and trace records, the model writes two or three plain sentences. Before display, a grounding check extracts every number in the text and requires each to match a value in the tool results (after our own rounding and monthly conversion). Any unmatched number rejects the text and falls back to a template sentence. This is the technical guarantee behind "every number has a receipt".

**Privacy**

- Names, contact details and the postcode never go to the model; persons are "Partner 1" and "Partner 2".
- No health questions anywhere before an application, which is human-only (H6).
- Voice is transcribed, the transcript is used once and not stored.
- Model calls run server-side with keys in environment variables; prefer a provider and region with EU or Swiss data residency and no training on inputs.
- If the model is unavailable, the app still works: cards for intake, templates for explanations.

## Traceability

Every number on screen carries a trace id; tapping it opens a sheet built from one record. The same records feed the advisor brief and the audit log, so traceability is one feature reused three times.

```ts
type Trace = {
  id: string;
  label: string;                 // "Your pension fund pension at 60%"
  value: number; unit: 'CHF/yr' | 'CHF/mo' | '%';
  operation?: string;            // "calculateRetirementBase"
  responseField?: string;        // "Person2.Pension"
  inputs: Record<string, number | string>;   // what was sent, no personal data
  derivation?: string;           // "(26,506 - 11,666) / 12"
  assumptions: string[];         // "Need 80% of income", "Pension fund estimated from salary"
  ruleId?: string;               // "P2", "H1"
  sources: ('estimate' | 'user' | 'document')[];
  explanation: string;           // one plain sentence, template or grounded AI
  createdAt: string;
};
```

**The sheet shows**, top to bottom: the plain explanation, the inputs that mattered, the assumption (editable where it is a need percentage), and a small "Calculated with Pax's pension engine" line with the operation name for the technical jurors.

**The audit log** stores each suggestion with its trace ids, rule id and household snapshot at that moment. For the demo it can live in memory or a JSON file; the point is that it can be shown.

## Build plan

Four phases, each ending in something demoable, so the team always has a working fallback. Assumes four people; with three, merge AI and rules.

1. **Friday evening: clickable path.** Start screen, cards, B1 and B2 screens, trace sheet, advisor brief, all on fixture data for Lea. Deploy to Vercel. Discovery questions to Pax happen in parallel.
2. **Saturday morning: live engine.** API proxy, cache, B1 and B2 on real Logismata calls, fixtures recorded from those calls.
3. **Saturday afternoon: intelligence.** Rules file with suggestions and handover triggers, AI intake with confirmation, grounded explanations, audit log.
4. **Sunday morning: polish and rehearse.** Motion, copy, B4 if time allows, demo cache flag tested offline, five timed rehearsals.

| Module | Owner | Stories |
| --- | --- | --- |
| Mobile interface and visuals | Person 1 | A1, A2, B1 and B2 screens, C1 sheet |
| Engine: API client, simulations, cache | Person 2 | B1 to B4 logic, F1, F2 |
| AI: intake, routing, explanations, grounding | Person 3 | A3, A4, F3 |
| Rules, handover, advisor brief, audit | Person 4 | D1, D2, E1, E2, F4 |

**Cut order** if time runs short: E3 dashboard, D2 suitability, B3 retirement age, A3 voice (keep typed text), B4 tax. Never cut B1, B2, C1, E2 or F2: they are the demo.

## Open questions

- [ ] Does Logismata include AHV child-raising credits when a child is in the household? It changes the AHV side of B1.
- [ ] When pension fund data is missing, does Logismata estimate with the legal BVG minimum and the standard coordination deduction? Many funds are more generous, which would soften the B1 drop.
- [ ] Which `Confession` code means "no church tax", and which `IncomeType` applies to employees in `calculateSaving3a`?
- [ ] Can we access QuickSale for one real proposal per persona, or only browse the public demo?
- [ ] How fast are Logismata calls under load? Measure on Friday to size the precompute.
- [ ] May the prototype keep its own brand and code after the hackathon (IP terms)?
