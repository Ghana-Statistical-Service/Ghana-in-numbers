/**
 * Multidimensional poverty: the ANNUAL series (2021 census; districts 2021 to 2025).
 *
 * Sources, all Ghana Statistical Service, statsghana.gov.gh > Publications > Administrative Data Reports:
 *  - "Multidimensional Poverty Report" (2021 Population and Housing Census): national, regional and household-group
 *    figures for 2021, method and weights. Cited below as the census report, with figure and table numbers.
 *  - "District-Level Multidimensional Poverty Rankings, 2021 to 2025" and the 261 district fact sheets.
 *  - StatsBank, "MPI by Indicators, Year and District".
 * District figures live in data/mpiDistricts.json (built by scripts/build-mpi-districts.py).
 * The quarterly survey series (2022 Q1 to 2025 Q3) is in data/mpiQuarterlyData.ts. Both are shown on the page,
 * each labelled, and never mixed.
 * Rules: docs/mpi-dashboard-guidelines.md. Checks: scripts/check-mpi-data.mjs.
 */

export const mpiSources = {
  census: "GSS, Multidimensional Poverty Report (2021 Population and Housing Census)",
  ranking: "GSS, District-Level Multidimensional Poverty Rankings, 2021 to 2025",
  factsheets: "GSS, district multidimensional poverty fact sheets, 2021 to 2025",
  statsbank: "GSS StatsBank, MPI by Indicators, Year and District",
  reportsUrl: "https://statsghana.gov.gh/publications/administrative-data-reports",
  statsbankUrl: "https://statsbank.statsghana.gov.gh/pxweb/en/MPI/",
  fileBase: "https://statsghana.gov.gh/api/minio/file?key=",
  censusKey: "publications/admin_data/Multi Dimensional Poverty Report.pdf",
  rankingKey: "publications/admin_data/Multidimensional Poverty National Ranking 2025.pdf",
} as const;

export const fileUrl = (key: string) => `${mpiSources.fileBase}${encodeURIComponent(key)}`;

export type DimensionKey = "health" | "living" | "education" | "employment";

/** Fixed order and colour on every chart (guidelines §4.3). */
export const dimensions: { key: DimensionKey; label: string; color: string; soft: string; weight: string }[] = [
  { key: "health", label: "Health", color: "#3C2FA3", soft: "#EEECFA", weight: "1/4" },
  { key: "living", label: "Living conditions", color: "#0E8A7E", soft: "#E6F4F2", weight: "1/4" },
  { key: "education", label: "Education", color: "#D17A22", soft: "#FBEFE2", weight: "1/4" },
  { key: "employment", label: "Employment", color: "#B4436C", soft: "#F8E9EF", weight: "1/4" },
];
export const dimensionOf = (key: DimensionKey) => dimensions.find(d => d.key === key)!;

/**
 * The 13 indicators. Weights: census report, Table 4.1 (p. 10). Cut-off wording: district fact sheets, 2021 to 2025.
 * `statsbank` is the label used in the StatsBank district table; `plain` is the short public wording.
 * The second health indicator was child and maternal mortality in 2021 (census) and is nutrition from 2022.
 */
export const indicators: { key: string; statsbank: string; label: string; plain: string; dimension: DimensionKey; weight: string; weightValue: number; cutoff: string }[] = [
  { key: "insurance", statsbank: "Insurance", label: "Health insurance", plain: "A household member has no valid health insurance", dimension: "health", weight: "1/8", weightValue: 1 / 8, cutoff: "Deprived if anyone in the household is not covered under any health insurance scheme, either through registration or non-renewal." },
  { key: "nutrition", statsbank: "Nutrition", label: "Nutrition", plain: "A child under 5 is undernourished (2021: a child or maternal death)", dimension: "health", weight: "1/8", weightValue: 1 / 8, cutoff: "From 2022: deprived if at least one child under 5 is underweight, stunted and wasting. In 2021 (census) the indicator was mortality: deprived if either a child under 5 or a pregnant mother died in the household." },
  { key: "toilet", statsbank: "Toilet", label: "Toilet", plain: "No toilet of its own, or an unimproved one", dimension: "living", weight: "1/28", weightValue: 1 / 28, cutoff: "Deprived if the household has no toilet (WC) facilities, or uses bucket or pan, a public toilet or a shared toilet outside the house." },
  { key: "overcrowding", statsbank: "Overcrowding", label: "Overcrowding", plain: "More than three people per sleeping room", dimension: "living", weight: "1/28", weightValue: 1 / 28, cutoff: "Deprived if the household on average has more than three people per sleeping room." },
  { key: "housing", statsbank: "Housing", label: "Housing", plain: "Floor or walls of earth, mud or thatch", dimension: "living", weight: "1/28", weightValue: 1 / 28, cutoff: "Deprived if the household uses inadequate flooring (earth or mud, other) or walls (earth or mud, palm leaves or thatch, grass or raffia, or other)." },
  { key: "assets", statsbank: "Assets", label: "Assets", plain: "Owns at most one small asset and no car", dimension: "living", weight: "1/28", weightValue: 1 / 28, cutoff: "Deprived if the household does not have more than one small asset (radio, TV, telephone, bike, motorbike, refrigerator or computer) and does not own a car." },
  { key: "fuel", statsbank: "Cooking fuel", label: "Cooking fuel", plain: "Cooks with solid fuel", dimension: "living", weight: "1/28", weightValue: 1 / 28, cutoff: "Deprived if the household uses solid fuels and cooking is done either outside the house, in the open, or in enclosed spaces." },
  { key: "water", statsbank: "Water", label: "Drinking water", plain: "Unsafe drinking water, or 30 minutes or more to fetch it", dimension: "living", weight: "1/28", weightValue: 1 / 28, cutoff: "Deprived if the household’s drinking water is from an unclean source (tanker supply or vendor; unprotected well or spring; river or stream; dugout, pond, lake, dam or canal; other) or a round trip to collect water takes 30 minutes or more." },
  { key: "electricity", statsbank: "Electricity", label: "Electricity", plain: "No electric power", dimension: "living", weight: "1/28", weightValue: 1 / 28, cutoff: "Deprived if the household does not have electric power." },
  { key: "attendance", statsbank: "School attendance", label: "School attendance", plain: "A child aged 4 to 15 is not in school", dimension: "education", weight: "1/12", weightValue: 1 / 12, cutoff: "Deprived if any child between 4 and 15 years in the household is not attending school." },
  { key: "lag", statsbank: "School lag", label: "School lag", plain: "A member is two or more years behind in school", dimension: "education", weight: "1/12", weightValue: 1 / 12, cutoff: "Deprived if the household has any member who is 2 or more years behind in school compared to the expected age and grade relationship." },
  { key: "attainment", statsbank: "School attainment", label: "School attainment", plain: "Nobody has nine years of schooling", dimension: "education", weight: "1/12", weightValue: 1 / 12, cutoff: "Deprived if no household member has received at least 9 years of schooling." },
  { key: "employment", statsbank: "Employment", label: "Employment", plain: "No one aged 15 or older is employed", dimension: "employment", weight: "1/4", weightValue: 1 / 4, cutoff: "Deprived if no member 15 years and older in the household is employed." },
];
export const indicatorByStatsbank = Object.fromEntries(indicators.map(i => [i.statsbank, i]));

/** A person is multidimensionally poor when deprived in at least one third of the weighted indicators (census report, Table 4.1 note). */
export const povertyCutoff = 33.3;

/** National figures, 2021 Population and Housing Census (census report, Figures 5.1 and 5.2, pp. 11 to 12). */
export const national2021 = {
  incidence: 24.3, intensity: 43.8, people: 7317555,
  /** Sum of the published regional household populations (Table 7.1). */
  householdPopulation: 30075379,
  sex: { female: { incidence: 24.6, intensity: 43.9, people: 3757628 }, male: { incidence: 24.0, intensity: 43.8, people: 3559927 } },
  locality: { urban: { incidence: 14.6, intensity: 43.4 }, rural: { incidence: 36.7, intensity: 44.0 } },
} as const;

/** Census report, Figure 5.6 (p. 16): % of the national MPI that comes from each dimension, 2021. */
export const dimensions2021: Record<DimensionKey, number> = { employment: 32.6, living: 27.9, health: 21.7, education: 17.8 };

/**
 * Census report, Figure 5.8 (p. 18): % of the household population deprived in each indicator in 2021,
 * whether multidimensionally poor or not. The health indicator beside insurance was mortality in 2021.
 */
export const deprivation2021: Record<string, number> = {
  toilet: 78.8, housing: 36.0, overcrowding: 34.9, fuel: 29.1, water: 19.3, electricity: 13.7, assets: 13.3,
  lag: 34.4, attendance: 12.8, attainment: 4.7, insurance: 52.2, nutrition: 0.2, employment: 17.9,
};

export type Region2021 = { region: string; population: number; people: number; incidence: number; urban: number; rural: number; dims: Record<DimensionKey, number> };
/**
 * Regions, 2021 census. Household population, number and % multidimensionally poor: Table 7.1 (p. 29).
 * Urban and rural incidence: Figure 5.5 (p. 15). Dimension contributions: Figure 5.7 (p. 17).
 * Regional figures are published for 2021 only; later years are published by district.
 */
export const regions: Region2021[] = [
  { region: "Greater Accra", population: 5384171, people: 627659, incidence: 11.7, urban: 10.5, rural: 24.4, dims: { employment: 47.8, health: 24.6, education: 12.1, living: 15.5 } },
  { region: "Bono", population: 1174830, people: 201089, incidence: 17.1, urban: 12.4, rural: 23.6, dims: { employment: 35.8, health: 18.2, education: 18.3, living: 27.7 } },
  { region: "Ashanti", population: 5247376, people: 959031, incidence: 18.3, urban: 11.9, rural: 28.1, dims: { employment: 34.2, health: 22.8, education: 16.3, living: 26.7 } },
  { region: "Eastern", population: 2819856, people: 611248, incidence: 21.7, urban: 14.0, rural: 29.4, dims: { employment: 31.0, health: 22.3, education: 17.8, living: 28.9 } },
  { region: "Central", population: 2770351, people: 623681, incidence: 22.5, urban: 17.0, rural: 29.9, dims: { employment: 33.7, health: 24.5, education: 16.1, living: 25.6 } },
  { region: "Bono East", population: 1184634, people: 286146, incidence: 24.2, urban: 14.1, rural: 35.0, dims: { employment: 22.4, health: 23.1, education: 22.1, living: 32.4 } },
  { region: "Ahafo", population: 548833, people: 135644, incidence: 24.7, urban: 16.4, rural: 32.3, dims: { employment: 27.4, health: 21.5, education: 18.6, living: 32.5 } },
  { region: "Western", population: 2022771, people: 519428, incidence: 25.7, urban: 15.8, rural: 35.9, dims: { employment: 31.5, health: 23.6, education: 16.4, living: 28.5 } },
  { region: "Western North", population: 869756, people: 235046, incidence: 27.0, urban: 14.7, rural: 32.1, dims: { employment: 22.4, health: 23.3, education: 19.7, living: 34.7 } },
  { region: "Volta", population: 1600269, people: 437481, incidence: 27.3, urban: 19.2, rural: 33.0, dims: { employment: 34.1, health: 21.6, education: 16.9, living: 27.4 } },
  { region: "Upper West", population: 875346, people: 327327, incidence: 37.4, urban: 14.6, rural: 45.0, dims: { employment: 36.9, health: 15.5, education: 18.4, living: 29.2 } },
  { region: "Northern", population: 2274919, people: 873742, incidence: 38.4, urban: 24.3, rural: 50.8, dims: { employment: 26.2, health: 23.0, education: 21.6, living: 29.3 } },
  { region: "Oti", population: 732747, people: 299316, incidence: 40.8, urban: 29.6, rural: 46.1, dims: { employment: 12.7, health: 27.5, education: 23.9, living: 35.9 } },
  { region: "Upper East", population: 1271883, people: 547436, incidence: 43.0, urban: 17.4, rural: 51.4, dims: { employment: 41.8, health: 13.3, education: 15.7, living: 29.3 } },
  { region: "North East", population: 651083, people: 313281, incidence: 48.1, urban: 37.7, rural: 53.0, dims: { employment: 31.1, health: 18.2, education: 19.4, living: 31.3 } },
  { region: "Savannah", population: 646554, people: 320000, incidence: 49.5, urban: 34.7, rural: 55.6, dims: { employment: 29.9, health: 20.7, education: 19.2, living: 30.1 } },
];

export type GroupSet = { key: string; title: string; figure: string; note?: string; ordered?: boolean; rows: { label: string; value: number }[] };
/** % of people living in households of each kind who were multidimensionally poor in 2021 (census report, Figures 5.9 to 5.16, pp. 20 to 27). */
export const householdGroups: GroupSet[] = [
  { key: "education", title: "Education of the household head", figure: "Figure 5.12, p. 23",
    rows: [{ label: "No education", value: 40.9 }, { label: "Basic", value: 20.0 }, { label: "Other", value: 16.1 }, { label: "Secondary", value: 13.3 }, { label: "Post-secondary", value: 10.7 }, { label: "Tertiary", value: 7.1 }] },
  { key: "work", title: "Work of the household head", figure: "Figure 5.13, p. 24",
    rows: [{ label: "Not working", value: 47.7 }, { label: "Private informal", value: 21.9 }, { label: "Private formal", value: 7.8 }, { label: "Other", value: 2.7 }, { label: "Public sector", value: 2.4 }] },
  { key: "sector", title: "Economic sector of the household head", figure: "Figure 5.14, p. 25", note: "Household heads who are working only.",
    rows: [{ label: "Agriculture", value: 34.3 }, { label: "Industry", value: 8.9 }, { label: "Services", value: 6.2 }] },
  { key: "size", title: "Size of the household", figure: "Figure 5.9, p. 20", ordered: true,
    rows: [{ label: "One to four members", value: 20.4 }, { label: "Five to nine members", value: 24.3 }, { label: "Ten or more members", value: 39.3 }] },
  { key: "age", title: "Age of the household head", figure: "Figure 5.11, p. 22", ordered: true, note: "Highest where the head is under 25 or aged 65 and older.",
    rows: [{ label: "15 to 19", value: 54.8 }, { label: "20 to 24", value: 30.4 }, { label: "25 to 29", value: 19.3 }, { label: "30 to 34", value: 17.3 }, { label: "35 to 39", value: 17.6 }, { label: "40 to 44", value: 19.1 }, { label: "45 to 49", value: 19.3 }, { label: "50 to 54", value: 21.1 }, { label: "55 to 59", value: 21.0 }, { label: "60 to 64", value: 25.7 }, { label: "65 and older", value: 38.3 }] },
  { key: "marital", title: "Marital status of the household head", figure: "Figure 5.15, p. 26",
    rows: [{ label: "Widowed", value: 32.0 }, { label: "Never married", value: 25.3 }, { label: "Divorced", value: 25.3 }, { label: "Separated", value: 24.6 }, { label: "Informal union or living together", value: 24.4 }, { label: "Married", value: 23.0 }] },
  { key: "sex", title: "Sex of the household head", figure: "Figure 5.10, p. 21",
    rows: [{ label: "Female-headed", value: 27.0 }, { label: "Male-headed", value: 23.0 }] },
  { key: "difficulty", title: "Household head has difficulty performing activities", figure: "Figure 5.16, p. 27", note: "Intensity: 44.6% with difficulty, 43.7% without.",
    rows: [{ label: "With difficulty", value: 33.8 }, { label: "Without difficulty", value: 23.3 }] },
];

export const mpiViews = [
  { id: "overview", label: "National picture", question: "How many people?" },
  { id: "regions", label: "Regions", question: "Where?" },
  { id: "districts", label: "Districts", question: "Which districts?" },
  { id: "groups", label: "Who is affected", question: "Who?" },
  { id: "method", label: "How it is measured", question: "How is it measured?" },
] as const;
export type MpiViewId = (typeof mpiViews)[number]["id"];

export type MpiDistrict = { name: string; region: string; headcount: number[]; rank: number[]; contributions: number[][]; census2021: { population: number; poor: number }; factsheet: string; shapes?: string[] };
export type MpiDistrictFile = { years: number[]; indicators: string[]; sources: { contributions: string; headcount: string; census2021: string }; districts: MpiDistrict[] };

/** Bands used to count districts by incidence. The same in every year. */
export const incidenceBands = [
  { max: 10, label: "Under 10%", color: "#D6D2F2" },
  { max: 20, label: "10% to under 20%", color: "#A59BE3" },
  { max: 30, label: "20% to under 30%", color: "#7365C7" },
  { max: 40, label: "30% to under 40%", color: "#3C2FA3" },
  { max: Infinity, label: "40% and over", color: "#1A1343" },
];
export const bandOf = (value: number) => incidenceBands.findIndex(b => value < b.max);
