#!/usr/bin/env python3
"""Reproducible, local PDF text-to-Markdown conversion. No AI call or document upload."""
import argparse
import hashlib
import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DEFAULT_PDF = ROOT.parent / 'Ghana In Numbers 2025 main report.pdf'
MARKDOWN = ROOT / 'public/documents/ghana-in-numbers-2025.md'
INDEX = ROOT / 'data/publicationText.json'


def content_blocks(text):
    lines = text.replace('\r', '').splitlines()
    nonempty = [i for i, line in enumerate(lines) if line.strip()]
    printed = None
    if nonempty and re.fullmatch(r'(?:\d{1,3}|[ivxlcdm]+)', lines[nonempty[-1]].strip()):
        printed = lines[nonempty[-1]].strip()
        lines.pop(nonempty[-1])
    # Remove only the repeated running header, retaining the publication's body text.
    lines = [line for line in lines if not re.fullmatch(r'\s*Ghana in Numbers,\s*2025\s*', line)]
    blocks = []
    for raw in re.split(r'\n\s*\n', '\n'.join(lines).strip()):
        if not raw.strip():
            continue
        rows = raw.splitlines()
        first = rows[0].strip()
        named_heading = re.fullmatch(r'Foreword|Preface|Message from the Board|Acknowledgements|Executive Summary|Table of Contents|List of (?:Tables|Figures)|Abbreviations and Acronyms|Glossary', first, re.I)
        numbered_heading = re.match(r'^\d{1,2}(?:\.\d{1,2})*\.?\s+[A-Z]', first) and not re.search(r'\S {3,}\S', rows[0]) and len(first) < 120
        if named_heading or numbered_heading:
            heading_text = first
            rows = rows[1:]
            if numbered_heading and rows and len(rows[0].strip()) < 45 and re.match(r'^[A-Z][A-Za-z –&-]+$', rows[0].strip()) and not re.match(r'^(Figure|Table|Source|Ghana)\b', rows[0].strip()):
                heading_text += ' ' + rows.pop(0).strip()
            blocks.append({'kind': 'heading', 'text': heading_text, 'level': 3})
            if not rows:
                continue
            raw = '\n'.join(rows)
        joined = ' '.join(line.strip() for line in rows)
        aligned = sum(bool(re.search(r'\S {3,}\S', line)) for line in rows)
        heading = (
            re.match(r'^\d{1,2}(?:\.\d{1,2})*\.?\s+[A-Z]', joined)
            or re.match(r'^(Foreword|Preface|Message from the Board|Acknowledgements|Executive Summary|Table of Contents|List of (Tables|Figures)|Abbreviations and Acronyms|Glossary)(?:\s|$)', joined, re.I)
        )
        figure = re.match(r'^(Figure|Table)\s+\d+\.\d+\s*:', joined)
        if figure and len(joined) < 260 and not aligned:
            blocks.append({'kind': 'heading', 'text': joined, 'level': 4})
        elif heading and len(joined) < 160 and not aligned and len(rows) <= 4:
            blocks.append({'kind': 'heading', 'text': joined, 'level': 3})
        elif aligned >= 2 or (aligned and len(rows) <= 3) or any(re.search(r'\.{5,}', line) for line in rows):
            # Keep column associations in source layout rather than guessing table structure.
            blocks.append({'kind': 'layout', 'text': '\n'.join(line.rstrip() for line in rows)})
        else:
            joined = re.sub(r'-\s+(?=[a-z])', '-', joined)
            blocks.append({'kind': 'paragraph', 'text': joined})
    return printed, blocks


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('pdf', nargs='?', type=Path, default=DEFAULT_PDF)
    args = parser.parse_args()
    pdf = args.pdf.resolve()
    info = subprocess.run(['pdfinfo', str(pdf)], check=True, text=True, capture_output=True).stdout
    count = int(re.search(r'^Pages:\s+(\d+)', info, re.M).group(1))
    extracted = subprocess.run(['pdftotext', '-layout', '-enc', 'UTF-8', str(pdf), '-'], check=True, text=True, capture_output=True).stdout
    pages = extracted.split('\f')
    if len(pages) == count + 1 and not pages[-1].strip():
        pages.pop()
    if len(pages) != count:
        raise RuntimeError(f'Expected {count} PDF pages; extracted {len(pages)}.')
    pdf_hash = hashlib.sha256(pdf.read_bytes()).hexdigest()
    introduction = f'''# Ghana in Numbers 2025 — searchable publication text

Source: **{pdf.name}**  
Publisher: Ghana Statistical Service. Copyright © Ghana Statistical Service, 2026.  
PDF pages: {count}. Source PDF SHA-256: `{pdf_hash}`.

## About this conversion

This Markdown contains the PDF's extractable text, organised by physical PDF page with the printed page label retained where available. Physical page numbers are the stable citation identifiers: the publication contains repeated printed labels. The original wording and numerical inconsistencies are preserved rather than silently corrected.

Narrative line wraps are joined for reading. Tables and column-aligned material are kept in fenced text blocks to preserve associations. Images, maps, plotted marks and image-only chart labels are not reproduced or inferred. An empty text page does not imply a blank PDF page. Consult the original PDF for its visual content.

For dashboard answers, use the audited structured datasets for numerical comparisons and calculations. Use this text for explanations, context, glossary definitions and methodology. Consult the existing document-data audit when original prose and chart figures disagree; in particular the Chapter 11 prose (printed pages 128–130) still quotes the draft women-judges values (High Court 48.6%, Court of Appeal 40.3%), while Figure 6.2 and Table 2.1 give 48.8% and 39.0%.

## Page index

'''
    records = []
    contents = []
    for i, page in enumerate(pages, start=1):
        printed, blocks = content_blocks(page)
        label = f'printed page {printed}' if printed else 'no printed label identified'
        heading_blocks = [block['text'] for block in blocks if block['kind'] == 'heading' and block.get('level') == 3]
        title = heading_blocks[0] if heading_blocks else (blocks[0]['text'].strip().split('\n')[0][:100] if blocks else 'Visual or image-only page')
        pieces = []
        for block in blocks:
            if block['kind'] == 'heading':
                pieces.append('#' * block['level'] + ' ' + block['text'])
            elif block['kind'] == 'layout':
                pieces.append('```text\n' + block['text'] + '\n```')
            else:
                pieces.append(block['text'])
        markdown = '\n\n'.join(pieces) if pieces else '_No extractable text on this PDF page. Consult the original PDF._'
        records.append({'id': f'gin-pdf-page-{i}', 'pdfPage': i, 'printedPage': printed, 'title': title, 'markdown': markdown, 'blocks': blocks, 'hasFigures': bool(re.search(r'Figure\s+\d+\.\d+', page)), 'hasExtractableText': bool(blocks)})
        contents.append(f'<!-- pdf-page: {i}; printed-page: {printed or "unknown"} -->\n\n## PDF page {i} — {label}\n\n{markdown}\n')
    page_index = '\n'.join(f'- [PDF {page["pdfPage"]} / {page["printedPage"] or "unlabelled"}: {page["title"]}](#pdf-page-{page["pdfPage"]})' for page in records)
    # Explicit anchors are portable across Markdown renderers.
    body = '\n\n---\n\n'.join(f'<a id="pdf-page-{i}"></a>\n\n{part}' for i, part in enumerate(contents, start=1))
    output = introduction + page_index + '\n\n---\n\n' + body + '\n'
    MARKDOWN.parent.mkdir(parents=True, exist_ok=True)
    MARKDOWN.write_text(output, encoding='utf-8')
    manifest = {'title': 'Ghana in Numbers 2025', 'sourceFilename': pdf.name, 'publisher': 'Ghana Statistical Service', 'sourceSha256': pdf_hash, 'markdownSha256': hashlib.sha256(output.encode()).hexdigest(), 'markdownUrl': '/documents/ghana-in-numbers-2025.md', 'pageCount': count, 'conversion': 'Local pdftotext -layout; paragraph reflow; aligned blocks preserved; images not inferred', 'pages': records}
    INDEX.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'Converted {count} PDF pages; {sum(page["hasExtractableText"] for page in records)} have extractable text.')
    print(f'Markdown: {MARKDOWN.relative_to(ROOT)} ({len(output):,} characters).')
    print(f'Retrieval index: {INDEX.relative_to(ROOT)}; page labels and source checksums preserved.')


if __name__ == '__main__':
    main()
