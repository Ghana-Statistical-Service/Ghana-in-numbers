import { businessEconomyKPIs } from "@/data/businessEconomyData";
import { populationKPIs } from "@/data/populationData";
import { socialDevelopmentKPIs } from "@/data/socialDevelopmentData";
import { governanceKPIs } from "@/data/governanceData";
import { environmentKPIs } from "@/data/environmentData";
import { allNavItems } from "@/lib/navigation";

export type SearchItem = {
  id: string;
  title: string;
  value?: string;
  period?: string;
  category: string;
  kind: "Page" | "Section" | "Indicator";
  href: string;
  keywords?: string[];
};

const topicOf: Record<string, string> = Object.fromEntries(allNavItems.map(item => [item.href, item.label]));

const pages: SearchItem[] = allNavItems.map(item => ({
  id: `page-${item.href}`, title: item.label, category: "Pages", kind: "Page", href: item.href, keywords: [item.description],
}));

// Section anchors match the `id` attributes rendered by each page's <Section>.
const sections: [string, string, string, string[]][] = [
  ["/population-and-society", "population-size", "Population size and growth", ["census", "projection", "doubling time", "intercensal"]],
  ["/population-and-society", "composition", "Age and sex composition", ["pyramid", "male", "female", "age group"]],
  ["/population-and-society", "urbanisation", "Urbanisation", ["urban", "rural", "towns", "cities"]],
  ["/population-and-society", "regional", "Regional population, density and fertility map", ["region", "density", "regional share", "fertility by region", "map"]],
  ["/population-and-society", "fertility-households", "Fertility and household size", ["total fertility rate", "TFR", "household"]],
  ["/population-and-society", "life-expectancy", "Life expectancy", ["survival", "longevity", "life table"]],
  ["/population-and-society", "migration", "Migration and population distribution", ["net migration", "emigration", "immigration", "internal migration", "in-migrants", "out-migrants", "Ghanaians abroad", "reasons for emigrating", "emigrant destinations"]],
  ["/social-development", "learning", "Learning and opportunity", ["enrolment", "GER", "NER", "completion", "teachers", "school"]],
  ["/social-development", "health", "Health and well-being", ["NHIS", "health insurance", "teenage motherhood"]],
  ["/social-development", "living-conditions", "Living conditions", ["housing deficit", "electricity", "water", "toilet", "sanitation"]],
  ["/social-development", "protection", "Inclusion and protection", ["gender-based violence", "child marriage"]],
  ["/business-and-economy", "output", "Size and structure of the economy", ["GDP", "nominal", "real", "per capita", "US dollars", "expenditure", "sector"]],
  ["/business-and-economy", "prices", "Prices and inflation", ["CPI", "inflation", "food", "local", "imported", "PPI", "building cost", "PBCI", "industrial production", "IIP"]],
  ["/business-and-economy", "labour", "Labour market", ["unemployment", "participation", "employment-to-population", "NEET"]],
  ["/business-and-economy", "enterprises", "Enterprises", ["IBES", "businesses", "establishments", "formal", "digital finance", "open-space", "mobile traders"]],
  ["/business-and-economy", "tourism", "Tourism", ["domestic", "inbound", "outbound", "visitors", "expenditure"]],
  ["/business-and-economy", "fiscal", "Government fiscal operations", ["revenue", "expenditure", "deficit", "primary balance", "arrears", "interest", "tax"]],
  ["/business-and-economy", "finance", "Monetary and financial sector", ["M2+", "credit", "interest rates", "policy rate", "treasury bill", "reserves", "NPL", "capital adequacy"]],
  ["/business-and-economy", "trade", "Ghana in the global market", ["exports", "imports", "trade balance", "gold", "cocoa", "partners"]],
  ["/business-and-economy", "informal-trade", "Informal cross-border trade", ["ICBT", "Togo", "Burkina Faso", "Côte d’Ivoire", "border"]],
  ["/governance", "women-leadership", "Women in leadership", ["parliament", "judges", "courts"]],
  ["/governance", "accountability", "Accountability and public trust", ["gifts", "bribery", "requests", "no say", "no influence"]],
  ["/governance", "voting", "Voting", ["right to vote", "never voted", "district elections"]],
  ["/environment-and-climate-change", "forests", "Forest reserves", ["forest", "Forestry Commission"]],
  ["/environment-and-climate-change", "carbon", "Carbon retention", ["carbon stock", "soil carbon", "land cover"]],
  ["/environment-and-climate-change", "climate", "Rainfall and temperature", ["rainfall", "temperature", "GMet", "climate"]],
  ["/progress-on-sdgs", "poverty-food", "Poverty and food insecurity", ["multidimensional poverty", "MPI", "FIES", "hunger", "SDG 1", "SDG 2"]],
  ["/progress-on-sdgs", "mortality", "Maternal and child mortality", ["maternal mortality", "under-five", "infant", "neonatal", "SDG 3"]],
  ["/progress-on-sdgs", "cities", "Sustainable cities and coasts", ["slums", "informal settlements", "plastic debris", "SDG 11", "SDG 14"]],
  ["/progress-on-sdgs", "institutions", "Institutions", ["bribery incidence", "SDG 16"]],
  ["/youth-bulge", "bulge", "The youth bulge", ["youth share", "15–24", "15–35", "demographic dividend"]],
  ["/youth-bulge", "unemployment", "Youth unemployment by region", ["Q2", "Q3", "regional unemployment"]],
  ["/youth-bulge", "neet", "Youth NEET", ["not in employment", "education", "training"]],
  ["/youth-bulge", "skills", "Skills and informal work", ["skills match", "overqualified", "informal"]],
  ["/agriculture-forestry-fishing", "spending", "Public spending on agriculture", ["Agriculture Orientation Index", "AOI", "SDG 2.a.1"]],
  ["/agriculture-forestry-fishing", "crops", "Crop production", ["cassava", "yam", "plantain", "maize", "rice", "cocoyam"]],
  ["/agriculture-forestry-fishing", "livestock", "Livestock", ["poultry", "goats", "sheep", "cattle", "pigs"]],
  ["/agriculture-forestry-fishing", "fish", "Fisheries and aquaculture", ["fish", "tilapia", "catfish", "marine", "inland"]],
  ["/agriculture-forestry-fishing", "youth-agriculture", "Young people in agriculture", ["youth employment", "census"]],
  ["/data-story", "water", "Clean water was 59 minutes away", ["Mangoase", "Ada West", "water"]],
  ["/data-story", "hackathon", "StatsBank Hackathon", ["students", "data users"]],
  ["/data-story", "disability", "Citizen data and disability policy", ["DACF", "persons with disabilities"]],
  ["/data-story", "afigya", "Afigya Kwabre North", ["district MPI", "NHIS"]],
];

const sectionItems: SearchItem[] = sections.map(([href, anchor, title, keywords]) => ({
  id: `section-${anchor}-${href}`, title, category: topicOf[href], kind: "Section", href: `${href}#${anchor}`, keywords,
}));

const indicatorItems = (href: string, cards: { label: string; value: string; unit: string; note: string }[]): SearchItem[] =>
  cards.map((card, index) => ({
    id: `kpi-${href}-${index}`, title: card.label, value: `${card.value}${card.unit === "%" ? "%" : card.unit ? ` ${card.unit}` : ""}`,
    period: card.note, category: topicOf[href], kind: "Indicator", href, keywords: [card.note],
  }));

export const searchIndex: SearchItem[] = [
  ...pages,
  ...sectionItems,
  ...indicatorItems("/business-and-economy", businessEconomyKPIs),
  ...indicatorItems("/population-and-society", populationKPIs),
  ...indicatorItems("/social-development", socialDevelopmentKPIs),
  ...indicatorItems("/governance", governanceKPIs),
  ...indicatorItems("/environment-and-climate-change", environmentKPIs),
];

const normalise = (text: string) => text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[–—]/g, "-");

export function querySearch(q: string): SearchItem[] {
  const terms = normalise(q.trim()).split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  return searchIndex
    .map(item => {
      const title = normalise(item.title);
      const haystack = normalise([item.title, item.category, item.value ?? "", item.period ?? "", ...(item.keywords ?? [])].join(" "));
      if (!terms.every(term => haystack.includes(term))) return null;
      const score = (title.startsWith(terms[0]) ? 4 : 0) + (title.includes(terms[0]) ? 2 : 0) + (item.kind === "Indicator" ? 1 : 0);
      return { item, score };
    })
    .filter((entry): entry is { item: SearchItem; score: number } => entry !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12)
    .map(entry => entry.item);
}
