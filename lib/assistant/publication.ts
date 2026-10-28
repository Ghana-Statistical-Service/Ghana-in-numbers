import publication from "@/data/publicationText.json";

export const publicationDocument = publication;
export const publicationPages = publication.pages;
// Chapter 11 pages (printed 128–130) whose prose was not updated with the revised Figure 6.2 values.
export const JUDGES_PROSE_PAGES = new Set([149, 150, 151]);
const stopWords = new Set("a an and are as at be been by can did do does explain for from give has have how i in into is it me of on or our please say says show tell that the their them there these they this to us used using was we were what when where which who why will with would you your about according publication document report ghana numbers 2025 pdf".split(" "));
function tokens(text: string) {
  return text.toLowerCase().normalize("NFKD").replace(/[’']/g, "").split(/[^a-z0-9]+/).filter(word => word.length > 2 && !stopWords.has(word)).map(word => word.length > 5 ? word.replace(/(?:ing|ies|s)$/, suffix => suffix === "ies" ? "y" : "") : word);
}
const index = publication.pages.map(page => {
  const words = tokens(page.markdown);
  const frequencies = new Map<string, number>();
  words.forEach(word => frequencies.set(word, (frequencies.get(word) ?? 0) + 1));
  return { page, frequencies, length: words.length, titleTokens: new Set(tokens(page.title)) };
});
const documentFrequency = new Map<string, number>();
index.forEach(item => item.frequencies.forEach((_, word) => documentFrequency.set(word, (documentFrequency.get(word) ?? 0) + 1)));
const averageLength = index.reduce((sum, item) => sum + item.length, 0) / index.length;

export function searchPublication(query: string, limit = 4) {
  const words = [...new Set(tokens(query.slice(0, 500)))];
  if (!words.length) return [];
  return index.map(item => {
    const score = words.reduce((sum, word) => {
      const frequency = item.frequencies.get(word) ?? 0;
      if (!frequency) return sum;
      const df = documentFrequency.get(word) ?? 0;
      const idf = Math.log(1 + (index.length - df + 0.5) / (df + 0.5));
      const bm25 = idf * frequency * 2.2 / (frequency + 1.2 * (0.25 + 0.75 * item.length / averageLength));
      return sum + bm25 + (item.titleTokens.has(word) ? idf * 1.8 : 0);
    }, 0);
    // Contents and figure lists are useful indexes, not the substantive passages they reference.
    const navigationPage = item.page.pdfPage >= 8 && item.page.pdfPage <= 13;
    return { ...item, score: navigationPage && !/contents|list of|index/i.test(query) ? score * 0.2 : score };
  }).filter(item => item.score > 0 && item.page.hasExtractableText).sort((a, b) => b.score - a.score).slice(0, Math.max(1, Math.min(6, limit))).map(({ page }) => {
    const body = page.markdown.replace(/[#`]/g, "");
    const firstMatch = words.map(word => body.toLowerCase().indexOf(word)).filter(position => position >= 0).sort((a, b) => a - b)[0] ?? 0;
    const start = Math.max(0, firstMatch - 80);
    return { id: page.id, pdf_page: page.pdfPage, printed_page: page.printedPage, title: page.title, excerpt: body.slice(start, start + 420), notice: "Search excerpt only. Read this page before using it as evidence." };
  });
}

export function getPublicationSource(id: string) {
  const page = publication.pages.find(entry => entry.id === id && entry.hasExtractableText);
  if (!page) return null;
  const heading = page.blocks.find(block => block.kind === "heading" && block.level === 3)?.text;
  const label = heading && heading.length <= 80 ? heading : `PDF page ${page.pdfPage}`;
  return { id: page.id, title: `Ghana in Numbers 2025 · ${label}`, href: `/publication#pdf-page-${page.pdfPage}`, reference: `Ghana Statistical Service · ${page.printedPage ? `printed page ${page.printedPage} · ` : ""}PDF page ${page.pdfPage}`, period: "Ghana in Numbers 2025 publication; individual statistics retain their stated reference periods" };
}

export function readPublicationPages(pageNumbers: unknown, readIds: Set<string>) {
  if (!Array.isArray(pageNumbers) || pageNumbers.length < 1 || pageNumbers.length > 3 || !pageNumbers.every(page => Number.isInteger(page) && page >= 1 && page <= publication.pageCount)) return { error: `Supply 1–3 physical PDF page numbers between 1 and ${publication.pageCount}. Printed page labels are not physical PDF page numbers.` };
  return {
    publication: publication.title, source_filename: publication.sourceFilename,
    extraction_notice: "Text-only Markdown conversion. Images, maps and chart marks are not inferred. Column-aligned blocks preserve PDF layout but may be ambiguous. Use audited structured datasets for figures and calculations where available; do not silently replace verified corrections with original prose errors.",
    pages: [...new Set(pageNumbers as number[])].map(pdfPage => {
      const page = publication.pages[pdfPage - 1];
      if (page.hasExtractableText) readIds.add(page.id);
      return { id: page.id, pdf_page: page.pdfPage, printed_page: page.printedPage, title: page.title, markdown: page.markdown,
        has_extractable_text: page.hasExtractableText, contains_figure_references: page.hasFigures,
        correction_notice: JUDGES_PROSE_PAGES.has(page.pdfPage) ? "Known inconsistency in the final edition: this Chapter 11 page still quotes the draft women-judges values (High Court 48.6%, Court of Appeal 40.3%). Figure 6.2 (printed page 86) and Table 2.1 give 48.8% and 39.0%, which the dashboard uses." : null };
    }),
  };
}
