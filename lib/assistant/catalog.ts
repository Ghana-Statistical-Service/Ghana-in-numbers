import * as population from "@/data/populationData";
import * as economy from "@/data/businessEconomyData";
import * as social from "@/data/socialDevelopmentData";
import * as environment from "@/data/environmentData";
import * as governance from "@/data/governanceData";
import * as sdg from "@/data/sdgData";
import * as youth from "@/data/youthBulgeData";
import * as report from "@/data/reportAdditions";
import { indicatorExplanations } from "@/data/indicatorExplanations";
import cpi from "@/public/data/cpiData.json";
import projections from "@/public/data/projectionData.json";
import census from "@/data/phc2021Data.json";
import gdpCache from "@/data/gdpData.json";

export type DataRow = Record<string, unknown>;
export type IndicatorDataset = {
  id: string; title: string; topic: string; unit: string; period: string;
  href: string; source: string; notes: string; keywords: string;
  definitions: { name: string; meaning: string; reading: string; why: string; source: string }[];
  records: DataRow[];
};
const catalogue: IndicatorDataset[] = [];
const definitionIndices: Record<string, number[]> = {
  "intercensal-growth": [0, 1], "population-pyramid": [3], "age-groups": [4], "sex-composition": [2],
  "urban-rural": [0], "life-expectancy": [1], "remaining-life-expectancy": [2], "fertility": [3], "household-size": [4],
  "regional-population-shares": [0], "net-migration": [1], "internal-migration": [2], "immigration": [3], "emigration": [4], "emigration-reasons": [5], "emigrant-destinations": [6],
  "nominal-gdp": [0], "real-gdp": [1], "sector-gdp": [2], "gdp-per-capita": [3],
  "merchandise-trade": [0, 1], "top-exports": [2], "top-imports": [2], "trade-partners": [2],
  "consumer-inflation": [0], "food-inflation": [1], "industrial-production": [3], "producer-prices": [2],
  "labour-participation": [0, 1], "unemployment": [2], "neet-annual": [3], "youth-neet-q3": [3], "youth-neet-regions": [3],
  "fish-production": [0], "crop-production": [1], "agriculture-reference": [0, 1, 2, 3], "livestock-endpoints": [0, 2], "youth-agriculture": [4],
  "tourism-flows": [0, 1], "tourism-purpose": [1], "enrolment": [0, 1], "school-completion": [2], "pupils-teachers": [3],
  "nhis": [0], "teenage-motherhood": [1], "housing": [0], "electricity": [1], "water": [2], "toilets": [3],
  "gender-violence": [0], "child-marriage": [1], "women-parliament": [0], "women-judges": [0], "gifts-officials": [1], "voting-rights": [3], "no-say": [2], "no-influence": [2],
  "forest-reserves": [0], "carbon": [1], "rainfall": [2], "temperature": [3], "poverty": [0], "food-insecurity": [1], "maternal-mortality": [2], "under-five-mortality": [3], "neonatal-mortality": [3], "slums": [4], "plastic-debris": [5], "youth-population": [0], "youth-unemployment-regional": [1], "youth-skills": [2, 3],
};

function rows(data: unknown, columns?: string[]): DataRow[] {
  if (!Array.isArray(data)) return [data as DataRow];
  return data.map(row => Array.isArray(row) ? Object.fromEntries(row.map((v, i) => [columns?.[i] ?? `column_${i}`, v])) : row as DataRow);
}
function add(id: string, title: string, topic: string, unit: string, period: string, href: string, group: string, data: unknown, notes = "", columns?: string[], keywords = "") {
  const groupDefinitions = indicatorExplanations[group] ?? [];
  const definitions = definitionIndices[id] ? definitionIndices[id].map(index => groupDefinitions[index]).filter(Boolean) : groupDefinitions;
  catalogue.push({ id, title, topic, unit, period, href, definitions, records: rows(data, columns), notes,
    keywords, source: `Ghana in Numbers 2025 · ${id === "gdp-expenditure" ? "Table 5.1, p. 39" : [...new Set(definitions.map(entry => entry.source))].join("; ")}` });
}
const pop = "/population-and-society";
const biz = "/business-and-economy";
const soc = "/social-development";
const env = "/environment-and-climate-change";
const gov = "/governance";
const goals = "/progress-on-sdgs";
const young = "/youth-bulge";
add("population-size", "Annual population size: census, estimates and projections", "Population", "million people", "2000–2025", pop, "populationSize", population.populationSize, "kind identifies census counts, intercensal estimates and projections. 2025 is a projection, not a census.", undefined, "population growth total Ghana inhabitants");
add("intercensal-growth", "Intercensal growth and doubling time", "Population", "annual growth %; doubling time years", "1984–2021", pop, "populationComposition", population.intercensalGrowth);
add("population-pyramid", "Age-sex population pyramid", "Population", "million people", "2010, 2021 and 2025", pop, "populationComposition", Object.entries(population.pyramidData).flatMap(([year, records]) => records.map(row => ({ year, ...row }))));
add("age-groups", "Population shares by age group", "Population", "% of total population", "2025 projection", pop, "populationComposition", population.ageGroupDistribution2025);
add("urban-rural", "Urban and rural population shares", "Population", "% of total population", "1984–2025", pop, "populationLiving", population.urbanRuralData);
add("life-expectancy", "Life expectancy at birth", "Population", "years", "1960–2021", pop, "populationLiving", population.lifeExpectancyTrend);
add("remaining-life-expectancy", "Remaining life expectancy by age and sex", "Population", "additional years of life", "2021", pop, "populationLiving", population.lifeExpectancyByAge);
add("fertility", "Total fertility rate", "Population", "children per woman", "1988–2022", pop, "populationLiving", population.fertilityData);
add("household-size", "Average household size", "Population", "persons per household", "1984–2021", pop, "populationLiving", population.householdSizeData);
add("net-migration", "Net migration by region", "Population", "people, rounded", "2021 census", pop, "migration", report.netMigration2021, "Birth region versus enumeration region; not annual flows.", ["region", "net_migrants"]);
add("sex-composition", "Male and female population shares", "Population", "% projected total population", "2025 projection", pop, "populationComposition", population.sexComposition2025);
add("regional-population-shares", "Population share by region", "Population", "% total population", "2025 projection", pop, "migration", report.regionalPopulationShares2025);
add("internal-migration", "Internal migrants as a share of population", "Migration", "% population", "2000, 2010 and 2021 censuses", pop, "migration", report.internalMigrationData);
add("immigration", "Immigrants as a share of Ghana’s population", "Migration", "% population", "2010 and 2021 censuses", pop, "migration", report.immigrationData);
add("emigration", "Census-recorded Ghanaians living abroad", "Migration", "people", "2010 and 2021 censuses", pop, "migration", report.emigrationData, "Census-recorded count; not an exhaustive count of the worldwide diaspora.");
add("emigration-reasons", "Reasons for emigrating abroad", "Migration", "% recorded emigrants aged 15+", "2021 census", pop, "migration", report.emigrationReasonsData);
add("emigrant-destinations", "Where Ghanaian emigrants live", "Migration", "% census-recorded emigrants", "2021 census", pop, "migration", report.emigrantDestinationsData);
add("nominal-gdp", "Nominal GDP", "Economy", "GH¢ billion; US$ billion as labelled by field", "2013–2025", biz, "gdp", economy.nominalGdpData, "2025 provisional; nominal reflects prices and currency movements.");
add("real-gdp", "Real GDP and annual GDP growth", "Economy", "real: GH¢ billion at 2013 prices; growth: %", "2013–2025", biz, "gdp", economy.realGdpData, "2025 provisional; 2024 revised.");
add("sector-gdp", "Sectoral share of nominal GDP", "Economy", "% of nominal GDP", "2025", biz, "gdp", economy.sectorShare2025);
add("gdp-per-capita", "Nominal GDP per capita", "Economy", "GH¢ per person and US$ per person as labelled", "2013–2025", biz, "gdp", economy.nominalGdpPerCapitaData);
add("gdp-expenditure", "GDP by expenditure: consumption, investment, exports and imports", "Economy", "nominal and real: GH¢ billion; real uses 2013 prices; growth %", "2025", `${biz}#expenditure`, "expenditure", report.gdpExpenditure2025, "Consumption contains household, government and NPISH sub-items. Do not add parent and sub-items twice. GDP totals and components can differ slightly due to rounding.", ["item", "nominal", "real", "growth"]);
add("merchandise-trade", "Merchandise exports, imports and balance", "Trade", "GH¢ billion at current prices", "As recorded in year field", biz, "trade", economy.tradeGoodsData, "Goods only; differs from national-accounts goods and services.");
add("top-exports", "Top export commodities", "Trade", "% of total exports", "2025", biz, "trade", economy.topExports2025);
add("top-imports", "Top import commodities", "Trade", "% of total imports", "2025", biz, "trade", economy.topImports2025);
add("trade-partners", "Trade by continental partner", "Trade", "% of exports and imports, separately", "2025", biz, "trade", economy.tradePartnerRegions);
add("consumer-inflation", "Publication consumer inflation series", "Prices", "% annual average and December year on year, as labelled", "2022–2025", biz, "prices", economy.annualInflationData, "December 2025 year-on-year inflation is 5.4%; 2025 annual average is 14.6%. Lower inflation does not mean prices fell.", undefined, "CPI inflation cost prices");
add("food-inflation", "Food and non-food inflation", "Prices", "% year on year", "Selected observations", biz, "prices", economy.foodNonFoodInflationData);
add("industrial-production", "Industrial production growth by sector", "Industry", "% growth in volume", "Year-end observations", biz, "prices", economy.iipSectorData);
add("producer-prices", "Producer price inflation by sector", "Prices", "% year on year at year-end", "2025", biz, "prices", economy.ppiSectorData);
add("labour-participation", "Labour-force participation and employment-to-population", "Employment", "% working-age population", "2022–2025; 2025 average Q1–Q3", biz, "labour", economy.labourParticipationData);
add("unemployment", "National and youth unemployment over time", "Employment", "% of labour force in each age group", "2017–2025; 2025 average Q1–Q3", biz, "labour", economy.unemploymentData, "Youth age groups 15–24 and 15–35 overlap. 2025 multi-quarter average differs from Q3 alone.");
add("neet-annual", "Youth NEET multi-quarter averages", "Employment", "% of all youth in each age band", "2022–2025; 2025 average Q1–Q3", biz, "labour", economy.neetData, "Not in employment, education or training. 2025 average is 19.1% for ages 15–24 and 17.9% for ages 15–35.");
add("fish-production", "Marine, inland and aquaculture fish production", "Agriculture", "100,000 metric tonnes per chart unit", "2010–2025", biz, "agriculture", economy.fishProductionData, "Multiply chart values by 100000 to express tonnes. Reported 2025 aggregate total is 722648 tonnes; revisions mean species and aggregates differ.");
add("crop-production", "Major crop production", "Agriculture", "million metric tonnes", "2013–2024", biz, "agriculture", economy.cropProductionData);
add("agriculture-reference", "Agriculture spending, orientation index, livestock and fish totals", "Agriculture", "mixed; see published_value field", "1990–2025 as labelled", `${biz}#agriculture-reference`, "agriculture", report.agricultureReferenceIndicators, "The 0.02 index is not a spending percentage; public spending is about 0.2% of GDP.", ["indicator", "period", "published_value"]);
add("livestock-endpoints", "Livestock populations and aquaculture before-and-after", "Agriculture", "see unit field", "1990–2024 livestock; 2013–2025 fish", `${biz}#agriculture-reference`, "agriculture", report.agricultureEndpointComparisons);
add("tourism-flows", "Domestic, inbound and outbound tourism flows and spending", "Tourism", "see each field; people/trips and GH¢ billion", "2023", biz, "tourism", economy.tourismFlowData, "Same-day and overnight flows are not deduplicated unique people.");
add("tourism-purpose", "Reasons for domestic, inbound and outbound travel", "Tourism", "% within each travel category", "2023", biz, "tourism", economy.tourismPurposeData);
add("enterprise-types", "Businesses by type: establishments, open-space and mobile", "Businesses", "counts and % of all businesses", "2024 IBES I", `${biz}#enterprises`, "enterprises", report.enterpriseTypes, "All businesses is a total, not a fourth component.", ["type", "count", "share"]);
add("enterprise-size", "Establishment size, employment shares and formality", "Businesses", "% with different denominators", "2024 IBES I", `${biz}#enterprises`, "enterprises", report.establishmentSize, "Formality rates within size groups must not be summed.", ["size", "establishment_share", "persons_engaged_share", "formal_within_size"]);
add("fiscal-operations", "Government revenue, tax, expenditure and fiscal balances", "Public finance", "nominal GH¢ million", "2022–2025", `${biz}#fiscal`, "fiscal", report.fiscalIndicators, "Tax revenue is included in revenue & grants. Cash and commitment bases are distinct. Primary excludes interest; negative balance is a deficit. Charts divide values by 1000 to show billions.", ["indicator", "2022", "2023", "2024", "2025"]);
add("monetary-financial", "Money, credit, reserves, interest rates and banking health", "Finance", "see indicator labels for GH¢ bn, US$ bn, %, or months", "2022–2025, end-period unless stated", `${biz}#finance`, "finance", report.monetaryIndicators, "Different units and denominators; percentage changes in rates are distinct from percentage-point differences.", ["indicator", "2022", "2023", "2024", "2025"]);
add("informal-trade", "Informal cross-border exports, imports, totals and balances", "Trade", "GH¢ billion", "October 2024–September 2025", `${biz}#informal-trade`, "informalTrade", report.informalTrade, "12 months is an aggregate, not a fifth quarter. Published rounded components can differ from arithmetic. Survey excludes night trade.", ["period", "exports", "imports", "total", "balance"]);
add("enrolment", "Gross and net school enrolment", "Education", "% at each school level", "2019/20–2023/24", soc, "education", social.enrolmentRateData);
add("school-completion", "Primary and JHS completion rates", "Education", "% administrative completion ratios", "2019/20–2023/24", soc, "education", social.completionRateData);
add("pupils-teachers", "Pupils per trained teacher", "Education", "pupils per trained teacher", "2010/11–2020/21", soc, "education", social.pupilTeacherRatioData);
add("nhis", "Active NHIS health insurance coverage", "Health", "% total population", "2010–2025", soc, "health", social.healthInsuranceCoverageData);
add("teenage-motherhood", "Teenage motherhood nationally and by locality", "Health", "% girls aged 15–19 already mothers", "2008–2022", soc, "health", social.teenageMotherhoodData);
add("housing", "Housing deficit and dwelling requirement", "Living conditions", "million dwelling units", "2010 and 2021", soc, "living", social.housingDeficitData);
add("electricity", "Household access to electricity", "Living conditions", "% households", "2000–2021", soc, "living", social.electricityAccessData);
add("water", "Improved drinking water", "Living conditions", "% households", "2000–2021", soc, "living", social.drinkingWaterData);
add("toilets", "Improved toilet use", "Living conditions", "% households", "2010 and 2022", soc, "living", social.improvedToiletUseData);
add("gender-violence", "Physical, sexual and psychological violence prevalence", "Protection", "% surveyed women", "2016 and 2022", soc, "protection", social.gbvPrevalenceData);
add("child-marriage", "Child marriage", "Protection", "% as labelled", "As reported", soc, "protection", social.childMarriageData);
add("women-parliament", "Women in Parliament", "Governance", "% parliamentary seats", "As recorded in year field", gov, "governance", governance.womenParliamentData);
add("women-judges", "Women judges by court", "Governance", "% judges within each court", "As recorded in year field", gov, "governance", governance.womenJudgesData);
add("gifts-officials", "Giving gifts to public officials", "Governance", "% reporting gifts given", "2021–2025", gov, "governance", governance.giftsToOfficialsData);
add("voting-rights", "Knowledge of right to vote", "Governance", "% adults aged 18+", "2024", gov, "governance", governance.rightToVoteKnowledge, "This is knowledge, not voter turnout.");
add("no-say", "Citizens feeling no say in decisions", "Governance", "% survey respondents", "As recorded in year field", gov, "governance", governance.noSayData);
add("no-influence", "Citizens feeling no influence on government action", "Governance", "% survey respondents", "As recorded in year field", gov, "governance", governance.noInfluenceData);
add("forest-reserves", "Forest reserve area by region", "Environment", "square kilometres", "December 2025", env, "environment", environment.forestReserveArea2025, "Twelve regions reported. Absent regions are not zeros. Total reported area 24133.53 km².");
add("carbon", "Carbon retained by land cover", "Environment", "million tonnes of carbon (Mt C)", "2021", env, "environment", environment.carbonRetentionData, "Grassland soil plus non-soil is 344.0 Mt C; the publication prose says 334.0 in error. Stock differs from annual sequestration.");
add("rainfall", "Monthly rainfall", "Environment", "millimetres", "2025", env, "environment", environment.monthlyRainfall2025);
add("temperature", "Monthly temperature", "Environment", "degrees Celsius", "2025", env, "environment", environment.monthlyTemperature2025);
add("poverty", "Multidimensional poverty incidence", "SDGs", "% population", "2022–2025; 2025 average Q1–Q3", goals, "sdg", sdg.povertyData);
add("food-insecurity", "Food insecurity prevalence (FIES)", "SDGs", "% population", "2022–2025; 2025 average Q1–Q3", goals, "sdg", sdg.foodInsecurityData);
add("maternal-mortality", "Maternal mortality ratio", "SDGs", "deaths per 100000 live births", "2007–2021", goals, "sdg", sdg.maternalMortality, "2007 and 2017 survey; 2010 and 2021 census. Methods differ.");
add("under-five-mortality", "Under-five child mortality", "SDGs", "deaths per 1000 live births", "2003–2022", goals, "sdg", sdg.underFiveMortality);
add("neonatal-mortality", "Neonatal newborn mortality", "SDGs", "deaths per 1000 live births", "2003–2022", goals, "sdg", sdg.neonatalMortality);
add("slums", "Slums and informal settlements", "SDGs", "household and population shares use different denominators", "2021 PHC / 2025 thematic report", goals, "sdg", sdg.urbanSlums);
add("plastic-debris", "Coastal plastic debris density", "SDGs", "million items per square kilometre", "2016–2020", goals, "sdg", sdg.coastalDebrisData);
add("youth-population", "Youth and child population shares", "Youth", "% population", "As recorded in year field", young, "youth", youth.populationShareData);
add("youth-unemployment-regional", "Youth unemployment by region and age band", "Youth", "% labour force within each age band", "Q2 and Q3 2025", young, "youth", youth.unemploymentByRegion);
add("youth-neet-q3", "Youth NEET by sex and locality", "Youth", "% of all youth aged 15–24 or 15–35", "Q3 2025 only", young, "labour", youth.neetData, "Distinct from Q1–Q3 average; National 19.5% ages 15–35 and 21.5% ages 15–24.");
add("youth-neet-regions", "Youth NEET by region, sex and locality", "Youth", "% of youth in each age band, dimension and region", "Q3 2025 only", young, "labour", Object.entries(youth.neetRegionalData).flatMap(([dimension, records]) => records.map(row => ({ dimension, ...row }))));
add("youth-agriculture", "Youth employment in agriculture, forestry and fishing", "Youth", "workers (people)", "2010 and 2021", young, "agriculture", youth.agricultureData);
add("youth-skills", "Youth skills and education alignment", "Youth", "% reported; separate questions", "Publication discussion pp. 112–113", young, "youth", { ...youth.skillsAlignment, informalShare: ">70% of all employment, not a youth-only estimate" });

type PxWeb = { columns: { code: string; type: string }[]; data: { key: string[]; values: string[] }[] };
function cache(id: string, title: string, payload: PxWeb, unit: string, href: string, source: string, fetchedAt: string, group: string) {
  const dimensions = payload.columns.filter(column => column.type !== "c");
  const records = payload.data.map(row => ({ ...Object.fromEntries(row.key.map((value, i) => [dimensions[i]?.code ?? `dimension_${i}`, value])), value: Number.isFinite(Number(row.values[0])) && row.values[0].trim() ? Number(row.values[0]) : null }));
  catalogue.push({ id, title, unit, href, source: `Cached GSS StatsBank snapshot · fetched ${fetchedAt} · ${source}`, period: "See time dimension; cached snapshot, not live", topic: "Cached StatsBank JSON", notes: "Supplementary cached data. Prefer publication datasets for questions about Ghana in Numbers 2025. State exact observation date and snapshot status. Missing values are not zeros. Never treat a projection as an observed census count.", keywords: "cached regional snapshot JSON StatsBank", definitions: indicatorExplanations[group] ?? [], records });
}
cache("cached-regional-inflation", "Cached monthly regional and national consumer inflation JSON", cpi.response, "% year on year", biz, cpi.sourceUrl, cpi.fetchedAt, "prices");
cache("cached-regional-projections", "Cached regional population projections JSON", projections.response, "people (not millions)", pop, projections.sourceUrl, projections.fetchedAt, "populationSize");
cache("cached-census", "Cached 2021 census population by age, sex and locality JSON", census.response, "people", pop, census.sourceUrl, census.fetchedAt, "populationComposition");
cache("cached-gdp-production", "Cached GDP production series JSON", gdpCache.annualProduction.response, "see GDP_Series: values may be GH¢ million or %", biz, gdpCache.annualProduction.sourceUrl, gdpCache.fetchedAt, "gdp");
cache("cached-gdp-expenditure", "Cached GDP expenditure series JSON", gdpCache.annualExpenditure.response, "see series dimension; do not mix price bases or units", biz, gdpCache.annualExpenditure.sourceUrl, gdpCache.fetchedAt, "expenditure");

export const indicatorCatalogue = catalogue;
export function getIndicator(id: string) { return catalogue.find(entry => entry.id === id); }
const stopWords = new Set("the a an of in on at for and or to is are was were what how which when where why show me tell about ghana data please has have did does do it its this that from since between with than can you i latest current".split(" "));
export function findIndicators(query: string, limit = 8) {
  const tokens = query.toLowerCase().replace(/\bjobs?\b/g, "employment").replace(/\bcpi\b/g, "inflation").split(/[^a-z0-9]+/).filter(word => word.length > 1 && !stopWords.has(word));
  return catalogue.map(entry => {
    const main = `${entry.id} ${entry.title} ${entry.keywords}`.toLowerCase();
    const secondary = `${entry.topic} ${entry.unit} ${entry.period}`.toLowerCase();
    const score = tokens.reduce((sum, word) => sum + (main.includes(word.replace(/s$/, "")) ? 4 : secondary.includes(word) ? 1 : 0), 0) - (entry.id.startsWith("cached-") && !/region|monthly|month|snapshot|statsbank|2026|2027|2028|2029|203\d|204\d|2050/i.test(query) ? 2 : 0);
    return { entry, score };
  }).filter(hit => hit.score > 0).sort((a, b) => b.score - a.score).slice(0, limit).map(({ entry }) => ({ id: entry.id, title: entry.title, topic: entry.topic, unit: entry.unit, period: entry.period, fields: Object.keys(entry.records[0] ?? {}), records: entry.records.length, notes: entry.notes }));
}
