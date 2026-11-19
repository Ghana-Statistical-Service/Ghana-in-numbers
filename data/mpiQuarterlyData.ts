/**
 * Multidimensional poverty: the QUARTERLY survey series (national, regional and household groups).
 *
 * Transcribed from Ghana Statistical Service, "Multidimensional Poverty Report, 2024 Q1 to 2025 Q3"
 * (statsghana.gov.gh > Publications > Administrative Data Reports). Table and figure numbers are given on each export.
 * 2025 Q1 values that the report tables omit come from the GSS infographic "Multidimensional Poverty Index (MPI) 2025".
 * The annual series (2021 census, districts 2021 to 2025) is in data/mpiData.ts and data/mpiDistricts.json.
 * The two series are shown side by side and never mixed: docs/mpi-dashboard-guidelines.md.
 */
import type { DimensionKey } from "./mpiData.ts";

export const quarterlySources = {
  report: "GSS, Multidimensional Poverty Report, 2024 Q1 to 2025 Q3",
  infographic: "GSS, Multidimensional Poverty Index (MPI) 2025 infographic",
  reportKey: "publications/admin_data/Multidimensional Poverty-Report_2024Q1-2025Q3.pdf",
  infographicKey: "publications/admin_data/Multidimensional Poverty_inforgraphics_2024Q1-2025Q3.pdf",
} as const;

export type Quarter = "2022 Q1" | "2022 Q2" | "2022 Q3" | "2022 Q4" | "2023 Q1" | "2023 Q2" | "2023 Q3" | "2023 Q4" | "2024 Q1" | "2024 Q2" | "2024 Q3" | "2024 Q4" | "2025 Q1" | "2025 Q2" | "2025 Q3";

/**
 * National series. Incidence 2022 Q1 to 2025 Q3: Figure 4.2 (p. 8). 2025 Q1 incidence and people: infographic.
 * Confidence intervals, intensity and MPI: Tables 6.2 and 6.3 (pp. 27 to 28). People: Table 6.4 (p. 29).
 * null = not published for that quarter.
 */
export const nationalQuarterly: { quarter: Quarter; incidence: number; low: number | null; high: number | null; intensity: number | null; mpi: number | null; people: number | null; peopleRounded?: boolean }[] = [
  { quarter: "2022 Q1", incidence: 28.3, low: null, high: null, intensity: null, mpi: null, people: null },
  { quarter: "2022 Q2", incidence: 32.4, low: null, high: null, intensity: null, mpi: null, people: null },
  { quarter: "2022 Q3", incidence: 32.3, low: null, high: null, intensity: null, mpi: null, people: null },
  { quarter: "2022 Q4", incidence: 31.7, low: null, high: null, intensity: null, mpi: null, people: null },
  { quarter: "2023 Q1", incidence: 28.3, low: null, high: null, intensity: null, mpi: null, people: null },
  { quarter: "2023 Q2", incidence: 27.7, low: null, high: null, intensity: null, mpi: null, people: null },
  { quarter: "2023 Q3", incidence: 28.6, low: null, high: null, intensity: null, mpi: null, people: null },
  { quarter: "2023 Q4", incidence: 27.4, low: null, high: null, intensity: null, mpi: null, people: null },
  { quarter: "2024 Q1", incidence: 24.0, low: 23.5, high: 24.4, intensity: 42.8, mpi: 0.103, people: 7690515 },
  { quarter: "2024 Q2", incidence: 28.5, low: 28.0, high: 29.0, intensity: 43.1, mpi: 0.123, people: 9148703 },
  { quarter: "2024 Q3", incidence: 24.9, low: 24.4, high: 25.3, intensity: 43.5, mpi: 0.108, people: 8005768 },
  { quarter: "2024 Q4", incidence: 24.9, low: 24.4, high: 25.3, intensity: 43.2, mpi: 0.107, people: 8018330 },
  { quarter: "2025 Q1", incidence: 23.9, low: null, high: null, intensity: null, mpi: null, people: 7800000, peopleRounded: true },
  { quarter: "2025 Q2", incidence: 23.1, low: 22.7, high: 23.5, intensity: 42.1, mpi: 0.097, people: 7544819 },
  { quarter: "2025 Q3", incidence: 21.9, low: 21.6, high: 22.3, intensity: 41.9, mpi: 0.092, people: 7182974 },
];
export const latestQuarter: Quarter = "2025 Q3";
export const latest = nationalQuarterly.at(-1)!;

/** Table 6.23 (p. 51); 2025 Q1 from the infographic. % of people in each type of locality who are multidimensionally poor. */
export const localityQuarterly: { quarter: Quarter; urban: number; rural: number }[] = [
  { quarter: "2024 Q1", urban: 13.6, rural: 37.2 },
  { quarter: "2024 Q2", urban: 17.4, rural: 42.7 },
  { quarter: "2024 Q3", urban: 14.1, rural: 38.6 },
  { quarter: "2024 Q4", urban: 13.9, rural: 38.8 },
  { quarter: "2025 Q1", urban: 14.6, rural: 35.7 },
  { quarter: "2025 Q2", urban: 15.3, rural: 33.1 },
  { quarter: "2025 Q3", urban: 14.2, rural: 31.9 },
];
/** Table 6.24 (p. 51): share of all multidimensionally poor people living in each type of locality, 2025 Q3. */
export const localityShareOfPoorQ3 = { urban: 36.4, rural: 63.6 };

/** Table 6.6 (pp. 33 to 34), "Total" rows: % of the national MPI that comes from each dimension. */
export const dimensionContribution: ({ quarter: Quarter } & Record<DimensionKey, number>)[] = [
  { quarter: "2024 Q1", living: 28.9, education: 18.5, health: 40.0, employment: 12.6 },
  { quarter: "2024 Q2", living: 27.5, education: 19.4, health: 41.7, employment: 11.4 },
  { quarter: "2024 Q3", living: 26.8, education: 18.9, health: 41.9, employment: 12.3 },
  { quarter: "2024 Q4", living: 28.2, education: 19.6, health: 42.7, employment: 9.4 },
  { quarter: "2025 Q2", living: 29.2, education: 13.4, health: 47.7, employment: 9.7 },
  { quarter: "2025 Q3", living: 33.8, education: 13.0, health: 40.9, employment: 12.3 },
];

/** Table 6.7 (p. 37), "Total" column, 2025 Q2 and Q3: % of the national MPI that comes from each indicator. */
export const indicatorContribution: Record<string, { q2: number; q3: number }> = {
  insurance: { q2: 27.4, q3: 26.5 }, nutrition: { q2: 20.3, q3: 14.4 }, employment: { q2: 9.7, q3: 12.3 },
  attendance: { q2: 6.0, q3: 8.5 }, overcrowding: { q2: 4.2, q3: 8.4 }, toilet: { q2: 7.9, q3: 8.0 },
  housing: { q2: 5.4, q3: 5.6 }, assets: { q2: 3.6, q3: 3.7 }, lag: { q2: 6.7, q3: 3.5 }, fuel: { q2: 3.5, q3: 3.3 },
  water: { q2: 2.5, q3: 2.5 }, electricity: { q2: 2.1, q3: 2.4 }, attainment: { q2: 0.6, q3: 0.9 },
};

/**
 * Table 6.1 (p. 27), censored headcount ratios: % of the whole population who are multidimensionally poor
 * and deprived in the indicator. 2024 Q1 to 2025 Q3 (seven quarters; 2025 Q1 is published in this table).
 */
export const censoredQuarters: Quarter[] = ["2024 Q1", "2024 Q2", "2024 Q3", "2024 Q4", "2025 Q1", "2025 Q2", "2025 Q3"];
export const censoredHeadcount: Record<string, number[]> = {
  electricity: [8.0, 8.7, 8.6, 8.4, 7.1, 5.7, 6.1],
  housing: [15.4, 17.8, 16.1, 16.6, 15.5, 14.8, 14.5],
  assets: [9.2, 10.5, 5.5, 7.8, 8.4, 9.8, 9.5],
  overcrowding: [12.4, 14.1, 12.2, 12.5, 14.8, 11.4, 21.6],
  fuel: [7.4, 9.0, 8.0, 8.6, 8.7, 9.4, 8.4],
  water: [8.4, 8.6, 8.0, 7.8, 7.2, 6.8, 6.3],
  toilet: [22.5, 26.0, 23.0, 23.1, 22.2, 21.6, 20.7],
  attendance: [8.0, 8.5, 8.7, 9.1, 8.5, 7.0, 9.4],
  attainment: [0.7, 0.7, 0.6, 0.6, 0.8, 0.8, 1.0],
  lag: [14.1, 19.4, 15.3, 15.5, 10.7, 7.9, 3.9],
  insurance: [22.2, 26.0, 23.0, 23.3, 21.9, 21.3, 19.5],
  nutrition: [10.6, 15.1, 13.3, 13.4, 13.2, 15.8, 10.6],
  employment: [5.2, 5.6, 5.3, 4.1, 4.5, 3.8, 4.5],
};

export const regionQuarters: Quarter[] = ["2024 Q1", "2024 Q2", "2024 Q3", "2024 Q4", "2025 Q2", "2025 Q3"];
export type RegionQuarterly = { region: string; mpi: number[]; incidence: number[]; intensity: number[]; people: number[] };
/** Tables 6.3 and 6.4 (pp. 28 to 29). Arrays follow `regionQuarters`. 2025 Q1 is not published by region. */
export const regionsQuarterly: RegionQuarterly[] = [
  { region: "Western", mpi: [0.093, 0.107, 0.084, 0.072, 0.074, 0.073], incidence: [21.1, 24.8, 19.7, 17.1, 18.6, 18.2], intensity: [44.1, 43.1, 42.6, 42.1, 39.8, 40.11], people: [454486, 535131, 425759, 370147, 408590, 401435] },
  { region: "Central", mpi: [0.100, 0.125, 0.108, 0.106, 0.104, 0.102], incidence: [23.1, 29.1, 24.9, 24.0, 24.2, 23.8], intensity: [43.3, 43.0, 43.4, 44.2, 43.0, 42.86], people: [681720, 860315, 737315, 711780, 728361, 719246] },
  { region: "Greater Accra", mpi: [0.043, 0.051, 0.044, 0.040, 0.049, 0.043], incidence: [9.7, 11.6, 9.7, 9.0, 11.6, 10.5], intensity: [44.3, 44.0, 45.4, 44.4, 42.2, 40.95], people: [556134, 666249, 558007, 518551, 678105, 612300] },
  { region: "Volta", mpi: [0.113, 0.115, 0.107, 0.097, 0.107, 0.089], incidence: [26.7, 26.5, 24.7, 23.1, 25.0, 20.6], intensity: [42.3, 43.4, 43.3, 42.0, 42.80, 43.20], people: [455164, 452557, 422487, 395739, 435010, 357754] },
  { region: "Eastern", mpi: [0.074, 0.109, 0.086, 0.085, 0.081, 0.065], incidence: [18.0, 26.1, 20.3, 19.3, 19.8, 16.1], intensity: [41.1, 41.8, 42.4, 44.0, 40.91, 40.37], people: [542188, 787569, 613526, 584219, 605671, 489564] },
  { region: "Ashanti", mpi: [0.083, 0.111, 0.089, 0.094, 0.073, 0.061], incidence: [19.5, 25.4, 19.6, 22.2, 17.5, 14.5], intensity: [42.6, 43.7, 45.4, 42.3, 41.71, 42.07], people: [1089680, 1421898, 1098956, 1246689, 997333, 829009] },
  { region: "Western North", mpi: [0.131, 0.153, 0.135, 0.132, 0.126, 0.122], incidence: [31.2, 35.8, 32.4, 32.0, 30.5, 29.9], intensity: [42.0, 42.7, 41.7, 41.3, 41.31, 40.80], people: [288957, 332149, 301082, 297830, 288082, 283567] },
  { region: "Ahafo", mpi: [0.130, 0.141, 0.115, 0.122, 0.096, 0.076], incidence: [29.6, 31.8, 27.0, 27.1, 22.9, 18.1], intensity: [43.9, 44.3, 42.6, 45.0, 41.92, 41.99], people: [173068, 186261, 158398, 159233, 136552, 108370] },
  { region: "Bono", mpi: [0.074, 0.095, 0.087, 0.070, 0.081, 0.067], incidence: [18.5, 22.9, 20.6, 17.1, 18.4, 15.8], intensity: [40.0, 41.5, 42.2, 40.9, 44.02, 42.41], people: [231435, 286987, 258573, 214978, 234753, 202404] },
  { region: "Bono East", mpi: [0.129, 0.154, 0.152, 0.139, 0.129, 0.118], incidence: [30.8, 36.1, 36.0, 32.2, 30.5, 28.4], intensity: [41.9, 42.7, 42.2, 43.2, 42.30, 41.55], people: [388523, 456188, 455646, 408190, 392377, 366852] },
  { region: "Oti", mpi: [0.208, 0.227, 0.212, 0.211, 0.152, 0.168], incidence: [48.3, 51.3, 48.2, 46.8, 35.6, 40.7], intensity: [43.1, 44.2, 44.0, 45.1, 42.70, 41.28], people: [379434, 403717, 379923, 369466, 283285, 325189] },
  { region: "Northern", mpi: [0.176, 0.203, 0.182, 0.192, 0.168, 0.174], incidence: [40.7, 46.9, 41.6, 43.8, 39.9, 41.0], intensity: [43.2, 43.3, 43.8, 43.8, 42.11, 42.44], people: [986041, 1138266, 1011238, 1066387, 985850, 1027342] },
  { region: "Savannah", mpi: [0.251, 0.248, 0.243, 0.231, 0.141, 0.152], incidence: [58.2, 58.3, 56.2, 53.4, 33.8, 37.3], intensity: [43.1, 42.5, 43.2, 43.3, 41.72, 40.75], people: [400832, 402233, 388361, 369590, 237407, 263059] },
  { region: "North East", mpi: [0.210, 0.259, 0.221, 0.258, 0.212, 0.222], incidence: [47.5, 57.3, 50.3, 57.2, 51.6, 53.5], intensity: [44.2, 45.2, 43.9, 45.1, 41.09, 41.50], people: [329316, 397963, 349901, 398524, 364842, 379820] },
  { region: "Upper East", mpi: [0.160, 0.189, 0.190, 0.173, 0.152, 0.168], incidence: [37.7, 44.7, 44.0, 41.4, 35.4, 38.6], intensity: [42.4, 42.3, 43.2, 41.8, 42.94, 43.52], people: [510663, 606557, 598006, 563552, 489028, 535410] },
  { region: "Upper West", mpi: [0.099, 0.103, 0.106, 0.147, 0.130, 0.119], incidence: [23.5, 24.4, 25.1, 35.4, 29.7, 28.3], intensity: [42.1, 42.2, 42.2, 41.5, 43.77, 42.05], people: [219075, 227869, 234778, 331641, 282370, 288154] },
];

/** Table 6.6 (p. 34), 2025 Q3: % of each region's MPI that comes from each dimension. */
export const regionDimensionsQ3: Record<string, Record<DimensionKey, number>> = {
  Western: { living: 33.4, education: 12.4, health: 43.7, employment: 10.5 },
  Central: { living: 31.3, education: 9.9, health: 41.7, employment: 17.1 },
  "Greater Accra": { living: 22.0, education: 10.1, health: 34.0, employment: 34.0 },
  Volta: { living: 35.5, education: 12.4, health: 36.2, employment: 16.0 },
  Eastern: { living: 35.4, education: 10.8, health: 43.7, employment: 10.1 },
  Ashanti: { living: 28.5, education: 12.0, health: 37.8, employment: 21.7 },
  "Western North": { living: 39.9, education: 12.9, health: 41.2, employment: 6.1 },
  Ahafo: { living: 36.3, education: 10.3, health: 47.5, employment: 5.8 },
  Bono: { living: 33.1, education: 12.7, health: 39.3, employment: 14.9 },
  "Bono East": { living: 37.3, education: 14.3, health: 44.6, employment: 3.8 },
  Oti: { living: 39.7, education: 15.2, health: 42.1, employment: 3.0 },
  Northern: { living: 35.8, education: 16.8, health: 44.9, employment: 2.6 },
  Savannah: { living: 37.4, education: 17.1, health: 42.7, employment: 2.8 },
  "North East": { living: 39.0, education: 14.2, health: 43.1, employment: 3.6 },
  "Upper East": { living: 37.4, education: 12.2, health: 36.8, employment: 13.6 },
  "Upper West": { living: 35.4, education: 13.9, health: 41.7, employment: 9.0 },
};

export type QuarterlyGroupSet = { key: string; title: string; table: string; note?: string; rows: { label: string; q2: number | null; q3: number }[] };
/** % of people living in households of each kind who are multidimensionally poor, 2025 Q2 and Q3. */
export const householdGroupsQuarterly: QuarterlyGroupSet[] = [
  { key: "education", title: "Education of the household head", table: "Table 6.12, p. 39",
    note: "“Other education” (6.8% in Q3) is a very small group and is listed in the table only.",
    rows: [{ label: "No education", q2: 38.1, q3: 38.5 }, { label: "Basic", q2: 22.6, q3: 20.8 }, { label: "Secondary", q2: 14.6, q3: 13.1 }, { label: "Post-secondary", q2: 6.1, q3: 12.9 }, { label: "Tertiary", q2: 6.5, q3: 5.7 }] },
  { key: "work", title: "Work of the household head", table: "Table 6.15, p. 44",
    note: "“Others” (5.4% in Q3) is a very small group and is listed in the table only.",
    rows: [{ label: "Not working", q2: 31.9, q3: 35.6 }, { label: "Private informal", q2: 24.4, q3: 22.4 }, { label: "Public sector", q2: 7.7, q3: 5.3 }, { label: "Private formal", q2: 7.0, q3: 5.0 }] },
  { key: "sector", title: "Economic sector of the household head", table: "Table 6.19, p. 48",
    rows: [{ label: "Not working", q2: 32.0, q3: 35.6 }, { label: "Agriculture", q2: 34.0, q3: 32.1 }, { label: "Industry", q2: 12.7, q3: 9.8 }, { label: "Services", q2: 10.7, q3: 9.7 }] },
  { key: "marital", title: "Marital status of the household head", table: "Table 6.27, p. 55",
    rows: [{ label: "Informal union or living together", q2: 34.4, q3: 33.1 }, { label: "Widowed", q2: 20.7, q3: 22.5 }, { label: "Never married", q2: 17.6, q3: 18.2 }, { label: "Separated", q2: 17.1, q3: 16.4 }, { label: "Married", q2: 17.9, q3: 16.1 }, { label: "Divorced", q2: 15.9, q3: 15.8 }] },
  { key: "sex", title: "Sex of the household head", table: "Table 6.8, p. 38",
    rows: [{ label: "Female-headed", q2: 22.0, q3: 22.0 }, { label: "Male-headed", q2: 23.6, q3: 21.9 }] },
];
export const otherGroupRows = [
  { group: "Education of the household head", label: "Other education", q2: 5.8, q3: 6.8 },
  { group: "Work of the household head", label: "Others", q2: 6.2, q3: 5.4 },
];

/**
 * Tables 6.29 to 6.34 (pp. 59 to 60), 2025 Q3: % multidimensionally poor by the household head's reported difficulty.
 * These are small groups; the published values move a great deal from quarter to quarter.
 */
export const difficultyQ3: { domain: string; none: number; some: number; aLot: number }[] = [
  { domain: "Hearing", none: 21.7, some: 35.7, aLot: 43.0 },
  { domain: "Intellectual (remembering or concentrating)", none: 21.8, some: 26.6, aLot: 33.6 },
  { domain: "Self-care", none: 21.8, some: 31.5, aLot: 28.8 },
  { domain: "Physical (walking or climbing)", none: 21.4, some: 28.3, aLot: 27.4 },
  { domain: "Sight", none: 21.5, some: 29.6, aLot: 26.6 },
  { domain: "Speech", none: 21.9, some: 32.8, aLot: 23.8 },
];

/** Table 6.10 (p. 38), 2025 Q3: % of the MPI of each kind of household that comes from each dimension. */
export const headshipDimensionsQ3: Record<"male" | "female", Record<DimensionKey, number>> = {
  male: { living: 35.4, education: 14.3, health: 44.0, employment: 6.3 },
  female: { living: 30.6, education: 10.2, health: 34.6, employment: 24.6 },
};

/** Table 6.35 (p. 61): people aged 15 and older, 2025 Q2 and Q3. */
export const burdens = {
  population15Plus: { q2: 15376747, q3: 15423716 },
  rows: [
    { label: "Multidimensionally poor, food insecure and unemployed", short: "All three at once", q2: { people: 208064, pct: 1.4 }, q3: { people: 227519, pct: 1.5 }, kind: "triple" },
    { label: "Multidimensionally poor and food insecure, but employed", short: "Poor and food insecure", q2: { people: 1256380, pct: 8.2 }, q3: { people: 1100295, pct: 7.1 }, kind: "double" },
    { label: "Multidimensionally poor and unemployed, but food secure", short: "Poor and unemployed", q2: { people: 222282, pct: 1.4 }, q3: { people: 256155, pct: 1.7 }, kind: "double" },
    { label: "Multidimensionally poor only (employed and food secure)", short: "Poor only", q2: { people: 1017066, pct: 6.6 }, q3: { people: 1069316, pct: 6.9 }, kind: "single" },
    { label: "Not poor, but food insecure and unemployed", short: "Food insecure and unemployed", q2: { people: 551549, pct: 3.6 }, q3: { people: 527593, pct: 3.4 }, kind: "other" },
    { label: "Not poor and employed, but food insecure", short: "Food insecure only", q2: { people: 4072119, pct: 26.5 }, q3: { people: 3822642, pct: 24.8 }, kind: "other" },
    { label: "Not poor and food secure, but unemployed", short: "Unemployed only", q2: { people: 949977, pct: 6.2 }, q3: { people: 992274, pct: 6.4 }, kind: "other" },
    { label: "None of the three (employed, food secure, not poor)", short: "None of the three", q2: { people: 7099309, pct: 46.2 }, q3: { people: 7427922, pct: 48.2 }, kind: "none" },
  ],
} as const;
