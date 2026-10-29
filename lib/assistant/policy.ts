/**
 * Statistics, not forecasts. Ghana in Numbers reports what was measured (and official projections that
 * the publication itself prints, such as the 2025 population projection). StatsChat must not predict,
 * forecast or extrapolate. These checks run in code so the rule does not depend on the model complying.
 */

// Words that ask for a prediction outright.
const FORECAST_VERB = /\b(predict(?:ion|ions|ed|ing|s)?|forecast(?:s|ing|ed)?|foresee|prophes(?:y|ise|ize)|extrapolat(?:e|ion|ing)|projection for (?:next|the next|coming|future))\b/i;
// Phrases about time after the publication's reference period.
const FUTURE_TIME = /\b(next|coming|following|upcoming)\s+(year|years|quarter|quarters|month|months|decade|census|election)\b|\bin the (?:near |distant )?future\b|\bnext\s+\d+\s+years?\b|\bby\s+(?:the\s+)?(?:end\s+of\s+)?20(?:2[6-9]|[3-9]\d)\b|\bin\s+20(?:2[6-9]|[3-9]\d)\b|\b20(?:2[6-9]|[3-9]\d)\s+(?:inflation|gdp|growth|rate|population|figure|value)\b/i;
// Questions that ask what a value "will" be, or for an outlook or expectation.
const FUTURE_ASK = /\b(what|how\s+(?:much|high|low|fast)|where)\b[^?]{0,60}\bwill\b|\bwill\s+(?:inflation|gdp|growth|unemployment|poverty|the\s+(?:population|economy|rate|cedi))\b|\b(outlook|expected\s+(?:to\s+be|rate|value|level)|expect(?:ation)?s?\s+for|likely\s+(?:to\s+be|value|level|rate)|going\s+to\s+be)\b/i;

/** True when the question asks for a prediction rather than for a published statistic. */
export function isForecastRequest(question: string) {
  const text = question.slice(0, 2000);
  if (FORECAST_VERB.test(text)) return true;
  return FUTURE_TIME.test(text) && (FUTURE_ASK.test(text) || /\b(be|reach|rise|fall|grow|increase|decrease|drop|look like|project|estimate|guess|anticipate|expect|calculate|model)\b/i.test(text));
}

// Speculative wording in a generated answer: forecasts that slipped past the instructions.
const SPECULATIVE_ANSWER = /\b(if (?:the|this|that|these) (?:recent |current |same |downward |upward )?trends? (?:continues?|persists?|holds?)|is (?:likely|expected) to (?:rise|fall|remain|stay|reach|be|continue|ease|increase|decrease)|(?:may|might|could|would|will) (?:likely )?(?:stay|remain) (?:below|above|around)|my (?:prediction|forecast|estimate) (?:is|would be)|i (?:predict|forecast|expect) (?:that|inflation|gdp|growth|the))\b/i;

/** True when an answer contains a prediction or extrapolation. */
export function containsForecast(answer: string) {
  return SPECULATIVE_ANSWER.test(answer);
}

export const FORECAST_REFUSAL = "I can’t make predictions or forecasts. Ghana in Numbers 2025 reports official statistics that have been measured, together with the official projections the publication itself prints, such as the 2025 population projection. It does not contain forecasts of future values, and I won’t estimate them by extending past trends.\n\nI can tell you the latest published figure and its reference period, how it has changed over the years covered, and what the publication says about it. Forecasts, where they exist, are published by the responsible institutions (for example, inflation forecasts in Bank of Ghana monetary policy releases), not in this publication.";

/** Rule text added to the model's instructions. */
export const FORECAST_RULE = "Never predict, forecast, extrapolate or speculate about values after the latest published observation, including statements such as \"if the trend continues\", \"is likely to\" or \"may stay below\". Do not suggest an expected direction for future years. You may quote only projections that the supplied data explicitly label as official projections, with their label and reference year. If a user asks for a prediction, decline in one sentence, then give the latest published value with its reference period and, if useful, how it changed over the published years.";

/* ── Other requests an official-statistics assistant must not answer ─────── */

export type RefusalCategory = "personal" | "advice" | "political" | "forecast";

// Identifiable people, households or businesses (confidential under the Statistical Service Act, 2019).
const PERSONAL = /\b(names? of|home address(?:es)?|addresses of|phone numbers?|contact details|who (?:lives|is living|lives at)|which (?:specific |particular )?(?:households?|famil(?:y|ies)|persons?|individuals?|respondents?|businesses|companies|shops)\b[^?]{0,40}\b(?:in|at|on|near|live|living|located)\b|(?:individual|respondent|person|household)[- ](?:level |by[- ]household )?(?:records?|data|responses|details)|micro-?data|raw (?:survey |census )?(?:data|records|responses|returns)|identify (?:the |specific )?(?:households?|people|persons|respondents|individuals|families|businesses))\b/i;
// Financial, investment, medical, legal or personal advice.
const ADVICE = /\b(should (?:i|we) (?:invest|buy|sell|borrow|save|lend|move|emigrate|relocate|take|start|change|put)|is (?:it|now|this) (?:a )?(?:good|bad|right|smart|wise) (?:time|moment|idea) to|(?:financial|investment|medical|legal|tax|health) advice|advise me (?:on|to|whether)|what should i (?:do|invest|buy|sell)|(?:recommend|suggest) (?:an? |the best )?(?:investment|stocks?|shares|bank|treatment|medicine|drug|business to start))\b/i;
// Opinions on parties, politicians or government performance (GSS must stay politically neutral).
const POLITICAL = /\b(NPP|NDC|CPP|political part(?:y|ies)|which party|vote for|who (?:should|do) (?:i|we|you) vote|(?:better|worse|best|worst) (?:president|government|party|administration|regime)|(?:president|government|minister|administration|regime)[^?.]{0,40}\b(?:doing (?:well|badly|poorly|a good job|a bad job|enough)|performing (?:well|badly|poorly)|perform(?:ed)? (?:well|badly|poorly)|fail(?:ed|ing|ure)|succeed(?:ed)?|success|to blame|deserve|competent|incompetent|corrupt)|blame (?:the )?(?:government|president|minister)|(?:under|during|by) (?:president )?(?:mahama|akufo-?addo|bawumia|rawlings|kufuor|mills)|(?:mahama|akufo-?addo|bawumia|rawlings|kufuor|mills)(?:'s)? (?:government|administration|record|performance))\b/i;

/** The kind of request StatsChat declines before calling the model, or null for an ordinary statistical question. */
export function classifyRequest(question: string): RefusalCategory | null {
  const text = question.slice(0, 2000);
  if (PERSONAL.test(text)) return "personal";
  if (ADVICE.test(text)) return "advice";
  if (POLITICAL.test(text)) return "political";
  if (isForecastRequest(text)) return "forecast";
  return null;
}

export const REFUSALS: Record<RefusalCategory, string> = {
  personal: "I can’t provide information about identifiable people, households, businesses or exact locations. Individual census and survey responses are confidential under the Statistical Service Act, 2019 (Act 1003), and this dashboard holds only published totals for Ghana, its regions and population groups. Anonymised microdata are released only through the Ghana Statistical Service’s formal data-access procedures.\n\nI can give you the published national or regional figure instead, with its reference period.",
  advice: "I can’t give financial, investment, medical, legal or personal advice. I can explain what the published statistics show, such as inflation, interest rates, employment or health indicators, with their reference periods, so you can discuss your decision with a qualified adviser.",
  political: "I can’t give opinions on political parties, politicians or how well a government has performed. As part of the Ghana Statistical Service, StatsChat stays politically neutral.\n\nI can give you the published figures, their reference periods and how they changed over time, so you can draw your own conclusions.",
  forecast: FORECAST_REFUSAL,
};

/* ── Checks on every generated answer ───────────────────────────────────── */

const CAUSAL = /\b(because of|due to|caused by|as a result of|thanks to|driven by|led to|resulted in|attributable to|owing to)\b/i;
const ATTRIBUTION = /\b(the publication|the report|ghana in numbers|according to|attributes?|attributed|states?|notes?|explains?|says|cites?|suggests)\b/i;
const EVALUATIVE_POLITICS = /\b(NPP|NDC|the government (?:has )?(?:done|did|performed|is doing) (?:well|badly|poorly|a good job|a bad job)|good job|bad job|policy (?:success|failure)|mismanag\w*|incompeten\w*)\b/i;
const LOADED_WORDS = /\b(worst|failing|backward|shameful|disgrace\w*|terrible|appalling|lazy|laggards?|lagging behind|poor performers?)\b/i;
// Figures whose official status must travel with them.
const LABELLED_FIGURES: { figure: RegExp; label: RegExp; note: string }[] = [
  { figure: /33\.7\s*million/i, label: /project/i, note: "33.7 million is the 2025 population projection, not a census count" },
  { figure: /1,?434\.1/, label: /provisional/i, note: "GH¢1,434.1 billion nominal GDP for 2025 is provisional" },
  { figure: /209\.6/, label: /provisional/i, note: "GH¢209.6 billion real GDP for 2025 is provisional" },
];
// Numbers that are part of a reference or a fixed unit, not a statistic.
const REFERENCE_BEFORE = /(?:figures?|tables?|p\.|pp\.|pages?|sdg|§|chapter|wave|act|no\.|q|quarter|gdhs|phc|glss|ahies|qlfs|ibes|top)\s*$/i;
const UNIT_CONSTANTS = new Set([100, 1000, 100000, 1000000]);

function numbersIn(text: string) {
  const out: { value: number; decimals: number; index: number; raw: string }[] = [];
  for (const match of text.replace(/[−–](?=\d)/g, "-").matchAll(/-?\d{1,3}(?:,\d{3})+(?:\.\d+)?|-?\d+(?:\.\d+)?/g)) {
    const raw = match[0].replace(/^-/, "");
    out.push({ value: Math.abs(Number(raw.replace(/,/g, ""))), decimals: (raw.split(".")[1] ?? "").length, index: match.index ?? 0, raw });
  }
  return out;
}

/** Numbers in the answer that do not appear (allowing rounding and thousand/million scaling) in the evidence read. */
export function unverifiedNumbers(answer: string, evidence: string) {
  const known = numbersIn(evidence).map(n => n.value);
  const matches = (value: number, decimals: number) => known.some(e => [e, e * 1000, e / 1000].some(candidate => {
    const factor = 10 ** decimals;
    return Math.abs(Math.round(candidate * factor) / factor - value) < 1e-9 || Math.abs(candidate - value) < 1e-9;
  }));
  return numbersIn(answer).filter(n => {
    if (Number.isInteger(n.value) && n.value <= 12 && n.decimals === 0) return false;
    if (UNIT_CONSTANTS.has(n.value)) return false;
    const before = answer.slice(Math.max(0, n.index - 14), n.index);
    if (REFERENCE_BEFORE.test(before)) return false;
    if (/^(?:st|nd|rd|th)\b/i.test(answer.slice(n.index + n.raw.length, n.index + n.raw.length + 2))) return false;
    return !matches(n.value, n.decimals);
  }).map(n => n.raw);
}

export type AnswerIssue = { kind: "forecast" | "unverified-number" | "causal" | "political" | "framing" | "label"; detail: string };

/** All rule breaches in a generated answer. */
export function reviewAnswer(answer: string, evidence: string): AnswerIssue[] {
  const issues: AnswerIssue[] = [];
  if (containsForecast(answer)) issues.push({ kind: "forecast", detail: "The answer speculates about future values." });
  const unverified = [...new Set(unverifiedNumbers(answer, evidence))];
  if (unverified.length) issues.push({ kind: "unverified-number", detail: `These figures do not appear in the evidence you read or calculated: ${unverified.join(", ")}. Use only figures from read_indicator, read_publication_pages or calculate_from_records.` });
  for (const sentence of answer.split(/(?<=[.!?])\s+/)) {
    if (CAUSAL.test(sentence) && !ATTRIBUTION.test(sentence)) issues.push({ kind: "causal", detail: `Unattributed cause: "${sentence.slice(0, 160)}". State a cause only as what the publication says ("the publication attributes this to …"), otherwise describe the change without a cause.` });
  }
  if (EVALUATIVE_POLITICS.test(answer)) issues.push({ kind: "political", detail: "The answer judges political performance. Report the figures neutrally." });
  const loaded = answer.match(LOADED_WORDS);
  if (loaded) issues.push({ kind: "framing", detail: `Loaded word "${loaded[0]}". Use neutral wording such as "highest", "lowest", "above" or "below".` });
  for (const rule of LABELLED_FIGURES) if (rule.figure.test(answer) && !rule.label.test(answer)) issues.push({ kind: "label", detail: `State that ${rule.note}.` });
  return issues;
}

export const UNVERIFIED_ANSWER = "I couldn’t produce an answer whose figures I could fully check against the published data, so I haven’t shown it. Please open the sources below, or ask a narrower question about one indicator and one year.";

/** Rules added to the model's instructions, alongside FORECAST_RULE. */
export const CONDUCT_RULES = [
  "Stay politically neutral: never give opinions on parties, politicians, elections or how well a government performed; report figures without praise or blame.",
  "State a cause only when the publication gives it, and attribute it (\"the publication attributes this to …\"). Otherwise describe what changed, not why.",
  "Never provide or infer information about identifiable people, households, businesses or exact locations; refer to the published totals for Ghana, regions and groups.",
  "Do not give financial, investment, medical, legal or personal advice.",
  "Keep each figure's status with it: projection, provisional, revised, estimate, survey or census, and any stated margin of error. Do not present an estimate as an exact count.",
  "Use neutral wording for regions and groups (highest, lowest, above, below); avoid words such as worst, failing or backward.",
].join(" ");
