// Final edition, Chapter 9 pp. 107–109 (read from Figure 3.2): the child share is printed for 2000 and 2025; the
// youth shares are printed as approximate ("about") values for 2010, 2021 and 2025. The draft's 2025 values
// (children 33.2%, youth 15–35 about 30%, 15–24 16%) and its 2000 youth share (34.6%) were revised or withdrawn.
export const populationShareData = [
  { year: "2000", children: 41.8, youth1524: null, youth1535: null },
  { year: "2010", children: null, youth1524: 20, youth1535: 35 },
  { year: "2021", children: null, youth1524: 20, youth1535: 36 },
  { year: "2025", children: 35.0, youth1524: 20, youth1535: 35 },
];

export const unemploymentByRegion = [
  { region: "Greater Accra", q2_1524: 45.4, q2_1535: 30.7, q3_1524: 49.3, q3_1535: 33.1 },
  { region: "Western",       q2_1524: 42.5, q2_1535: 26.1, q3_1524: 46.8, q3_1535: 28.7 },
  { region: "Ashanti",       q2_1524: 37.3, q2_1535: 25.6, q3_1524: 41.2, q3_1535: 28.9 },
  { region: "Central",       q2_1524: 41.0, q2_1535: 27.6, q3_1524: 48.9, q3_1535: 33.7 },
  { region: "Volta",         q2_1524: 33.2, q2_1535: 20.9, q3_1524: 34.1, q3_1535: 22.3 },
  { region: "Bono",          q2_1524: 29.0, q2_1535: 19.1, q3_1524: 32.1, q3_1535: 18.7 },
  { region: "Ahafo",         q2_1524: 25.7, q2_1535: 17.1, q3_1524: 33.5, q3_1535: 20.6 },
  { region: "Eastern",       q2_1524: 23.5, q2_1535: 16.2, q3_1524: 25.2, q3_1535: 17.5 },
  { region: "Western North", q2_1524: 24.1, q2_1535: 15.0, q3_1524: 27.2, q3_1535: 18.0 },
  { region: "Savannah",      q2_1524: 15.7, q2_1535: 11.9, q3_1524: 21.0, q3_1535: 15.6 },
  { region: "North East",    q2_1524: 17.6, q2_1535: 10.3, q3_1524: 24.6, q3_1535: 15.9 },
  { region: "Northern",      q2_1524: 15.2, q2_1535: 10.0, q3_1524: 17.2, q3_1535: 10.6 },
  { region: "Upper East",    q2_1524: 18.4, q2_1535:  9.9, q3_1524: 22.7, q3_1535: 12.6 },
  { region: "Oti",           q2_1524: 12.5, q2_1535:  9.2, q3_1524: 12.0, q3_1535:  8.2 },
  { region: "Upper West",    q2_1524: 13.3, q2_1535:  9.0, q3_1524: 20.8, q3_1535: 11.5 },
  { region: "Bono East",     q2_1524:  7.6, q2_1535:  6.6, q3_1524: 15.1, q3_1535: 10.1 },
];

export const nationalUnemployment = {
  q2_1524: 30.5,
  q2_1535: 20.6,
  q3_1524: 34.4,
  q3_1535: 23.2,
};

export const agricultureData = [
  { group: "15–24 Male",   y2010: 478_562,   y2021: 243_364 },
  { group: "15–24 Female", y2010: 387_293,   y2021: 138_112 },
  { group: "15–35 Male",   y2010: 1_069_672, y2021: 764_212 },
  { group: "15–35 Female", y2010: 955_879,   y2021: 458_673 },
];

export const agricultureTotals = {
  total1524_2010: 865_855,
  total1524_2021: 381_476,
  total1535_2010: 2_025_551,
  total1535_2021: 1_222_885,
};

export type NeetDim = "regional" | "urban" | "rural" | "male" | "female";

export const neetRegionalData: Record<NeetDim, Array<{ region: string; r1535: number; r1524: number }>> = {
  "regional": [
    {
      "region": "National",
      "r1535": 19.5,
      "r1524": 21.5
    },
    {
      "region": "Western",
      "r1535": 23.7,
      "r1524": 29.3
    },
    {
      "region": "Central",
      "r1535": 25.3,
      "r1524": 26.6
    },
    {
      "region": "Ashanti",
      "r1535": 23.2,
      "r1524": 24.8
    },
    {
      "region": "Volta",
      "r1535": 20.4,
      "r1524": 23.3
    },
    {
      "region": "Greater Accra",
      "r1535": 22.9,
      "r1524": 22.9
    },
    {
      "region": "Bono",
      "r1535": 18.5,
      "r1524": 22.6
    },
    {
      "region": "Ahafo",
      "r1535": 16.3,
      "r1524": 19.6
    },
    {
      "region": "North East",
      "r1535": 16.6,
      "r1524": 19.4
    },
    {
      "region": "Upper West",
      "r1535": 14.2,
      "r1524": 17.9
    },
    {
      "region": "Eastern",
      "r1535": 15.4,
      "r1524": 17.8
    },
    {
      "region": "Upper East",
      "r1535": 16.5,
      "r1524": 17.1
    },
    {
      "region": "Western North",
      "r1535": 14.6,
      "r1524": 16.9
    },
    {
      "region": "Savannah",
      "r1535": 14.3,
      "r1524": 15.9
    },
    {
      "region": "Northern",
      "r1535": 12.3,
      "r1524": 14.6
    },
    {
      "region": "Bono East",
      "r1535": 10.9,
      "r1524": 13.3
    },
    {
      "region": "Oti",
      "r1535": 9.5,
      "r1524": 11.1
    }
  ],
  "urban": [
    {
      "region": "National",
      "r1535": 20.6,
      "r1524": 21.8
    },
    {
      "region": "Western",
      "r1535": 23.8,
      "r1524": 28.4
    },
    {
      "region": "Central",
      "r1535": 24.8,
      "r1524": 25.5
    },
    {
      "region": "Ashanti",
      "r1535": 22.8,
      "r1524": 24
    },
    {
      "region": "Volta",
      "r1535": 18.1,
      "r1524": 18.9
    },
    {
      "region": "Greater Accra",
      "r1535": 23,
      "r1524": 23
    },
    {
      "region": "Bono",
      "r1535": 17.4,
      "r1524": 21.6
    },
    {
      "region": "Ahafo",
      "r1535": 17.2,
      "r1524": 19
    },
    {
      "region": "North East",
      "r1535": 17,
      "r1524": 16.9
    },
    {
      "region": "Upper West",
      "r1535": 16.4,
      "r1524": 23.7
    },
    {
      "region": "Eastern",
      "r1535": 15.7,
      "r1524": 16.7
    },
    {
      "region": "Upper East",
      "r1535": 12.9,
      "r1524": 12.5
    },
    {
      "region": "Western North",
      "r1535": 17.4,
      "r1524": 19.9
    },
    {
      "region": "Savannah",
      "r1535": 16.8,
      "r1524": 20.1
    },
    {
      "region": "Northern",
      "r1535": 14.5,
      "r1524": 15.5
    },
    {
      "region": "Bono East",
      "r1535": 13.4,
      "r1524": 16.2
    },
    {
      "region": "Oti",
      "r1535": 12.4,
      "r1524": 16.1
    }
  ],
  "rural": [
    {
      "region": "National",
      "r1535": 18,
      "r1524": 21.1
    },
    {
      "region": "Western",
      "r1535": 23.7,
      "r1524": 30.3
    },
    {
      "region": "Central",
      "r1535": 25.9,
      "r1524": 28.2
    },
    {
      "region": "Ashanti",
      "r1535": 23.9,
      "r1524": 26.1
    },
    {
      "region": "Volta",
      "r1535": 22.3,
      "r1524": 27
    },
    {
      "region": "Greater Accra",
      "r1535": 22.3,
      "r1524": 22.2
    },
    {
      "region": "Bono",
      "r1535": 20,
      "r1524": 24
    },
    {
      "region": "Ahafo",
      "r1535": 15.5,
      "r1524": 20.1
    },
    {
      "region": "North East",
      "r1535": 16.4,
      "r1524": 20.7
    },
    {
      "region": "Upper West",
      "r1535": 13.6,
      "r1524": 16.3
    },
    {
      "region": "Eastern",
      "r1535": 15.1,
      "r1524": 19.1
    },
    {
      "region": "Upper East",
      "r1535": 17.8,
      "r1524": 18.7
    },
    {
      "region": "Western North",
      "r1535": 13.4,
      "r1524": 15.6
    },
    {
      "region": "Savannah",
      "r1535": 13.2,
      "r1524": 13.9
    },
    {
      "region": "Northern",
      "r1535": 10.3,
      "r1524": 13.7
    },
    {
      "region": "Bono East",
      "r1535": 8.1,
      "r1524": 9.8
    },
    {
      "region": "Oti",
      "r1535": 8.2,
      "r1524": 8.6
    }
  ],
  "male": [
    {
      "region": "National",
      "r1535": 16.5,
      "r1524": 19.2
    },
    {
      "region": "Western",
      "r1535": 20.3,
      "r1524": 25.2
    },
    {
      "region": "Central",
      "r1535": 20,
      "r1524": 22.4
    },
    {
      "region": "Ashanti",
      "r1535": 20,
      "r1524": 22.9
    },
    {
      "region": "Volta",
      "r1535": 18.7,
      "r1524": 20.7
    },
    {
      "region": "Greater Accra",
      "r1535": 20,
      "r1524": 21.8
    },
    {
      "region": "Bono",
      "r1535": 16.3,
      "r1524": 19.6
    },
    {
      "region": "Ahafo",
      "r1535": 12,
      "r1524": 15.9
    },
    {
      "region": "North East",
      "r1535": 14.9,
      "r1524": 20.1
    },
    {
      "region": "Upper West",
      "r1535": 12.6,
      "r1524": 16.5
    },
    {
      "region": "Eastern",
      "r1535": 15.4,
      "r1524": 17
    },
    {
      "region": "Upper East",
      "r1535": 14.3,
      "r1524": 15.8
    },
    {
      "region": "Western North",
      "r1535": 10.6,
      "r1524": 12.3
    },
    {
      "region": "Savannah",
      "r1535": 10.5,
      "r1524": 13.5
    },
    {
      "region": "Northern",
      "r1535": 8.4,
      "r1524": 10.7
    },
    {
      "region": "Bono East",
      "r1535": 9.3,
      "r1524": 12.3
    },
    {
      "region": "Oti",
      "r1535": 7.6,
      "r1524": 9.5
    }
  ],
  "female": [
    {
      "region": "National",
      "r1535": 21.9,
      "r1524": 23.7
    },
    {
      "region": "Western",
      "r1535": 26.4,
      "r1524": 33.2
    },
    {
      "region": "Central",
      "r1535": 29.3,
      "r1524": 30.7
    },
    {
      "region": "Ashanti",
      "r1535": 25.7,
      "r1524": 26.5
    },
    {
      "region": "Volta",
      "r1535": 21.9,
      "r1524": 26.2
    },
    {
      "region": "Greater Accra",
      "r1535": 25.3,
      "r1524": 23.9
    },
    {
      "region": "Bono",
      "r1535": 19.9,
      "r1524": 24.8
    },
    {
      "region": "Ahafo",
      "r1535": 19.6,
      "r1524": 22.6
    },
    {
      "region": "North East",
      "r1535": 18.5,
      "r1524": 18.7
    },
    {
      "region": "Upper West",
      "r1535": 15.6,
      "r1524": 19.2
    },
    {
      "region": "Eastern",
      "r1535": 15.5,
      "r1524": 18.6
    },
    {
      "region": "Upper East",
      "r1535": 18.3,
      "r1524": 18.3
    },
    {
      "region": "Western North",
      "r1535": 18.2,
      "r1524": 21.5
    },
    {
      "region": "Savannah",
      "r1535": 17.8,
      "r1524": 18.6
    },
    {
      "region": "Northern",
      "r1535": 15.8,
      "r1524": 18.8
    },
    {
      "region": "Bono East",
      "r1535": 12.3,
      "r1524": 14.3
    },
    {
      "region": "Oti",
      "r1535": 11.2,
      "r1524": 12.6
    }
  ]
};

export const skillsAlignment = {
  wellMatched:      65,
  overqualified:     8,
  underqualified:   15,
  educationAligned: 58,
  informalShare:    70,
};

export const neetData = [
  { group: "National",  rate1535: 19.5, rate1524: 21.5 },
  { group: "Urban",     rate1535: 20.6, rate1524: 21.8 },
  { group: "Rural",     rate1535: 18.0, rate1524: 21.1 },
  { group: "Male",      rate1535: 16.5, rate1524: 19.2 },
  { group: "Female",    rate1535: 21.9, rate1524: 23.7 },
];
