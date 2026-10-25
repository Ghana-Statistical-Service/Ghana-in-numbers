# Ghana in Numbers 2025: dashboard coverage record

Source: `../2025 GIN-Draft 24-12Oct26-Final (1).pdf` (167 PDF pages). Page numbers are printed pages (PDF page ≈ printed page + 19 in the main chapters). Compiled 25 October 2026 after a full text read of the publication and a visual check of every chart page listed below. It extends `document-data-audit.md`; earlier verified corrections are kept unless stated.

**How to read the table.** *Location* is the route and section anchor. *Visual* is the primary presentation; every visual also has a **View data** table with the published figures and an **Explain** panel (What it measures / The story in this chart / Why does it matter?). *Added or corrected* lists what changed in this pass. *Uncertainty* records anything not resolved from the document itself.

Abbreviations: B&E = `/business-and-economy`, Pop = `/population-and-society`, Soc = `/social-development`, Gov = `/governance`, Env = `/environment-and-climate-change`, SDG = `/progress-on-sdgs`, Youth = `/youth-bulge`, Agri = `/agriculture-forestry-fishing`, Stories = `/data-story`, Home = `/`.

## Front matter and Chapter 2

| PDF section, page | Indicator / dataset | Location | Visual | Added or corrected | Uncertainty |
|---|---|---|---|---|---|
| Foreword, Board, Preface, pp. iii–v | Context; Preface headline figures | Home welcome message (Government Statistician) | Text | Unchanged text; now an accessible native dialog | None |
| Executive Summary, pp. xv–xviii | Cross-chapter headline figures | Home KPIs, Key findings card, topic cards | KPI cards, dated findings | Findings list now dated and linked to sections | Exec. Summary groups coastal "nutrients and plastic" under one figure; the indicator printed in Ch. 8 is plastic debris density only, as shown |
| §1 Introduction, pp. 1–3 | Scope and sources | Page headers (sources line) | Text | Each page header names its sources and latest period | None |
| §2, p. 4 | Land and water area (238,500 / 227,500 / 11,000 km²) | Not charted | — | Not a time series; mentioned here for completeness | Not separately displayed |
| Figure 2.1, p. 5 | Administrative map | Regional map component (all regional maps) | Choropleth | Region boundaries reused for every regional indicator | District boundaries not used (regional publication) |
| Table 2.1, pp. 6–10 | National summary table | Each topic page KPI row; search index | KPI cards | Values reconciled with chapters; see conflicts below | Table 2.1 differs from detailed chapters for PPI, IIP water, tourism, forest share and "no say" (29.2% in Table 11.1); detailed chapters used |

## Chapter 3 Population and Society

| PDF section, page | Indicator / dataset | Location | Visual | Added or corrected | Uncertainty |
|---|---|---|---|---|---|
| §3.1 Figure 3.1, p. 12 | Population 2000–2025, census/estimate/projection | Pop `#population-size` | Line with census, estimate and projection markers | Restyled; label subset to prevent collisions; full values in table | None |
| Table 3.1, p. 13 | Growth rate and doubling time | Pop `#population-size` | Two separate-unit panels | Replaced plain table with paired bar panels | Doubling time explained as conditional |
| §3.2 Figure 3.2, p. 14 | Age–sex pyramid 2010/2021/2025 | Pop `#composition` | Diverging pyramid with year switch | Projection/census qualifier by year | None |
| §3.2 Figure 3.3, p. 15; Table 2.1 | Age groups 2025; sex shares and counts | Pop `#composition` | Composition bars (valid wholes) | **Added** male/female counts (16.6M / 17.1M) | Age shares total 99.9% (rounding, disclosed) |
| §3.3 Figure 3.4, p. 16 | Population density by region 2010, 2021 | Pop `#regional` | Choropleth + ranked list (selector) | **Added** all 16 regions both years | None; labels verified at 300 dpi and against the text |
| §3.3 Figure 3.5, p. 17 | Urban/rural shares 1984–2025 | Pop `#urbanisation` | 100% bars per census year | **Added** urban/rural counts 2000–2025 (8.28/10.63 … 19.80/13.95M) | 1984 counts not printed |
| §3.3 Figure 3.6, p. 18 | Regional share of population 2010/2021/2025 | Pop `#regional` | Choropleth + ranked list | **Added** 2010 and 2021 series (2025 already shown) | 2025 Greater Accra printed 18.2% (map) and 18.25% (text) |
| §3.4 Figure 3.7, p. 19 | TFR 1988–2022; regional TFR 2022 | Pop `#fertility-households`, `#regional` | Dot-line; choropleth | **Added** regional TFR for all 16 regions | None |
| §3.5 Figure 3.8, p. 20 | Household size 1984–2021 | Pop `#fertility-households` | Dot-line | Restyled | None |
| §3.6 Figure 3.9, p. 21 | Life expectancy at birth 1960–2021 | Pop `#life-expectancy` | Labelled line; age-group lookup kept | Restyled lookup (keyboard, Escape) | Uneven year spacing disclosed |
| §3.6 Figure 3.10, p. 22 | Remaining life expectancy by age and sex 2021 | Pop `#life-expectancy` | Two-line chart | **Added** as a visual (previously only inside the lookup) | None |
| §3.7 Figure 3.11, p. 23 | Net migration by region 2021 | Pop `#migration` | Diverging bars with zero line; map option | Labels added | Values rounded to thousands in source |
| §3.7 Figure 3.12, p. 24 | Internal migrant share 2000/2010/2021 | Pop `#migration` | Stat; milestone card with 10-person pictogram (30.2%, 34.7%, 27.0%) | Restored as its own card with table (Oct 2026) | Text rounds 2010 to "35%" |
| §3.7 Figure 3.13, p. 24 | Inter-regional migration (Sankey) | Pop `#migration` | Paired diverging bars: in-migrants vs out-migrants | **Added** all 16 regional in/out totals; in − out reproduces Figure 3.11 exactly | Individual origin–destination flows are unlabelled and not reproduced |
| §3.7 Figures 3.14–3.17, pp. 25–26 | Emigrants, reasons, destinations, immigrant share | Pop `#migration` | Stats; before/after figure with computed change; waffle grids; icon rows and tiles on a 0–100% scale | Restored as separate cards, each with table (Oct 2026) | Census reporting does not capture all emigrants |

## Chapter 4 Social Development

| PDF section, page | Indicator / dataset | Location | Visual | Added or corrected | Uncertainty |
|---|---|---|---|---|---|
| Figure 4.1, p. 28 | NER/GER by level 2019/20–2023/24 | Soc `#learning` | Lines with NER/GER switch, 100% reference | Restyled; 0-based axes | Prose misnames levels (audit #1); legend used |
| Figure 4.2, p. 29 | Completion rates | Soc `#learning` | Lines with 100% reference | Restyled | Ratios above 100% explained |
| Figure 4.3, p. 29 | Pupils per trained teacher | Soc `#learning` | Lines | Restyled | None |
| Figure 4.4, p. 30 | Active NHIS coverage 2010–2025 | Soc `#health` | Headline icon card (2 in 3 pictogram) + bars from zero | Restyled; change since 2024 computed | None |
| Figure 4.5, p. 31 | Teenage motherhood by locality | Soc `#health` | Latest national/rural/urban icon tiles + three straight lines with survey markers | Source line clarified (figure plots 2011 and 2017 though source cites 2008/2014/2022) | Survey sources for 2011 and 2017 not named |
| Figure 4.6, pp. 31–32 | Child marriage 2010/2021 | Soc `#protection` | Before/after strip + 100-person pictogram | Noted that the regional breakdown is not printed | Regional values absent despite the title |
| Figure 4.7, pp. 32–33 | Housing deficit, stock, requirement | Soc `#living-conditions` | House-icon before/after with computed change + stats | Added households (8.3M), structures (3.4 → 5.9M), vacancy (1 in 8) | Supply/demand lines are unlabelled except 2021 |
| Figure 4.8, p. 33 | Electricity, water, toilets | Soc `#living-conditions` | Three milestone cards with 10-household pictograms | Toilet end year 2022 called out | None |
| Figure 4.9, p. 34 | Gender-based violence 2016/2022 | Soc `#protection` | Icon cards (2016 vs 2022) + dumbbell | Change in percentage points | Forms overlap (not additive) |

## Chapter 5 Business and Economy

| PDF section, page | Indicator / dataset | Location | Visual | Added or corrected | Uncertainty |
|---|---|---|---|---|---|
| Figure 5.1, p. 36 | Nominal GDP, GH¢ | B&E `#output` | Bars with GH¢/US$ switch | Revised/provisional marked | Non-oil line unlabelled, not reproduced |
| Figure 5.2, p. 36 | Nominal GDP, US$ 2013–2025 | B&E `#output` | Same card (US$) | **Added** full series | Duplicate "2019" x-label (audit #9) |
| Figures 5.3–5.4, pp. 37–38 | GDP per capita GH¢ and US$ | B&E `#output` | Bars with currency switch | **Added** US$ series (2,453 … 3,385) | Fig 5.3 caption says US$ but is GH¢ (audit #9) |
| Figure 5.5, p. 38 | Real GDP and growth | B&E `#output` | Two separate panels (level line, growth bars) | **Replaced dual-axis chart** with separate panels; non-oil growth 7.6% (Table 2.1) added | Non-oil real line unlabelled |
| p. 37 | Sector shares 2025 | Home, B&E `#output` | 100% bar | **Added** comparison bar of establishments by sector (IBES, 76.7/21.1/2.2%) clearly labelled as a different measure | None |
| Table 5.1, p. 39 | GDP by expenditure | B&E `#output` | Waterfall with nominal/real switch; hierarchy table | Restyled; consumption sub-items kept outside the sum | Rounding disclosed |
| §5.2 Table 5.2, pp. 40–41 | Agriculture spending, GVA, GDP, AOI 2013–2024 | Agri `#spending` | AOI line | **Added** full series with money columns | AOI reproduces from GVA ÷ GDP; printed "GVA share" column ≈1 point higher (likely basic prices); 2024 GDP 1,176.2bn predates revision |
| §5.2 Figure 5.6, p. 42 | Fish production by source | Agri `#fish` | Stacked bars (value) | **Corrected:** labels are GH¢ billion values, not tonnes; full 2010–2025 value series added | Caption mislabels unit; aquaculture unlabelled 2010–2014 (hatched remainder) |
| §5.2 p. 42 text | Fish quantity 2010, 2025 | Agri `#fish` | Paired bars | Kept; components 722,647 vs published 722,648 (audit #7) | Only two years printed as tonnes |
| Table 5.3, p. 43 | Tilapia and catfish 2013–2025 | Agri `#fish` | Stacked bars, quantity/value switch | **Added** full table (previously endpoints only) | 267-tonne difference vs aggregate aquaculture (explained in source) |
| Figure 5.7, p. 44 | Major crops 2013–2024 | Agri `#crops` | Six small multiples (own scales from zero) | **Added** annual series for six labelled crops (previous audit kept only endpoints) | Five minor crops unlabelled; excluded |
| Figure 5.8, pp. 44–45 | Livestock 1990–2024 | Agri `#livestock` | Lines; poultry separate | **Added** annual series for five species | Labels small; read at 400–600 dpi, components sum to printed totals within 0.1 |
| Table 5.4, p. 46 | Businesses by type | B&E `#enterprises` | Composition bar | Restyled | Mobile undercount disclosed |
| Figure 5.9, p. 47 | Establishments by start period | B&E `#enterprises` | Bars | **Added** | Survivors only (disclosed) |
| Figure 5.10, p. 48 | Size: establishments vs persons engaged | B&E `#enterprises` | Two composition bars | Restyled | None |
| Table 5.5, p. 48 | Formality and management by size | B&E `#enterprises` | Bars + stacked management bars | **Added** management by sex | Joint management derived as remainder |
| Table 5.6, p. 49 | Regional business conditions | B&E `#enterprises` | Range dot plot (low–Ghana–high) | **Added** | Only extremes published |
| Table 5.7, pp. 49–50 | Open-space vs mobile | B&E `#enterprises` | Comparison table | **Added** | None |
| Figure 5.11, p. 51 | CPI inflation 2014–2025 | B&E `#prices`; Home | Monthly line (y/y, m/m switch) | **Changed** from one-year selector to full 2014–2025 line from the cached StatsBank series; values match labelled points (54.1%, 5.4%) | Cached series also contains 2026 months, excluded here |
| Figure 5.12, p. 52 | Food / non-food inflation | B&E `#prices` | Dated paired bars | Kept to dated observations | Full monthly series unlabelled |
| Figure 5.13, pp. 52–53 | Local / imported inflation | B&E `#prices` | Dated paired bars | **Added** Jan 2022, Jan 2023, Dec 2023, Dec 2025 observations | Text 51.3% (Jan 2023) vs chart label 51.9% resolved: 51.9 is local's own end-2022 peak |
| Figure 5.14, p. 54 | Prime Building Cost Index, monthly | B&E `#prices` | Line Jan 2024–Mar 2026 | **Added** (was missing) | Months after Dec 2025 outside main period (marked); component lines unlabelled |
| Figure 5.15, pp. 55–56 | PPI by sector 2023–2025 | B&E `#prices` | Grouped horizontal bars, zero line | **Added** 2023 and 2024 values | Table 2.1 sector values differ (audit #2) |
| Figure 5.16, pp. 56–57 | IIP by sector 2023–2025 | B&E `#prices` | Grouped horizontal bars, zero line | Restyled | Table 2.1 water −1.1% vs −2.1% (audit #2) |
| Figure 5.17, p. 58 | Participation and EPR | B&E `#labour` | Two lines | **Corrected** 2024 EPR 60.4 → **60.6%** (figure label, verified at 400 dpi) | None |
| Figures 5.18–5.19, p. 59 | Unemployment; NEET | B&E `#labour` | Lines | Restyled | Uneven years disclosed |
| Table 2.1, p. 8 | Employed 13.3M; vulnerable 9.7M; informal >70% | B&E `#labour` | Stats | **Added** | Vulnerable employment covers Q2–Q3 only |
| Figures 5.20–5.21, Table 5.8, pp. 60, 70 | Tourism flows, spending, purposes | B&E `#tourism` | Stats; stacked overnight/same-day bars; purposes | **Added** overnight/same-day split and inbound/outbound purposes | Table 2.1 inbound GH¢15.18bn vs 15.4bn; outbound same-day 77,500 vs 77,501 |
| Tables 5.9a–b, pp. 73–74 | Fiscal operations, GH¢ million and % of GDP | B&E `#fiscal` | Lines, diverging balance bars, revenue and spending composition, arrears bridge; basis and unit switches | **Added** all rows of both tables (non-tax, social contributions, grants, primary expenditure, goods and services, transfers, social benefits, other, claims, arrears) and the % of GDP view | Rounded components (±2) |
| Table 5.10, p. 77 | Monetary and financial indicators | B&E `#finance` | Small multiples by group | **Added** missing nominal PSC growth row (31.8/10.7/26.3/19.2) | None |
| Figures 5.22–5.23, pp. 81–82 | Merchandise trade GH¢ and US$ | B&E `#trade` | Lines + separate diverging balance panel; currency switch | **Added** US$ series; replaced bar-and-line mixed axis | Real balance (−3.4bn) explained |
| Figure 5.24, pp. 82–83 | Top 5 exports/imports | B&E `#trade` | Ranked bars | Restyled; concentration notes | None |
| Figure 5.25, pp. 83–84 | Trade by continent; named destinations | B&E `#trade` | Paired bars; named-destination tiles | **Added** UAE/India/Switzerland/China values and Africa trade | Figure title says "top 10 partners" but shows continents; no country list printed |
| Table 5.11, p. 85 | Informal trade by quarter, formal totals, share | B&E `#informal-trade` | Grouped bars; table | **Added** formal total and informal share columns | Rounded balances (audit #8) |
| Figure 5.26, p. 86 | Informal balance by neighbour | B&E `#informal-trade` | Grouped diverging bars | **Added** | None (quarter sums match Table 5.11) |
| Table 5.12, p. 86 | Top informal goods | B&E `#informal-trade` | Ranked bars | **Added** | Weedicide value is a minimum |
| Figure 5.27, p. 87 | Transport modes; women transporters | B&E `#informal-trade` | Ranked bars; grouped bars | **Added** | None |

## Chapters 6–8

| PDF section, page | Indicator / dataset | Location | Visual | Added or corrected | Uncertainty |
|---|---|---|---|---|---|
| Figure 6.1, p. 90 | Women in Parliament 1993–2025 | Gov `#women-leadership` | Bars from zero | Restyled | None |
| Figure 6.2, p. 91 | Women judges by court | Gov `#women-leadership` | Three lines | 2012 shown as a gap, not interpolated | 2012 not reported |
| Figure 6.3, p. 92 | Direct requests for gifts | Gov `#accountability` | Bars | **Added** Jan–Dec 2024 (51.3%) | Periods of different length |
| Figure 6.4, p. 92 | Gave a gift 2021/2024/2025 | Gov `#accountability`; SDG `#institutions` | Bars | Restyled | None |
| Figure 6.5, p. 93 | No say / no influence | Gov `#accountability` | Dot plot (2013 from text) | Restyled | Table 11.1 gives 29.2% (vs 29.7%) |
| p. 93 | Knowledge of right to vote | Gov `#voting` | Stat | Restyled | Not turnout |
| Figure 6.6, p. 94 | Never voted, national vs district, by region | Gov `#voting` | Dumbbell per region | **Added** | Wave 1 period not printed; four district labels conflict with map shading (flagged) |
| Figure 7.1, p. 96 | Forest reserve area by region, Dec 2025 | Env `#forests` | Choropleth with n/r hatching + ranked list | Map added; unreported regions shown as not reported | Four regions not separately reported |
| Table 2.1 / Ch. 11, pp. 9, 128 | Forest reserve share 1990→2021 (4 regions) | Env `#forests` | Dumbbell, flagged as superseded | **Added** with caveat (audit #3) | Definition not stated; not combined with area |
| Figure 7.2, p. 97 | Carbon stock by land cover 2021 | Env `#carbon` | Stacked horizontal bars | Restyled | Grassland 334.0 (prose) vs 344.0 (audit #4) |
| Figure 7.3, p. 97 | Carbon stock change 2015→2021 | Env `#carbon` | Waterfall | **Added** (1,367.5 → 1,147.6 Mt C; reconciles exactly) | Increase/decrease classes confirmed at 400 dpi |
| Figures 7.4–7.5, pp. 98–99; Table 2.1 | Monthly rainfall and temperature 2025; monthly averages | Env `#climate` | Bars (rain); line (temperature, 20°C baseline disclosed) | **Added** monthly averages 99.3 mm / 28.2°C | 2000–2010 and 2011–2024 rainfall curves unlabelled |
| Figure 8.1, p. 101 | Multidimensional poverty | SDG `#poverty-food` | Bars | Restyled | 2025 is Q1–Q3 average |
| Figure 8.2, p. 102 | Food insecurity | SDG `#poverty-food` | Bars | Restyled | None |
| Figure 8.3, p. 102 | Maternal mortality | SDG `#mortality` | Bars distinguishing GMMR vs PHC | Source method encoded visually | Methods differ |
| Figure 8.4, p. 103 | Under-five, infant, neonatal | SDG `#mortality` | Three lines | Consolidated | Overlapping age ranges |
| Figure 8.5, pp. 103–104 | Slums | SDG `#cities` | Settlement map image + stats | Restyled | Different denominators |
| Figure 8.6, pp. 104–105 | Plastic debris density | SDG `#cities` | Bars with 2018 gap | 2018 shown as not reported | None |
| Table 2.1, p. 10 | Bribery incidence SDG 16.5.1 | SDG `#institutions` | Stats | Restyled | None |

## Chapters 9–11 and glossary

| PDF section, page | Indicator / dataset | Location | Visual | Added or corrected | Uncertainty |
|---|---|---|---|---|---|
| Ch. 9, pp. 108–110 | Youth definitions, child/youth shares | Youth `#bulge` | Definition panels; dumbbell | **Removed unsupported claims**: "youngest working-age population in its history", "~30% structural unemployment risk", ">70% of employed youth informal" (source: all employment), migrant-youth and subsistence-farming causal statements | 0.83 ratio (text) vs 0.90 from printed shares (audit #5) |
| Figure 9.1, p. 111 | Youth unemployment by region Q2/Q3 | Youth `#unemployment` | Ranked bars with national line; quarter and age switches | Restyled | None |
| Figure 9.2, p. 112 | NEET by sex, locality, region | Youth `#neet` | Grouped bars; ranked regional bars by group | **Corrected label** "2021 PHC" → QLFS Q3 2025 | None |
| pp. 112–113 | Skills alignment; informal work | Youth `#skills` | Separate bars | Clarified separate questions | None |
| Figure 9.3, pp. 114–115 | Youth in agriculture by sex | Agri `#youth-agriculture` | Grouped bars with % change | Moved to the agriculture deep dive; removed invented quote and causal claims | Causes not measured |
| Ch. 10, pp. 117–122 | Four data stories | Stories | Story cards with stats; DACF survey bars | **Added** DACF support types, education levels, request shares, hackathon facts | Survey not nationally representative |
| Ch. 11, pp. 123–137 | Policy implications, call to action, data gaps | Not reproduced as a page | — | Figures cited there are shown in their chapters; conflicts noted above | Chapter adds no new data (p. 124) |
| Glossary, pp. 138–147 | Definitions | Explain panels | Text | Used for "What it measures" | None |

## Not displayed, by design

- District-level or individual migration flows (Sankey links), unlabelled chart lines (non-oil GDP, PBCI components, rainfall baselines, housing supply), regional child-marriage values: not printed as numbers, so not approximated.
- Chapter 11 narrative and policy recommendations: interpretive, not statistical; each figure it cites appears in its own chapter view.
