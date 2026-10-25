# Ghana in Numbers

Ghana in Numbers is a dashboard-style frontend for presenting key national indicators from the Ghana Statistical Service in a fast, visual, and accessible format.

The current implementation focuses on the homepage experience: a national snapshot with headline KPIs, a regional map, macro charts, and quick-entry cards for deeper stories and exploration.

## Current Scope

Ten routes present the statistics of *Ghana in Numbers 2025*: an overview, six chapter pages (Population and Society, Social Development, Business and Economy, Governance, Environment and Climate, Progress on the SDGs), two deep dives (Youth Bulge; Agriculture, Forestry and Fishing) and Data Stories. Every indicator card shows its unit, reference period, qualifiers (provisional, projection, estimate) and source page, with a **View data** table and an **Explain** panel. A floating **Ask Ghana in Numbers** assistant answers questions from the same data (see `docs/data-assistant.md`).

## Design system

- Tokens (colour, type, radii, shadows, focus) are defined once in `app/globals.css`. Brand colours follow the rendered statsghana.gov.gh site: navigation `#241B5A`, controls `#3C2FA3`; slate neutrals; a six-colour chart palette mirrored in `components/ui/chart.tsx`.
- Layout primitives: `components/ui/Page.tsx` (page header, section, in-page navigation, grid) and `components/ui/Card.tsx` (indicator card, KPI card, stats, qualifiers).
- Data primitives: `components/ui/Data.tsx` (View data disclosure, accessible tables with parent–child rows, segmented switches, legends).
- Navigation is defined in `lib/navigation.ts` and drives the sidebar, the mobile drawer, search and the overview topic grid.

## Data and documentation

- Publication data: `data/*.ts`; series added in the October 2026 review: `data/publicationAdditions.ts`.
- `docs/document-data-audit.md`: corrections and conflicts in the source edition.
- `docs/coverage-record.md`: page-by-page mapping of the publication to dashboard locations and visuals.
- Checks: `node --experimental-strip-types scripts/check-report-data.mjs`, `node scripts/check-assistant.cjs`, `npx tsc --noEmit`, `npm run build`.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Recharts
- react-simple-maps

## Getting Started

### Prerequisites

- Node.js 20+ recommended
- npm

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

Open `http://localhost:3000`.

### Build for production

```bash
npm run build
npm run start
```

## Available Scripts

- `npm run dev`: start the development server
- `npm run build`: create a production build
- `npm run start`: run the production build

## Notes

- The app currently uses `next/font/google` for the Inter font in `app/layout.tsx`.
- In restricted or offline environments, `npm run build` can fail if Google Fonts cannot be fetched.
- If offline builds are required, switch to local fonts or a system font stack.

## Ownership

Built for the Ghana in Numbers dashboard initiative in the Ghana Statistical Service context.
