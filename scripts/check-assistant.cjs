// Load the TypeScript data/tool modules without running Next.js or making API calls.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function (name, ...rest) {
  if (name.startsWith('@/')) name = path.join(root, name.slice(2));
  return originalResolve.call(this, name, ...rest);
};
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, resolveJsonModule: true } }).outputText, filename);
const { indicatorCatalogue, findIndicators } = require('../lib/assistant/catalog.ts');
const { runAssistantTool } = require('../lib/assistant/tools.ts');
const ids = new Set(); const cells = new Map();
const run = (name, args) => runAssistantTool(name, args, ids, cells);
const read = (id, filters = [], limit = 80) => run('read_indicator', { indicator_id: id, filters, offset: 0, limit });
assert.equal(new Set(indicatorCatalogue.map(item => item.id)).size, indicatorCatalogue.length);
for (const item of indicatorCatalogue) {
  assert.ok(item.records.length, item.id);
  assert.ok(item.source && item.unit && item.period && item.href.startsWith('/'), item.id);
  assert.ok(!/\.env|OPENAI_API_KEY/.test(JSON.stringify(item)), item.id);
}
assert.equal(findIndicators('annual Ghana population size')[0].id, 'population-size');
assert.ok(findIndicators('regional monthly inflation 2026').some(item => item.id === 'cached-regional-inflation'));
assert.ok(read('../../.env').error);
assert.ok(read('population-size', [{ field: '__proto__', value: 'test' }]).error);
assert.ok(run('run_shell', { command: 'cat .env' }).error);
assert.ok(run('calculate_from_records', { operation: 'difference', operands: [{ indicator_id: 'population-size', row: 10, field: 'value' }, { indicator_id: 'population-size', row: 25, field: 'value' }], scale_factor: null }).error);
const population = read('population-size');
assert.equal(population.records.find(row => row.year === '2025').kind, 'projection');
assert.equal(population.records.find(row => row.year === '2021').kind, 'census');
const refs = [{ indicator_id: 'population-size', row: 10, field: 'value' }, { indicator_id: 'population-size', row: 25, field: 'value' }];
assert.equal(run('calculate_from_records', { operation: 'difference', operands: refs, scale_factor: null }).result, 9);
assert.ok(Math.abs(run('calculate_from_records', { operation: 'percent_change', operands: refs, scale_factor: null }).result - 36.437247) < 0.000001);
assert.ok(run('calculate_from_records', { operation: 'sum', operands: [{ indicator_id: 'population-size', row: 0, field: '__proto__' }], scale_factor: null }).error);
read('youth-neet-q3');
assert.equal(read('youth-neet-q3').records.find(row => row.group === 'National').rate1535, 19.5);
assert.equal(read('neet-annual').records.find(row => row.year === '2025').youth1535, 17.9);
assert.equal(read('cached-regional-inflation', [{ field: 'Month', value: '2025M12' }, { field: 'Region', value: 'Ghana' }]).records[0].value, 5.4);
assert.equal(read('cached-regional-projections', [{ field: 'Year', value: '2025' }, { field: 'Geographic_Area', value: 'Ghana' }]).records[0].Year, '2025');
const empty = read('population-size', [{ field: 'year', value: '2099' }]);
assert.equal(empty.matched_records, 0); assert.equal(empty.records.length, 0);
const first = read('population-size', [], 2); assert.equal(first.next_offset, 2);
assert.equal(read('monetary-financial').records.find(row => row.indicator === 'Monetary policy rate (%)')['2025'], 18);
assert.equal(read('gdp-expenditure').records.find(row => row.item === 'GDP at market prices').real, 209.6);
const { reserveAssistantRequest } = require('../lib/assistant/limits.ts');
const originalNow = Date.now;
const originalDailyLimit = process.env.AI_DAILY_REQUEST_LIMIT;
try {
  Date.now = () => 1700000000000;
  const simultaneous = Array.from({ length: 4 }, (_, i) => reserveAssistantRequest('parallel-' + i));
  assert.ok(simultaneous.every(Boolean));
  assert.equal(reserveAssistantRequest('parallel-overflow'), null);
  simultaneous.forEach(release => release());
  for (let i = 0; i < 5; i++) { const release = reserveAssistantRequest('minute-client'); assert.ok(release); release(); }
  assert.equal(reserveAssistantRequest('minute-client'), null);
  Date.now = () => 1700100000000;
  process.env.AI_DAILY_REQUEST_LIMIT = '2';
  for (const client of ['daily-a', 'daily-b']) { const release = reserveAssistantRequest(client); assert.ok(release); release(); }
  assert.equal(reserveAssistantRequest('daily-c'), null);
} finally {
  Date.now = originalNow;
  if (originalDailyLimit === undefined) delete process.env.AI_DAILY_REQUEST_LIMIT;
  else process.env.AI_DAILY_REQUEST_LIMIT = originalDailyLimit;
}
console.log(`Assistant checks passed: ${indicatorCatalogue.length} source datasets, catalogue search, period distinctions, cached JSON filters, paging, safe calculations, unread-cell rejection, file-access rejection and request/concurrency limits.`);
