// Governance data from the supplied Ghana in Numbers reference pages.
// Keep this file scoped to the provided indicators only.

export const governanceKPIs = [
  {
    label: "Women in Parliament",
    value: "14.9",
    unit: "%",
    note: "2025, 9th Parliament",
    color: "#00723F",
  },
  {
    label: "Women High Court Judges",
    value: "48.6",
    unit: "%",
    note: "2025",
    color: "#12AEE3",
  },
  {
    label: "Gifts to Public Officials",
    value: "14.3",
    unit: "%",
    note: "2025",
    color: "#082B73",
  },
  {
    label: "Right to Vote Knowledge",
    value: "98.1",
    unit: "%",
    note: "Public knowledge",
    color: "#285F18",
  },
  {
    label: "No Say",
    value: "29.2",
    unit: "%",
    note: "Decision-making, 2025",
    color: "#C85017",
  },
];

export const womenParliamentData = [
  { year: "1993", parliament: "1st", value: 8.5 },
  { year: "1997", parliament: "2nd", value: 9.5 },
  { year: "2001", parliament: "3rd", value: 9.5 },
  { year: "2005", parliament: "4th", value: 10.9 },
  { year: "2009", parliament: "5th", value: 8.7 },
  { year: "2013", parliament: "6th", value: 11.3 },
  { year: "2017", parliament: "7th", value: 13.8 },
  { year: "2021", parliament: "8th", value: 14.5 },
  { year: "2025", parliament: "9th", value: 14.9 },
];

export const womenJudgesData = [
  { year: "2008", supreme: 20.0, appeal: 12.5, high: 20.0 },
  { year: "2009", supreme: 30.8, appeal: 15.4, high: 19.0 },
  { year: "2010", supreme: 30.8, appeal: 17.4, high: 15.2 },
  { year: "2011", supreme: 30.8, appeal: 17.4, high: 15.4 },
  { year: "2013", supreme: 36.4, appeal: 18.2, high: 20.2 },
  { year: "2014", supreme: 33.3, appeal: 37.5, high: 23.5 },
  { year: "2015", supreme: 23.1, appeal: 37.0, high: 27.6 },
  { year: "2016", supreme: 23.1, appeal: 37.0, high: 27.6 },
  { year: "2017", supreme: 25.0, appeal: 37.0, high: 29.2 },
  { year: "2018", supreme: 21.4, appeal: 37.9, high: 34.4 },
  { year: "2019", supreme: 15.4, appeal: 44.0, high: 38.8 },
  { year: "2020", supreme: 29.4, appeal: 42.4, high: 44.1 },
  { year: "2021", supreme: 33.3, appeal: 39.4, high: 45.3 },
  { year: "2022", supreme: 38.5, appeal: 48.4, high: 45.0 },
  { year: "2023", supreme: 41.7, appeal: 41.0, high: 44.8 },
  { year: "2024", supreme: 28.6, appeal: 40.6, high: 44.7 },
  { year: "2025", supreme: 25.0, appeal: 40.3, high: 48.6 },
];

export const giftsToOfficialsData = [
  { year: "2013", value: 56.2 },
  { year: "2017", value: 46.8 },
  { year: "2021", value: 26.7 },
  { year: "2024", value: 18.4 },
  { year: "2025", value: 14.3 },
];

export const rightToVoteKnowledge = {
  value: 98.1,
  label: "Knowledge of right to vote",
};

export const noSayData = [
  { year: "2013", value: 59.9 },
  { year: "2017", value: 56.2 },
  { year: "2024", value: 45.2 },
  { year: "2025*", value: 29.2 },
];

export const noInfluenceData = [
  { year: "2024", value: 46.0 },
  { year: "2025*", value: 32.5 },
];
