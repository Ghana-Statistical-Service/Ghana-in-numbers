// Social Development data from the provided Ghana in Numbers reference pages.
// Keep this file scoped to the supplied indicators only.

export const socialDevelopmentKPIs = [
  {
    label: "Primary NER",
    value: "79.4",
    unit: "%",
    note: "Net enrolment, 2023/24",
    accent: "#F26B2A",
  },
  {
    label: "JHS GER",
    value: "115.5",
    unit: "%",
    note: "Gross enrolment, 2023/24",
    accent: "#0F5D7E",
  },
  {
    label: "Health Insurance",
    value: "88.2",
    unit: "%",
    note: "Coverage, 2025",
    accent: "#5EC5E8",
  },
  {
    label: "Housing Deficit",
    value: "1.81",
    unit: "M",
    note: "Housing units, 2021",
    accent: "#EF4444",
  },
  {
    label: "Electricity Access",
    value: "86.3",
    unit: "%",
    note: "Households, 2021",
    accent: "#F6B800",
  },
];

export const enrolmentRateData = [
  {
    year: "2019/20",
    primaryNet: 80.3,
    jhsNet: 71.4,
    shsNet: 45.8,
    primaryGross: 98.3,
    jhsGross: 111.0,
    shsGross: 83.2,
  },
  {
    year: "2020/21",
    primaryNet: 78.7,
    jhsNet: 89.3,
    shsNet: 44.9,
    primaryGross: 99.3,
    jhsGross: 106.0,
    shsGross: 84.4,
  },
  {
    year: "2021/22",
    primaryNet: 78.99,
    jhsNet: 85.2,
    shsNet: 44.27,
    primaryGross: 107.4,
    jhsGross: 123.4,
    shsGross: 88.0,
  },
  {
    year: "2022/23",
    primaryNet: 79.42,
    jhsNet: 85.22,
    shsNet: 58.76,
    primaryGross: 107.1,
    jhsGross: 122.1,
    shsGross: 88.4,
  },
  {
    year: "2023/24",
    primaryNet: 79.42,
    jhsNet: 85.22,
    shsNet: 58.76,
    primaryGross: 103.6,
    jhsGross: 115.5,
    shsGross: 95.5,
  },
];

export const completionRateData = [
  { year: "2019/20", primary: 107.5, jhs: 77.5 },
  { year: "2020/21", primary: 108.6, jhs: 83.1 },
  { year: "2021/22", primary: 107.0, jhs: 84.3 },
  { year: "2022/23", primary: 101.5, jhs: 94.1 },
  { year: "2023/24", primary: 102.0, jhs: 88.4 },
];

export const pupilTeacherRatioData = [
  { year: "2010/11", kg: 96, primary: 54, jhs: 22 },
  { year: "2011/12", kg: 85, primary: 52, jhs: 20 },
  { year: "2012/13", kg: 99, primary: 48, jhs: 19 },
  { year: "2013/14", kg: 62, primary: 46, jhs: 18 },
  { year: "2014/15", kg: 56, primary: 45, jhs: 18 },
  { year: "2015/16", kg: 52, primary: 43, jhs: 18 },
  { year: "2016/17", kg: 46, primary: 39, jhs: 16 },
  { year: "2017/18", kg: 39, primary: 35, jhs: 16 },
  { year: "2018/19", kg: 37, primary: 33, jhs: 15 },
  { year: "2019/20", kg: 31, primary: 28, jhs: 13 },
  { year: "2020/21", kg: 34, primary: 32, jhs: 16 },
];

export const healthInsuranceCoverageData = [
  { year: "2006", value: 8.5 },
  { year: "2008", value: 16.6 },
  { year: "2010", value: 68.8 },
  { year: "2013", value: 67.6 },
  { year: "2017", value: 77.7 },
  { year: "2021", value: 68.7 },
  { year: "2022", value: 79.7 },
  { year: "2023", value: 85.6 },
  { year: "2024", value: 88.1 },
  { year: "2025", value: 88.2 },
];

export const teenageMotherhoodData = [
  { year: "2008", rural: 15.7, national: 13.3, urban: 10.7 },
  { year: "2011", rural: 17.7, national: 12.3, urban: 7.1 },
  { year: "2014", rural: 16.7, national: 14.2, urban: 11.5 },
  { year: "2017", rural: 18.3, national: 14.3, urban: 10.0 },
  { year: "2022", rural: 17.2, national: 12.8, urban: 9.1 },
];

export const housingDeficitData = [
  { year: "1970", population: 8.6, demand: 1.65, supply: 2.3, deficit: 0.65 },
  { year: "1984", population: 12.3, demand: 2.4, supply: 3.0, deficit: 1.05 },
  { year: "2000", population: 18.9, demand: 3.7, supply: 5.4, deficit: 1.6 },
  { year: "2010", population: 23.3, demand: 8.7, supply: 14.2, deficit: 1.7 },
  { year: "2021", population: 30.83, demand: 11.81, supply: 25.0, deficit: 1.81 },
];

export const electricityAccessData = [
  { year: "2000", value: 43.8 },
  { year: "2010", value: 65.1 },
  { year: "2021", value: 86.3 },
];

export const drinkingWaterData = [
  { year: "2000", value: 60.7 },
  { year: "2010", value: 86.0 },
  { year: "2021", value: 92.0 },
];

export const improvedToiletUseData = [
  { year: "2010", value: 44.8 },
  { year: "2022", value: 69.0 },
];

export const gbvPrevalenceData = [
  { type: "Physical Violence", value2016: 42.4, value2022: 9.8, color: "#F26B2A" },
  { type: "Sexual Violence", value2016: 10.6, value2022: 6.1, color: "#5EC5E8" },
  { type: "Psychological Violence", value2016: 48.0, value2022: 25.5, color: "#8B1E5D" },
];

export const childMarriageData = {
  label: "Child marriage (female)",
  year2010: "2010",
  value2010: 5.2,
  year2021: "2021",
  value2021: 2.1,
};
