// Checks for the Multidimensional Poverty dashboard data (docs/mpi-dashboard-guidelines.md, rules marked [checked]).
// Annual series (2021 census report, district rankings 2021-2025, StatsBank) and quarterly survey series, kept apart.
// Run: node --experimental-strip-types scripts/check-mpi-data.mjs
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import * as mpi from "../data/mpiData.ts";
import * as q from "../data/mpiQuarterlyData.ts";

const file = JSON.parse(readFileSync(new URL("../data/mpiDistricts.json", import.meta.url), "utf8"));
const near = (a, b, tolerance) => Math.abs(a - b) <= tolerance + 1e-9;
const oneDecimal = v => near(v * 10, Math.round(v * 10), 1e-6);
let checks = 0;
const failures = [];
const ok = (condition, message) => { checks += 1; if (!condition) failures.push(message); };
const sumDims = d => d.health + d.living + d.education + d.employment;

// Method: 13 indicators, four dimensions of one quarter each, weights add to 1.
ok(mpi.indicators.length === 13 && mpi.dimensions.length === 4, "13 indicators in 4 dimensions");
ok(near(mpi.indicators.reduce((s, i) => s + i.weightValue, 0), 1, 1e-9), "indicator weights add to 1");
for (const d of mpi.dimensions) ok(near(mpi.indicators.filter(i => i.dimension === d.key).reduce((s, i) => s + i.weightValue, 0), 0.25, 1e-9), `${d.label} weighs one quarter`);
ok(Object.keys(mpi.deprivation2021).sort().join() === mpi.indicators.map(i => i.key).sort().join(), "one 2021 deprivation figure per indicator");

// National 2021: sexes add to the total; incidence equals people over household population; shares add to 100.
const n = mpi.national2021;
ok(n.sex.female.people + n.sex.male.people === n.people, "female and male counts add to the national count");
ok(near((n.people / n.householdPopulation) * 100, n.incidence, 0.05), "national incidence equals poor people over household population");
ok(near(sumDims(mpi.dimensions2021), 100, 0.5), "national dimension contributions add to 100");
ok(n.locality.urban.incidence < n.incidence && n.incidence < n.locality.rural.incidence, "national incidence lies between urban and rural");

// Regions 2021: 16, internally consistent, and they add up to the national figures exactly.
ok(mpi.regions.length === 16, "16 regions");
ok(mpi.regions.reduce((s, r) => s + r.people, 0) === n.people, "regional counts add to the national count");
ok(mpi.regions.reduce((s, r) => s + r.population, 0) === n.householdPopulation, "regional household populations add to the national total");
for (const r of mpi.regions) {
  ok(near((r.people / r.population) * 100, r.incidence, 0.06), `${r.region}: incidence equals poor people over household population`);
  ok(r.urban < r.incidence && r.incidence < r.rural, `${r.region}: incidence lies between urban and rural`);
  ok(near(sumDims(r.dims), 100, 0.5), `${r.region}: dimension contributions add to 100`);
}

// Household groups: one decimal, plausible, and groups that split everyone straddle the national figure.
for (const g of mpi.householdGroups) {
  ok(g.rows.every(r => oneDecimal(r.value) && r.value > 0 && r.value < 100), `${g.title}: values`);
  if (g.key !== "sector") ok(Math.min(...g.rows.map(r => r.value)) <= n.incidence && n.incidence <= Math.max(...g.rows.map(r => r.value)), `${g.title}: groups straddle the national incidence`);
}

// Districts: 261, complete, ranks consistent with incidence, contributions add to 100.
ok(file.districts.length === 261 && new Set(file.districts.map(d => d.name)).size === 261, "261 unique districts");
ok(file.years.join() === "2021,2022,2023,2024,2025", "district years");
ok(file.indicators.every(name => mpi.indicatorByStatsbank[name]) && file.indicators.length === 13, "StatsBank indicators map to the method table");
ok(new Set(file.districts.map(d => d.region)).size === 16 && file.districts.every(d => mpi.regions.some(r => r.region === d.region)), "district regions");
const shapes = new Set(file.districts.flatMap(d => d.shapes ?? [d.name]));
const geo = JSON.parse(readFileSync(new URL("../public/map/District.gh.json", import.meta.url), "utf8"));
ok(geo.features.every(f => shapes.has(f.properties.label)) && shapes.size === geo.features.length, "every map shape belongs to exactly one district");
const places = JSON.parse(readFileSync(new URL("../data/mpiPlaces.json", import.meta.url), "utf8"));
ok(places.length === 261 && places.every(([name, region]) => file.districts.some(d => d.name === name && d.region === region)), "place search list matches the district file");
for (const d of file.districts) {
  ok(d.headcount.length === 5 && d.rank.length === 5 && d.contributions.length === 5 && d.headcount.every(v => oneDecimal(v) && v > 0 && v < 100), `${d.name}: complete series`);
  ok(d.factsheet.includes(`/${d.region}/`) && d.factsheet.endsWith(".pdf"), `${d.name}: fact sheet`);
  ok(near((d.census2021.poor / d.census2021.population) * 100, d.headcount[0], 0.06), `${d.name}: 2021 incidence equals census poor over household population`);
  d.contributions.forEach((row, y) => ok(row.length === 13 && near(row.reduce((s, v) => s + v, 0), 100, 0.5), `${d.name} ${file.years[y]}: contributions add to 100`));
}
for (let y = 0; y < 5; y += 1) {
  const sorted = [...file.districts].sort((a, b) => a.rank[y] - b.rank[y]);
  ok(sorted.every((d, i) => d.rank[y] === i + 1), `${file.years[y]}: ranks run 1 to 261`);
  ok(sorted.every((d, i) => i === 0 || d.headcount[y] <= sorted[i - 1].headcount[y]), `${file.years[y]}: rank order follows incidence`);
}
// The census district table, the regional table and the national figure agree exactly.
ok(file.districts.reduce((s, d) => s + d.census2021.poor, 0) === n.people, "district census counts add to the national count");
for (const r of mpi.regions) {
  const inRegion = file.districts.filter(d => d.region === r.region);
  ok(inRegion.reduce((s, d) => s + d.census2021.poor, 0) === r.people && inRegion.reduce((s, d) => s + d.census2021.population, 0) === r.population, `${r.region}: district census counts add to the regional figures`);
}
// Spot check against the official fact sheet for Asunafo North Municipal.
const asunafo = file.districts.find(d => d.name === "Asunafo North Municipal");
ok(asunafo.headcount.join() === "26.2,35.9,29.2,22.4,12.4" && asunafo.census2021.poor === 38694, "Asunafo North incidence and 2021 count match its fact sheet");
ok(asunafo.contributions[4][file.indicators.indexOf("Insurance")] === 27.8 && asunafo.contributions[0][file.indicators.indexOf("Employment")] === 25.6, "Asunafo North contributions match its fact sheet");

// ---- Quarterly survey series ----
for (const row of q.nationalQuarterly) {
  ok(oneDecimal(row.incidence), `${row.quarter} incidence has one decimal`);
  if (row.mpi != null) ok(near(row.mpi, (row.incidence / 100) * (row.intensity / 100), 0.0011), `${row.quarter}: MPI equals H x A`);
  if (row.low != null) ok(row.low <= row.incidence && row.incidence <= row.high, `${row.quarter}: interval contains the estimate`);
}
ok(q.latest.quarter === q.latestQuarter, "latest quarter");
for (const d of q.dimensionContribution) ok(near(sumDims(d), 100, 0.5), `${d.quarter}: dimensions add to 100`);
for (const key of ["q2", "q3"]) ok(near(Object.values(q.indicatorContribution).reduce((s, v) => s + v[key], 0), 100, 0.5), `indicator contributions ${key} add to 100`);
ok(Object.keys(q.indicatorContribution).sort().join() === mpi.indicators.map(i => i.key).sort().join(), "one quarterly contribution per indicator");
for (const d of mpi.dimensions) {
  const sum = mpi.indicators.filter(i => i.dimension === d.key).reduce((s, i) => s + q.indicatorContribution[i.key].q3, 0);
  ok(near(sum, q.dimensionContribution.at(-1)[d.key], 0.35), `${d.label}: Table 6.7 indicators agree with Table 6.6 (2025 Q3)`);
}
ok(near(q.localityShareOfPoorQ3.urban + q.localityShareOfPoorQ3.rural, 100, 0.05), "locality shares add to 100");
for (const [region, d] of Object.entries(q.regionDimensionsQ3)) ok(near(sumDims(d), 100, 0.5), `${region}: quarterly dimensions add to 100`);
for (const h of Object.values(q.headshipDimensionsQ3)) ok(near(sumDims(h), 100, 0.5), "headship dimensions add to 100");
q.censoredQuarters.forEach((quarter, i) => {
  const incidence = q.nationalQuarterly.find(row => row.quarter === quarter).incidence;
  for (const [key, series] of Object.entries(q.censoredHeadcount)) ok(series.length === 7 && series[i] <= incidence, `${key} ${quarter}: censored headcount within incidence`);
});
ok(q.regionsQuarterly.length === 16 && q.regionsQuarterly.every(r => mpi.regions.some(x => x.region === r.region)), "16 quarterly regions with the same names as the census regions");
q.regionQuarters.forEach((quarter, i) => {
  const national = q.nationalQuarterly.find(row => row.quarter === quarter);
  // Published regional counts differ from the published national count by up to 0.17% (docs/document-data-audit.md), so the page never adds regions up.
  ok(near(q.regionsQuarterly.reduce((s, r) => s + r.people[i], 0) / national.people, 1, 0.002), `${quarter}: regional counts are within 0.2% of the national count`);
  for (const r of q.regionsQuarterly) ok(near(r.mpi[i], (r.incidence[i] / 100) * (r.intensity[i] / 100), 0.0016), `${r.region} ${quarter}: MPI equals H x A`);
});
for (const key of ["q2", "q3"]) ok(near(q.burdens.rows.reduce((s, r) => s + r[key].people, 0), q.burdens.population15Plus[key], 2), `burdens ${key} add to the total (within rounding)`);
// The two series stay in separate files: no quarterly figures in the annual data file.
const annualSource = readFileSync(new URL("../data/mpiData.ts", import.meta.url), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
ok(!/20\d\d Q[1-4]/.test(annualSource), "annual data file holds no quarterly figures");

assert.equal(failures.length, 0, `${failures.length} of ${checks} checks failed:\n- ${failures.join("\n- ")}`);
console.log(`MPI data: ${checks} checks passed.`);
