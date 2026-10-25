import type { Metadata } from "next";
import DashboardShell from "@/components/layout/DashboardShell";
import { PageBody, PageHeader } from "@/components/ui/Page";
import publication from "@/data/publicationText.json";

export const metadata: Metadata = { title: "Publication text | Ghana in Numbers" };

export default function PublicationPage() {
  return (
    <DashboardShell>
      <PageBody>
        <PageHeader
          eyebrow="Source publication"
          title="Ghana in Numbers 2025"
          description="Read the publication text used by the statistical assistant. Citations identify the physical PDF page and the printed page label, which can differ."
          meta={[{ label: "Publisher", value: publication.publisher }, { label: "PDF pages", value: String(publication.pageCount) }]}
          aside={<a href={publication.markdownUrl} download className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-brand px-4 text-sm font-semibold text-white hover:opacity-90">Download Markdown</a>}
        />

        <div className="mb-6 rounded-xl border border-line bg-surface p-5 text-sm leading-relaxed text-muted">
          <p className="break-words"><span className="font-semibold text-ink">Source:</span> {publication.sourceFilename}</p>
          <p className="mt-2">This text conversion preserves the original wording, including published inconsistencies. Images, maps and plotted marks are not reproduced. Column-aligned material retains its text layout; consult the original PDF for visual interpretation. The assistant uses audited dashboard data for numerical comparisons and calculations.</p>
        </div>

        <details className="mb-8 rounded-xl border border-line bg-surface p-5">
          <summary className="cursor-pointer text-sm font-semibold text-brand">Browse PDF pages</summary>
          <nav aria-label="Publication pages" className="mt-4 max-h-80 overflow-y-auto">
            <ol className="grid gap-2 text-sm sm:grid-cols-2">
              {publication.pages.map(page => (
                <li key={page.id}><a href={`#pdf-page-${page.pdfPage}`} className="block rounded-md p-2 text-body hover:bg-brand-soft hover:text-brand">PDF {page.pdfPage}{page.printedPage ? ` · printed ${page.printedPage}` : ""} — {page.title}</a></li>
              ))}
            </ol>
          </nav>
        </details>

        <div className="mx-auto max-w-4xl space-y-6">
          {publication.pages.map(page => (
            <article key={page.id} id={`pdf-page-${page.pdfPage}`} aria-labelledby={`${page.id}-heading`} className="min-w-0 scroll-mt-6 rounded-xl border border-line bg-surface p-5 shadow-sm sm:p-8">
              <h2 id={`${page.id}-heading`} className="mb-5 border-b border-line pb-3 text-sm font-semibold text-brand">PDF page {page.pdfPage}{page.printedPage ? ` · Printed page ${page.printedPage}` : " · No printed label identified"}</h2>
              {page.printedPage === "97" && <p className="mb-5 rounded-lg border border-line bg-surface-muted p-4 text-sm leading-relaxed text-body">Correction used in the dashboard: grassland soil carbon (202.8 Mt C) plus non-soil carbon (141.2 Mt C) totals 344.0 Mt C. The original prose below gives 334.0 Mt C.</p>}
              {!page.hasExtractableText && <p className="text-sm italic text-muted">No extractable text on this PDF page. Consult the original PDF for its visual content.</p>}
              <div className="space-y-4 text-[15px] leading-7 text-body">
                {page.blocks.map((block, index) => block.kind === "heading" ? (
                  <h3 key={index} className="pt-2 text-lg font-semibold leading-snug text-ink">{block.text}</h3>
                ) : block.kind === "layout" ? (
                  <pre key={index} tabIndex={0} aria-label={`Source text layout on PDF page ${page.pdfPage}`} className="max-w-full overflow-x-auto rounded-lg border border-line bg-surface-muted p-4 text-xs leading-6"><code>{block.text}</code></pre>
                ) : <p key={index}>{block.text}</p>)}
              </div>
            </article>
          ))}
        </div>
      </PageBody>
    </DashboardShell>
  );
}
