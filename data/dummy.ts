import type { KPICard, GDPDataPoint, InflationDataPoint, SectorData, SearchedIndicator } from "@/types";

export const kpiCards: KPICard[] = [
  { label: "Population", value: "34.4 M", borderColor: "#17B8A6" },
  { label: "GDP Growth", value: "6.0%", borderColor: "#F59E0B" },
  { label: "Inflation (CPI)", value: "3.2%", borderColor: "#EF4444" },
  { label: "Unemployment", value: "13.0%", borderColor: "#8B5CF6" },
  { label: "Life Expectancy", value: "65.1 Years", borderColor: "#3B82F6" },
];

// GDP by Production Approach — Real GDP growth rate (year-on-year %), GSS StatsBank
export const gdpGrowthData: GDPDataPoint[] = [
  { year: "2017", value: 8.1 },
  { year: "2018", value: 6.2 },
  { year: "2019", value: 6.5 },
  { year: "2020", value: 0.5 },
  { year: "2021", value: 5.1 },
  { year: "2022", value: 3.8 },
  { year: "2023", value: 3.1 },
  { year: "2024", value: 5.8 },
  { year: "2025", value: 6.0 },
];

// Ghana year-on-year CPI inflation (%), GSS StatsBank — Apr 2024 to Mar 2026
export const inflationSparklineData: InflationDataPoint[] = [
  { month: "Apr'24", value: 25.1 },
  { month: "May'24", value: 23.1 },
  { month: "Jun'24", value: 22.8 },
  { month: "Jul'24", value: 20.9 },
  { month: "Aug'24", value: 20.4 },
  { month: "Sep'24", value: 21.5 },
  { month: "Oct'24", value: 22.1 },
  { month: "Nov'24", value: 23.0 },
  { month: "Dec'24", value: 23.8 },
  { month: "Jan'25", value: 23.5 },
  { month: "Feb'25", value: 23.1 },
  { month: "Mar'25", value: 22.4 },
  { month: "Apr'25", value: 21.2 },
  { month: "May'25", value: 18.4 },
  { month: "Jun'25", value: 13.7 },
  { month: "Jul'25", value: 12.1 },
  { month: "Aug'25", value: 11.5 },
  { month: "Sep'25", value: 9.4 },
  { month: "Oct'25", value: 8.0 },
  { month: "Nov'25", value: 6.3 },
  { month: "Dec'25", value: 5.4 },
  { month: "Jan'26", value: 3.8 },
  { month: "Feb'26", value: 3.3 },
  { month: "Mar'26", value: 3.2 },
];

export const sectorData: SectorData[] = [
  { sector: "Agriculture", primary: 45, secondary: 30, tertiary: 25 },
  { sector: "Industry", primary: 35, secondary: 25, tertiary: 40 },
  { sector: "Services", primary: 20, secondary: 15, tertiary: 65 },
];

export const mostSearchedIndicators: SearchedIndicator[] = [
  { rank: 1, name: "Inflation Rate", share: "33.2%", icon: "bookmark" },
  { rank: 2, name: "GDP Growth", share: "19.5%", icon: "bookmark" },
  { rank: 3, name: "Unemployment Rate", share: "7.2%", icon: "bar" },
];

// Regional year-on-year CPI inflation (%), GSS StatsBank — March 2026
export const regionInflationData: Record<string, number> = {
  "Ahafo": 3.3,
  "Ashanti": 5.0,
  "Bono": -0.6,
  "Bono East": -3.4,
  "Central": 4.4,
  "Eastern": 4.1,
  "Greater Accra": 4.0,
  "North East": 8.6,
  "Northern": -0.1,
  "Oti": -1.0,
  "Savannah": -4.6,
  "Upper East": -1.8,
  "Upper West": 1.6,
  "Volta": 4.6,
  "Western": -0.4,
  "Western North": 4.0,
};

export const whatsChanged = {
  indicator: "Inflation",
  from: "3.3%",
  to: "3.2%",
  direction: "down" as const,
};

export const statOfDay = {
  value: "56.1%",
  label: "Internet Penetration in Ghana",
};
