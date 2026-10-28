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
// Starters and follow-ups only come from the question bank, and each question must lead search to the dataset that answers it.
const { datasetQuestions, answerableQuestions, followUpQuestions, chooseSuggestions, starterQuestions, starterPaths } = require('../lib/assistant/questions.ts');
const catalogueIds = new Set(indicatorCatalogue.map(item => item.id));
assert.equal(answerableQuestions.length, Object.values(datasetQuestions).flat().length, 'Questions are unique');
for (const [id, questions] of Object.entries(datasetQuestions)) {
  assert.ok(catalogueIds.has(id), id);
  for (const question of questions) assert.ok(findIndicators(question).some(item => item.id === id), `${question} should find ${id}`);
}
for (const page of ['/', '/data-story', ...starterPaths]) {
  assert.equal(starterQuestions(page).length, 3, page);
  starterQuestions(page).forEach(question => assert.ok(answerableQuestions.includes(question), question));
}
assert.equal(starterQuestions('/youth-bulge'), starterQuestions('/youth-bulge/anything'));
const menu = followUpQuestions(['neet-annual', 'youth-neet-regions'], ['what does neet measure']);
assert.deepEqual(menu, ['How has the youth NEET rate changed since 2022?', 'Which region had the highest youth NEET rate in Q3 2025?']);
assert.deepEqual(chooseSuggestions(['Which region had the highest youth NEET rate in Q3 2025', 'What will unemployment be in 2055?'], menu), ['Which region had the highest youth NEET rate in Q3 2025?', 'How has the youth NEET rate changed since 2022?']);
assert.deepEqual(followUpQuestions(['unknown-dataset'], []), starterQuestions('/'));
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
// The publication is a bounded, page-referenced evidence source, independent of chart records.
const crypto = require('node:crypto');
const { publicationDocument, searchPublication, getPublicationSource } = require('../lib/assistant/publication.ts');
const markdown = fs.readFileSync(path.join(root, 'public', publicationDocument.markdownUrl), 'utf8');
assert.equal(crypto.createHash('sha256').update(markdown).digest('hex'), publicationDocument.markdownSha256);
assert.equal(publicationDocument.pageCount, 178);
assert.equal(publicationDocument.pages.length, 178);
assert.equal(new Set(publicationDocument.pages.map(page => page.id)).size, 178);
for (const [index, page] of publicationDocument.pages.entries()) {
  assert.equal(page.pdfPage, index + 1);
  assert.equal(page.id, `gin-pdf-page-${index + 1}`);
  assert.ok(markdown.includes(`<a id="pdf-page-${page.pdfPage}"></a>`));
  assert.ok(markdown.includes(page.markdown));
  assert.ok(page.markdown.length < 15000, 'Page reads stay bounded');
}
assert.equal(publicationDocument.sourceFilename, 'Ghana In Numbers 2025 main report.pdf');
assert.equal(publicationDocument.pages[7].printedPage, 'vii');
assert.equal(publicationDocument.pages[32].printedPage, '12');
assert.equal(searchPublication('preface')[0].pdf_page, 8);
assert.ok(searchPublication('demographic dividend skills investment youth').some(page => page.pdf_page === 129));
assert.ok(searchPublication('housing deficit affordability quality').some(page => page.pdf_page === 55 || page.pdf_page === 56));
assert.equal(searchPublication('grassland carbon')[0].pdf_page, 114);
assert.deepEqual(searchPublication('the and what'), []);
const publicationIds = new Set();
const publicationCells = new Map();
const publicationTool = (name, args) => runAssistantTool(name, args, publicationIds, publicationCells);
assert.ok(publicationTool('search_publication', { query: 'preface', limit: 3 }).pages.length);
assert.equal(publicationIds.size, 0, 'Search snippets cannot become cited evidence');
assert.ok(publicationTool('search_publication', { query: 'x'.repeat(501), limit: 3 }).error);
assert.ok(publicationTool('search_publication', { query: 'preface', limit: 7 }).error);
const preface = publicationTool('read_publication_pages', { pdf_pages: [8] });
assert.equal(preface.pages[0].printed_page, 'vii');
assert.match(preface.pages[0].markdown, /2,644,363 businesses/);
assert.match(preface.pages[0].markdown, /Preface/);
assert.ok(publicationIds.has('gin-pdf-page-8'));
assert.deepEqual([...publicationCells.keys()], [], 'Document text is not a numeric cell');
const grassland = publicationTool('read_publication_pages', { pdf_pages: [114] });
assert.equal(grassland.pages[0].correction_notice, null, 'The final edition corrected the grassland total');
assert.match(grassland.pages[0].markdown, /344\.0/);
const judgesProse = publicationTool('read_publication_pages', { pdf_pages: [149] });
assert.match(judgesProse.pages[0].correction_notice, /48\.8/);
assert.match(judgesProse.pages[0].markdown, /48\.6/, 'The conversion preserves original inconsistencies');
publicationTool('read_publication_pages', { pdf_pages: [1] });
assert.ok(!publicationIds.has('gin-pdf-page-1'), 'An image-only page cannot supply text evidence');
for (const pdf_pages of [[], [0], [179], [1.5], ['8'], ['../../.env'], [1, 2, 3, 4], null]) assert.ok(publicationTool('read_publication_pages', { pdf_pages }).error);
assert.equal(getPublicationSource('gin-pdf-page-8').href, '/publication#pdf-page-8');
assert.equal(getPublicationSource('../../.env'), null);
assert.equal(getPublicationSource('gin-pdf-page-1'), null);
assert.ok(publicationTool('calculate_from_records', { operation: 'sum', operands: [{ indicator_id: 'gin-pdf-page-8', row: 0, field: 'markdown' }], scale_factor: null }).error);
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
console.log(`Assistant checks passed: ${indicatorCatalogue.length} source datasets, ${answerableQuestions.length} answerable suggestion questions, ${publicationDocument.pageCount} publication pages, Markdown integrity, page search/citations, correction notices, period distinctions, cached JSON filters, paging, safe calculations, unread-evidence rejection, file-access rejection and request/concurrency limits.`);
