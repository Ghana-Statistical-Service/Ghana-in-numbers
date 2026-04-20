# Ghana in Numbers

Ghana in Numbers is a dashboard-style frontend for presenting key national indicators from the Ghana Statistical Service in a fast, visual, and accessible format.

The current implementation focuses on the homepage experience: a national snapshot with headline KPIs, a regional map, macro charts, and quick-entry cards for deeper stories and exploration.

## Current Scope

The app currently includes:

- A dashboard shell with sidebar navigation and top bar
- A KPI strip for headline national indicators
- An inflation summary card with a trend graph
- A regional choropleth map
- GDP growth and sector breakdown charts
- Supporting cards for monthly changes, popular indicators, and a featured data story

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Recharts
- react-simple-maps

## Project Structure

```text
src/
  app/
    layout.tsx
    page.tsx
    globals.css
  components/
    home/
      ChoroplethMap.tsx
      DataStoryCard.tsx
      GDPGrowthChart.tsx
      InflationSparkline.tsx
      KPIStrip.tsx
      MostSearchedCard.tsx
      SectorBreakdown.tsx
      WhatsChangedCard.tsx
    layout/
      Sidebar.tsx
      TopBar.tsx
  data/
    dummy.ts
  lib/
    geojsonToSvg.ts
  types/
    index.ts
```

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

## Data

The current interface uses placeholder/demo values stored in [`src/data/dummy.ts`](./src/data/dummy.ts).

This keeps the frontend easy to iterate on while live data integration and final indicator definitions are being refined.

## Design and Product Direction

The broader product direction is documented in [`../docs.md`](../docs.md), including:

- thematic areas
- homepage structure
- section templates
- future storytelling and SDG modules

## Status

This repository is currently a frontend prototype / working dashboard shell, not a finished production release.

Expected next steps include:

- live data integration from official sources
- expanded thematic pages
- drill-downs and comparisons
- production hardening and deployment setup

## Notes

- The app currently uses `next/font/google` for Geist fonts in [`src/app/layout.tsx`](./src/app/layout.tsx).
- In restricted or offline environments, `npm run build` can fail if Google Fonts cannot be fetched.
- If offline builds are required, switch to local fonts or a system font stack.

## Ownership

Built for the Ghana in Numbers dashboard initiative in the Ghana Statistical Service context.
