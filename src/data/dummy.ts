import type { KPICard, GDPDataPoint, InflationDataPoint, SectorData, SearchedIndicator } from "@/types";

export const kpiCards: KPICard[] = [
  { label: "Population", value: "31.2 M", borderColor: "#17B8A6" },
  { label: "GDP (Real)", value: "$68.5 B", borderColor: "#F59E0B" },
  { label: "Inflation (CPI)", value: "12.8%", borderColor: "#EF4444" },
  { label: "Unemployment", value: "6.5%", borderColor: "#8B5CF6" },
  { label: "Life Expectancy", value: "65.3 Years", borderColor: "#3B82F6" },
];

export const gdpGrowthData: GDPDataPoint[] = [
  { year: "May", value: 8 },
  { year: "2019", value: 5.7 },
  { year: "2019", value: 1.8 },
  { year: "2020", value: -1.8 },
  { year: "2021", value: 4.1 },
  { year: "2023", value: 6.8 },
];

export const inflationSparklineData: InflationDataPoint[] = [
  { month: "M1", value: 13.24 },
  { month: "M2", value: 13.28 },
  { month: "M3", value: 13.26 },
  { month: "M4", value: 13.30 },
  { month: "M5", value: 13.12 },
  { month: "M6", value: 12.86 },
  { month: "M7", value: 12.83 },
  { month: "M8", value: 13.05 },
  { month: "M9", value: 13.28 },
  { month: "M10", value: 13.52 },
  { month: "M11", value: 13.56 },
  { month: "M12", value: 13.74 },
  { month: "M13", value: 13.32 },
  { month: "M14", value: 13.28 },
  { month: "M15", value: 13.72 },
  { month: "M16", value: 13.58 },
  { month: "M17", value: 13.98 },
  { month: "M18", value: 14.34 },
  { month: "M19", value: 14.10 },
  { month: "M20", value: 14.46 },
  { month: "M21", value: 14.38 },
  { month: "M22", value: 14.82 },
  { month: "M23", value: 14.76 },
  { month: "M24", value: 15.34 },
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

export const regionInflationData: Record<string, number> = {
  "Ahafo": 12.1,
  "Ashanti": 13.8,
  "Bono": 11.9,
  "Bono East": 12.4,
  "Central": 14.2,
  "Eastern": 13.1,
  "Greater Accra": 13.5,
  "North East": 11.2,
  "Northern": 11.8,
  "Oti": 12.7,
  "Savannah": 11.5,
  "Upper East": 11.0,
  "Upper West": 10.8,
  "Volta": 12.9,
  "Western": 13.3,
  "Western North": 12.6,
};

export const whatsChanged = {
  indicator: "Inflation",
  from: "13.5%",
  to: "12.8%",
  direction: "down" as const,
};

export const statOfDay = {
  value: "56.1%",
  label: "Internet Penetration in Ghana",
};
