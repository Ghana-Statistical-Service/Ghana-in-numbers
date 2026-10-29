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
