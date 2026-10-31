# Pax QuickSale catalogue, parsed for Dear Me

Source: Pax QuickSale EDU portal (`portal.pax.ch/quicksale/edu/`), read on 31 Oct 2026 in a browser, plus the technical tariff sheets the portal links to.

## How it was parsed

1. Plain web fetch: blocked by the site's robots rules.
2. Browser (Chrome): read the product overview page text and every link.
3. The portal's own API: `api/defaults/vorschlag` returned the full product list (19 tariffs) and the fund list. `api/produkte` returned an error without a session.
4. Tariff PDFs linked from each product card: ages, minimum premiums, options.

The proposal calculator (`/vorschlag`) needs a person's name, birth date and nationality before it shows prices, so no premiums were calculated.

## Files

| File | Content |
| --- | --- |
| `catalogue.md` | All 19 tariffs, grouped, with pillar and premium type |
| `products/lifestar.md` | Savings with individual guarantee (3a and 3b) |
| `products/fondsstar.md` | Fund savings (3a and 3b), incl. birth and adoption waiver |
| `products/kinderversicherung.md` | Children's insurance (FirstStep) |
| `products/erwerbsunfaehigkeit.md` | Income protection (SIR, SIRjL) |
| `products/todesfall.md` | Term life: constant, decreasing, annuity, two lives |
| `products/auszahlungsplan.md` | Payout plan for retirement capital |
| `products/funds.md` | Funds available inside the unit-linked products |
| `scenarios.md` | Life moments mapped to gaps and products, for Dear Me |

All tariff sheets say they are for illustration only. Binding terms come from the policy and Pax's general insurance conditions (AVB).
