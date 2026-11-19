# Multidimensional Poverty dashboard: guidelines

These are the rules the `/multidimensional-poverty` page is built to. They exist so that the page can be read by someone
with no statistical training without any official figure being bent, rounded away or over-claimed along the way.
`scripts/check-mpi-data.mjs` enforces the rules marked **[checked]**; run it whenever the data or the page changes.

## 1. Sources and what each one may be used for

**The page shows two published series, side by side and never mixed.**

| Series | Source (all Ghana Statistical Service, Administrative Data Reports) | Used for |
|---|---|---|
| Quarterly survey | *Multidimensional Poverty Report, 2024 Q1 to 2025 Q3* (AHIES and QLFS), Tables 6.1 to 6.36, Figure 4.2; the *MPI 2025* infographic for 2025 Q1 values the tables omit | Latest national, regional, urban and rural, household-group and driver figures; overlapping hardships |
| Annual | *Multidimensional Poverty Report* (2021 Population and Housing Census), Table 4.1, Figures 5.1 to 5.16, Tables 7.1 and 7.18 | National, regional, household-group and driver figures for 2021; weights; each district's 2021 population and number of poor |
| Annual | *District-Level Multidimensional Poverty Rankings, 2021 to 2025* | District incidence and rank, every year |
| Annual | StatsBank, *MPI by Indicators, Year and District* | Share of each district's MPI that comes from each indicator |
| Annual | District fact sheets (261 PDFs) | Linked for download; wording of the indicator definitions |

The quarterly figures live in `data/mpiQuarterlyData.ts`, the annual ones in `data/mpiData.ts` and `data/mpiDistricts.json`. `scripts/check-mpi-data.mjs` fails if quarterly figures appear in the annual file. **[checked]**

Rules:

1. **Every figure on the page is a published figure.** Nothing is modelled, interpolated, forecast or averaged by the dashboard. **[checked]**
2. The only arithmetic allowed is: a difference between two published values of the same series, a sum of published indicator shares into their dimension, a count or a range (lowest to highest) of published district values, and the rank order of published values. Each is labelled as derived.
3. **Never mix the two series.** Quarterly survey figures and annual figures are never placed on one axis, never subtracted from one another and never described as a trend from one to the other. Each card names its period; on the national picture the annual figures sit in their own numbered block; on the Regions and Who is affected tabs a switch chooses the series.
3a. **Say which kind of figure it is.** In the annual series 2021 figures are census counts and 2022 to 2025 district figures are modelled estimates, marked "modelled estimate".
4. **In the annual series, national and regional figures exist for 2021 only.** The page never fills later years by averaging or summing districts (no populations are published after 2021). A region's later years are shown as its list of districts.
5. In the 2021 census tables the districts add up to their region and the regions to the national figure exactly; the check script enforces this. **[checked]**
6. Where two parts of a publication disagree, the table or the labelled figure is used, the choice is recorded in `docs/document-data-audit.md`, and the page does not repeat the conflicting sentence.
7. Each card carries its source with table or figure number. Each view links to the original publication and to StatsBank.

## 2. Words

The public reads the words before the numbers, so the words are fixed.

| Official term | Shown as (first use) | Plain meaning used on the page |
|---|---|---|
| Incidence, headcount ratio (H) | "Share of people who are poor (incidence)" | Out of every 100 people, how many are multidimensionally poor |
| Intensity (A) | "How deep poverty is (intensity)" | The share of the weighted basic needs that poor people lack, on average |
| MPI (adjusted headcount ratio, M0) | "MPI score" | Incidence multiplied by intensity; 0 is no poverty, 1 is everyone lacking everything |
| Uncensored headcount ratio | "Went without this" | Share of the whole household population deprived in the indicator, poor or not |
| Percentage contribution | "Share of poverty that comes from" | How much of the MPI score is made up by an indicator or dimension; shares add to 100 |
| Deprived | "lacks" or "goes without" | Falls below the official cut-off for the indicator |

Rules:

1. The official term always appears beside the plain one at first use in a view, so a statistician can map the page back to the report.
2. "Multidimensionally poor" is never shortened to "poor" in a title or a headline number. It may be shortened in running text after the full term has been used in the same card.
3. **Contribution is not prevalence.** A sentence about contribution must not read as "X% of people lack...". The fixed wording is "X% of measured poverty comes from...".
4. No causal language ("because of", "led to", "thanks to") and no attribution to policies or governments. The page describes; the publications recommend.
5. No value judgements on places ("worst district", "poorest people"). Use "highest incidence" and "lowest incidence". Rank 1 is always explained as the highest incidence.
6. "1 in 5" style statements are allowed only next to the exact percentage, and only as "about".
7. Money poverty is a different measure. The page says so once in the method view and never compares the two.
8. House style: British spelling, no em dashes, no emoji, lucide icons marked `aria-hidden`.

## 3. Numbers

1. Percentages are shown to one decimal place, exactly as published. MPI scores to three decimals. **[checked]**
2. Counts of people are shown in full in tables. Headlines may use "7.2 million" beside the full figure.
3. Changes between two percentages are "percentage points", never "%".
4. No margins of error are published for the modelled district estimates, so a difference between two years or two districts is stated as a difference between published estimates, never as a proven rise or fall.
5. Missing is "not published", never zero and never a gap silently skipped.
6. Every value carries its unit and its reference period in the same card.
7. Shares of a whole are drawn on a 0 to 100 scale. Indicator contributions must add to 100 within rounding (99.5 to 100.5). **[checked]**

## 4. Charts

1. One job per chart, chosen in this order: a number (stat tile) → a comparison (sorted bars) → a trend (line) → a place (map) → parts of a whole (one segmented bar). No pies, no donuts, no dual axes, no 3D.
2. Bars start at zero. Trend lines for incidence start at zero as well, so a fall from 28 to 22 is not drawn as a collapse.
3. **Colour has three fixed jobs** and is never reused across them:
   - Dimension identity, the same on every chart: Health `#3C2FA3`, Living conditions `#0E8A7E`, Education `#D17A22`, Employment `#B4436C`. Always with a legend or direct label; never colour alone.
   - Magnitude on maps: the single purple ramp used across the dashboard, light = low, dark = high.
   - Emphasis: one highlighted mark in brand purple, the rest slate. Gold (`#C9A227` on light, `#F5C451` on dark) marks what the reader is pointing at or the latest value; it never encodes a category or a level.
   The four dimension colours are the house chart tokens. They pass colour-vision-deficiency separation and 3:1 contrast in the dataviz validator but sit outside its lightness and chroma bands, so identity is always double-encoded with labels.
4. **Maps use the Ghana map from the GSS Annual Economic Survey dashboard** (`components/maps/GhanaMap.tsx`): a continuous purple ramp, white boundaries, a gold highlight with the place name on hover, a floating value card and a gradient legend that marks the hovered value. **The ends of the scale are fixed per measure** (incidence 0 to 60% for regions and 0 to 70% for districts), never fitted to the period on screen, so a place keeps its colour meaning from one quarter or year to the next.
5. No red and green for "bad" and "good" places. Poverty levels are magnitude, not status.
6. Every chart has a text alternative (`role="img"` with a label that states the finding) and a "View data" table with the exact published values.
7. Values needed to read a chart are printed on it or in the table; a tooltip is never the only way to a value.
8. Controls sit in one row above what they change. Selecting a period or measure changes every linked chart together.
9. Text never wears a series colour. Text is ink, body or muted; a swatch beside it carries identity.
10. No text under 12px. Touch targets at least 36px. Everything reachable by keyboard; focus shows what hover shows.

## 5. Caveats that must be visible, not hidden in a tooltip

1. District figures for 2022 to 2025 are **modelled small area estimates** (2021 census with AHIES 2022 to 2024 and QLFS 2025). They carry more uncertainty than census figures and no margins of error are published. This is stated at the top of the district view.
2. The second health indicator is **mortality in 2021 and nutrition from 2022**. Indicator shares for 2021 are therefore not compared with later years in text, and the 2021 column is marked.
3. Ghana's MPI is a **national** measure with its own indicators and weights. It is not comparable with other countries' MPIs or with the global MPI.
4. Each national, regional and household-group card says whether it is the quarterly survey or the 2021 census.
4a. Quarterly figures move with the season and the survey sample. A single quarter is not a trend.
5. Ranks compress information: districts with almost identical incidence can sit many ranks apart. The rank is always shown with the incidence it comes from.

## 6. Look and motion

The page should feel like a flagship product without loosening anything above. The visual language is shared with the GSS Annual Economic Survey dashboard.

1. **One hero per view at most.** The national picture opens with a dark brand panel (ink to purple, Ghana-flag hairline, gold accent) carrying the headline sentence, the headline figure and three supporting figures. District profiles reuse the same panel at small size.
2. **A headline number is always the exact published value.** Numbers never count up, roll or tween: a half-finished animation shows a figure that was never published and can be captured in a screenshot. Figures may fade or slide into place.
3. Marks may animate once on entry (bars grow from zero, the trend line draws, dots appear), in under one second, and never loop. The only looping motion is a slow glow behind the hero dots. All motion stops under `prefers-reduced-motion`.
4. Decoration never looks like data: gradients, glows and patterns stay off chart marks. Bars and map fills are flat colour.
5. Pictures match the decimal: the 100-dot figure part-fills its last dot (21.9, not 22).
6. Each view is cut into numbered questions ("How has it changed?", "Where do people live?", "What is behind it?") so a reader can stop after any one of them.
7. White text on the hero is at least 75% opacity on the dark panel; gold is used for at most one phrase and one number per panel.

## 7. Layout

1. The page answers five questions in order, one per tab: *How many people? Where? Which districts? Who? How is it measured?*
2. Each tab opens with one sentence a non-specialist can repeat, followed by the evidence.
3. The first screen of the first tab holds the headline number, its plain reading, its trend and its source. Method is one click away, not in the way.
4. Components come from `components/ui` (Page, Card, Data, chart, Infographic). New visual patterns are added there only if reused.

## 8. Updating

1. Quarterly release: add the quarter to `data/mpiQuarterlyData.ts` from the report tables, with table numbers. New annual national or regional figures go in `data/mpiData.ts`.
2. District release: download the StatsBank table as JSON-stat 2, the ranking PDF and the census report, then run `python3 scripts/build-mpi-districts.py`.
3. Run `node --experimental-strip-types scripts/check-mpi-data.mjs` and `node scripts/check-assistant.cjs`.
4. Record any correction or source conflict in `docs/document-data-audit.md`.
