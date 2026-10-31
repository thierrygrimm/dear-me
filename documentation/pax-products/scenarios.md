# Dear Me scenarios: life moment, gap, product

Dear Me recommends only when the engine shows a gap. Each life moment opens one or more of five gap types, and each gap type maps to a product family.

## Gap types

| Gap | Question the app answers | Pax product |
| --- | --- | --- |
| Retirement gap | Will I have enough at 65? | TerzaFondsStar / TerzaLifeStar (3a), FondsStar / LifeStar (3b) |
| Income gap | What if I can't work? | Erwerbsunfähigkeitsversicherung (SIR, SIRjL) |
| Family gap | What if I die? | Todesfallversicherung (FR, FK, FKF, FK2) |
| Child gap | What if something happens to my child, or to me as payer? | Kinderversicherung (FirstStep) |
| Payout gap | How do I turn capital into monthly income? | Auszahlungsplan |

Guarantee or funds: offer LifeStar when the horizon is short or the person wants certainty, FondsStar when the horizon is 10+ years.

## Life moments

| # | Moment | Age | Trigger in the app | Gaps opened | First recommendation | Second | Letter line |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | First job | 20 to 28 | First salary, first pension statement | Income, retirement | SIRjL (young tariff, extra surplus first 2 years) | TerzaFondsStar, small premium | Dear me at 65, I started early. You're welcome. |
| 2 | Moving in, unmarried | 25 to 40 | "We live together" | Family | FK2 (covers both lives) | FondsStar 3b | Dear me, we're not married. The law has noticed. |
| 3 | Expecting a child | 28 to 40 | Due date entered | Family, child, income | FR (pension for the family) | FondsStar with birth waiver (4 months), Kinderversicherung | Dear us, before we decide who stays home. |
| 4 | Reducing pensum | 30 to 45 | Pensum slider below 100% | Retirement, income | TerzaFondsStar with automatic 3a increase | SIR (pension-fund disability cover falls with salary) | 60% pensum. Let's not make it 60% pension. |
| 5 | Buying a home | 30 to 50 | Mortgage amount | Family | FKF (decreasing capital follows the mortgage) | TerzaLifeStar for indirect amortisation | Dear me, the flat is ours. Let's keep it that way. |
| 6 | Going self-employed | 25 to 55 | Employment type = self-employed | Income, retirement, family | SIR | Large 3a with TerzaFondsStar or TerzaLifeStar | Dear me, I'm my own boss now. That includes your pension. |
| 7 | Divorce or separation | 35 to 55 | Civil status change | Retirement, family | Restart 3a (FondsStar or LifeStar by horizon) | New FR or FK with new beneficiaries | Dear me, new start. New numbers. |
| 8 | Windfall: bonus, inheritance | any | One-off amount entered | Retirement | FondsStarInvest / LifeStarInvest, or privileged top-up | | Dear me, we didn't spend it all. |
| 9 | Becoming a grandparent | 50 to 65 | "I want to save for a grandchild" | Child | Kinderversicherung (payer up to 65) | FondsStar 3b in the child's name | Dear little one, I thought about you today. |
| 10 | Catching up at 50+ | 50 to 60 | Gap shown, horizon under 15 years | Retirement | TerzaLifeStar with high guarantee share | LifeStarInvest for savings already there | Dear me, late is better than never. |
| 11 | Retirement with lump sum | 60 to 70 | Capital withdrawal chosen | Payout | Auszahlungsplan (from CHF 25,000) | | Dear me, the money's here. Now let's make it last. |
| 12 | Caring for a parent | 40 to 60 | Pensum cut for care | Retirement, income | 3a to keep saving | SIR | Dear me, I'm caring for Mum. Who's caring for you? |

## Timing rules for the prototype

- Show a product only after the user has seen their own gap in CHF.
- One recommendation per screen; the second one appears only on "show more".
- Moments 3 and 4 often come together: run the child scenario first, then offer the pensum slider.
- Moment 1 and 3 are the strongest demo pair: young and simple, then emotional and complex.

## For the hackathon demo

Lead with moment 3 + 4 (expecting a child, then reducing pensum): it touches four of the five gaps and shows the women's pension gap (31.2%, CHF 16,379 a year, BFS 2023).

Then show moment 11 briefly to prove the app also works at the other end of life.

## Open questions for Pax

- What exactly is a "privilegierte Einmalprämie", and who qualifies?
- What is in the Basic, Medium and Premium packages of the children's insurance?
- Is the birth and adoption waiver also available on LifeStar?
- Which products can be offered fully digitally, and which need an advisor?
