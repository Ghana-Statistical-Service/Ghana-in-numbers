// Social Development data from the provided Ghana in Numbers reference pages.
// Keep this file scoped to the supplied indicators only.

export const socialDevelopmentKPIs = [
  {
    label: "Primary NER",
    value: "83.2",
    unit: "%",
    note: "Net enrolment, 2023/24",
    accent: "#F26B2A",
  },
  {
    label: "JHS GER",
    value: "95.5",
    unit: "%",
    note: "Gross enrolment, 2023/24",
    accent: "#0F5D7E",
  },
  {
    label: "Health Insurance",
    value: "66.2",
    unit: "%",
    note: "Active membership, 2025",
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
    "year": "2019/20",
    "kgNet": 71.4,
    "primaryNet": 80.3,
    "jhsNet": 45.8,
    "kgGross": 111,
    "primaryGross": 98.3,
    "jhsGross": 83.2
  },
  {
    "year": "2020/21",
    "kgNet": 89.3,
    "primaryNet": 78.9,
    "jhsNet": 44.9,
    "kgGross": 106,
    "primaryGross": 99.3,
    "jhsGross": 84.6
  },
  {
    "year": "2021/22",
    "kgNet": 85.2,
    "primaryNet": 79,
    "jhsNet": 44.3,
    "kgGross": 123.4,
    "primaryGross": 107.4,
    "jhsGross": 88
  },
  {
    "year": "2022/23",
    "kgNet": 85.2,
    "primaryNet": 79.4,
    "jhsNet": 58.8,
    "kgGross": 122.1,
    "primaryGross": 107.1,
    "jhsGross": 88.4
  },
  {
    "year": "2023/24",
    "kgNet": 78,
    "primaryNet": 83.2,
    "jhsNet": 59.3,
    "kgGross": 115.5,
    "primaryGross": 103.6,
    "jhsGross": 95.5
  }
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
  {
    "year": "2010",
    "value": 30
  },
  {
    "year": "2011",
    "value": 43.1
  },
  {
    "year": "2012",
    "value": 48
  },
  {
    "year": "2013",
    "value": 52.3
  },
  {
    "year": "2014",
    "value": 55.8
  },
  {
    "year": "2015",
    "value": 58.8
  },
  {
    "year": "2016",
    "value": 55.4
  },
  {
    "year": "2017",
    "value": 50.4
  },
  {
    "year": "2018",
    "value": 48.3
  },
  {
    "year": "2019",
    "value": 52
  },
  {
    "year": "2020",
    "value": 52.7
  },
  {
    "year": "2021",
    "value": 54.4
  },
  {
    "year": "2022",
    "value": 54.4
  },
  {
    "year": "2023",
    "value": 55.3
  },
  {
    "year": "2024",
    "value": 55.9
  },
  {
    "year": "2025",
    "value": 66.2
  }
];

export const teenageMotherhoodData = [
  { year: "2008", rural: 15.7, national: 13.3, urban: 10.7 },
  { year: "2011", rural: 17.7, national: 12.3, urban: 7.1 },
  { year: "2014", rural: 16.7, national: 14.2, urban: 11.5 },
  { year: "2017", rural: 18.3, national: 14.3, urban: 10.0 },
  { year: "2022", rural: 17.2, national: 12.8, urban: 9.1 },
];

export const housingDeficitData = [
  {
    "year": "2010",
    "deficit": 2.8
  },
  {
    "year": "2021",
    "deficit": 1.81
  }
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
