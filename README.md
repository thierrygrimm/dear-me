<a name="readme-top"></a>

<p align="center">
  <img src="assets/logo.svg" width="96" alt="dear me — lime square mark with a charcoal squirrel">
</p>

<h1 align="center">dear me</h1>

<p align="center">
  <b>A planner for life's big moments.</b><br>
  BaselHack 2026 · Pax challenge · Philippe Reichen &amp; Thierry Grimm
</p>

<div align='left'>

[![](https://img.shields.io/badge/Next.js-000000.svg?style=for-the-badge&logo=nextdotjs&logoColor=white 'Next.js')](https://nextjs.org/) [![](https://img.shields.io/badge/React-61DAFB.svg?style=for-the-badge&logo=react&logoColor=black 'React')](https://react.dev/) [![](https://img.shields.io/badge/TypeScript-3178C6.svg?style=for-the-badge&logo=typescript&logoColor=white 'TypeScript')](https://www.typescriptlang.org/) [![](https://img.shields.io/badge/Tailwind-38BDF8.svg?style=for-the-badge&logo=tailwindcss&logoColor=white 'Tailwind')](https://tailwindcss.com/)

</div>

<details>
  <summary>Table of contents</summary>
  <ol>
    <li><a href="#project-description">Project description</a></li>
    <li>
      <a href="#getting-started">Getting started</a>
      <ul>
        <li><a href="#requirements">Requirements</a></li>
        <li><a href="#setup">Setup</a></li>
        <li><a href="#usage">Usage</a></li>
      </ul>
    </li>
    <li><a href="#repository">Repository</a></li>
    <li><a href="#licence">Licence</a></li>
  </ol>
</details>

## Project description

**dear me** is a Swiss Vorsorge planner for life's big moments — a baby, less hours at work, a first job, a home, self-employment, retirement.

You ask in your own words. The app answers with one short sentence and a number in francs, then lets you change the levers (pensum, who is planning, what-ifs). Every figure carries its source; the model explains, the engine calculates. Numbers use Swiss formatting (`CHF 3'640`, `60 %`). Copy is English for now, centralised in [`code/lib/copy.ts`](code/lib/copy.ts).

Built for the Pax BaselHack 2026 challenge. Challenge material and product notes sit under [`documentation/`](documentation).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting started

### Requirements

- Node.js 20+ (current LTS is fine)
- npm (the app ships with `package-lock.json`)

No API keys are required to run the prototype locally.

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

### Usage

| Path | What |
| --- | --- |
| `/` | Home |
| `/signup` | Welcome and account / look-around |
| `/ask` | Ask in your own words |
| `/plan` | Open steps |
| `/learn` | Short lessons |
| `/me` | Profile, documents, privacy |
| `/certificate` | Bring in a Vorsorgeausweis |
| `/dev/ui` | UI playground |

Start at `/signup` if you have not been through onboarding yet.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Repository

| Folder | Content |
| --- | --- |
| [`code/`](code) | Next.js app |
| [`documentation/`](documentation) | Challenge material, product notes, commit style |
| [`assets/`](assets) | Logos used by this README |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Licence

Proprietary — all rights reserved. See [`LICENSE`](LICENSE).

Copyright © 2026 Philippe Reichen and Thierry Grimm.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
