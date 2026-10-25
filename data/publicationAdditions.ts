// Additional series transcribed from "2025 GIN-Draft 24-12Oct26-Final (1).pdf" during the October 2026 redesign.
// Page numbers are printed pages. Values are the labels printed in each figure or table; nothing is interpolated.
// Where a label is ambiguous or inconsistent the record carries a `flag` and docs/coverage-record.md explains it.

/* ── Population and Society ─────────────────────────────────────────────── */

export const REGIONS = ["Western", "Central", "Greater Accra", "Volta", "Eastern", "Ashanti", "Western North", "Ahafo", "Bono", "Bono East", "Oti", "Northern", "Savannah", "North East", "Upper East", "Upper West"] as const;
export type Region = typeof REGIONS[number];

/** Figure 3.6, p. 18. Percentage of national population. 2025 equals Table 2.1. Each year sums to 99.9–100.1 with rounding. */
export const regionalShare: Record<Region, { y2010: number; y2021: number; y2025: number }> = {
  "Western": { y2010: 6.7, y2021: 6.7, y2025: 6.7 },
  "Central": { y2010: 8.9, y2021: 9.3, y2025: 9.4 },
  "Greater Accra": { y2010: 16.2, y2021: 17.7, y2025: 18.2 },
  "Volta": { y2010: 6.0, y2021: 5.4, y2025: 5.2 },
  "Eastern": { y2010: 10.7, y2021: 9.5, y2025: 9.1 },
  "Ashanti": { y2010: 19.4, y2021: 17.6, y2025: 17.0 },
  "Western North": { y2010: 2.9, y2021: 2.9, y2025: 2.8 },
  "Ahafo": { y2010: 2.0, y2021: 1.8, y2025: 1.8 },
  "Bono": { y2010: 3.7, y2021: 3.9, y2025: 4.0 },
  "Bono East": { y2010: 3.7, y2021: 3.9, y2025: 4.0 },
  "Oti": { y2010: 2.6, y2021: 2.4, y2025: 2.4 },
  "Northern": { y2010: 6.3, y2021: 7.5, y2025: 7.9 },
  "Savannah": { y2010: 1.9, y2021: 2.1, y2025: 2.2 },
  "North East": { y2010: 1.9, y2021: 2.1, y2025: 2.2 },
  "Upper East": { y2010: 4.2, y2021: 4.2, y2025: 4.2 },
  "Upper West": { y2010: 2.8, y2021: 2.9, y2025: 3.0 },
};

/** Figure 3.4, p. 16. Persons per square kilometre, 2010 and 2021 censuses. */
export const populationDensity: Record<Region, { y2010: number; y2021: number }> = {
  "Western": { y2010: 120.2, y2021: 148.9 },
  "Central": { y2010: 223.9, y2021: 291.0 },
  "Greater Accra": { y2010: 1235.5, y2021: 1681.3 },
  "Volta": { y2010: 155.8, y2021: 174.6 },
  "Eastern": { y2010: 136.2, y2021: 151.4 },
  "Ashanti": { y2010: 195.9, y2021: 223.1 },
  "Western North": { y2010: 70.6, y2021: 87.4 },
  "Ahafo": { y2010: 93.2, y2021: 108.7 },
  "Bono": { y2010: 83.0, y2021: 108.8 },
  "Bono East": { y2010: 38.9, y2021: 51.8 },
  "Oti": { y2010: 57.5, y2021: 67.5 },
  "Northern": { y2010: 58.2, y2021: 87.1 },
  "Savannah": { y2010: 13.5, y2021: 18.8 },
  "North East": { y2010: 51.2, y2021: 72.7 },
  "Upper East": { y2010: 118.3, y2021: 147.2 },
  "Upper West": { y2010: 38.0, y2021: 48.8 },
};

/** Figure 3.7, p. 19. Total fertility rate by region, 2022 GDHS (children per woman). National: 3.9. */
export const regionalFertility2022: Record<Region, number> = {
  "Western": 3.6, "Central": 3.6, "Greater Accra": 2.9, "Volta": 3.2, "Eastern": 3.5, "Ashanti": 3.5,
  "Western North": 3.8, "Ahafo": 4.3, "Bono": 3.7, "Bono East": 4.7, "Oti": 5.2, "Northern": 5.6,
  "Savannah": 5.8, "North East": 6.6, "Upper East": 4.6, "Upper West": 4.5,
};

/**
 * Figure 3.13, p. 24 (Sankey totals). Lifetime internal migrants, 2021 PHC.
 * out = born in the region, enumerated elsewhere; in = enumerated in the region, born elsewhere.
 * in − out reproduces every Figure 3.11 net-migration value to the nearest thousand.
 */
export const internalMigrationFlows: Record<Region, { out: number; in: number }> = {
  "Western": { out: 216882, in: 328171 },
  "Central": { out: 495404, in: 437518 },
  "Greater Accra": { out: 386377, in: 1492378 },
  "Volta": { out: 555484, in: 120595 },
  "Eastern": { out: 622350, in: 378422 },
  "Ashanti": { out: 561064, in: 768918 },
  "Western North": { out: 100591, in: 155841 },
  "Ahafo": { out: 95829, in: 115239 },
  "Bono": { out: 172759, in: 150148 },
  "Bono East": { out: 120839, in: 189427 },
  "Oti": { out: 110969, in: 76049 },
  "Northern": { out: 269712, in: 91134 },
  "Savannah": { out: 79601, in: 47323 },
  "North East": { out: 96819, in: 15294 },
  "Upper East": { out: 324340, in: 32378 },
  "Upper West": { out: 226226, in: 36411 },
};

/** pp. 6, 17. Urban and rural residents, million people. 1984 counts are not printed. */
export const urbanRuralCounts = [
  { year: "2000", urban: 8.28, rural: 10.63, kind: "census" },
  { year: "2010", urban: 12.55, rural: 12.11, kind: "census" },
  { year: "2021", urban: 17.47, rural: 13.36, kind: "census" },
  { year: "2025", urban: 19.80, rural: 13.95, kind: "projection" },
];

/** Table 2.1, p. 6. 2025 projection by sex, million people. */
export const sexCounts2025 = { male: 16.6, female: 17.1 };

/* ── Business and Economy ───────────────────────────────────────────────── */

/** Figure 5.2, p. 36. Nominal GDP, US$ billion. Text gives the end points as US$64.83bn and US$114.21bn. */
export const nominalGdpUsd = [
  { year: "2013", value: 64.8 }, { year: "2014", value: 54.1 }, { year: "2015", value: 48.6 }, { year: "2016", value: 56.0 },
  { year: "2017", value: 60.3 }, { year: "2018", value: 67.3 }, { year: "2019", value: 68.3 }, { year: "2020", value: 70.0 },
  { year: "2021", value: 79.5 }, { year: "2022", value: 74.3 }, { year: "2023", value: 80.6 }, { year: "2024*", value: 83.4 },
  { year: "2025**", value: 114.2 },
];

/** Figure 5.4, p. 38. GDP per capita, US$. */
export const gdpPerCapitaUsd = [
  { year: "2013", value: 2453 }, { year: "2014", value: 1999 }, { year: "2015", value: 1756 }, { year: "2016", value: 1978 },
  { year: "2017", value: 2083 }, { year: "2018", value: 2273 }, { year: "2019", value: 2257 }, { year: "2020", value: 2272 },
  { year: "2021", value: 2579 }, { year: "2022", value: 2369 }, { year: "2023", value: 2570 }, { year: "2024*", value: 2527 },
  { year: "2025**", value: 3385 },
];

/** Table 2.1, p. 7. */
export const nonOilGdpGrowth2025 = 7.6;

/** Figure 5.15, p. 55. Year-on-year producer price inflation at year end, %. */
export const ppiBySector = [
  { sector: "All industries", y2023: 16.4, y2024: 26.1, y2025: 1.9 },
  { sector: "Electricity and gas", y2023: 43.9, y2024: 8.1, y2025: 6.1 },
  { sector: "Mining and quarrying", y2023: 20.2, y2024: 42.8, y2025: 3.3 },
  { sector: "Water supply and waste", y2023: 16.6, y2024: 5.0, y2025: 2.3 },
  { sector: "Construction", y2023: 20.5, y2024: 29.6, y2025: 1.7 },
  { sector: "Information and communication", y2023: 18.2, y2024: 2.9, y2025: 1.7 },
  { sector: "Manufacturing", y2023: 8.5, y2024: 18.9, y2025: 0.1 },
  { sector: "Accommodation and food", y2023: 18.1, y2024: 30.1, y2025: -3.2 },
  { sector: "Transportation and storage", y2023: 14.8, y2024: 23.1, y2025: -3.7 },
];

/** Figure 5.14, p. 54. Prime Building Cost Index, combined, year-on-year %. Component lines are unlabelled and omitted. */
export const pbciCombined = [
  ["Jan 2024", 6.3], ["Feb 2024", 8.3], ["Mar 2024", 9.1], ["Apr 2024", 8.5], ["May 2024", 11.1], ["Jun 2024", 13.4],
  ["Jul 2024", 16.2], ["Aug 2024", 17.6], ["Sep 2024", 18.4], ["Oct 2024", 19.2], ["Nov 2024", 21.7], ["Dec 2024", 22.6],
  ["Jan 2025", 23.7], ["Feb 2025", 23.7], ["Mar 2025", 23.6], ["Apr 2025", 24.4], ["May 2025", 22.0], ["Jun 2025", 18.1],
  ["Jul 2025", 14.2], ["Aug 2025", 12.0], ["Sep 2025", 9.7], ["Oct 2025", 7.8], ["Nov 2025", 5.9], ["Dec 2025", 4.4],
  ["Jan 2026", 3.9], ["Feb 2026", 2.4], ["Mar 2026", 2.2],
].map(([month, value]) => ({ month: String(month), value: Number(value) }));

/**
 * Figure 5.13 labels and p. 53 text. Year-on-year %, dated observations only (the monthly series is not printed).
 * Local inflation's printed peak (51.9) falls at the end of 2022; the text's 51.3 refers to January 2023.
 */
export const localImportedInflation = [
  { period: "Jan 2022", local: 13.7, imported: 11.1, source: "Figure 5.13 labels" },
  { period: "Jan 2023", local: 51.3, imported: 62.4, source: "p. 53 text (imported peak)" },
  { period: "Dec 2023", local: 23.9, imported: 21.8, source: "p. 53 text" },
  { period: "Dec 2025", local: 5.9, imported: 4.3, source: "Figure 5.13 labels" },
];

/** Table 2.1, p. 8. Ave Q1–Q3 2025 unless stated. */
export const labourLevels2025 = { employedMillion: 13.3, vulnerableEmploymentMillion: 9.7, vulnerablePeriod: "Ave Q2–Q3 2025", informalShare: "over 70%" };

/** Table 5.8, p. 60–61 and p. 70 text. 2023. Expenditure GH¢ billion. */
export const tourismSplit = [
  { flow: "Domestic", overnight: 8_800_000, sameDay: 6_600_000, overnightSpend: 4.76, sameDaySpend: 1.83, totalVisitors: 15_388_978, totalSpend: 6.59 },
  { flow: "Inbound", overnight: 888_584, sameDay: 12_866, overnightSpend: 15.4, sameDaySpend: 0.024, totalVisitors: 901_450, totalSpend: 15.42 },
  { flow: "Outbound", overnight: 393_305, sameDay: 77_500, overnightSpend: 3.4, sameDaySpend: 0.058, totalVisitors: 470_805, totalSpend: 3.46 },
];
export const tourismPurposes = {
  domestic: "Funerals 39.3% and visiting friends or relatives 35.9% of trips (83% of overnight and 71% of same-day trips together)",
  inbound: "Overnight: visiting friends or relatives 42%, business 38%. Same-day: 60% in transit",
  outbound: "Overnight: visiting friends or relatives 37%, business 22%. Same-day: business 31%, funerals 23%, family visits 22%",
};

/** Table 5.9a, p. 73. Nominal GH¢ million, annual outturns 2022–2025. */
export const fiscalNominal = {
  years: ["2022", "2023", "2024", "2025"],
  revenue: {
    total: [96651, 136011, 186593, 224884],
    tax: [75548, 110019, 151155, 183987],
    nonTax: [14561, 17646, 27734, 27870],
    socialContributions: [350, 635, 1060, 866],
    other: [5073, 5060, 4928, 10336],
    grants: [1119, 2652, 1716, 1825],
  },
  expenditure: {
    cash: [161808, 163998, 248004, 268284],
    commitment: [168848, 167514, 268099, 238740],
    primaryCash: [116120, 134650, 201212, 218393],
    primaryCommitment: [123161, 138167, 221306, 188849],
    compensation: [39434, 50808, 67189, 78970],
    interest: [45687, 29348, 46792, 49891],
    goodsServices: [7926, 8446, 11509, 6090],
    capital: [18689, 21111, 29389, 20235],
    grantsToUnits: [24550, 31150, 46426, 57720],
    socialBenefits: [94, 429, 737, 2908],
    other: [13784, 26223, 26961, 22926],
    outstandingClaims: [18684, 0, 39097, 0],
    arrearsClearance: [7041, 3516, 20095, -29544],
  },
  balance: {
    overallCommitment: [-72197, -31503, -81505, -13856],
    overallCash: [-65156, -27987, -61411, -43400],
    primaryCommitment: [-26510, -2155, -34713, 36035],
    primaryCash: [-19469, 1361, -14618, 6491],
  },
  gdp: [614336, 887748, 1182799, 1434115],
};

/** Table 5.9b, p. 74. Percent of GDP. */
export const fiscalShareOfGdp = {
  revenue: { total: [15.7, 15.3, 15.8, 15.7], tax: [12.3, 12.4, 12.8, 12.8], nonTax: [2.4, 2.0, 2.3, 1.9], socialContributions: [0.1, 0.1, 0.1, 0.1], other: [0.8, 0.6, 0.4, 0.7], grants: [0.2, 0.3, 0.1, 0.1] },
  expenditure: { cash: [26.3, 18.5, 21.0, 18.7], commitment: [27.5, 18.9, 22.7, 16.6], primaryCash: [18.9, 15.2, 17.0, 15.2], primaryCommitment: [20.0, 15.6, 18.7, 13.2], compensation: [6.4, 5.7, 5.7, 5.5], interest: [7.4, 3.3, 4.0, 3.5], goodsServices: [1.3, 1.0, 1.0, 0.4], capital: [3.0, 2.4, 2.5, 1.4], grantsToUnits: [4.0, 3.5, 3.9, 4.0], socialBenefits: [0.0, 0.0, 0.1, 0.2], other: [2.2, 3.0, 2.3, 1.6], arrearsClearance: [1.1, 0.4, 1.7, -2.1] },
  balance: { overallCash: [-10.6, -3.2, -5.2, -3.0], overallCommitment: [-11.8, -3.5, -6.9, -1.0], primaryCash: [-3.2, 0.2, -1.2, 0.5], primaryCommitment: [-4.3, -0.2, -2.9, 2.5] },
};

/** Table 5.10 row 1.04, p. 77. Nominal private-sector credit growth, % y/y (row was missing from the dashboard). */
export const nominalCreditGrowth = [31.8, 10.7, 26.3, 19.2];

/** Figure 5.23, p. 82. Merchandise trade, US$ billion. 2025 equals Table 2.1 (32.00 / 20.49 / 11.51). */
export const tradeGoodsUsd = [
  { year: "2014", export: 14.7, import: 14.1, balance: 0.6 },
  { year: "2015", export: 12.1, import: 13.3, balance: -1.2 },
  { year: "2016", export: 10.6, import: 11.6, balance: -1.0 },
  { year: "2017", export: 12.6, import: 13.9, balance: -1.3 },
  { year: "2018", export: 16.4, import: 12.9, balance: 3.5 },
  { year: "2019", export: 16.5, import: 12.4, balance: 4.1 },
  { year: "2020", export: 13.5, import: 14.5, balance: -1.0 },
  { year: "2021", export: 14.8, import: 17.8, balance: -3.0 },
  { year: "2022", export: 17.6, import: 18.3, balance: -0.7 },
  { year: "2023", export: 16.8, import: 16.3, balance: 0.5 },
  { year: "2024", export: 20.6, import: 17.5, balance: 3.1 },
  { year: "2025", export: 32.0, import: 20.5, balance: 11.5 },
];

/** pp. 83–84 text. 2025 merchandise exports by named destination, GH¢ billion (not a complete top-ten list). */
export const namedExportDestinations2025 = [
  { name: "United Arab Emirates", value: 104.0 }, { name: "India", value: 64.3 }, { name: "Switzerland", value: 56.8 }, { name: "China", value: 19.6 },
];
export const tradeFacts2025 = { totalTrade: 654.7, totalTradeGrowth: 20.1, importPartners: 216, exportPartners: 163, africaExports: 70.3, africaImports: 35.6, top5ExportShare: 83.9, top5ImportShare: 28.3, realMerchandiseBalance: -3.4 };

/** Table 5.11, p. 85. Formal trade (all partners) and informal share of all trade, by quarter. */
export const informalTradeContext = [
  { quarter: "Q4 2024", formalTotal: 165.3, informalShare: 4.3 },
  { quarter: "Q1 2025", formalTotal: 181.6, informalShare: 5.5 },
  { quarter: "Q2 2025", formalTotal: 157.3, informalShare: 6.5 },
  { quarter: "Q3 2025", formalTotal: 145.0, informalShare: 6.1 },
  { quarter: "12 months", formalTotal: 649.2, informalShare: 5.6 },
];

/** Figure 5.26, p. 86. Informal trade balance by neighbour, GH¢ million. Quarterly sums reproduce Table 5.11 balances. */
export const informalBalanceByNeighbour = [
  { quarter: "Q4 2024", burkina: 576, coteDIvoire: 378, togo: -539 },
  { quarter: "Q1 2025", burkina: 699, coteDIvoire: 624, togo: -726 },
  { quarter: "Q2 2025", burkina: 936, coteDIvoire: 634, togo: -905 },
  { quarter: "Q3 2025", burkina: 632, coteDIvoire: 412, togo: -994 },
];

/** Table 5.12, p. 86. October 2024–September 2025, GH¢ million. Weedicide is a minimum (earlier quarters not published). */
export const informalTopGoods = {
  exports: [["Alcoholic drinks", 746], ["Soft drinks", 731], ["Petrol", 624], ["Energy drinks", 579], ["Weedicide (minimum)", 534]] as [string, number][],
  imports: [["Cooking oil", 1397], ["Mattresses", 755], ["Rice", 734], ["Material cloth", 650], ["Cattle", 604]] as [string, number][],
  exportTop5Share: 16.0, importTop5Share: 22.6,
};

/** Figure 5.27, p. 87. */
export const informalTransport = [["Tricycle", 13.7, 36], ["Motorbike", 10.1, 26], ["Canoe", 4.0, 10], ["On foot", 3.5, 9], ["Truck", 2.6, 7], ["Car", 1.9, 5], ["All others", 2.6, 7]] as [string, number, number][];
export const informalWomenTransporters = [
  { quarter: "Q4 2024", exports: 34, imports: 41 }, { quarter: "Q1 2025", exports: 32, imports: 39 },
  { quarter: "Q2 2025", exports: 30, imports: 39 }, { quarter: "Q3 2025", exports: 30, imports: 38 },
];

/** Figure 5.9, p. 47. Establishments operating in 2024 by year started (survivors only). */
export const establishmentsByStart = [["Before 1975", 21176], ["1975–1984", 15490], ["1985–1994", 42205], ["1995–2004", 139310], ["2005–2014", 323634], ["2015–2023", 1325880]] as [string, number][];

/** Table 5.5, p. 48. % of establishments within each size group; the remainder of each management row is jointly managed. */
export const managementBySize = [
  { size: "Micro", formal: 5.5, women: 59.4, men: 36.2 },
  { size: "Small", formal: 31.1, women: 29.3, men: 55.6 },
  { size: "Medium", formal: 55.7, women: 9.0, men: 60.5 },
  { size: "Large", formal: 64.5, women: 5.8, men: 54.5 },
  { size: "All sizes", formal: 7.7, women: 56.3, men: 38.1 },
];

/** Table 5.6, p. 49. Highest and lowest region for each indicator, %. */
export const businessConditionsByRegion = [
  { indicator: "Establishments that are formal", high: ["Greater Accra", 12.8], low: ["North East", 1.8], ghana: 7.7 },
  { indicator: "Establishments using digital finance", high: ["Greater Accra", 50.9], low: ["Savannah", 18.9], ghana: 37.2 },
  { indicator: "Persons engaged who are paid", high: ["Greater Accra", 82.0], low: ["Western North", 43.4], ghana: 64.0 },
  { indicator: "Establishments in industry", high: ["Upper East", 37.6], low: ["Greater Accra", 15.7], ghana: 21.1 },
] as { indicator: string; high: [string, number]; low: [string, number]; ghana: number }[];

/** Table 5.7, pp. 49–50. */
export const openSpaceVsMobile = [
  ["Number of businesses", "693,748", "82,920"],
  ["People working in them", "922,177", "82,920 operators"],
  ["Run by women", "84.0% of owners", "77.5% of operators"],
  ["Ghanaian-owned or operated", "99.2%", "94.2%"],
  ["Selling food", "68.4% (food and drinks)", "63.6%"],
  ["Selling goods, not services", "84.0%", "85.2%"],
  ["In Greater Accra and Ashanti", "40.6%", "50.4%"],
  ["Daily sales of GH¢100 or less", "31.3%", "57.1%"],
  ["Effort", "63.7% open six or seven days a week", "35.9% work nine hours or more a day"],
];
export const enterpriseFacts = { servicesShare: 76.7, industryShare: 21.1, agricultureShare: 2.2, privateOwnership: 96.4, womenPositions: 50.9, unpaidShare: 36, largeFirms: 4874, largeFirmPersons: 1.5, establishments2014: 638235, persons2014: 3.38, newFormal: 6.7, oldFormal: 28.9, mobileYouth: 52253, mobileChildren: 2087 };

/* ── Agriculture, forestry and fishing ──────────────────────────────────── */

/**
 * Table 5.2, p. 41. Government spending on agriculture and total spending (GH¢), agriculture GVA and GDP (GH¢),
 * the printed "GVA share of GDP" column (%) and AOI (SDG 2.a.1). The AOI reproduces from (spend ÷ total) ÷ (gva ÷ gdp);
 * the printed share column is about one point higher than gva ÷ gdp (likely GDP at basic prices), so it is not used in the check.
 */
export const agricultureSpending = [
  { year: "2013", gva: 25355886760, gdp: 124477578786, spend: 181099469, total: 25059540580, gvaShare: 21.4, aoi: 0.035 },
  { year: "2014", gva: 31076313516, gdp: 158683994554, spend: 273855843, total: 39322200517, gvaShare: 21.5, aoi: 0.036 },
  { year: "2015", gva: 36673287356, gdp: 183525640047, spend: 205276078, total: 40048805910, gvaShare: 21.8, aoi: 0.026 },
  { year: "2016", gva: 45772940716, gdp: 219594595438, spend: 244898460, total: 44791386715, gvaShare: 22.5, aoi: 0.026 },
  { year: "2017", gva: 51407775787, gdp: 262797966051, spend: 284069429, total: 50251936147, gvaShare: 21.0, aoi: 0.029 },
  { year: "2018", gva: 55967108329, gdp: 308587395726, spend: 757757821, total: 63335704491, gvaShare: 19.5, aoi: 0.066 },
  { year: "2019", gva: 61764983869, gdp: 356544265615, spend: 691069367, total: 77937091692, gvaShare: 18.5, aoi: 0.051 },
  { year: "2020", gva: 73895654015, gdp: 391940733197, spend: 1155290438, total: 112322718689, gvaShare: 20.1, aoi: 0.055 },
  { year: "2021", gva: 90757559793, gdp: 461694936015, spend: 1353356717, total: 136737117057, gvaShare: 21.1, aoi: 0.050 },
  { year: "2022", gva: 119879353737, gdp: 614336252718, spend: 1123228750, total: 251192878448, gvaShare: 20.8, aoi: 0.023 },
  { year: "2023", gva: 185921700246, gdp: 887748123973, spend: 1595142970, total: 343819340962, gvaShare: 22.4, aoi: 0.022 },
  { year: "2024", gva: 243743200360, gdp: 1176219900567, spend: 2462583513, total: 517578047240, gvaShare: 22.0, aoi: 0.023 },
];

/** Figure 5.7, p. 44. Million metric tonnes, 2013–2024 (2024 provisional). Groundnut, sorghum, cowpea, soyabean and millet are unlabelled and omitted. */
export const cropSeries = {
  years: ["2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024*"],
  cassava: [16.0, 16.5, 17.2, 17.8, 19.0, 20.8, 22.8, 23.0, 24.7, 26.1, 27.7, 28.5],
  yam: [7.1, 7.1, 7.3, 7.4, 7.9, 7.8, 8.8, 8.8, 9.5, 11.1, 11.7, 11.4],
  plantain: [3.7, 3.8, 4.0, 4.0, 4.3, 4.7, 5.5, 5.4, 6.2, 6.3, 7.3, 7.2],
  maize: [1.8, 1.8, 1.7, 1.7, 2.0, 2.3, 2.9, 3.0, 3.6, 3.3, 3.6, 3.3],
  cocoyam: [1.3, 1.3, 1.3, 1.3, 1.4, 1.5, 1.6, 2.2, 2.2, 1.7, 1.8, 1.8],
  rice: [0.6, 0.6, 0.6, 0.7, 0.7, 0.8, 0.9, 1.0, 1.1, 1.3, 1.4, 1.1],
  total: [31.5, 32.3, 33.2, 34.2, 36.5, 39.3, 44.0, 44.8, 48.9, 51.5, 55.6, 55.4],
};

/** Figure 5.8, p. 45. Livestock, million animals, 1990–2024. Components sum to the printed total within 0.1. */
export const livestockSeries = {
  years: Array.from({ length: 35 }, (_, i) => String(1990 + i)),
  poultry: [10.0, 10.6, 11.2, 12.2, 12.3, 13.1, 14.6, 15.9, 17.3, 18.8, 20.5, 22.0, 24.3, 26.4, 28.7, 28.4, 34.0, 37.0, 39.8, 43.3, 47.8, 52.6, 57.9, 63.7, 68.5, 71.6, 73.9, 75.4, 76.9, 79.4, 81.8, 81.5, 86.7, 88.1, 90.8],
  goats: [2.0, 2.2, 2.2, 2.1, 2.2, 2.2, 2.5, 2.7, 2.8, 2.9, 3.1, 3.2, 3.2, 3.6, 3.9, 3.9, 4.0, 4.2, 4.4, 4.6, 4.9, 5.1, 5.4, 5.8, 6.0, 6.4, 6.7, 7.2, 7.4, 7.8, 8.2, 8.4, 8.8, 9.1, 9.5],
  sheep: [2.2, 2.2, 2.1, 2.2, 2.2, 2.0, 2.4, 2.5, 2.6, 2.7, 2.7, 2.8, 2.9, 3.0, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.8, 3.9, 4.0, 4.2, 4.3, 4.5, 4.7, 5.0, 5.1, 5.3, 5.5, 5.7, 5.9, 6.1, 6.3],
  cattle: [1.1, 1.2, 1.2, 1.2, 1.2, 1.1, 1.2, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.3, 1.4, 1.4, 1.4, 1.4, 1.4, 1.4, 1.5, 1.5, 1.5, 1.6, 1.7, 1.7, 1.8, 1.9, 1.9, 2.0, 2.1, 2.2, 2.2, 2.3, 2.4],
  pigs: [0.5, 0.5, 0.4, 0.4, 0.4, 0.4, 0.4, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.5, 0.5, 0.6, 0.6, 0.6, 0.7, 0.7, 0.8, 0.8, 0.8, 0.8, 0.9, 0.9, 1.0, 1.0, 1.1],
  total: [15.9, 16.6, 17.1, 18.1, 18.3, 18.7, 21.1, 22.6, 24.3, 26.0, 27.9, 29.6, 32.0, 34.6, 37.4, 37.2, 43.2, 46.6, 49.7, 53.5, 58.4, 63.7, 69.5, 75.9, 81.2, 84.9, 88.0, 90.2, 92.1, 95.4, 98.5, 98.7, 104.7, 106.7, 110.2],
};

/**
 * Figure 5.6, p. 42. The figure is captioned "Production in hundred thousand metric tonnes", but its labels are VALUES in GH¢ billion:
 * totals 1.94 (2010) and 20.44 (2025) equal the value figures in the p. 42 text, and 2025 marine (10.67) cannot be 443,794 tonnes.
 * Aquaculture segments for 2010–2014 are unlabelled (null); the published total is kept.
 */
export const fishValue = [
  { year: "2010", marine: 1.42, inland: 0.46, aquaculture: null, total: 1.94 },
  { year: "2011", marine: 1.64, inland: 0.57, aquaculture: null, total: 2.33 },
  { year: "2012", marine: 2.23, inland: 0.71, aquaculture: null, total: 3.13 },
  { year: "2013", marine: 2.31, inland: 0.58, aquaculture: null, total: 3.12 },
  { year: "2014", marine: 1.75, inland: 0.59, aquaculture: null, total: 2.76 },
  { year: "2015", marine: 3.86, inland: 0.60, aquaculture: 0.52, total: 4.98 },
  { year: "2016", marine: 4.53, inland: 0.84, aquaculture: 0.63, total: 5.99 },
  { year: "2017", marine: 4.68, inland: 0.79, aquaculture: 0.69, total: 6.16 },
  { year: "2018", marine: 4.66, inland: 1.01, aquaculture: 1.04, total: 6.71 },
  { year: "2019", marine: 4.83, inland: 1.18, aquaculture: 0.86, total: 6.86 },
  { year: "2020", marine: 5.26, inland: 0.90, aquaculture: 1.01, total: 7.17 },
  { year: "2021", marine: 7.37, inland: 2.54, aquaculture: 1.74, total: 11.65 },
  { year: "2022", marine: 7.86, inland: 3.30, aquaculture: 3.34, total: 14.50 },
  { year: "2023", marine: 9.82, inland: 3.91, aquaculture: 4.20, total: 17.93 },
  { year: "2024", marine: 10.76, inland: 3.87, aquaculture: 4.15, total: 18.78 },
  { year: "2025", marine: 10.67, inland: 4.85, aquaculture: 4.92, total: 20.44 },
];

/** p. 42 text. Fish production quantity, tonnes (only these two years are printed). */
export const fishQuantity = [
  { year: "2010", marine: 319331, inland: 83127, aquaculture: 10200, total: 412658 },
  { year: "2025", marine: 443794, inland: 154692, aquaculture: 124161, total: 722648 },
];

/** Table 5.3, p. 43. Quantity in metric tonnes, value in GH¢ million. */
export const tilapiaCatfish = [
  [2013, 29911.0, 215.4, 2601.0, 15.6], [2014, 35836.7, 394.2, 2698.3, 29.7], [2015, 40818.0, 474.3, 3697.0, 47.0],
  [2016, 48637.9, 583.4, 3832.1, 42.8], [2017, 48663.9, 862.0, 8741.4, 143.3], [2018, 69859.8, 947.0, 6760.2, 91.3],
  [2019, 38916.0, 640.6, 13434.0, 214.9], [2020, 47682.1, 749.9, 16322.0, 258.0], [2021, 68714.5, 1010.3, 20661.0, 259.6],
  [2022, 97600.0, 2571.6, 35052.4, 772.5], [2023, 73901.5, 2710.9, 42206.3, 1492.0], [2024, 82845.3, 2899.6, 38964.2, 1334.4],
  [2025, 86584.8, 3457.4, 37842.9, 1477.4],
].map(([year, tilapia, tilapiaValue, catfish, catfishValue]) => ({ year: String(year), tilapia, tilapiaValue, catfish, catfishValue }));

/* ── Governance ─────────────────────────────────────────────────────────── */

/** Figure 6.3, p. 92. Share reporting a direct request for a gift by a public official. Reference periods differ in length. */
export const giftRequests = [
  { period: "Jan–Dec 2024", value: 51.3 },
  { period: "Jan–Jun 2025", value: 38.6 },
  { period: "Jul–Dec 2025", value: 50.5 },
];

/**
 * Figure 6.6, p. 94. % who have never voted, Governance Series Wave 1. Reference period and national figure are not printed.
 * In the district-election map four labels conflict with their shading class (flagged); labels are reproduced as printed.
 */
export const neverVoted: { region: Region; national: number; district: number; flag?: string }[] = [
  { region: "Western", national: 2.5, district: 9.1 },
  { region: "Central", national: 1.7, district: 6.2 },
  { region: "Greater Accra", national: 2.5, district: 4.0, flag: "District label 4.0% but shaded in the “above 10%” class" },
  { region: "Volta", national: 0.6, district: 3.0 },
  { region: "Eastern", national: 2.2, district: 8.2 },
  { region: "Ashanti", national: 1.4, district: 7.6 },
  { region: "Western North", national: 0.7, district: 7.2 },
  { region: "Ahafo", national: 0.0, district: 3.8 },
  { region: "Bono", national: 1.6, district: 7.0 },
  { region: "Bono East", national: 2.1, district: 0.5, flag: "District label 0.5% but shaded in the “above 10%” class" },
  { region: "Oti", national: 0.6, district: 8.5, flag: "District label 8.5% but shaded in the “above 10%” class" },
  { region: "Northern", national: 2.5, district: 7.8 },
  { region: "Savannah", national: 0.5, district: 4.7 },
  { region: "North East", national: 3.4, district: 6.2 },
  { region: "Upper East", national: 1.5, district: 3.6 },
  { region: "Upper West", national: 4.0, district: 7.7, flag: "District label 7.7% but shaded in the “above 10%” class" },
];

/* ── Environment ────────────────────────────────────────────────────────── */

/** Figure 7.3, p. 97. Change in carbon stock by land-cover class, 2015 → 2021, Mt C. Steps reproduce 1,367.5 → 1,147.6. */
export const carbonStockChange = {
  start: 1367.5,
  end: 1147.6,
  steps: [["Settlement", -187.6], ["Closed forest", -41.7], ["Grassland", -18.3], ["Other tree crops", -2.9], ["Mangrove", -0.3], ["Open forest", 0.6], ["Mono cocoa", 1.3], ["Shaded cocoa", 6.2], ["Cropland", 22.8]] as [string, number][],
};

/** Table 2.1, p. 9. */
export const climateAverages2025 = { rainfallMonthlyAverage: 99.3, temperatureMonthlyAverage: 28.2 };

/** Table 2.1 and Chapter 11 (pp. 9, 128). Older forest-reserve share series, superseded in Chapter 7 by 2025 area; shown for context only. */
export const forestShare1990to2021 = [
  { region: "Western North", y1990: 19.6, y2021: 6.5 },
  { region: "Western", y1990: 17.0, y2021: 8.4 },
  { region: "Savannah", y1990: 6.5, y2021: 14.9 },
  { region: "Northern", y1990: 1.1, y2021: 6.9 },
];
