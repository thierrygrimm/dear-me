# API

Server routes for the pension engine. The browser sends a household; the server returns the numbers and a trace id for each one. The Logismata token stays on the server.

Local base URL: `http://localhost:3000`.

POST and GET bodies and responses are JSON. On POST, send `Content-Type: application/json`. Success is HTTP 200. These routes do not read an `Authorization` header.

## Household

Every POST nests the household under `household`. Calculations use that object. `personaId` is an optional string on the simulate and recommendations bodies; it does not choose the household.

The household helper used for Lea (persona `lena` or `lea`) writes person 2 from the intake and the certificate: `fullTimeIncome` and `workloadPc` from what they entered, and `pillar2.pensionAt65` plus `pillar2.currentCapital` after `/certificate`. `source` on those fields becomes `user` or `document`.

### `household`

| Field | Required | What it is |
| --- | --- | --- |
| `relationship` | yes | `single`, `married`, `partnership`, or `cohabiting` |
| `persons` | yes | One or two people. Order is stable: index `0`, then index `1` |
| `children` | no | `[{ "birthYear": 2027 }]`. Omitted means `[]`. A future child is just a birth year |
| `sinceYear` | no | Integer. Year the relationship started |
| `postcode` | no | String. Used to resolve a tax location for the 3a call |
| `churchTax` | no | Boolean. `true` is sent to the engine as church tax |
| `assets` | no | Number ≥ 0. Current fortune |
| `needs` | no | See below. Filled in when omitted |

### Each person

| Field | Required | What it is |
| --- | --- | --- |
| `sex` | yes | `1` or `2` |
| `birthYear` | yes | Integer from 1920 to 2020 |
| `fullTimeIncome` | yes | Gross CHF per year at 100% pensum. ≥ 0 |
| `workloadPc` | yes | Current pensum, 0 to 100. Gross income is `fullTimeIncome × workloadPc / 100`, rounded |
| `withBVG` | yes | Boolean. In a pension fund or not. Chooses the 3a maximum |
| `retirementAge` | no | Integer 58–70. Omitted means 65 on the engine call |
| `pillar2` | no | Numbers from a statement. All optional: `pensionAt65`, `currentCapital`, `disability`, `disabilityChildren`, `widow`, `orphan`, `coverageCapital` |
| `source` | no | Map of field name → `estimate`, `user`, or `document`. Omitted means `{}` |

### `needs` when you omit it

| | Someone depends on the income (`relationship` is not `single`, or there is a child) | Single, no children |
| --- | --- | --- |
| `disabilityPc` | 80 | 80 |
| `deathPc` | 70 | 0 |
| `retirementPc` | 80 | 80 |

Each value you do send must be from 0 to 100. Leads and audit snapshots store the household after these defaults are applied.

```json
{
  "household": {
    "relationship": "married",
    "persons": [
      {
        "sex": 1,
        "birthYear": 1992,
        "fullTimeIncome": 100000,
        "workloadPc": 100,
        "withBVG": true
      },
      {
        "sex": 2,
        "birthYear": 1994,
        "fullTimeIncome": 90000,
        "workloadPc": 100,
        "withBVG": true
      }
    ],
    "children": [{ "birthYear": 2027 }],
    "postcode": "4051",
    "churchTax": false,
    "assets": 20000
  }
}
```

`personIndex` on a call is `0` or `1` (default `1`, person 2). A one-person household must send `"personIndex": 0` on workload, retirement age, tax, and recommendations. Otherwise the response is HTTP 500, `"No person at index 1"`. Creating a lead picks the index itself: `1` when there are two people, otherwise `0`.

## Errors

| Status | When | Body |
| --- | --- | --- |
| 400 | Body failed the schema | `{ "error": "Invalid request", "issues": [{ "path": "household.persons.0.birthYear", "message": "…" }] }` |
| 404 | Unknown lead id or trace id | `{ "error": "Lead not found" }` or `{ "error": "Trace not found" }` |
| 500 | Body is not JSON, person index missing, or another server error | `{ "error": "<message>" }` — not JSON is `"Body must be JSON"` |
| Logismata | Live engine call failed | `{ "error": "<message>", "operation": "<name>" }` and the upstream status. Status 502 when the client has no status. A 400 here is this shape, not the `issues` shape |

If Logismata rejects a retirement age, `error` is `This person is too close to retirement for that calculation.` and `operation` is the call that failed (`calculateRetirementBase`, `calculateRisk`, `calculateRetirement`, `getSaving3aLimits`, `searchLocation`, or `calculateSaving3a`).

With `DEMO_CACHE` on, or with no `LOGISMATA_API_TOKEN`, the simulate routes answer from recorded results and do not call Logismata. See [Environment](#environment).

Trace, lead, and audit records live in the server process. Read an id from the same process that created it. Leads and audit each keep the newest 50. A new process starts with empty lists.

## Call order

For one consultation:

1. **Workload and coverage, for the screen in front of the person.** `POST /api/simulate/workload` when they move the pensum (working less after a baby, or any “what if I work less”). Illness and accident scenarios are the `coverage` object on `POST /api/recommendations` (`includeCoverage` defaults to true). Same moment: `POST /api/simulate/retirement-age` when they ask when they can stop, `POST /api/simulate/tax-3a` when they ask what this year’s 3a saves.
2. **`POST /api/recommendations`.** Rule suggestions, plus the workload, coverage, and 3a results those rules used. This call runs those three again unless you set the matching `include…` flag to false.
3. **`POST /api/leads`.** When they ask to talk to a person (`/me/book`, or from `/ask`). The route runs workload, coverage, and 3a, then stores the suggestions as the brief.
4. **`GET /api/trace/[id]`.** When they tap a number. The id is on the step, the scenario, or the suggestion.
5. **`GET /api/audit`.** Advisor trail: each product suggestion and handover, with the household at that moment. `GET /api/leads` and `GET /api/leads/[id]` are the brief itself (`/advisor`).

## `POST /api/simulate/workload`

When they change hours. The plan step and the “what if I work less” answer. One call returns every pensum step, so a slider can switch steps without another request.

| Field | Required | Default |
| --- | --- | --- |
| `household` | yes | — |
| `personaId` | no | omitted |
| `personIndex` | no | `1` |
| `steps` | no | `100, 90, 80, 70, 60, 50, 40`. Each number is from 40 to 100 |

Steps come back sorted from high pensum to low. The baseline is the pension at 100%, or the highest step you sent if 100 is not in the list. Drops are against that baseline.

The app helper sends `personIndex: 1` and `steps: [100, 80, 60]`.

```bash
curl -s -X POST http://localhost:3000/api/simulate/workload \
  -H 'Content-Type: application/json' \
  -d '{
    "household": {
      "relationship": "married",
      "persons": [
        {"sex": 1, "birthYear": 1992, "fullTimeIncome": 100000, "workloadPc": 100, "withBVG": true},
        {"sex": 2, "birthYear": 1994, "fullTimeIncome": 90000, "workloadPc": 100, "withBVG": true}
      ],
      "children": [{"birthYear": 2027}],
      "postcode": "4051"
    },
    "personIndex": 1,
    "steps": [100, 60]
  }'
```

Response: `WorkloadSimulation`.

| Field | What it is |
| --- | --- |
| `personIndex` | The index you asked for |
| `baselinePensionYr` | Pension-fund pension at the baseline, CHF per year |
| `steps[]` | One object per step |

Each step:

| Field | What it is |
| --- | --- |
| `workloadPc` | The step |
| `grossIncome` | CHF per year at that pensum |
| `pillar2PensionYr` | Pension-fund pension, CHF per year |
| `salaryDropPc` | Fraction lost versus full time. `0.4` means 40% less salary. Four decimal places |
| `pensionDropPc` | Fraction lost versus the baseline pension. Same scale |
| `monthlyDiff` | CHF per month less than the baseline. `(baseline − this step) / 12`, rounded |
| `overRetirement` | `monthlyDiff × 12 × 20`, undiscounted |
| `disabilityCoverYr` | Disability cover at that pensum, CHF per year |
| `traces.pillar2Pension` | Trace id for the pension |
| `traces.monthlyDiff` | Trace id for the monthly difference |

Recorded result for the household above, person 2, at 100% and 60% (ids are new on each call):

```json
{
  "personIndex": 1,
  "baselinePensionYr": 26506,
  "steps": [
    {
      "workloadPc": 100,
      "grossIncome": 90000,
      "pillar2PensionYr": 26506,
      "salaryDropPc": 0,
      "pensionDropPc": 0,
      "monthlyDiff": 0,
      "overRetirement": 0,
      "disabilityCoverYr": 42000,
      "traces": { "pillar2Pension": "<uuid>", "monthlyDiff": "<uuid>" }
    },
    {
      "workloadPc": 60,
      "grossIncome": 54000,
      "pillar2PensionYr": 11666,
      "salaryDropPc": 0.4,
      "pensionDropPc": 0.5599,
      "monthlyDiff": 1237,
      "overRetirement": 296880,
      "disabilityCoverYr": 20400,
      "traces": { "pillar2Pension": "<uuid>", "monthlyDiff": "<uuid>" }
    }
  ]
}
```

Live calls use `calculateRetirementBase` and return the same fields. Errors: 400, 500, Logismata.

## `POST /api/simulate/retirement-age`

When they ask when they can stop. Slider from the ages you send; the default list is 60 through 70.

| Field | Required | Default |
| --- | --- | --- |
| `household` | yes | — |
| `personaId` | no | omitted |
| `personIndex` | no | `1` |
| `ages` | no | `60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70`. Each age is an integer from 58 to 70. 58 and 59 are used only if you send them |

Ages come back in the order you sent.

```bash
curl -s -X POST http://localhost:3000/api/simulate/retirement-age \
  -H 'Content-Type: application/json' \
  -d '{
    "household": {
      "relationship": "married",
      "persons": [
        {"sex": 1, "birthYear": 1992, "fullTimeIncome": 100000, "workloadPc": 100, "withBVG": true},
        {"sex": 2, "birthYear": 1994, "fullTimeIncome": 90000, "workloadPc": 100, "withBVG": true}
      ],
      "children": [{"birthYear": 2027}],
      "postcode": "4051"
    },
    "personIndex": 1,
    "ages": [63, 65]
  }'
```

Response: `RetirementAgeSimulation`.

| Field | What it is |
| --- | --- |
| `personIndex` | The index you asked for |
| `steps[].age` | Retirement age for this step |
| `steps[].incomePillar1Yr` | AHV income, CHF per year |
| `steps[].incomePillar2Yr` | Pension-fund income, CHF per year |
| `steps[].incomeGapYr` | Gap against the retirement need, CHF per year |
| `steps[].capitalNeeded` | Capital to close the gap, CHF |
| `steps[].traceId` | Trace id for that age |

Live calls use `calculateRetirement`. Errors: 400, 500, Logismata.

## `POST /api/simulate/tax-3a`

When they want this year’s 3a maximum and the tax it saves, including days left until 31 December.

| Field | Required | Default |
| --- | --- | --- |
| `household` | yes | — |
| `personaId` | no | omitted |
| `personIndex` | no | `1` |

```bash
curl -s -X POST http://localhost:3000/api/simulate/tax-3a \
  -H 'Content-Type: application/json' \
  -d '{
    "household": {
      "relationship": "married",
      "persons": [
        {"sex": 1, "birthYear": 1992, "fullTimeIncome": 100000, "workloadPc": 100, "withBVG": true},
        {"sex": 2, "birthYear": 1994, "fullTimeIncome": 90000, "workloadPc": 100, "withBVG": true}
      ],
      "children": [{"birthYear": 2027}],
      "postcode": "4051",
      "churchTax": false
    },
    "personIndex": 1
  }'
```

Response: `Tax3aResult`.

| Field | What it is |
| --- | --- |
| `personIndex` | The index you asked for |
| `maxContribution` | This year’s legal maximum, CHF. The pension-fund ceiling when `withBVG` is true, otherwise the higher ceiling |
| `taxSaved` | Tax saved by paying that maximum, CHF |
| `daysLeft` | Days from today through 31 December, at least 0 |
| `taxLocationId` | Location id used for the tax figure, when the engine has one |
| `traceId` | Trace id for the tax saving |

Live calls use `getSaving3aLimits`, then `searchLocation` when `postcode` is set, then `calculateSaving3a`. Errors: 400, 500, Logismata.

## `POST /api/recommendations`

After the numbers, when the screen should say what to do: a product, a “you don’t need this”, or a handover to a person. Also the right call when you want illness and accident scenarios (`coverage`).

| Field | Required | Default |
| --- | --- | --- |
| `household` | yes | — |
| `personaId` | no | omitted |
| `personIndex` | no | `1`. Used for workload and 3a. Coverage always uses both people |
| `askedForPerson` | no | omitted, which does not add H5. Send `true` when they asked for a person |
| `includeWorkload` | no | `true` |
| `includeCoverage` | no | `true` |
| `includeTax3a` | no | `true` |

The app helper sends `personIndex: 1`, all three includes true, and `askedForPerson: false` until they ask for a person.

```bash
curl -s -X POST http://localhost:3000/api/recommendations \
  -H 'Content-Type: application/json' \
  -d '{
    "household": {
      "relationship": "married",
      "persons": [
        {"sex": 1, "birthYear": 1992, "fullTimeIncome": 100000, "workloadPc": 100, "withBVG": true},
        {"sex": 2, "birthYear": 1994, "fullTimeIncome": 90000, "workloadPc": 100, "withBVG": true}
      ],
      "children": [{"birthYear": 2027}],
      "postcode": "4051"
    },
    "personIndex": 1,
    "askedForPerson": false
  }'
```

Response:

| Field | What it is |
| --- | --- |
| `rulesVersion` | `"1"` |
| `suggestions` | Array of suggestions. See [Rules](#rules) |
| `auditIds` | Ids just written to the audit log. Product and handover only; “not needed” is in `suggestions` and not in the log |
| `workload` | `WorkloadSimulation`, present when `includeWorkload` is true. Same shape as the workload route, default steps |
| `coverage` | Present when `includeCoverage` is true. See below |
| `tax3a` | `Tax3aResult`, present when `includeTax3a` is true |

A flag set to `false` drops that key. The three simulations run together; one failure fails the request.

### `coverage`

| Field | What it is |
| --- | --- |
| `scenarios[].id` | Scenario id. 1–4 are person 0, 5–8 are person 1 |
| `scenarios[].label` | Short label, for example `Partner 2 disabled by illness` |
| `scenarios[].personIndex` | `0` or `1` |
| `scenarios[].kind` | `disability-illness`, `disability-accident`, `death-illness`, or `death-accident` |
| `scenarios[].incomeNeedMo` | Need, CHF per month |
| `scenarios[].incomeTotalMo` | Cover in place, CHF per month |
| `scenarios[].incomeGapMo` | Gap, CHF per month. `0` means the need is met |
| `scenarios[].capitalGap` | Capital gap, CHF |
| `scenarios[].traceId` | Trace id for the monthly gap |

Order of kinds for each person: disability by illness, disability by accident, death by illness, death by accident. Monthly figures are the yearly engine figures divided by 12 and rounded. Live calls use `calculateRisk`.

### Suggestion

| Field | What it is |
| --- | --- |
| `ruleId` | Rule id below |
| `kind` | `product`, `not-needed`, or `handover` |
| `title` | Short title |
| `body` | One or two sentences |
| `amount` | Present on product suggestions |
| `amountUnit` | `CHF`, `CHF/yr`, or `CHF/mo` |
| `productHint` | Product name, when there is one |
| `traceIds` | Trace ids the suggestion rests on. Empty for some handovers |

Errors: 400, 500, Logismata.

## `POST /api/leads`

When they book a conversation: `/me/book`, or the book action from `/ask`. The route recalculates workload, coverage, and 3a, runs the same rules, writes the audit rows, and stores the lead.

| Field | Required | Default |
| --- | --- | --- |
| `household` | yes | — |
| `entryPoint` | no | `"ask"`. The app helper sends `"book"` from the booking screen. Any non-empty string |
| `contactPreference` | no | `"video"`. Also `call`, `office`, `message` |
| `questions` | no | `[]`. Strings they still want answered |
| `askedForPerson` | no | `true`, so H5 is included unless you send `false` |

There is no `personaId` and no `personIndex` on this body.

```bash
curl -s -X POST http://localhost:3000/api/leads \
  -H 'Content-Type: application/json' \
  -d '{
    "household": {
      "relationship": "married",
      "persons": [
        {"sex": 1, "birthYear": 1992, "fullTimeIncome": 100000, "workloadPc": 100, "withBVG": true},
        {"sex": 2, "birthYear": 1994, "fullTimeIncome": 90000, "workloadPc": 100, "withBVG": true}
      ],
      "children": [{"birthYear": 2027}],
      "postcode": "4051"
    },
    "entryPoint": "book",
    "contactPreference": "video",
    "questions": ["What happens to my pension at 60%?"],
    "askedForPerson": true
  }'
```

Response: `{ "lead": { … } }`.

| Field | What it is |
| --- | --- |
| `id` | UUID |
| `createdAt` | ISO timestamp |
| `entryPoint` | What you sent |
| `contactPreference` | What you sent |
| `household` | Household after needs defaults |
| `gaps` | The suggestions, same shape as `suggestions` above |
| `questions` | The strings you sent |
| `traceIds` | Every trace id on `gaps` |

The raw workload, coverage, and tax objects are not on the lead. They are folded into `gaps`. Errors: 400, 500, Logismata.

## `GET /api/leads`

List the briefs. No body. Response: `{ "leads": [ … ] }`, newest first, at most 50. Each item is the lead object above. Empty array when none have been created in this process.

## `GET /api/leads/[id]`

One brief, for the advisor page. No body.

| Status | Body |
| --- | --- |
| 200 | `{ "lead": { … } }` |
| 404 | `{ "error": "Lead not found" }` |

## `GET /api/trace/[id]`

When they tap a franc amount or a percent. No body. The id comes from a step, a coverage scenario, a 3a result, or a suggestion.

| Status | Body |
| --- | --- |
| 200 | `{ "trace": { … } }` |
| 404 | `{ "error": "Trace not found" }` |

| Field | What it is |
| --- | --- |
| `id` | UUID |
| `label` | What the number is. Example: `Your pension fund pension at 60%` |
| `value` | The number |
| `unit` | `CHF/yr`, `CHF/mo`, or `%` |
| `operation` | Engine call, when there is one. Example: `calculateRetirementBase` |
| `responseField` | Field the number was read from. Example: `Person2.Pension` |
| `inputs` | Inputs that mattered. Values are numbers or strings |
| `derivation` | How a difference was built, when it was derived. Example: `(26'506 - 11'666) / 12` |
| `assumptions` | Short lines, such as the need percent or “Pension fund estimated from salary” |
| `ruleId` | Optional on the trace. These routes do not set it; the rule id is on the suggestion and the audit row |
| `sources` | `estimate`, `user`, and/or `document` |
| `explanation` | One sentence for the sheet |
| `createdAt` | ISO timestamp |

Workload writes two traces per step (pension and monthly difference). Coverage, retirement age, and 3a write one each.

## `GET /api/audit`

The advisor trail after recommendations or a lead. No body. Response: `{ "entries": [ … ] }`, newest first, at most 50.

| Field | What it is |
| --- | --- |
| `id` | UUID. These are the `auditIds` from recommendations |
| `createdAt` | ISO timestamp |
| `ruleId` | Rule that fired |
| `suggestion` | The suggestion object |
| `householdSnapshot` | Household at that moment, after needs defaults |
| `traceIds` | Copy of the suggestion’s trace ids |

“Not needed” rules (N1, N3) are not stored. Product and handover rules are.

## Rules

`rulesVersion` is `"1"`. A suggestion is kept once per rule id and title, so a second H2 with the same title is dropped. P4 only runs when the workload result includes a step at exactly 60%.

The age used for H3 is the current calendar year minus the birth year of person 2, or of the only person. An empty `source` map counts as all estimates, so H4 fires.

| Id | Kind | When it is added |
| --- | --- | --- |
| N1 | not-needed | Single and no children. No death cover |
| P1 | product | Death by illness leaves a monthly gap, and someone depends on the income. `amount` is the capital gap rounded up to CHF 10'000 |
| P2 | product | Disability by illness leaves a monthly gap. `amount` is that gap times 12, rounded up to CHF 1'000, unit `CHF/yr` |
| P4 | product | Some step under 100% has a monthly pension drop, and 60% is one of the steps. `amount` is the monthly drop at 60%, capped at this year’s 3a maximum divided by 12 (7'258 when the 3a result is absent) |
| T1 | product | `taxSaved` is above 0. `amount` is `maxContribution` |
| N3 | not-needed | Every accident scenario has `incomeGapMo` of 0 |
| H1 | handover | A suggestion already points at a fund product (`productHint` contains “FondsStar” or “fund”) |
| H2 | handover | The P1 lump or the P2 annual amount is over CHF 200'000 |
| H3 | handover | That person is 55 or older |
| H4 | handover | More than half of the `source` values are `estimate` |
| H5 | handover | `askedForPerson` is true |

## Environment

Set these in `code/.env.local` (see `code/.env.example`). They stay on the server.

| Variable | Effect |
| --- | --- |
| `LOGISMATA_BASE_URL` | Engine origin. Default `https://api.logismata.com`. A trailing slash is removed |
| `LOGISMATA_API_TOKEN` | Bearer token for Logismata. Empty means the routes use recorded results |
| `DEMO_CACHE` | `1`, `true`, or `yes` forces recorded results. Unset: on when the token is empty, off when the token is set |
| `LLM_API_KEY` | Model key, read by the engine config |
| `LLM_BASE_URL` | Model origin, read by the engine config. A trailing slash is removed |
