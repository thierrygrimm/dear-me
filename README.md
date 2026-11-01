<a name="readme-top"></a>

<p align="center">
  <img src="assets/logo.svg" width="96" alt="dear me — lime square mark with a charcoal squirrel">
</p>

<h1 align="center">dear me</h1>

<p align="center">
  <b>A planner for life's big moments.</b><br>
  BaselHack 2026 · Pax challenge · Philippe Reichen &amp; Thierry Grimm
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind-4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind">
</p>

<details>
  <summary>Table of contents</summary>
  <ol>
    <li><a href="#what-it-is">What it is</a></li>
    <li><a href="#how-it-feels">How it feels</a></li>
    <li><a href="#what-you-can-do">What you can do</a></li>
    <li>
      <a href="#getting-started">Getting started</a>
      <ul>
        <li><a href="#requirements">Requirements</a></li>
        <li><a href="#setup">Setup</a></li>
        <li><a href="#useful-urls">Useful URLs</a></li>
      </ul>
    </li>
    <li><a href="#demo-personas">Demo personas</a></li>
    <li><a href="#repository">Repository</a></li>
    <li><a href="#design">Design</a></li>
    <li><a href="#challenge-context">Challenge context</a></li>
    <li><a href="#licence">Licence</a></li>
  </ol>
</details>

## What it is

**dear me** helps people in Switzerland plan the moments that actually change their money: a baby, less hours at work, a first job, buying a home, going self-employed, retirement.

You ask in your own words. The app answers with one clear sentence and a number in francs — then lets you play with the levers (pensum, who is planning, what-if scenarios). Only when a real gap remains does it show a Pax idea. You can book a human advisor when you want one.

Built for the Pax BaselHack 2026 challenge: make life insurance and Vorsorge simple, honest, and calm.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## How it feels

A few principles we keep coming back to:

| Principle | In practice |
| --- | --- |
| Answer first | One short verdict, then one number. Detail on tap. |
| Engine calculates, AI explains | Every figure has a source. The model does not invent amounts or products. |
| Permission over pressure | “You don't need anything else.” is a complete screen. |
| Gaps without alarm | Missing cover shows as dashed outlines — no red scare tactics. |
| Life before product | Start from the moment (“we're expecting”), not from a catalogue. |

Tone: like a friend who understands money, at the kitchen table at 11 pm. Warm, never cute. No emoji in product copy.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## What you can do

| Area | What happens |
| --- | --- |
| **Home** | Greeting by name, the one thing worth looking at, next steps, a short lesson, a letter to future you. |
| **Ask** | Type or speak (“What's on your mind?”). Guided life-moment flows, follow-up chat, plans you can tick. |
| **Plan** | Open steps from those moments — tap and go. |
| **Learn** | Two-minute lessons (three pillars, part-time, certificate, 3a). |
| **Me** | What we know, documents, privacy, booking a Pax advisor. |
| **Numbers in** | myPax login, certificate scan/upload, or a quick estimate. |
| **Numbers out** | Coverage across retirement, disability, family, savings; scenario compare in CHF. |

Life moments map to gaps (retirement, income, family, child, payout). A Pax product appears only after the gap is shown in francs. Details live in [`documentation/pax-products/scenarios.md`](documentation/pax-products/scenarios.md).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting started

### Requirements

- Node.js 20+ (or a current LTS)
- npm (ships with Node; the app uses `package-lock.json`)

No API keys are required for the current prototype: demo personas, lessons, and flows run locally in the browser.

### Setup

```bash
git clone https://github.com/thierrygrimm/dear-me.git
cd dear-me/code
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |

### Useful URLs

| Path | What |
| --- | --- |
| `/` | Home (after onboarding) |
| `/signup` | Welcome, myPax / Apple / Google / email, life moments |
| `/ask` | Ask bar and guided moments |
| `/plan` | Open steps |
| `/learn` | Lessons |
| `/me` | Profile, documents, privacy, booking |
| `/certificate` | Bring in a Vorsorgeausweis |
| `/dev/ui` | Component playground |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Demo personas

On Home you can switch lives to walk the jury through different stories:

| Persona | Moment | Soft spot |
| --- | --- | --- |
| **Lena & Marco** | Expecting a child | Part-time after the baby (~CHF 600 / month at 65) |
| **Noah** | First job | Income protection while the fund is still thin |
| **Sandra** | Self-employed | No pension fund — AHV/IV only if she can't work |
| **Ruth** | Near retirement | Turning capital into a lasting payout |

Pax challenge reference personas (Müller, Smith, Johnson) are documented under [`documentation/pax-challenge-material/markdown/personas.md`](documentation/pax-challenge-material/markdown/personas.md).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Repository

| Folder | Content |
| --- | --- |
| [`code/`](code) | Next.js app (PWA shell, tabs, flows, copy) |
| [`documentation/`](documentation) | Product scenarios, Pax catalogue notes, challenge material |
| [`dear-me-design-system/`](dear-me-design-system) | Tokens, components, principles, interactive previews |
| [`assets/`](assets) | Logos and pitch assets for this README |

Inside `code/`, most product strings live in [`code/lib/copy.ts`](code/lib/copy.ts) so a German pass can follow without hunting the UI.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Design

Brand: lime (`Neonweste`) as signal, charcoal ink, paper grounds. The squirrel is the only character — listening, thinking, progress, done.

Full principles, colour, type, motion, and component inventory: [`dear-me-design-system/README.md`](dear-me-design-system/README.md).

Open `dear-me-design-system/index.html` in a browser for the live kit.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Challenge context

Pax asked for an AI that makes life insurance simple, with clear legal guardrails:

1. Transparent data use — no uncontrolled hand-off of personal data to external AI.
2. Recommendations that are explainable, documented, and auditable.
3. Human review still possible for complex or high-impact cases.
4. Security and insurance-law basics (access, logging, formal requirements).

Source notes: [`documentation/pax-challenge-material/markdown/legal-framework.md`](documentation/pax-challenge-material/markdown/legal-framework.md).

Parsed QuickSale catalogue and moment → gap → product mapping: [`documentation/pax-products/`](documentation/pax-products/).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Licence

Proprietary — all rights reserved. See [`LICENSE`](LICENSE).

Copyright © 2026 Philippe Reichen and Thierry Grimm.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
