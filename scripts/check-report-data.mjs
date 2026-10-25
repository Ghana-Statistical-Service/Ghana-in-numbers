import assert from 'node:assert/strict';
import * as population from '../data/populationData.ts';
import * as social from '../data/socialDevelopmentData.ts';
import * as economy from '../data/businessEconomyData.ts';
import * as environment from '../data/environmentData.ts';
import * as governance from '../data/governanceData.ts';
import * as youth from '../data/youthBulgeData.ts';
import * as sdg from '../data/sdgData.ts';
import * as additions from '../data/reportAdditions.ts';
import * as extra from '../data/publicationAdditions.ts';
import { indicatorExplanations } from '../data/indicatorExplanations.ts';
import { cardExplanations, kpiExplanationKeys } from '../data/cardExplanations.ts';

const close = (actual, expected, tolerance = 0.001) => assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} differs from ${expected}`);
// Annual chart must preserve census/projection distinctions while covering every year.
assert.deepEqual(population.populationSize.map(d => Number(d.year)), Array.from({ length:26 }, (_,i) => 2000+i));
assert.deepEqual(population.populationSize.filter(d => d.kind === 'census').map(d => d.year), ['2000','2010','2021']);
assert.deepEqual(population.populationSize.filter(d => d.kind === 'projection').map(d => d.year), ['2022','2023','2024','2025']);
for (const d of population.populationSize) assert.ok(d.value > 0);
for (const entries of Object.values(indicatorExplanations)) {
  assert.equal(new Set(entries.map(e => e.name)).size, entries.length);
  for (const e of entries) for (const key of ['name','meaning','reading','why','source']) assert.ok(e[key].trim());
}
for (const cards of [population.populationKPIs, social.socialDevelopmentKPIs, economy.businessEconomyKPIs, governance.governanceKPIs, environment.environmentKPIs]) {
  for (const card of cards) {
    const key = kpiExplanationKeys[card.label];
    assert.ok(cardExplanations[key], `Missing card explanation: ${card.label}`);
    assert.ok(cardExplanations[key].text && cardExplanations[key].source);
  }
}
// Cross-page reference figures and definitions from the PDF, not current/live statistics.
assert.equal(population.populationKPIs[0].value, String(population.populationSize.at(-1).value));
assert.equal(social.healthInsuranceCoverageData.at(-1).value, Number(social.socialDevelopmentKPIs.find(k => k.label === 'Health Insurance').value));
assert.equal(social.enrolmentRateData.at(-1).primaryNet, 83.2); // Figure 4.1, p. 28
assert.equal(social.enrolmentRateData.at(-1).jhsNet, 59.3);
assert.equal(governance.giftsToOfficialsData.at(-1).value, 16.8); // Wave 3, p. 92
assert.equal(governance.womenJudgesData.find(d => d.year === '2023').supreme, 46.2);
assert.equal(economy.realGdpData.at(-1).real, 209.6); // Figure 5.5, p. 38
assert.equal(economy.ppiSectorData.find(d => d.sector === 'Mining and Quarrying').value, 3.3); // Detailed Figure 5.15
assert.equal(sdg.povertyData.find(d => d.year === '2024').value, 25.2);
close(economy.sectorShare2025.reduce((s,d) => s + d.value, 0), 100);
close(population.ageGroupDistribution2025.reduce((s,d) => s + d.pct, 0), 100, 0.11);
for (const d of population.urbanRuralData) close(d.urban + d.rural, 100);
for (const d of economy.tradeGoodsData) close(d.export - d.import, d.balance, 0.11);
for (const d of sdg.povertyData) assert.ok(d.value >= 0 && d.value <= 100);
assert.deepEqual(sdg.foodInsecurityData.map(d => d.year), ['2022','2023','2024','2025']);
for (const [dimension, rows] of Object.entries(youth.neetRegionalData)) {
  assert.equal(new Set(rows.map(d => d.region)).size, 17, dimension);
  for (const d of rows) for (const v of [d.r1524,d.r1535]) assert.ok(v >= 0 && v <= 100);
}
for (const d of youth.neetData) {
  const dimension = { National:'regional', Urban:'urban', Rural:'rural', Male:'male', Female:'female' }[d.group];
  const national = youth.neetRegionalData[dimension].find(r => r.region === 'National');
  assert.equal(d.rate1535, national.r1535);
  assert.equal(d.rate1524, national.r1524);
}
close(environment.carbonRetentionData.find(d => d.landCover === 'Grassland').soil + environment.carbonRetentionData.find(d => d.landCover === 'Grassland').nonSoil, 344);
assert.equal(environment.monthlyRainfall2025.length, 12);
assert.equal(environment.monthlyTemperature2025.length, 12);
close(Math.max(...environment.monthlyRainfall2025.map(d => d.value)), 216.7);
close(Math.max(...environment.monthlyTemperature2025.map(d => d.value)), 30.4);
assert.equal(environment.forestReserveArea2025.length, 12); // Absent regions must not be zero-filled.
close(environment.forestReserveArea2025.reduce((s,d) => s + d.area, 0), environment.forestReserveTotal2025, 5);
close(additions.enterpriseTypes.slice(0,3).reduce((s,d) => s + Number(d[1].replaceAll(',','')), 0), 2644358);
for (const d of additions.informalTrade) close(d[1] - d[2], d[4], 0.02);
// Series added in the October 2026 redesign.
assert.equal(economy.labourParticipationData.find(d => d.year === '2024').employmentPopulation, 60.6); // Figure 5.17 label
for (const y of ['y2010', 'y2021', 'y2025']) close(Object.values(extra.regionalShare).reduce((s, r) => s + r[y], 0), 100, 0.15);
assert.equal(Object.keys(extra.regionalShare).length, 16);
for (const [region, f] of Object.entries(extra.internalMigrationFlows)) {
  const net = Number(additions.netMigration2021.find(([n]) => n === region)[1]);
  close(f.in - f.out, net, 1000); // Sankey totals reproduce Figure 3.11 net migration
}
close(Object.values(extra.internalMigrationFlows).reduce((s, f) => s + f.in, 0), Object.values(extra.internalMigrationFlows).reduce((s, f) => s + f.out, 0), 2);
for (const i of extra.livestockSeries.total.keys()) close(['poultry', 'goats', 'sheep', 'cattle', 'pigs'].reduce((s, k) => s + extra.livestockSeries[k][i], 0), extra.livestockSeries.total[i], 0.21);
assert.equal(extra.livestockSeries.years.length, extra.livestockSeries.poultry.length);
for (const d of extra.fishValue) if (d.aquaculture != null) close(d.marine + d.inland + d.aquaculture, d.total, 0.02);
assert.ok(extra.fishValue.filter(d => d.aquaculture == null).every(d => Number(d.year) <= 2014)); // unlabelled segments stay missing
close(extra.fishValue.at(-1).total, 20.44); close(extra.fishValue[0].total, 1.94); // values, matching p. 42 text
close(extra.fishQuantity[1].marine + extra.fishQuantity[1].inland + extra.fishQuantity[1].aquaculture, extra.fishQuantity[1].total, 1);
close(extra.tilapiaCatfish.at(-1).tilapia + extra.tilapiaCatfish.at(-1).catfish, 124428, 0.5);
close(extra.tilapiaCatfish[0].tilapia + extra.tilapiaCatfish[0].catfish, 32512, 0.5);
for (const i of extra.fiscalNominal.years.keys()) {
  const r = extra.fiscalNominal.revenue, e = extra.fiscalNominal.expenditure;
  close(r.tax[i] + r.nonTax[i] + r.socialContributions[i] + r.other[i] + r.grants[i], r.total[i], 2);
  close(e.compensation[i] + e.interest[i] + e.goodsServices[i] + e.capital[i] + e.grantsToUnits[i] + e.socialBenefits[i] + e.other[i] + e.outstandingClaims[i], e.commitment[i], 2);
  close(e.commitment[i] - e.arrearsClearance[i], e.cash[i], 2); // cash = commitment − net change in arrears
  close(r.total[i] - e.commitment[i], extra.fiscalNominal.balance.overallCommitment[i], 2);
}
for (const q of extra.informalBalanceByNeighbour) {
  const published = additions.informalTrade.find(r => r[0] === q.quarter)[4];
  close((q.burkina + q.coteDIvoire + q.togo) / 1000, published, 0.02);
}
close(extra.informalTransport.reduce((s, r) => s + r[1], 0), 38.4, 0.05);
for (const d of extra.tradeGoodsUsd) close(d.export - d.import, d.balance, 0.11);
close(extra.carbonStockChange.steps.reduce((s, [, v]) => s + v, extra.carbonStockChange.start), extra.carbonStockChange.end, 0.05);
for (const d of extra.agricultureSpending) close(d.spend / d.total / (d.gva / d.gdp), d.aoi, 0.0006); // AOI = budget share ÷ (GVA ÷ GDP), Table 5.2 money columns
close(extra.cropSeries.cassava.at(-1), 28.5); close(extra.cropSeries.rice[0], 0.6);
assert.equal(extra.neverVoted.length, 16);
assert.equal(extra.neverVoted.filter(r => r.flag).length, 4);
close(extra.pbciCombined.find(d => d.month === 'Apr 2025').value, 24.4);
close(Object.values(extra.populationDensity).find(() => true) && extra.populationDensity['Greater Accra'].y2021, 1681.3);
console.log('Publication data checks passed: source anchors, units/periods, totals, trade balances, regional coverage and cross-page consistency.');
