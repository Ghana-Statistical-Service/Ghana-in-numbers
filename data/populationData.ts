// Population and Society data — Ghana In Numbers 2025 (GSS)

export const populationSize = [
  { year: "2000", value: 18.9 },
  { year: "2001", value: 19.3 },
  { year: "2002", value: 19.8 },
  { year: "2003", value: 20.4 },
  { year: "2004", value: 21.1 },
  { year: "2005", value: 21.8 },
  { year: "2006", value: 22.6 },
  { year: "2007", value: 23.3 },
  { year: "2008", value: 23.8 },
  { year: "2009", value: 24.3 },
  { year: "2010", value: 24.7 },
  { year: "2011", value: 25.2 },
  { year: "2012", value: 25.8 },
  { year: "2013", value: 26.4 },
  { year: "2014", value: 26.9 },
  { year: "2015", value: 27.5 },
  { year: "2016", value: 28.0 },
  { year: "2017", value: 28.6 },
  { year: "2018", value: 29.2 },
  { year: "2019", value: 29.7 },
  { year: "2020", value: 30.3 },
  { year: "2021", value: 30.8 },
  { year: "2022", value: 31.5 },
  { year: "2023", value: 32.3 },
  { year: "2024", value: 33.0 },
  { year: "2025*", value: 33.7 },
];

export const intercensalGrowth = [
  { period: "1984 → 2000", years: 16, rate: "2.7%", doublingTime: 25.9 },
  { period: "2000 → 2010", years: 10, rate: "2.5%", doublingTime: 28.0 },
  { period: "2010 → 2021", years: 11, rate: "2.1%", doublingTime: 33.3 },
];

export const pyramidData: Record<string, { age: string; male: number; female: number }[]> = {
  "2010": [
    { age: "80+",   male: 0.12, female: 0.19 },
    { age: "75-79", male: 0.09, female: 0.12 },
    { age: "70-74", male: 0.15, female: 0.20 },
    { age: "65-69", male: 0.14, female: 0.16 },
    { age: "60-64", male: 0.23, female: 0.25 },
    { age: "55-59", male: 0.26, female: 0.27 },
    { age: "50-54", male: 0.39, female: 0.44 },
    { age: "45-49", male: 0.45, female: 0.49 },
    { age: "40-44", male: 0.57, female: 0.61 },
    { age: "35-39", male: 0.68, female: 0.74 },
    { age: "30-34", male: 0.79, female: 0.89 },
    { age: "25-29", male: 0.94, female: 1.11 },
    { age: "20-24", male: 1.10, female: 1.22 },
    { age: "15-19", male: 1.31, female: 1.30 },
    { age: "10-14", male: 1.48, female: 1.44 },
    { age: "5-9",   male: 1.59, female: 1.54 },
    { age: "0-4",   male: 1.73, female: 1.67 },
  ],
  "2021": [
    { age: "80+",   male: 0.11, female: 0.23 },
    { age: "75-79", male: 0.09, female: 0.13 },
    { age: "70-74", male: 0.15, female: 0.18 },
    { age: "65-69", male: 0.21, female: 0.23 },
    { age: "60-64", male: 0.31, female: 0.36 },
    { age: "55-59", male: 0.36, female: 0.39 },
    { age: "50-54", male: 0.49, female: 0.52 },
    { age: "45-49", male: 0.64, female: 0.63 },
    { age: "40-44", male: 0.80, female: 0.80 },
    { age: "35-39", male: 1.00, female: 1.04 },
    { age: "30-34", male: 1.16, female: 1.22 },
    { age: "25-29", male: 1.26, female: 1.36 },
    { age: "20-24", male: 1.44, female: 1.50 },
    { age: "15-19", male: 1.65, female: 1.66 },
    { age: "10-14", male: 1.71, female: 1.66 },
    { age: "5-9",   male: 1.90, female: 1.84 },
    { age: "0-4",   male: 1.91, female: 1.86 },
  ],
  "2025": [
    { age: "80+",   male: 0.10, female: 0.18 },
    { age: "75-79", male: 0.11, female: 0.14 },
    { age: "70-74", male: 0.16, female: 0.19 },
    { age: "65-69", male: 0.26, female: 0.31 },
    { age: "60-64", male: 0.32, female: 0.37 },
    { age: "55-59", male: 0.44, female: 0.48 },
    { age: "50-54", male: 0.59, female: 0.59 },
    { age: "45-49", male: 0.75, female: 0.75 },
    { age: "40-44", male: 0.94, female: 0.99 },
    { age: "35-39", male: 1.12, female: 1.18 },
    { age: "30-34", male: 1.22, female: 1.33 },
    { age: "25-29", male: 1.38, female: 1.46 },
    { age: "20-24", male: 1.60, female: 1.63 },
    { age: "15-19", male: 1.68, female: 1.65 },
    { age: "10-14", male: 1.86, female: 1.81 },
    { age: "5-9",   male: 1.93, female: 1.89 },
    { age: "0-4",   male: 2.17, female: 2.14 },
  ],
};

export const ageGroupDistribution2025 = [
  { label: "0-4",   sublabel: "Infants & Toddlers",    pct: 12.8, color: "#1B2A4A" },
  { label: "5-9",   sublabel: "Early Childhood",       pct: 11.3, color: "#2F6FE4" },
  { label: "10-19", sublabel: "Adolescents",           pct: 20.7, color: "#17B8A6" },
  { label: "20-34", sublabel: "Young Adults",          pct: 25.6, color: "#3DD9C8" },
  { label: "35-59", sublabel: "Middle Aged Adults",    pct: 23.2, color: "#7EE8DF" },
  { label: "60+",   sublabel: "Older Adults / Elderly",pct:  6.3, color: "#BEF7F0" },
];

export const urbanRuralData = [
  { year: "1984",  urban: 32.0, rural: 68.0 },
  { year: "2000",  urban: 43.8, rural: 56.2 },
  { year: "2010",  urban: 50.9, rural: 49.1 },
  { year: "2021",  urban: 56.7, rural: 43.3 },
  { year: "2025*", urban: 58.7, rural: 41.3 },
];

export const lifeExpectancyTrend = [
  { year: "1960", value: 40.3 },
  { year: "1971", value: 46.0 },
  { year: "1980", value: 56.0 },
  { year: "1993", value: 54.7 },
  { year: "1998", value: 56.7 },
  { year: "2003", value: 57.4 },
  { year: "2008", value: 62.3 },
  { year: "2010", value: 61.8 },
  { year: "2021", value: 65.1 },
];

export const lifeExpectancyByAge = [
  { age: "Under 1", male: 63.3, female: 66.8 },
  { age: "1-4",     male: 65.3, female: 68.4 },
  { age: "5-9",     male: 62.1, female: 64.9 },
  { age: "10-14",   male: 57.6, female: 60.2 },
  { age: "15-19",   male: 52.9, female: 55.4 },
  { age: "20-24",   male: 48.5, female: 50.7 },
  { age: "25-29",   male: 44.3, female: 46.1 },
  { age: "30-34",   male: 40.0, female: 41.6 },
  { age: "35-39",   male: 35.7, female: 37.0 },
  { age: "40-44",   male: 31.3, female: 32.5 },
  { age: "45-49",   male: 27.1, female: 28.1 },
  { age: "50-54",   male: 23.1, female: 23.9 },
  { age: "55-59",   male: 19.3, female: 19.9 },
  { age: "60-64",   male: 15.7, female: 16.0 },
  { age: "65-69",   male: 12.5, female: 12.6 },
  { age: "70-74",   male:  9.6, female:  9.9 },
  { age: "75-79",   male:  7.5, female:  7.9 },
  { age: "80+",     male:  7.1, female:  7.4 },
];

export const fertilityData = [
  { year: "1988", value: 6.4 },
  { year: "1993", value: 5.2 },
  { year: "2014", value: 4.2 },
  { year: "2022", value: 3.9 },
];

export const householdSizeData = [
  { year: "1984", value: 4.9 },
  { year: "1993", value: 5.1 },
  { year: "2014", value: 4.4 },
  { year: "2022", value: 3.6 },
];

export const populationKPIs = [
  {
    label: "Total Population",
    value: "34.4",
    unit: "M",
    note: "2025 Projected",
    stripes: [{ color: "#17B8A6", pct: 100 }],
  },
  {
    label: "Growth Rate",
    value: "2.1",
    unit: "%",
    note: "2010–2021",
    stripes: [{ color: "#2F6FE4", pct: 100 }],
  },
  {
    label: "Life Expectancy",
    value: "65.1",
    unit: "yrs",
    note: "At birth, 2021",
    stripes: [{ color: "#16A34A", pct: 100 }],
  },
  {
    label: "Urban Population",
    value: "58.7",
    unit: "%",
    note: "2025 Projected",
    stripes: [{ color: "#382873", pct: 100 }],
  },
  {
    label: "Fertility Rate",
    value: "3.9",
    unit: "",
    note: "Children per woman, 2022",
    stripes: [{ color: "#DB2988", pct: 100 }],
  },
];
