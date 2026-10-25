import { cardExplanations, kpiExplanationKeys } from "./cardExplanations";
import { indicatorExplanations } from "./indicatorExplanations";

// Links the short card copy to its definition and chart story in the PDF-based catalogue.
const references: Record<string, [string, number]> = {
  population:["populationSize",0], growth:["populationComposition",0], composition:["populationComposition",2], pyramid:["populationComposition",3], age:["populationComposition",4],
  urban:["populationLiving",0], life:["populationLiving",1], fertility:["populationLiving",3], household:["populationLiving",4],
  nominalGdp:["gdp",0], realGdp:["gdp",1], gdpGrowth:["gdp",1], sector:["gdp",2], perCapita:["gdp",3],
  inflation:["prices",0], foodInflation:["prices",1], ppi:["prices",2], iip:["prices",3],
  participation:["labour",0], unemployment:["labour",2], neet:["labour",3],
  primaryNet:["education",1], enrolment:["education",1], gross:["education",0], completion:["education",2], teachers:["education",3],
  health:["health",0], teenage:["health",1], housing:["living",0], electricity:["living",1], water:["living",2], toilet:["living",3],
  physical:["protection",0], sexual:["protection",0], psychological:["protection",0], childMarriage:["protection",1],
  trade:["trade",0], surplus:["trade",1], exports:["trade",2], imports:["trade",2], partner:["trade",2],
  fish:["agriculture",0], crops:["agriculture",1], youthAgriculture:["agriculture",4],
  tourism:["tourism",0], tourismSpending:["tourism",1], domestic:["tourism",0], inbound:["tourism",0], outbound:["tourism",0], purpose:["tourism",1],
  businesses:["enterprises",0], parliament:["governance",0], judges:["governance",0], gifts:["governance",1], requests:["governance",1], vote:["governance",3], noSay:["governance",2], noInfluence:["governance",2],
  forest:["environment",0], carbon:["environment",1], rain:["environment",2], temperature:["environment",3],
  poverty:["sdg",0], food:["sdg",1], maternal:["sdg",2], underFive:["sdg",3], infant:["sdg",3], neonatal:["sdg",3], slums:["sdg",4], plastic:["sdg",5],
  youth:["youth",0], skills:["youth",2], informal:["youth",3],
  regionalPopulation:["migration",0], netMigration:["migration",1], internalMigration:["migration",2], immigration:["migration",3], emigration:["migration",4], emigrationReasons:["migration",5], emigrantDestinations:["migration",6],
};

export function getCardExplanation(indicator?: string, label?: string) {
  const key = indicator ?? (label ? kpiExplanationKeys[label] : undefined);
  if (!key) return null;
  const reference = references[key];
  const entry = reference ? indicatorExplanations[reference[0]]?.[reference[1]] : undefined;
  if (!entry) return null;
  const short = cardExplanations[key];
  const specific = ["physical","sexual","psychological","domestic","inbound","outbound","exports","imports"].includes(key);
  return {
    title: label ?? ({ physical:"Physical violence", sexual:"Sexual violence", psychological:"Psychological violence", domestic:"Domestic tourism", inbound:"Inbound tourism", outbound:"Outbound tourism", exports:"Export commodity shares", imports:"Import commodity shares", judges:"Women judges", requests:"Direct requests for gifts", gifts:"Giving gifts to public officials", noSay:"No say in government decisions", noInfluence:"No influence on government action" } as Record<string,string>)[key] ?? entry.name,
    meaning: key === "enrolment" ? "Net enrolment counts pupils of the official school age. Gross enrolment counts pupils of all ages relative to the official school-age population, so it can exceed 100%." : entry.meaning,
    story: specific && short ? short.text : entry.reading,
    why: entry.why,
    source: entry.source,
  };
}

/** Combined explanation for a report section that groups several catalogued indicators (e.g. "fiscal"). */
export function getGroupExplanation(group: string, title: string, indices?: number[]) {
  const all = indicatorExplanations[group] ?? [];
  const entries = indices ? indices.map(i => all[i]).filter(Boolean) : all;
  if (!entries.length) return { title };
  const many = entries.length > 1;
  return {
    title,
    meaning: entries.map(e => many ? `${e.name}\n${e.meaning}` : e.meaning).join("\n\n"),
    story: entries.map(e => many ? `${e.name}\n${e.reading}` : e.reading).join("\n\n"),
    why: entries.map(e => many ? `${e.name}\n${e.why}` : e.why).join("\n\n"),
    source: [...new Set(entries.map(e => e.source))].join("; "),
  };
}
