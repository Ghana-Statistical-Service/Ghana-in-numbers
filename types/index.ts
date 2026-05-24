export interface KPICard {
  label: string;
  value: string;
  borderColor: string;
}

export interface GDPDataPoint {
  year: string;
  value: number;
}

export interface InflationDataPoint {
  month: string;
  value: number;
}

export interface SectorData {
  sector: string;
  primary: number;
  secondary: number;
  tertiary: number;
}

export interface SearchedIndicator {
  rank: number;
  name: string;
  share: string;
  icon: "bookmark" | "bar";
}

export interface NavItem {
  label: string;
  icon: string;
  hasChildren?: boolean;
  active?: boolean;
}

export interface PyramidDataPoint {
  age: string;
  male: number;
  female: number;
}

export interface UrbanRuralPoint {
  year: string;
  urban: number;
  rural: number;
}

export interface LifeExpPoint {
  year: string;
  value: number;
}

export interface PopulationKPI {
  label: string;
  value: string;
  unit: string;
  note: string;
  stripes: { color: string; pct: number }[];
}
