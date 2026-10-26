// Questions StatsChat can answer, keyed by the catalogue dataset that holds the answer.
// Suggestions are only ever drawn from this list; scripts/check-assistant.cjs checks every ID exists and that search finds it.
export const datasetQuestions: Record<string, string[]> = {
  "population-size": ["How has Ghana’s population changed since 2010?", "What is Ghana’s projected population in 2025?"],
  "intercensal-growth": ["How has Ghana’s intercensal population growth rate changed since 1984?", "What is the population doubling time at the 2010–2021 growth rate?"],
  "population-pyramid": ["How has Ghana’s age-sex population pyramid changed between 2010 and 2025?"],
  "age-groups": ["What share of the population is projected to be aged 60 and over in 2025?"],
  "urban-rural": ["What share of Ghana’s population lived in urban areas in 2021?"],
  "urban-rural-counts": ["How many people lived in urban and rural areas in 2021?"],
  "life-expectancy": ["How has life expectancy at birth changed since 1960?"],
  "remaining-life-expectancy": ["How does remaining life expectancy differ between males and females in 2021?"],
  "fertility": ["How has Ghana’s total fertility rate changed since 1988?"],
  "regional-fertility": ["Which region had the highest total fertility rate in 2022?"],
  "household-size": ["How has average household size changed since 1984?"],
  "sex-composition": ["What are the projected male and female shares of the population in 2025?"],
  "regional-population-shares": ["Which regions hold the largest shares of Ghana’s population in 2025?"],
  "regional-share-2010-2025": ["How has Greater Accra’s share of the population changed since 2010?"],
  "population-density": ["Which region had the highest population density in 2021?"],
  "net-migration": ["Which regions gained the most people through net migration in 2021?"],
  "internal-migration-flows": ["How many in-migrants and out-migrants did Greater Accra record in 2021?"],
  "internal-migration": ["What share of the population were internal migrants in 2021?"],
  "immigration": ["What share of Ghana’s population were immigrants in 2021?"],
  "emigration": ["How many Ghanaians living abroad did the 2021 census record?"],
  "emigration-reasons": ["What were the main reasons for emigrating abroad in the 2021 census?"],
  "emigrant-destinations": ["Where do most Ghanaian emigrants live?"],
  "cached-regional-projections": ["What is the projected population of each region in 2030?"],

  "nominal-gdp": ["What was Ghana’s nominal GDP in 2025?"],
  "real-gdp": ["How fast did Ghana’s real GDP grow in 2025?", "Explain the difference between nominal and real GDP."],
  "sector-gdp": ["What share of nominal GDP did services, industry and agriculture contribute in 2025?"],
  "gdp-per-capita": ["What was Ghana’s nominal GDP per capita in 2025?"],
  "gdp-usd": ["What was Ghana’s GDP in US dollars in 2025?"],
  "gdp-expenditure": ["Which expenditure components made up GDP in 2025?", "How fast did household consumption grow in real terms in 2025?"],
  "merchandise-trade": ["What was Ghana’s merchandise trade balance in 2025?"],
  "trade-usd": ["How did merchandise exports in US dollars change between 2024 and 2025?"],
  "top-exports": ["What were Ghana’s top export commodities in 2025?"],
  "top-imports": ["What were Ghana’s top import commodities in 2025?"],
  "trade-partners": ["Which continent was Ghana’s largest trade partner in 2025?"],
  "consumer-inflation": ["What was Ghana’s inflation rate in December 2025?", "What was the annual average inflation rate in 2025?"],
  "cached-regional-inflation": ["How did year-on-year inflation in December 2025 compare with December 2022?", "Which region had the highest inflation in December 2025?"],
  "food-inflation": ["How did food and non-food inflation compare in December 2025?"],
  "local-imported-inflation": ["How did local and imported inflation compare in December 2025?"],
  "industrial-production": ["Which industrial production sectors grew fastest in 2025?"],
  "ppi-by-sector-2023-2025": ["How did producer price inflation change between 2023 and 2025?"],
  "building-cost-index": ["How did the Prime Building Cost Index change during 2025?"],
  "labour-participation": ["What was the labour-force participation rate in 2025?"],
  "unemployment": ["Compare unemployment among the two youth age groups in 2025.", "How has national unemployment changed since 2017?"],
  "neet-annual": ["What does NEET measure?", "How has the youth NEET rate changed since 2022?"],
  "enterprise-types": ["How many businesses were counted by type in 2024?"],
  "enterprise-size": ["What share of establishments are micro businesses?"],
  "enterprise-details": ["What share of micro enterprises are managed by women?"],
  "fiscal-operations": ["Compare cash and commitment government expenditure in 2025.", "How much tax revenue did government collect in 2025?"],
  "monetary-financial": ["How did the monetary policy rate change between 2022 and 2025?", "How many months of import cover did gross international reserves provide in 2025?"],
  "informal-trade": ["What was the informal cross-border trade balance from October 2024 to September 2025?"],
  "informal-trade-neighbours": ["Which neighbouring country had an informal trade balance in Ghana’s favour?"],
  "informal-trade-goods-transport": ["Which goods led informal cross-border trade imports?"],
  "tourism-flows": ["How many inbound tourism visitors came to Ghana in 2023 and how much did they spend?"],
  "tourism-purpose": ["What were the main reasons for travel in 2023?"],

  "crops-annual": ["How has cassava production changed since 2013?", "Which major crop had the largest production in 2024?"],
  "livestock-annual": ["How has the poultry population changed since 1990?"],
  "fish-production": ["How has aquaculture fish production changed since 2010?"],
  "fish-value": ["What was the value of fish production in 2025?"],
  "tilapia-catfish": ["How much tilapia and catfish was produced in 2025?"],
  "agriculture-spending-aoi": ["What is the Agriculture Orientation Index?", "How has government spending on agriculture changed since 2013?"],
  "youth-agriculture": ["How many young people worked in agriculture in 2021?"],

  "enrolment": ["Explain net versus gross school enrolment.", "How has JHS net enrolment changed since 2019/20?"],
  "school-completion": ["What were the primary and JHS completion rates in 2023/24?"],
  "pupils-teachers": ["How has the number of pupils per trained teacher changed since 2010/11?"],
  "nhis": ["How has active health insurance coverage changed?"],
  "teenage-motherhood": ["How does teenage motherhood differ between urban and rural areas?"],
  "housing": ["How did the housing deficit change between 2010 and 2021?"],
  "electricity": ["What share of households had access to electricity in 2021?"],
  "water": ["What share of households used improved drinking water in 2021?"],
  "toilets": ["How has improved toilet use changed between 2010 and 2022?"],
  "gender-violence": ["How did the prevalence of violence against women change between 2016 and 2022?"],
  "child-marriage": ["How has child marriage changed between 2010 and 2021?"],

  "women-parliament": ["How has women’s representation in Parliament changed?"],
  "women-judges": ["Compare women judges across courts in 2025."],
  "gifts-officials": ["What share of people reported giving gifts to public officials in 2025?"],
  "gift-requests": ["How often did public officials directly request gifts in 2025?"],
  "voting-rights": ["What share of adults knew they had the right to vote in 2024?"],
  "no-say": ["What share of citizens felt they had no say in 2025?"],
  "no-influence": ["What share of citizens felt they had no influence on government action in 2025?"],
  "never-voted": ["Which region had the highest share of people who never voted?"],

  "forest-reserves": ["Which regions hold the largest reported forest reserves?"],
  "carbon": ["How is carbon retention measured?", "Which land cover retained the most carbon in 2021?"],
  "carbon-stock-change": ["How did carbon stock change between 2015 and 2021?"],
  "rainfall": ["What were the wettest months of 2025?"],
  "temperature": ["Which months had the highest temperature in 2025?"],

  "poverty": ["How has multidimensional poverty changed since 2022?"],
  "food-insecurity": ["What does food insecurity measure?", "How has food insecurity changed since 2022?"],
  "maternal-mortality": ["How has the maternal mortality ratio changed since 2007?"],
  "under-five-mortality": ["How has under-five mortality changed since 2003?"],
  "neonatal-mortality": ["How has neonatal mortality changed since 2003?"],
  "slums": ["What share of urban residents live in slums or informal settlements?"],
  "plastic-debris": ["How has coastal plastic debris density changed since 2016?"],

  "youth-population": ["What share of Ghana’s population were youth aged 15–35 in 2025?"],
  "youth-unemployment-regional": ["Which region had the highest youth unemployment in Q3 2025?"],
  "youth-neet-q3": ["How does the youth NEET rate differ between males and females in Q3 2025?"],
  "youth-neet-regions": ["Which region had the highest youth NEET rate in Q3 2025?"],
  "youth-skills": ["How well are young workers’ skills matched to their jobs?"],
};

const key = (text: string) => text.toLowerCase().replace(/[’‘`]/g, "'").replace(/[?.!\s]+$/, "").replace(/\s+/g, " ").trim();
const canonical = new Map(Object.values(datasetQuestions).flat().map(question => [key(question), question]));
export const answerableQuestions = [...canonical.values()];

/** Questions for these datasets, in order, leaving out anything already asked; the overview starters stand in when none are left. */
export function followUpQuestions(datasetIds: string[], asked: string[], limit = 12) {
  const skip = new Set(asked.map(key));
  const fresh = (questions: string[]) => [...new Set(questions)].filter(question => !skip.has(key(question)));
  const questions = fresh(datasetIds.flatMap(id => datasetQuestions[id] ?? []));
  return (questions.length ? questions : fresh(overview)).slice(0, limit);
}

/** Keeps only proposed questions that appear in the menu, then fills the rest from the menu so there are always `count` when available. */
export function chooseSuggestions(proposed: unknown, menu: string[], count = 3) {
  const allowed = new Map(menu.map(question => [key(question), question]));
  const chosen = new Set<string>();
  if (Array.isArray(proposed)) for (const text of proposed) { const question = typeof text === "string" ? allowed.get(key(text)) : undefined; if (question && chosen.size < count) chosen.add(question); }
  for (const question of menu) if (chosen.size < count) chosen.add(question);
  return [...chosen];
}

const starters: [path: string, questions: string[]][] = [
  ["/population-and-society", ["How has Ghana’s population changed since 2010?", "Which region had the highest population density in 2021?", "Where do most Ghanaian emigrants live?"]],
  ["/business-and-economy", ["Which expenditure components made up GDP in 2025?", "Compare cash and commitment government expenditure in 2025.", "How did year-on-year inflation in December 2025 compare with December 2022?"]],
  ["/youth-bulge", ["Compare unemployment among the two youth age groups in 2025.", "What does NEET measure?", "Which region had the highest youth NEET rate in Q3 2025?"]],
  ["/social-development", ["How has active health insurance coverage changed?", "Explain net versus gross school enrolment.", "What share of households had access to electricity in 2021?"]],
  ["/environment-and-climate-change", ["What were the wettest months of 2025?", "How is carbon retention measured?", "Which regions hold the largest reported forest reserves?"]],
  ["/governance", ["How has women’s representation in Parliament changed?", "Compare women judges across courts in 2025.", "What share of citizens felt they had no say in 2025?"]],
  ["/progress-on-sdgs", ["How has multidimensional poverty changed since 2022?", "What does food insecurity measure?", "How has under-five mortality changed since 2003?"]],
  ["/agriculture-forestry-fishing", ["How has cassava production changed since 2013?", "What is the Agriculture Orientation Index?", "How many young people worked in agriculture in 2021?"]],
];
const overview = ["How has Ghana’s population changed since 2010?", "What was Ghana’s inflation rate in December 2025?", "Compare unemployment among the two youth age groups in 2025."];
export const starterPaths = starters.map(([path]) => path);

export function starterQuestions(path: string) {
  return starters.find(([prefix]) => path === prefix || path.startsWith(`${prefix}/`))?.[1] ?? overview;
}
