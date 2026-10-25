// Environment and Climate Change data from the supplied Ghana in Numbers reference pages.
// Forest reserves table is represented as chart-ready regional series.

export const environmentKPIs = [
  {
    "label": "Forest Reserve Area",
    "value": "24,133.53",
    "unit": "km²",
    "note": "Reported regions, Dec 2025",
    "color": "#00723F"
  },
  {
    "label": "Grassland Carbon",
    "value": "344.0",
    "unit": "Mt C",
    "note": "Stored carbon, 2021",
    "color": "#C85017"
  },
  {
    "label": "Peak Rainfall",
    "value": "216.7",
    "unit": "mm",
    "note": "June 2025",
    "color": "#12AEE3"
  },
  {
    "label": "Peak Temperature",
    "value": "30.4",
    "unit": "°C",
    "note": "March 2025",
    "color": "#CC0000"
  },
  {
    "label": "Lowest Rainfall",
    "value": "11.1",
    "unit": "mm",
    "note": "January 2025",
    "color": "#64748B"
  }
];

// Figure 7.1, December 2025. Missing regions are not zero.
// Exact values from prose; remaining regions rounded as labelled in the chart.
export const forestReserveArea2025 = [
  { region: "Western", area: 7131.36 },
  { region: "Ashanti", area: 3880.29 },
  { region: "Northern", area: 3649.85 },
  { region: "Eastern", area: 1787.55 },
  { region: "Upper East", area: 1558.07 },
  { region: "Bono", area: 1492.77 },
  { region: "Central", area: 1247.34 },
  { region: "Upper West", area: 1117.57 },
  { region: "Ahafo", area: 997 },
  { region: "Volta", area: 761 },
  { region: "Bono East", area: 473 },
  { region: "Greater Accra", area: 37.38 },
];
export const forestReserveTotal2025 = 24133.53;

export const carbonRetentionData = [
  { landCover: "Mangrove", nonSoil: 0.9, soil: 0.2 },
  { landCover: "Settlement", nonSoil: 0.5, soil: 3.5 },
  { landCover: "Mono Cocoa", nonSoil: 14.4, soil: 34.2 },
  { landCover: "Shaded Cocoa", nonSoil: 33.5, soil: 15.3 },
  { landCover: "Other Tree Crops", nonSoil: 77.9, soil: 0.0 },
  { landCover: "Closed Forest", nonSoil: 141.1, soil: 31.2 },
  { landCover: "Cropland", nonSoil: 83.8, soil: 130.5 },
  { landCover: "Open Forest", nonSoil: 113.2, soil: 123.6 },
  { landCover: "Grassland", nonSoil: 141.2, soil: 202.8 },
  { landCover: "Water", nonSoil: 0.0, soil: 0.0 },
  { landCover: "Bare", nonSoil: 0.0, soil: 0.0 },
];

export const monthlyRainfall2025 = [
  {
    "month": "Jan",
    "value": 11.1
  },
  {
    "month": "Feb",
    "value": 37.9
  },
  {
    "month": "Mar",
    "value": 69.9
  },
  {
    "month": "Apr",
    "value": 95.9
  },
  {
    "month": "May",
    "value": 163.5
  },
  {
    "month": "Jun",
    "value": 216.7
  },
  {
    "month": "Jul",
    "value": 67.2
  },
  {
    "month": "Aug",
    "value": 71.9
  },
  {
    "month": "Sep",
    "value": 148.9
  },
  {
    "month": "Oct",
    "value": 185.1
  },
  {
    "month": "Nov",
    "value": 66.6
  },
  {
    "month": "Dec",
    "value": 57.3
  }
];

export const monthlyTemperature2025 = [
  {
    "month": "Jan",
    "value": 29.3
  },
  {
    "month": "Feb",
    "value": 30
  },
  {
    "month": "Mar",
    "value": 30.4
  },
  {
    "month": "Apr",
    "value": 29.8
  },
  {
    "month": "May",
    "value": 28.8
  },
  {
    "month": "Jun",
    "value": 27.6
  },
  {
    "month": "Jul",
    "value": 26
  },
  {
    "month": "Aug",
    "value": 25.4
  },
  {
    "month": "Sep",
    "value": 26.6
  },
  {
    "month": "Oct",
    "value": 27.5
  },
  {
    "month": "Nov",
    "value": 28.4
  },
  {
    "month": "Dec",
    "value": 28.5
  }
];
