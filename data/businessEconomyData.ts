// Business and Economy data from the supplied Ghana in Numbers reference pages.
// Keep this scoped to the provided indicators only.

export const businessEconomyKPIs = [
  { label: "Overall GDP", value: "1,434.1", unit: "bn GH¢", note: "Nominal, 2025", color: "#00A3FF" },
  { label: "Real GDP", value: "210", unit: "bn", note: "2013 prices, 2025", color: "#006FC9" },
  { label: "Trade Surplus", value: "148.3", unit: "bn", note: "Goods, 2025", color: "#8BC34A" },
  { label: "Inflation", value: "14.6", unit: "%", note: "2025 year-on-year", color: "#8B3A16" },
  { label: "Visitors", value: "16.76", unit: "M", note: "Tourism flow, 2023", color: "#6B3FA0" },
];

export const nominalGdpData = [
  { year: "2013", overall: 124.48, nonOil: 120.4 },
  { year: "2014", overall: 150.3, nonOil: 146.0 },
  { year: "2015", overall: 183.53, nonOil: 178.9 },
  { year: "2016", overall: 219.6, nonOil: 213.8 },
  { year: "2017", overall: 262.8, nonOil: 254.9 },
  { year: "2018", overall: 310.1, nonOil: 298.4 },
  { year: "2019", overall: 356.54, nonOil: 342.6 },
  { year: "2020", overall: 391.9, nonOil: 376.8 },
  { year: "2021", overall: 461.69, nonOil: 437.0 },
  { year: "2022", overall: 614.34, nonOil: 574.9 },
  { year: "2023*", overall: 887.75, nonOil: 820.2 },
  { year: "2024**", overall: 1182.8, nonOil: 1092.0 },
  { year: "2025**", overall: 1434.11, nonOil: 1321.5 },
];

export const sectorShare2025 = [
  { name: "Agriculture", value: 22.8, color: "#16B99A" },
  { name: "Industry", value: 31.3, color: "#146B7D" },
  { name: "Services", value: 45.9, color: "#FF8A00" },
];

export const nominalGdpPerCapitaData = [
  { year: "2020", value: 12718.53 },
  { year: "2021", value: 14974.53 },
  { year: "2022", value: 19595.81 },
  { year: "2023*", value: 28316.97 },
  { year: "2024**", value: 35834.13 },
  { year: "2025**", value: 42501.88 },
];

export const realGdpData = [
  { year: "2013", real: 124, nonOil: 118, growth: 7.2 },
  { year: "2014", real: 128, nonOil: 120, growth: 2.9 },
  { year: "2015", real: 131, nonOil: 123, growth: 2.1 },
  { year: "2016", real: 135, nonOil: 129, growth: 3.4 },
  { year: "2017", real: 146, nonOil: 135, growth: 8.1 },
  { year: "2018", real: 155, nonOil: 143, growth: 6.2 },
  { year: "2019", real: 165, nonOil: 152, growth: 6.5 },
  { year: "2020", real: 166, nonOil: 153, growth: 0.5 },
  { year: "2021", real: 175, nonOil: 164, growth: 5.1 },
  { year: "2022", real: 181, nonOil: 171, growth: 3.8 },
  { year: "2023", real: 187, nonOil: 178, growth: 3.1 },
  { year: "2024**", real: 198, nonOil: 190, growth: 5.8 },
  { year: "2025**", real: 210, nonOil: 203, growth: 6.0 },
];

export const tradeGoodsData = [
  { year: "2014", export: 42.7, import: 40.7, balance: 2.0 },
  { year: "2015", export: 44.7, import: 49.2, balance: -4.5 },
  { year: "2016", export: 41.6, import: 45.5, balance: -4.0 },
  { year: "2017", export: 54.7, import: 60.5, balance: -5.8 },
  { year: "2018", export: 75.0, import: 59.2, balance: 15.9 },
  { year: "2019", export: 86.2, import: 64.5, balance: 21.8 },
  { year: "2020", export: 75.5, import: 81.5, balance: -6.1 },
  { year: "2021", export: 86.1, import: 103.6, balance: -17.6 },
  { year: "2022", export: 143.8, import: 148.6, balance: -4.8 },
  { year: "2023", export: 186.0, import: 180.7, balance: 5.3 },
  { year: "2024", export: 294.9, import: 250.2, balance: 44.7 },
  { year: "2025", export: 401.5, import: 253.2, balance: 148.3 },
];

export const topExports2025 = [
  { name: "Good Bullion", share: 62.9, color: "#F6B800" },
  { name: "Cocoa beans", share: 8.6, color: "#8B4513" },
  { name: "Crude Petroleum", share: 8.3, color: "#F26B2A" },
  { name: "Cocoa paste", share: 2.3, color: "#A16207" },
  { name: "Cashew nuts", share: 1.8, color: "#84CC16" },
];

export const topImports2025 = [
  { name: "Gas Oil", share: 11.2, color: "#F59E0B" },
  { name: "Motor spirit", share: 9.2, color: "#EF4444" },
  { name: "Used cars 1.5-3.0L", share: 3.7, color: "#2563EB" },
  { name: "Crude Petroleum", share: 2.3, color: "#111827" },
  { name: "Cement clinkers", share: 1.9, color: "#64748B" },
];

export const tradePartnerRegions = [
  { region: "Asia", export: 50.1, import: 48.4, color: "#12AEE3" },
  { region: "Europe", export: 28.8, import: 24.7, color: "#0088CC" },
  { region: "Africa", export: 17.5, import: 14.1, color: "#8BC34A" },
  { region: "North America", export: 4.2, import: 9.5, color: "#082B73" },
];

export const annualInflationData = [
  { year: "2014", yoy: 14.0, mom: 3.4 },
  { year: "2015", yoy: 17.0, mom: 1.1 },
  { year: "2016", yoy: 18.5, mom: 2.0 },
  { year: "2017", yoy: 12.4, mom: 0.8 },
  { year: "2018", yoy: 9.2, mom: 0.4 },
  { year: "2019", yoy: 7.1, mom: 0.5 },
  { year: "2020", yoy: 10.4, mom: 1.0 },
  { year: "2021", yoy: 10.0, mom: 0.9 },
  { year: "2022", yoy: 31.7, mom: 3.9 },
  { year: "2023", yoy: 53.4, mom: 8.2 },
  { year: "2024", yoy: 23.2, mom: 1.7 },
  { year: "2025", yoy: 14.6, mom: 0.9 },
];

export const foodNonFoodInflationData = [
  { year: "2014", food: 7, nonFood: 18 },
  { year: "2015", food: 8, nonFood: 23 },
  { year: "2016", food: 9, nonFood: 25 },
  { year: "2017", food: 6, nonFood: 16 },
  { year: "2018", food: 5, nonFood: 12 },
  { year: "2019", food: 6, nonFood: 6 },
  { year: "2020", food: 14, nonFood: 8 },
  { year: "2021", food: 11, nonFood: 7 },
  { year: "2022", food: 28, nonFood: 22 },
  { year: "2023", food: 60, nonFood: 27 },
  { year: "2024", food: 25, nonFood: 12 },
  { year: "2025", food: 14, nonFood: 2 },
];

export const localImportedInflationData = [
  { year: "2022", local: 14, import: 11 },
  { year: "2022.5", local: 34, import: 36 },
  { year: "2023", local: 51, import: 63 },
  { year: "2023.5", local: 38, import: 45 },
  { year: "2024", local: 24, import: 20 },
  { year: "2024.5", local: 23, import: 16 },
  { year: "2025", local: 25, import: 18 },
  { year: "2025.5", local: 6, import: 4 },
];

export const iipSectorData = [
  { sector: "Mining and Quarrying", y2023: 1.6, y2024: 7.3, y2025: -0.3 },
  { sector: "Manufacturing", y2023: -1.2, y2024: 5.9, y2025: 5.3 },
  { sector: "Electricity and gas", y2023: 8.8, y2024: 1.5, y2025: 7.5 },
  { sector: "Water supply and waste", y2023: -6.1, y2024: -1.2, y2025: -1.1 },
];

export const ppiSectorData = [
  { sector: "Mining and Quarrying", value: 16.1, icon: "pickaxe", color: "#64748B" },
  { sector: "Manufacturing", value: 9.2, icon: "factory", color: "#F59E0B" },
  { sector: "Electricity and gas", value: 6.8, icon: "zap", color: "#F6B800" },
  { sector: "Water supply and waste", value: 4.4, icon: "waves", color: "#0EA5A3" },
  { sector: "Construction", value: 8.8, icon: "crane", color: "#F97316" },
  { sector: "Transportation and storage", value: 2.0, icon: "bus", color: "#EF4444" },
  { sector: "Accommodation and food service", value: 7.3, icon: "hotel", color: "#6366F1" },
  { sector: "Information and communication", value: 2.7, icon: "wifi", color: "#F59E0B" },
];

export const labourParticipationData = [
  { year: "2022", labourForce: 67.1, employmentPopulation: 58.3 },
  { year: "2023", labourForce: 71.6, employmentPopulation: 61.2 },
  { year: "2024", labourForce: 70.1, employmentPopulation: 60.6 },
  { year: "2025", labourForce: 74.5, employmentPopulation: 65.0 },
];

export const unemploymentData = [
  { year: "2017", youth1524: 18.5, youth1535: 12.6, national: 8.4 },
  { year: "2022", youth1524: 24.2, youth1535: 18.9, national: 13.1 },
  { year: "2023", youth1524: 29.7, youth1535: 21.5, national: 14.6 },
  { year: "2024", youth1524: 32.1, youth1535: 22.5, national: 13.6 },
  { year: "2025", youth1524: 30.5, youth1535: 22.55, national: 12.8 },
];

export const neetData = [
  { year: "2022", youth1524: 22.4, youth1535: 21.7 },
  { year: "2023", youth1524: 19.6, youth1535: 18.5 },
  { year: "2024", youth1524: 20.9, youth1535: 19.7 },
  { year: "2025", youth1524: 19.1, youth1535: 17.9 },
];

export const fishProductionData = [
  { year: "2010", marine: 3.19, inland: 0.83, aquaculture: 0.1 },
  { year: "2011", marine: 3.27, inland: 0.95, aquaculture: 0.19 },
  { year: "2012", marine: 3.34, inland: 0.95, aquaculture: 0.27 },
  { year: "2013", marine: 3.15, inland: 0.87, aquaculture: 0.33 },
  { year: "2014", marine: 2.89, inland: 0.85, aquaculture: 0.39 },
  { year: "2015", marine: 3.13, inland: 0.86, aquaculture: 0.45 },
  { year: "2016", marine: 3.29, inland: 0.84, aquaculture: 0.52 },
  { year: "2017", marine: 3.42, inland: 0.77, aquaculture: 0.57 },
  { year: "2018", marine: 3.02, inland: 0.74, aquaculture: 0.77 },
  { year: "2019", marine: 3.09, inland: 0.81, aquaculture: 0.52 },
  { year: "2020", marine: 3.27, inland: 0.81, aquaculture: 0.64 },
  { year: "2021", marine: 3.94, inland: 1.45, aquaculture: 0.89 },
  { year: "2022", marine: 3.78, inland: 1.47, aquaculture: 1.33 },
  { year: "2023", marine: 4.25, inland: 1.43, aquaculture: 1.16 },
  { year: "2024", marine: 4.42, inland: 1.32, aquaculture: 1.22 },
];

export const cropProductionData = [
  { year: "2013", maize: 1.76, cassava: 15.99, yam: 7.07, cocoyam: 1.26, plantain: 3.68, other: 1.2 },
  { year: "2014", maize: 1.77, cassava: 16.52, yam: 7.12, cocoyam: 1.3, plantain: 3.83, other: 1.1 },
  { year: "2015", maize: 1.69, cassava: 17.21, yam: 7.3, cocoyam: 1.3, plantain: 3.95, other: 1.3 },
  { year: "2016", maize: 1.72, cassava: 17.8, yam: 7.44, cocoyam: 1.34, plantain: 4.0, other: 1.5 },
  { year: "2017", maize: 2.01, cassava: 19.01, yam: 7.86, cocoyam: 1.39, plantain: 4.28, other: 1.2 },
  { year: "2018", maize: 2.31, cassava: 20.85, yam: 7.79, cocoyam: 1.46, plantain: 4.69, other: 2.0 },
  { year: "2019", maize: 2.91, cassava: 22.75, yam: 8.75, cocoyam: 1.55, plantain: 5.48, other: 2.4 },
  { year: "2020", maize: 3.03, cassava: 22.96, yam: 8.8, cocoyam: 2.16, plantain: 5.41, other: 2.6 },
  { year: "2021", maize: 3.58, cassava: 24.71, yam: 9.48, cocoyam: 2.19, plantain: 6.25, other: 3.1 },
  { year: "2022", maize: 3.26, cassava: 26.08, yam: 11.14, cocoyam: 1.71, plantain: 6.28, other: 3.4 },
  { year: "2023", maize: 3.58, cassava: 27.7, yam: 11.74, cocoyam: 1.8, plantain: 7.26, other: 3.6 },
];

export const tourismPurposeData = [
  { purpose: "Funeral", share: 39.3, color: "#8B3A16" },
  { purpose: "Visiting friends & relatives", share: 35.9, color: "#6B3FA0" },
  { purpose: "Business & professional", share: 11.7, color: "#111827" },
];

export const tourismFlowData = [
  {
    type: "Domestic",
    visitors: "15,388,978",
    expenditure: "GHC 6.59bn",
    purposes: ["Visiting Friends & Relatives", "Funerals"],
    topAreas: ["Aburi Botanical Garden", "Elmina Castle", "Kwame Nkrumah Memorial Park", "Cape Three Points", "Cape Coast Castle"],
  },
  {
    type: "Outbound",
    visitors: "470,806",
    expenditure: "GHC 4.00bn",
    purposes: ["Business & Professional", "Visiting Friends & Relatives"],
    topAreas: [],
  },
  {
    type: "Inbound",
    visitors: "901,448",
    expenditure: "GHC 15.42bn",
    purposes: ["Visiting Friends & Relatives"],
    topAreas: ["Independence Square and Arts Centre", "Kwame Nkrumah Memorial Park", "Cape Coast Castle", "Elmina Castle", "Kakum National Park"],
  },
];
