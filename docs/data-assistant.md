# Ask Ghana in Numbers

The top-bar **Ask AI** button opens a right-hand chat panel throughout the dashboard. It supports follow-up questions, suggested questions, links to the dashboard sources, stopping a request and starting a new conversation. Desktop and mobile share the same panel.

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

1. The server identifies candidate indicators from a catalogue of 83 datasets.
2. The model can search the catalogue and read selected records, filtered by year, region or another dimension.
3. Tool results include the values, units, reference period, publication definitions, interpretation and source.
4. Calculations use server code and references to numeric cells that were actually retrieved. Differences, percentage-point changes, percentage growth, ratios, percentages and unit conversions are supported. Unread cells, missing values, invalid numbers and zero-denominator ratios are rejected.
5. The model returns a structured answer. Source IDs must refer to retrieved datasets; the server supplies the dashboard links and reference labels. Answers without retrieved evidence fall back to a request for an available indicator rather than presenting statistics.

The catalogue imports the same publication data as the charts. It also decodes the cached CPI, population projection, census and GDP JSON files. Publication datasets are the default for publication questions. Cached snapshots retain their source and fetch date; they are not live statistics. Filters and pagination keep large JSON results bounded. Migration charts and sex-composition cards now share their data exports with the assistant.

The model has no general filesystem, shell, database-write or web-search tool. It cannot read environment files. JSON schemas and the server both validate tool arguments. Arbitrary arithmetic expressions are not evaluated. Retrieved evidence reduces unsupported answers but does not guarantee that every generated interpretation is correct; the interface keeps the cited source visible for review.

## Usage and request limits

Each question allows at most five model requests, twelve tool calls and 1,600 output tokens per model request. Further requests stop after 45,000 cumulative tokens, and timeouts bound the request duration. Automatic provider retries are disabled.

The initial request limiter allows five questions per minute and thirty per day per client address, eighty per day across one server process by default, and four concurrent questions. These counters are **in memory**: restarts reset them and separate serverless instances do not share them. They are not a hard dollar spending cap. Before a broad public launch, move usage counters to shared persistent storage and configure the account’s billing controls.

Only bounded user/assistant text is sent in conversation history. The application does not persist chats in a database or browser storage. Responses use `store: false`; this is not a claim about all provider retention policies. Request bodies, credentials and provider error messages are not logged by the route.

## Validation

- `node scripts/check-assistant.cjs`: source catalogue, JSON filters, units/period anchors, paging, arithmetic and access rejection.
- `node --experimental-strip-types scripts/check-report-data.mjs`: publication data consistency.
- `npm run build`: TypeScript, production compilation and routes.
- Browser checks with a local simulated provider: retrieval/calculation loop, citations, follow-ups, clear/stop, keyboard/focus, mobile fit, malformed requests, origin rejection and error/retry behavior.
- Six live OpenAI questions: population growth (9.0 million / 36.4%), December versus annual-average inflation, Q3 versus Q1–Q3 NEET (1.6 percentage points), nominal/real GDP, Greater Accra’s cached projection, and refusal to invent an unemployment forecast for 2055.

The local `.env` assignment formatting was corrected before successful authentication. No secret key was printed, committed or embedded in the client bundle.
