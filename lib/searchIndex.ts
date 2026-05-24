import { businessEconomyKPIs } from "@/data/businessEconomyData";
import { populationKPIs } from "@/data/populationData";
import { socialDevelopmentKPIs } from "@/data/socialDevelopmentData";
import { governanceKPIs } from "@/data/governanceData";
import { environmentKPIs } from "@/data/environmentData";

export type SearchItem = {
  id: string;
  title: string;
  value?: string;
  category: string;
  href: string;
  keywords?: string[];
};

export const CATEGORY_COLORS: Record<string, string> = {
  "Business & Economy": "#17B8A6",
  "Population & Society": "#382873",
  "Social Development": "#DB2988",
  "Governance": "#F59E0B",
  "Environment": "#22C55E",
  "Pages": "#6B7280",
};

const pages: SearchItem[] = [
  {
    id: "page-home",
    title: "Overview Dashboard",
    category: "Pages",
    href: "/",
    keywords: ["home", "overview", "summary", "dashboard", "ghana"],
  },
  {
    id: "page-business",
    title: "Business & Economy",
    category: "Pages",
    href: "/business-and-economy",
    keywords: ["gdp", "economy", "trade", "inflation", "sector", "growth"],
  },
  {
    id: "page-population",
    title: "Population & Society",
    category: "Pages",
    href: "/population-and-society",
    keywords: ["population", "demographics", "census", "urban", "rural", "age"],
  },
  {
    id: "page-social",
    title: "Social Development",
    category: "Pages",
    href: "/social-development",
    keywords: ["education", "health", "housing", "electricity", "school", "enrolment"],
  },
  {
    id: "page-governance",
    title: "Governance",
    category: "Pages",
    href: "/governance",
    keywords: ["parliament", "women", "vote", "accountability", "democracy"],
  },
  {
    id: "page-environment",
    title: "Environment & Climate",
    category: "Pages",
    href: "/environment-and-climate-change",
    keywords: ["forest", "carbon", "rainfall", "temperature", "climate", "environment"],
  },
];

const businessItems: SearchItem[] = businessEconomyKPIs.map((kpi, i) => ({
  id: `biz-${i}`,
  title: kpi.label,
  value: `${kpi.value} ${kpi.unit}`,
  category: "Business & Economy",
  href: "/business-and-economy",
  keywords: [kpi.note, kpi.label.toLowerCase()],
}));

const populationItems: SearchItem[] = populationKPIs.map((kpi, i) => ({
  id: `pop-${i}`,
  title: kpi.label,
  value: `${kpi.value} ${kpi.unit}`,
  category: "Population & Society",
  href: "/population-and-society",
  keywords: [kpi.note, kpi.label.toLowerCase()],
}));

const socialItems: SearchItem[] = socialDevelopmentKPIs.map((kpi, i) => ({
  id: `soc-${i}`,
  title: kpi.label,
  value: `${kpi.value} ${kpi.unit}`,
  category: "Social Development",
  href: "/social-development",
  keywords: [kpi.note, kpi.label.toLowerCase()],
}));

const governanceItems: SearchItem[] = governanceKPIs.map((kpi, i) => ({
  id: `gov-${i}`,
  title: kpi.label,
  value: `${kpi.value} ${kpi.unit}`,
  category: "Governance",
  href: "/governance",
  keywords: [kpi.note, kpi.label.toLowerCase()],
}));

const environmentItems: SearchItem[] = environmentKPIs.map((kpi, i) => ({
  id: `env-${i}`,
  title: kpi.label,
  value: `${kpi.value} ${kpi.unit}`,
  category: "Environment",
  href: "/environment-and-climate-change",
  keywords: [kpi.note, kpi.label.toLowerCase()],
}));

export const searchIndex: SearchItem[] = [
  ...pages,
  ...businessItems,
  ...populationItems,
  ...socialItems,
  ...governanceItems,
  ...environmentItems,
];

export function querySearch(q: string): SearchItem[] {
  const term = q.trim().toLowerCase();
  if (!term) return [];
  return searchIndex.filter((item) => {
    const haystack = [
      item.title,
      item.category,
      item.value ?? "",
      ...(item.keywords ?? []),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(term);
  });
}
