# Ask StatsChat

A persistent **Ask StatsChat** launcher sits at the bottom-right of every page. The welcome message begins: “I am StatsChat, an AI model for official statistics developed by Ghana Statistical Service.” It explains the supported Ghana in Numbers sources, references and unavailable-information handling. On desktop it opens a 400 px chat window anchored above the launcher; on phones it opens a full-screen sheet that respects safe areas and the on-screen keyboard. Minimising keeps the conversation (and any request in progress); **New conversation** clears it. It supports suggested questions, follow-ups, source citations, stop and retry. It never opens automatically. Page content reserves bottom padding so the launcher does not cover the last chart or table, and the Explain panels and search dialog sit above it in the top layer.

## Local configuration

The Next.js app reads `ghana-in-numbers/.env.local`. A workspace-level `.env` outside that app directory is not automatically loaded by Next.js. The key supplied for this implementation was configured in the app’s `.env.local` without displaying its value. For subsequent key changes, update the app file and restart the server.

```dotenv
OPENAI_API_KEY=your_complete_secret_key
OPENAI_MODEL=gpt-5.4-mini
AI_DAILY_REQUEST_LIMIT=80
AI_ASSISTANT_ENABLED=true
```

Only `OPENAI_API_KEY` is required. The other values shown are the defaults. Environment files are ignored by Git. The key is used only by the server route; never add a `NEXT_PUBLIC_` prefix. On the hosting platform, set these as server environment variables and redeploy. No deployment was performed as part of this implementation.

The model is configurable. GPT-5.4 Mini was verified as available to the configured account and used for the live checks. Official integration references: [Responses API](https://developers.openai.com/api/reference/responses/overview), [function calling](https://developers.openai.com/api/docs/guides/function-calling), and [model documentation](https://developers.openai.com/api/docs/models/gpt-5.4-mini).

## How answers are assembled

1. The server identifies candidate indicators from a catalogue of 105 datasets, including the series added in the October 2026 redesign (`data/publicationAdditions.ts`).
2. The model can search the catalogue and read selected records, filtered by year, region or another dimension. It can also search the 167-page source publication and read up to three physical PDF pages per tool call.
3. Tool results include the values, units, reference period, publication definitions, interpretation and source. Publication pages supply the original narrative, glossary and methods, with both physical PDF page numbers and printed labels.
4. Calculations use server code and references to numeric cells that were actually retrieved. Differences, percentage-point changes, percentage growth, ratios, percentages and unit conversions are supported. Unread cells, missing values, invalid numbers and zero-denominator ratios are rejected.
5. The model returns a structured answer. Source IDs must refer to datasets or publication pages actually read; search results alone cannot be cited. The server supplies the dashboard links and reference labels. Publication citations open `/publication#pdf-page-N`. Answers without retrieved evidence fall back to a request for an available indicator rather than presenting statistics.

The catalogue imports the same publication data as the charts. It also decodes the cached CPI, population projection, census and GDP JSON files. Publication datasets are the default for publication questions. Cached snapshots retain their source and fetch date; they are not live statistics. Filters and pagination keep large JSON results bounded. Migration charts and sex-composition cards now share their data exports with the assistant.

The model has no general filesystem, shell, database-write or web-search tool. It cannot read environment files. JSON schemas and the server both validate tool arguments. Arbitrary arithmetic expressions are not evaluated. Retrieved evidence reduces unsupported answers but does not guarantee that every generated interpretation is correct; the interface keeps the cited source visible for review.

## Publication Markdown and page retrieval

The source is `2025 GIN-Draft 24-12Oct26-Final (1).pdf` in the workspace parent directory. Its extractable text is converted locally into `public/documents/ghana-in-numbers-2025.md`, with the matching retrieval/reader index in `data/publicationText.json`. Both files are committed application assets: runtime access requires no local PDF, external vector database or uploaded OpenAI file. The model receives relevant passages on demand, rather than the entire document on each question.

Regenerate after replacing the PDF using:

```sh
python3 scripts/convert-gin-publication.py
node scripts/check-assistant.cjs
```

The converter requires Poppler's `pdfinfo` and `pdftotext`. It records the source PDF SHA-256, Markdown SHA-256, physical page number and detected printed label. All 167 physical pages have sections; 164 contain extractable text. Physical numbers are stable citation IDs because some printed labels repeat. Narrative line wraps are joined and aligned text is preserved in fenced blocks. The `/publication` reader provides page anchors and a Markdown download.

This is a text conversion, not a reconstruction of images, maps or plotted marks. Pages without extractable text are explicitly marked, and ambiguous column layouts must not be interpreted as precise numeric evidence. Original publication errors remain visible. Retrieval attaches the known grassland-carbon correction on printed p. 97 (PDF p. 108); model instructions prioritise audited datasets and documented corrections over contradictory original prose. Structured chart records remain the numerical calculation source. Document-only figures must be attributed with their period and caveats.

## Usage and request limits

Each question allows at most five model requests, twelve tool calls and 1,600 output tokens per model request. Further requests stop after 45,000 cumulative tokens, and timeouts bound the request duration. Automatic provider retries are disabled.

The initial request limiter allows five questions per minute and thirty per day per client address, eighty per day across one server process by default, and four concurrent questions. These counters are **in memory**: restarts reset them and separate serverless instances do not share them. They are not a hard dollar spending cap. Before a broad public launch, move usage counters to shared persistent storage and configure the account’s billing controls.

Only bounded user/assistant text is sent in conversation history. The application does not persist chats in a database or browser storage. Responses use `store: false`; this is not a claim about all provider retention policies. Request bodies, credentials and provider error messages are not logged by the route.

## Validation

- `node scripts/check-assistant.cjs`: source catalogue, JSON filters, units/period anchors, paging, arithmetic and access rejection; 167-page index/Markdown integrity, search relevance, physical/printed labels, citation eligibility, empty-page rejection, invalid page bounds and grassland correction preservation.
- `node --experimental-strip-types scripts/check-report-data.mjs`: publication data consistency.
- `npm run build`: TypeScript, production compilation and routes.
- Browser checks with a local simulated provider: retrieval/calculation loop, citations, follow-ups, clear/stop, keyboard/focus, mobile fit, malformed requests, origin rejection and error/retry behavior.
- Six live OpenAI questions: population growth (9.0 million / 36.4%), December versus annual-average inflation, Q3 versus Q1–Q3 NEET (1.6 percentage points), nominal/real GDP, Greater Accra’s cached projection, and refusal to invent an unemployment forecast for 2055.
- Three live publication questions: preface audience/purpose, youth demographic-dividend recommendations, and the grassland-carbon prose correction. All returned verified page citations; the carbon answer also cited the audited numerical dataset.
- Publication browser checks at 1440 px and 390 px: downloadable Markdown hash, all 167 sections, direct physical-page anchors, source-link navigation, automatic chat minimisation when opening a publication citation, and no horizontal page overflow or browser runtime errors.

The local `.env` assignment formatting was corrected before successful authentication. No secret key was printed, committed or embedded in the client bundle.
