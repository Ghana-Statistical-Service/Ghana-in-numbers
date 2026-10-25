// Business and Economy data from the supplied Ghana in Numbers reference pages.
// Keep this scoped to the provided indicators only.

export const businessEconomyKPIs = [
  { label: "Overall GDP", value: "1,434.1", unit: "bn GH¢", note: "Nominal, 2025", color: "#00A3FF" },
  { label: "Real GDP", value: "209.6", unit: "bn GH¢", note: "2013 prices, 2025", color: "#006FC9" },
  { label: "Trade Surplus", value: "148.3", unit: "bn", note: "Goods, 2025", color: "#8BC34A" },
  { label: "Inflation", value: "14.6", unit: "%", note: "Annual average, 2025", color: "#8B3A16" },
  { label: "Businesses", value: "2.64", unit: "M", note: "IBES I, 2024", color: "#6B3FA0" },
];

export const nominalGdpData = [
  {
    "year": "2013",
    "overall": 124.5
  },
  {
    "year": "2014",
    "overall": 158.7
  },
  {
    "year": "2015",
    "overall": 183.5
  },
  {
    "year": "2016",
    "overall": 219.6
  },
  {
    "year": "2017",
    "overall": 262.8
  },
  {
    "year": "2018",
    "overall": 308.6
  },
  {
    "year": "2019",
    "overall": 356.5
  },
  {
    "year": "2020",
    "overall": 391.9
  },
  {
    "year": "2021",
    "overall": 461.7
  },
  {
    "year": "2022",
    "overall": 614.336
  },
  {
    "year": "2023",
    "overall": 887.748
  },
  {
    "year": "2024*",
    "overall": 1182.799
  },
  {
    "year": "2025**",
    "overall": 1434.115
  }
];

export const sectorShare2025 = [
  { name: "Agriculture", value: 22.8, color: "#16B99A" },
  { name: "Industry", value: 31.3, color: "#146B7D" },
  { name: "Services", value: 45.9, color: "#FF8A00" },
];

export const nominalGdpPerCapitaData = [
  {
    "year": "2013",
    "value": 4710.1
  },
  {
    "year": "2014",
    "value": 5900
  },
  {
    "year": "2015",
    "value": 6600
  },
  {
    "year": "2016",
    "value": 7800
  },
  {
    "year": "2017",
    "value": 9100
  },
  {
    "year": "2018",
    "value": 10400
  },
  {
    "year": "2019",
    "value": 11800
  },
  {
    "year": "2020",
    "value": 12700
  },
  {
    "year": "2021",
    "value": 15000
  },
  {
    "year": "2022",
    "value": 19600
  },
  {
    "year": "2023",
    "value": 28300
  },
  {
    "year": "2024*",
    "value": 35800
  },
  {
    "year": "2025**",
    "value": 42501.88
  }
];

export const realGdpData = [
  {
    "year": "2013",
    "real": 124.5,
    "growth": 7.2
  },
  {
    "year": "2014",
    "real": 128,
    "growth": 2.9
  },
  {
    "year": "2015",
    "real": 130.7,
    "growth": 2.1
  },
  {
    "year": "2016",
    "real": 135.2,
    "growth": 3.4
  },
  {
    "year": "2017",
    "real": 146.1,
    "growth": 8.1
  },
  {
    "year": "2018",
    "real": 155.2,
    "growth": 6.2
  },
  {
    "year": "2019",
    "real": 165.3,
    "growth": 6.5
  },
  {
    "year": "2020",
    "real": 166.2,
    "growth": 0.5
  },
  {
    "year": "2021",
    "real": 174.6,
    "growth": 5.1
  },
  {
    "year": "2022",
    "real": 181.2,
    "growth": 3.8
  },
  {
    "year": "2023",
    "real": 186.9,
    "growth": 3.1
  },
  {
    "year": "2024*",
    "real": 197.9,
    "growth": 5.8
  },
  {
    "year": "2025**",
    "real": 209.6,
    "growth": 6
  }
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
  { name: "Gold bullion", share: 62.9, color: "#F6B800" },
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
  { region: "Europe", export: 26.8, import: 24.7, color: "#0088CC" },
  { region: "Africa", export: 17.5, import: 14.1, color: "#8BC34A" },
  { region: "North America", export: 4.2, import: 9.5, color: "#082B73" },
];

export const annualInflationData = [
  {
    "year": "2025",
    "yoy": 14.6
  }
];

export const foodNonFoodInflationData = [
  {
    "year": "Jan 2023",
    "food": 61,
    "nonFood": 47.9
  },
  {
    "year": "Dec 2025",
    "food": 4.9,
    "nonFood": 5.8
  }
];


export const iipSectorData = [
  {
    "sector": "All industries",
    "y2023": 1.1,
    "y2024": 1.7,
    "y2025": 1.9
  },
  {
    "sector": "Mining and Quarrying",
    "y2023": 1.3,
    "y2024": -1.1,
    "y2025": -1.2
  },
  {
    "sector": "Manufacturing",
    "y2023": 1.1,
    "y2024": 5.1,
    "y2025": 6.1
  },
  {
    "sector": "Electricity and gas",
    "y2023": -0.6,
    "y2024": 6.4,
    "y2025": 3.9
  },
  {
    "sector": "Water supply and waste",
    "y2023": -1.8,
    "y2024": -5.9,
    "y2025": -2.1
  }
];

export const ppiSectorData = [
  {
    "sector": "All industries",
    "value": 1.9,
    "icon": "factory",
    "color": "#00723F"
  },
  {
    "sector": "Mining and Quarrying",
    "value": 3.3,
    "icon": "pickaxe",
    "color": "#64748B"
  },
  {
    "sector": "Manufacturing",
    "value": 0.1,
    "icon": "factory",
    "color": "#F59E0B"
  },
  {
    "sector": "Electricity and gas",
    "value": 6.1,
    "icon": "zap",
    "color": "#F6B800"
  },
  {
    "sector": "Water supply and waste",
    "value": 2.3,
    "icon": "waves",
    "color": "#0EA5A3"
  },
  {
    "sector": "Construction",
    "value": 1.7,
    "icon": "crane",
    "color": "#F97316"
  },
  {
    "sector": "Transportation and storage",
    "value": -3.7,
    "icon": "bus",
    "color": "#EF4444"
  },
  {
    "sector": "Accommodation and food service",
    "value": -3.2,
    "icon": "hotel",
    "color": "#6366F1"
  },
  {
    "sector": "Information and communication",
    "value": 1.7,
    "icon": "wifi",
    "color": "#F59E0B"
  }
];

export const labourParticipationData = [
  { year: "2022", labourForce: 67.1, employmentPopulation: 58.3 },
  { year: "2023", labourForce: 71.6, employmentPopulation: 61.2 },
  { year: "2024", labourForce: 70.1, employmentPopulation: 60.4 },
  { year: "2025", labourForce: 74.5, employmentPopulation: 65.0 },
];

export const unemploymentData = [
  {
    "year": "2017",
    "youth1524": 18.5,
    "youth1535": 12.6,
    "national": 8.4
  },
  {
    "year": "2021",
    "youth1524": 32.8,
    "youth1535": 19.7,
    "national": 13.4
  },
  {
    "year": "2022",
    "youth1524": 24.1,
    "youth1535": 18.8,
    "national": 13.1
  },
  {
    "year": "2023",
    "youth1524": 30.6,
    "youth1535": 22.2,
    "national": 14.6
  },
  {
    "year": "2024",
    "youth1524": 32,
    "youth1535": 22.5,
    "national": 13.6
  },
  {
    "year": "2025",
    "youth1524": 32.4,
    "youth1535": 21.9,
    "national": 12.8
  }
];

export const neetData = [
  {
    "year": "2022",
    "youth1524": 22.4,
    "youth1535": 21.7
  },
  {
    "year": "2023",
    "youth1524": 19.5,
    "youth1535": 18.4
  },
  {
    "year": "2024",
    "youth1524": 20.8,
    "youth1535": 19.7
  },
  {
    "year": "2025",
    "youth1524": 19.1,
    "youth1535": 17.9
  }
];

export const fishProductionData = [
  {
    "year": "2010",
    "marine": 3.19331,
    "inland": 0.83127,
    "aquaculture": 0.102
  },
  {
    "year": "2025",
    "marine": 4.43794,
    "inland": 1.54692,
    "aquaculture": 1.24161
  }
];

export const cropProductionData = [
  {
    "year": "2013",
    "maize": 1.8,
    "cassava": 16,
    "yam": 7.1,
    "plantain": 3.7,
    "rice": 0.6
  },
  {
    "year": "2024*",
    "maize": 3.3,
    "cassava": 28.5,
    "yam": 11.4,
    "plantain": 7.2,
    "rice": 1.1
  }
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
    expenditure: "GH¢6.59bn",
    purposes: ["Visiting Friends & Relatives", "Funerals"],
    topAreas: ["Aburi Botanical Garden", "Elmina Castle", "Kwame Nkrumah Memorial Park", "Cape Three Points", "Cape Coast Castle"],
  },
  {
    type: "Outbound",
    visitors: "470,805",
    expenditure: "GH¢3.46bn",
    purposes: ["Visiting Friends & Relatives", "Business & Professional"],
    topAreas: [],
  },
  {
    type: "Inbound",
    visitors: "901,450",
    expenditure: "GH¢15.42bn",
    purposes: ["Visiting Friends & Relatives"],
    topAreas: ["Independence Square and Arts Centre", "Kwame Nkrumah Memorial Park", "Cape Coast Castle", "Elmina Castle", "Kakum National Park"],
  },
];
