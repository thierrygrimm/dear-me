# Pax QuickSale catalogue

Nine portal categories, 19 tariffs (from `api/defaults/vorschlag`).

## Portal categories

- Gebundene Vorsorge (Säule 3a)
- Freie Vorsorge (Säule 3b)
- Fondsanlage mit individueller Garantie
- Fondsanlage
- Kinderversicherung
- Erwerbsunfähigkeitsversicherung
- Todesfallversicherung
- Auszahlungsplan

## Tariffs

| # | Tariff | Family | Pillar | Premium |
| --- | --- | --- | --- | --- |
| 0 | TerzaLifeStar | LifeStar (guarantee + funds) | 3a | Periodic |
| 1 | TerzaLifeStarInvest | LifeStar | 3a | Single |
| 2 | TerzaLifeStarPlanInvest | LifeStar | 3a | Periodic + single |
| 3 | LifeStar | LifeStar | 3b | Periodic |
| 4 | LifeStarInvest | LifeStar | 3b | Single |
| 5 | LifeStarPlanInvest | LifeStar | 3b | Periodic + single |
| 6 | Privilegierte Einmalprämie (LifeStar) | LifeStar top-up | 3a | Single |
| 7 | Privilegierte Einmalprämie (LifeStar) | LifeStar top-up | 3b | Single |
| 8 | TerzaFondsStar | FondsStar (funds) | 3a | Periodic |
| 9 | TerzaFondsStarInvest | FondsStar | 3a | Single |
| 10 | TerzaFondsStarPlanInvest | FondsStar | 3a | Periodic + single |
| 11 | FondsStar | FondsStar | 3b | Periodic |
| 12 | FondsStarInvest | FondsStar | 3b | Single |
| 13 | FondsStarPlanInvest | FondsStar | 3b | Periodic + single |
| 14 | Privilegierte Einmalprämie (FondsStar) | FondsStar top-up | 3a | Single |
| 15 | Privilegierte Einmalprämie (FondsStar) | FondsStar top-up | 3b | Single |
| 16 | Auszahlungsplan | Payout plan | 3b | Single |
| 17 | Todesfallversicherung | Term life (FK, FKF, FK2, FKF2, FR) | 3a / 3b | Periodic |
| 18 | Erwerbsunfähigkeitsversicherung | Income protection (SIR, SIRjL) | 3a / 3b | Periodic |

The children's insurance (FirstStep, packages Basic, Medium, Premium) appears in the portal but not in the API's default list; it is built on FondsStar FR or LifeStar FR.

"Privilegierte Einmalprämie" is listed as a top-up ("Zuzahlung") into a LifeStar or FondsStar contract. Its exact conditions are not on the portal.
