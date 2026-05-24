// Environment and Climate Change data from the supplied Ghana in Numbers reference pages.
// Forest reserves table is represented as chart-ready regional series.

export const environmentKPIs = [
  { label: "Highest Forest Reserve", value: "15.2", unit: "%", note: "Ashanti, 2021", color: "#00723F" },
  { label: "Carbon Retention", value: "344.0", unit: "Mt", note: "Grassland total", color: "#C85017" },
  { label: "Peak Rainfall", value: "211.8", unit: "mm", note: "June 2024", color: "#12AEE3" },
  { label: "Peak Temperature", value: "31.0", unit: "°C", note: "March 2024", color: "#CC0000" },
  { label: "Lowest Rainfall", value: "3.8", unit: "mm", note: "December 2024", color: "#64748B" },
];

export const forestReserveYears = ["1990", "2000", "2010", "2012", "2015", "2021"];

export const forestReserveData = [
  { region: "Ahafo", y1990: 6.9, y2000: 6.7, y2010: 6.7, y2012: 5.9, y2015: 3.5, y2021: 3.5 },
  { region: "Ashanti", y1990: 17.1, y2000: 16.6, y2010: 15.0, y2012: 16.0, y2015: 15.2, y2021: 15.2 },
  { region: "Bono", y1990: 7.4, y2000: 6.9, y2010: 6.2, y2012: 5.5, y2015: 5.4, y2021: 5.4 },
  { region: "Bono East", y1990: 7.5, y2000: 8.3, y2010: 10.2, y2012: 9.8, y2015: 6.7, y2021: 6.7 },
  { region: "Central", y1990: 4.4, y2000: 4.3, y2010: 4.2, y2012: 3.7, y2015: 3.6, y2021: 3.6 },
  { region: "Eastern", y1990: 7.2, y2000: 6.5, y2010: 4.2, y2012: 6.1, y2015: 9.5, y2021: 9.5 },
  { region: "Greater Accra", y1990: 0.1, y2000: 0.0, y2010: 0.1, y2012: 0.2, y2015: 0.4, y2021: 0.4 },
  { region: "Northern", y1990: 1.1, y2000: 1.4, y2010: 1.8, y2012: 2.4, y2015: 6.9, y2021: 6.9 },
  { region: "North East", y1990: 0.2, y2000: 0.3, y2010: 0.2, y2012: 0.7, y2015: 2.4, y2021: 2.3 },
  { region: "Oti", y1990: 3.0, y2000: 2.8, y2010: 3.1, y2012: 3.5, y2015: 7.0, y2021: 7.0 },
  { region: "Savannah", y1990: 6.5, y2000: 6.9, y2010: 10.3, y2012: 9.7, y2015: 14.9, y2021: 14.9 },
  { region: "Upper East", y1990: 0.8, y2000: 1.4, y2010: 1.0, y2012: 2.6, y2015: 2.1, y2021: 2.1 },
  { region: "Upper West", y1990: 0.9, y2000: 1.3, y2010: 1.3, y2012: 3.0, y2015: 4.3, y2021: 4.3 },
  { region: "Volta", y1990: 0.3, y2000: 0.4, y2010: 0.4, y2012: 0.5, y2015: 3.3, y2021: 3.3 },
  { region: "Western", y1990: 17.0, y2000: 16.8, y2010: 16.5, y2012: 14.3, y2015: 8.3, y2021: 8.4 },
  { region: "Western North", y1990: 19.6, y2000: 19.2, y2010: 18.7, y2012: 15.9, y2015: 6.5, y2021: 6.5 },
];

export const forestReserveTop2021 = forestReserveData
  .map((item) => ({ region: item.region, value: item.y2021, change: item.y2021 - item.y1990 }))
  .sort((a, b) => b.value - a.value)
  .slice(0, 8);

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

export const monthlyRainfall2024 = [
  { month: "Jan", value: 16.8, historic: 18 },
  { month: "Feb", value: 20.8, historic: 22 },
  { month: "Mar", value: 77.1, historic: 72 },
  { month: "Apr", value: 117.3, historic: 110 },
  { month: "May", value: 167.1, historic: 158 },
  { month: "Jun", value: 211.8, historic: 185 },
  { month: "Jul", value: 92.0, historic: 125 },
  { month: "Aug", value: 69.5, historic: 105 },
  { month: "Sep", value: 115.4, historic: 140 },
  { month: "Oct", value: 197.7, historic: 175 },
  { month: "Nov", value: 30.7, historic: 55 },
  { month: "Dec", value: 3.8, historic: 18 },
];

export const monthlyTemperature2024 = [
  { month: "Jan", value: 29.1, historic: 28.2 },
  { month: "Feb", value: 30.4, historic: 29.2 },
  { month: "Mar", value: 31.0, historic: 29.7 },
  { month: "Apr", value: 30.5, historic: 29.6 },
  { month: "May", value: 29.8, historic: 29.1 },
  { month: "Jun", value: 28.0, historic: 27.9 },
  { month: "Jul", value: 26.8, historic: 26.7 },
  { month: "Aug", value: 26.2, historic: 26.1 },
  { month: "Sep", value: 27.1, historic: 26.8 },
  { month: "Oct", value: 27.7, historic: 27.4 },
  { month: "Nov", value: 28.6, historic: 27.9 },
  { month: "Dec", value: 28.6, historic: 27.6 },
];
