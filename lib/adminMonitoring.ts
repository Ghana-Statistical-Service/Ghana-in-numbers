/**
 * Data layer for /adminmonitoring: the MMDA administrative data quality monitor.
 * Source files are built by scripts/build-admin-monitoring.py. Everything here is a sum, a share or a rank of
 * values in those files, worked out the same way as in the assessment report and the district factsheets.
 */

/** [records, completion %, repeats, small values, percentages over 100, possible outliers, conflicting figures, missing years, 2026 to 2030 years found] */
export type AreaRow = [number, number, number, number, number, number, number, string, string];

export type RawDistrict = {
  n: string; r: string; shapes: string[]; rec: number; exp: number; comp: number; sub: number; wb: number;
  rep: number; invS: number; invP: number; out: number; conf: number; first: string; last: string;
  /** Per year, 2015 to 2025: records, expected, repeats, invalid, outliers. */
  y: [number[], number[], number[], number[], number[]];
  a: AreaRow[];
};
export type AdminFile = { compiled: string; years: number[]; areas: string[]; districts: RawDistrict[] };
/** Loaded only when a district profile opens. `subs` rows: submitted, template, workbooks, records. */
export type AdminDetail = Record<string, { iy: number[][]; subs: [string, string, number, number][] }>;

export type CheckId = "repeats" | "invalid" | "outliers";
export type TabId = "overview" | "completeness" | "checks" | "districts" | "method";

export const tabs: { id: TabId; label: string; question: string }[] = [
  { id: "overview", label: "Overview", question: "How good is the data?" },
  { id: "completeness", label: "Completeness", question: "Is anything missing?" },
  { id: "checks", label: "Quality checks", question: "Can the values be used?" },
  { id: "districts", label: "Districts", question: "How is my district doing?" },
  { id: "method", label: "Method", question: "How is it assessed?" },
];

/** Status labels follow the district factsheet summary: at least 80%, 50 to under 80, under 50. */
export type StatusId = "strong" | "moderate" | "low";
export const statuses: Record<StatusId, { label: string; range: string; fg: string; bg: string; fill: string }> = {
  strong: { label: "Strong", range: "80% or more", fg: "#0B6E65", bg: "#E6F4F2", fill: "#0E8A7E" },
  moderate: { label: "Moderate", range: "50% to under 80%", fg: "#9A5512", bg: "#FBEFE2", fill: "#D17A22" },
  low: { label: "Low", range: "Under 50%", fg: "#963558", bg: "#F8E9EF", fill: "#B4436C" },
};
export const statusOrder: StatusId[] = ["strong", "moderate", "low"];
export const statusOf = (completion: number): StatusId => (completion >= 80 ? "strong" : completion >= 50 ? "moderate" : "low");

export const checks: Record<CheckId, {
  label: string; official: string; question: string; noun: string; countLabel: string; rateLabel: string; rule: string; reading: string;
}> = {
  repeats: {
    label: "Sent more than once", official: "Uniqueness", question: "Was anything sent more than once?", noun: "are repeat submissions",
    countLabel: "Repeat submissions", rateLabel: "Share of records that are repeats",
    rule: "A record is a repeat when the same district, indicator, variable, breakdown and year was reported in more than one submission. Repeats are counted once in the completeness figures, and the most recent value is the one kept.",
    reading: "A repeat is usually a correction or a resubmission. It matters when the two submissions give different figures, which are counted separately as conflicting figures.",
  },
  invalid: {
    label: "Broke a rule", official: "Validity", question: "Did the values follow the rules?", noun: "fail a validity rule",
    countLabel: "Records that fail a rule", rateLabel: "Share of records that fail a rule",
    rule: "Two rules were applied: a percentage above 100, and a small value (1 or 2) in a count field where such a value was not expected. These records may reflect entry errors or the use of codes in place of values.",
    reading: "A record that fails a rule should be reviewed with the department that produced it before it is used.",
  },
  outliers: {
    label: "Unusual values", official: "Accuracy", question: "Do any values look unusual?", noun: "are flagged as possible outliers",
    countLabel: "Possible outliers", rateLabel: "Share of records flagged as unusual",
    rule: "A value is flagged when it lies far outside the usual range for the same indicator, variable and breakdown.",
    reading: "A flag is not a finding of error. Large districts can correctly report large values, so flagged values should be verified, not assumed wrong.",
  },
};
export const checkOrder: CheckId[] = ["repeats", "invalid", "outliers"];

export type District = RawDistrict & { name: string; region: string; pctExpected: number; status: StatusId; invalid: number; nationalRank: number; regionRank: number; regionCount: number };

export const share = (part: number, whole: number) => (whole ? (part / whole) * 100 : 0);
export const countOf = (d: { rep: number; invalid: number; out: number }, check: CheckId) => (check === "repeats" ? d.rep : check === "invalid" ? d.invalid : d.out);
export const rateOf = (d: { rep: number; invalid: number; out: number; rec: number }, check: CheckId) => share(countOf(d, check), d.rec);

/** Rank 1 is the highest overall completion; districts with the same score share a rank. */
export function prepare(file: AdminFile): District[] {
  const base = file.districts.map(d => ({ ...d, name: d.n, region: d.r, pctExpected: share(d.rec, d.exp), status: statusOf(d.comp), invalid: d.invS + d.invP }));
  const rank = (list: typeof base, d: (typeof base)[number]) => 1 + list.filter(x => x.comp > d.comp).length;
  const byRegion = new Map<string, typeof base>();
  base.forEach(d => byRegion.set(d.region, [...(byRegion.get(d.region) ?? []), d]));
  return base.map(d => ({ ...d, nationalRank: rank(base, d), regionRank: rank(byRegion.get(d.region)!, d), regionCount: byRegion.get(d.region)!.length }));
}

export type AreaTotal = { area: string; rec: number; completion: number; rep: number; invS: number; invP: number; invalid: number; out: number; conf: number; noData: number };
export type YearTotal = { year: number; rec: number; exp: number; rep: number; invalid: number; out: number; pctExpected: number };
export type Scope = {
  name: string; districts: District[]; rec: number; exp: number; pctExpected: number; completion: number; sub: number; wb: number;
  rep: number; invS: number; invP: number; invalid: number; out: number; conf: number;
  byStatus: Record<StatusId, number>; years: YearTotal[]; areas: AreaTotal[];
};

/** Totals for a set of districts. `completion` is the plain average of the districts' overall completion, as in the report. */
export function summarise(name: string, list: District[], file: AdminFile): Scope {
  const sum = (pick: (d: District) => number) => list.reduce((t, d) => t + pick(d), 0);
  const rec = sum(d => d.rec), exp = sum(d => d.exp);
  const years = file.years.map((year, i) => {
    const [r, e, rep, invalid, out] = [0, 1, 2, 3, 4].map(k => sum(d => d.y[k][i]));
    return { year, rec: r, exp: e, rep, invalid, out, pctExpected: share(r, e) };
  });
  const areas = file.areas.map((area, i) => {
    const col = (k: number) => sum(d => d.a[i][k] as number);
    const invS = col(3), invP = col(4);
    return { area, rec: col(0), completion: list.length ? col(1) / list.length : 0, rep: col(2), invS, invP, invalid: invS + invP, out: col(5), conf: col(6), noData: list.filter(d => d.a[i][0] === 0).length };
  });
  const byStatus = { strong: 0, moderate: 0, low: 0 };
  list.forEach(d => { byStatus[d.status] += 1; });
  const invS = sum(d => d.invS), invP = sum(d => d.invP);
  return {
    name, districts: list, rec, exp, pctExpected: share(rec, exp), completion: list.length ? sum(d => d.comp) / list.length : 0,
    sub: sum(d => d.sub), wb: sum(d => d.wb), rep: sum(d => d.rep), invS, invP, invalid: invS + invP, out: sum(d => d.out), conf: sum(d => d.conf), byStatus, years, areas,
  };
}

/** A district reshaped to the same totals as a scope, so one set of components serves both. */
export function districtScope(d: District, file: AdminFile): Scope {
  return summarise(d.name, [d], file);
}

/* Formatting. Percentages to one decimal, as in the rest of the dashboard. */
export const int = (v: number) => Math.round(v).toLocaleString("en-GB");
export const pct = (v: number) => `${v.toFixed(1)}%`;
/** Small shares that would round to 0.0% are shown as "under 0.1%" so a real count is never printed as zero. */
export const rate = (v: number) => (v > 0 && v < 0.05 ? "<0.1%" : pct(v));
export const ordinal = (n: number) => { const s = ["th", "st", "nd", "rd"], v = n % 100; return `${n}${s[(v - 20) % 10] ?? s[v] ?? s[0]}`; };
export const longDate = (iso: string) => (iso ? new Date(`${iso.slice(0, 10)}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }) : "Not recorded");
export const perHundred = (v: number) => { const n = Math.round(v / 10); return n === 0 ? "fewer than 1 in 10" : n === 10 ? "almost all" : `about ${n} in 10`; };

/** The district factsheet's summary sentence. */
export function factsheetSentence(d: District, areas: string[]) {
  const rows = d.a.map((a, i) => ({ area: areas[i], c: a[1] }));
  const strong = rows.filter(r => r.c >= 80).length, mid = rows.filter(r => r.c >= 50 && r.c < 80).length;
  const low = rows.filter(r => r.c < 50).sort((x, y) => x.c - y.c);
  const show = (r: { area: string; c: number }) => `${r.area} (${r.c === 0 ? "no data" : `${r.c.toFixed(0)}%`})`;
  let s = `${strong} of 15 thematic areas are at least 80% complete`;
  if (mid) s += `; ${mid} ${mid === 1 ? "is" : "are"} between 50% and 79%`;
  if (low.length) {
    const none = low.filter(r => r.c === 0).length;
    s += `; ${low.length} ${low.length === 1 ? "is" : "are"} below 50%${none ? `, of which ${none} ${none === 1 ? "has" : "have"} no data` : ""}. Areas below 50%: ${low.slice(0, 6).map(show).join(", ")}${low.length > 6 ? " and others." : "."}`;
  } else {
    s += `. Weakest area: ${show([...rows].sort((x, y) => x.c - y.c)[0])}.`;
  }
  return s;
}
