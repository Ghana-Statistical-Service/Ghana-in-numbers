import { findIndicators, getIndicator } from "./catalog";
import { searchPublication, readPublicationPages, publicationDocument } from "./publication";

export const assistantTools = [
  { type: "function" as const, name: "search_publication", description: "Search the full Ghana in Numbers 2025 publication Markdown for preface, explanations, glossary definitions, methods, narrative interpretation or material absent from chart datasets. Returns physical PDF page numbers and short excerpts; read pages before citing them.", strict: true, parameters: { type: "object", properties: { query: { type: "string", maxLength: 500 }, limit: { type: "integer", minimum: 1, maximum: 6 } }, required: ["query", "limit"], additionalProperties: false } },
  { type: "function" as const, name: "read_publication_pages", description: "Read 1–3 pages from the full publication Markdown using physical PDF page numbers returned by search_publication. Includes original wording, printed page labels, extraction limitations and correction notices. These pages may support narrative answers. Use structured datasets and calculate_from_records for statistical arithmetic.", strict: true, parameters: { type: "object", properties: { pdf_pages: { type: "array", minItems: 1, maxItems: 3, items: { type: "integer", minimum: 1, maximum: publicationDocument.pageCount } } }, required: ["pdf_pages"], additionalProperties: false } },
  { type: "function" as const, name: "find_indicators", description: "Find dashboard datasets for a question. Search concise indicator terms. Returns IDs, fields, units and reference periods; it does not itself return observations.", strict: true, parameters: { type: "object", properties: { query: { type: "string", maxLength: 300 } }, required: ["query"], additionalProperties: false } },
  { type: "function" as const, name: "read_indicator", description: "Read exact records plus definitions, interpretation, units and sources. Filters are case-insensitive exact matches on named fields; empty filters reads all rows up to limit. Returned _row indices are stable and can be used for calculations. Use offset to page through truncated results.", strict: true, parameters: { type: "object", properties: { indicator_id: { type: "string" }, filters: { type: "array", maxItems: 6, items: { type: "object", properties: { field: { type: "string" }, value: { type: "string" } }, required: ["field", "value"], additionalProperties: false } }, offset: { type: "integer", minimum: 0 }, limit: { type: "integer", minimum: 1, maximum: 80 } }, required: ["indicator_id", "filters", "offset", "limit"], additionalProperties: false } },
  { type: "function" as const, name: "calculate_from_records", description: "Calculate using numeric cells from datasets already read. Do not perform arithmetic in your answer. For difference, percentage-point difference, percent_change, ratio and percentage_of, operand order is [earlier/base, later/comparison]. difference = second minus first; percent_change = (second-first)/first*100; percentage_of = second/first*100. sum adds values. scale multiplies one numeric cell by scale_factor for explicit unit conversion. Numeric strings containing % or commas are accepted.", strict: true, parameters: { type: "object", properties: { operation: { type: "string", enum: ["difference", "percentage_point_difference", "percent_change", "ratio", "percentage_of", "sum", "scale"] }, operands: { type: "array", minItems: 1, maxItems: 12, items: { type: "object", properties: { indicator_id: { type: "string" }, row: { type: "integer", minimum: 0 }, field: { type: "string" } }, required: ["indicator_id", "row", "field"], additionalProperties: false } }, scale_factor: { type: ["number", "null"], enum: [null, 0.001, 0.00001, 0.000001, 1000, 100000, 1000000] } }, required: ["operation", "operands", "scale_factor"], additionalProperties: false } },
];

const isObject = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);
function numeric(value: unknown) {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value !== "string" || !/^-?[\d,]+(?:\.\d+)?%?$/.test(value.trim())) return null;
  const parsed = Number(value.replaceAll(",", "").replace("%", ""));
  return Number.isFinite(parsed) ? parsed : null;
}
export function runAssistantTool(name: string, args: unknown, readIds: Set<string>, readCells: Map<string, Set<number>>) {
  if (!isObject(args)) return { error: "Invalid tool arguments." };
  if (name === "search_publication") {
    if (typeof args.query !== "string" || !args.query.trim() || args.query.length > 500) return { error: "Supply search terms of up to 500 characters." };
    if (!Number.isInteger(args.limit) || Number(args.limit) < 1 || Number(args.limit) > 6) return { error: "Supply a result limit between 1 and 6." };
    return { publication: publicationDocument.title, pages: searchPublication(args.query, Number(args.limit)) };
  }
  if (name === "read_publication_pages") return readPublicationPages(args.pdf_pages, readIds);
  if (name === "find_indicators") return { indicators: findIndicators(typeof args.query === "string" ? args.query.slice(0, 300) : "") };
  if (name === "read_indicator") {
    if (typeof args.indicator_id !== "string") return { error: "Missing indicator ID." };
    const entry = getIndicator(args.indicator_id);
    if (!entry) return { error: "Unknown indicator. Use find_indicators to find a valid ID." };
    if (!Array.isArray(args.filters) || args.filters.length > 6 || !args.filters.every(filter => isObject(filter) && typeof filter.field === "string" && typeof filter.value === "string")) return { error: "Invalid filters." };
    const filters = args.filters as { field: string; value: string }[];
    const fields = Object.keys(entry.records[0] ?? {});
    if (filters.some(filter => !fields.includes(filter.field))) return { error: "Unknown filter field.", fields };
    const matches = entry.records.map((row, index) => ({ ...row, _row: index })).filter(row => filters.every(filter => String((row as Record<string, unknown>)[filter.field] ?? "").toLowerCase() === filter.value.toLowerCase()));
    const offset = Number.isInteger(args.offset) && Number(args.offset) >= 0 ? Number(args.offset) : 0;
    const limit = Number.isInteger(args.limit) ? Math.max(1, Math.min(80, Number(args.limit))) : 40;
    const selected = matches.slice(offset, offset + limit);
    if (selected.length) {
      readIds.add(entry.id);
      const seen = readCells.get(entry.id) ?? new Set<number>();
      selected.forEach(row => seen.add(row._row));
      readCells.set(entry.id, seen);
    }
    const samples = Object.fromEntries(fields.filter(field => entry.records.some(row => typeof row[field] === "string")).map(field => [field, [...new Set(entry.records.map(row => String(row[field])))].slice(0, 8)]));
    return { id: entry.id, title: entry.title, unit: entry.unit, period: entry.period, source: entry.source, notes: entry.notes, fields, filter_value_examples: samples, definitions: entry.definitions, matched_records: matches.length, returned_records: selected.length, next_offset: matches.length > offset + limit ? offset + limit : null, records: selected };
  }
  if (name === "calculate_from_records") {
    if (!Array.isArray(args.operands) || args.operands.length < 1 || args.operands.length > 12) return { error: "Supply 1–12 source cell references." };
    const operands: { indicator: string; row: number; field: string; value: number; unit: string }[] = [];
    for (const ref of args.operands) {
      if (!isObject(ref) || typeof ref.indicator_id !== "string" || !Number.isInteger(ref.row) || typeof ref.field !== "string") return { error: "Invalid cell reference." };
      const dataset = getIndicator(ref.indicator_id);
      if (!dataset || !readIds.has(dataset.id) || !readCells.get(dataset.id)?.has(Number(ref.row))) return { error: "Read each referenced row before calculating." };
      const record = dataset.records[Number(ref.row)];
      if (!record || !Object.hasOwn(record, ref.field)) return { error: "Unknown row or field." };
      const value = numeric(record[ref.field]);
      if (value === null) return { error: "Referenced cell is not an unambiguous numeric value." };
      operands.push({ indicator: dataset.id, row: Number(ref.row), field: ref.field, value, unit: dataset.unit });
    }
    const operation = String(args.operation);
    if (!["sum", "scale"].includes(operation) && operands.length !== 2) return { error: "This calculation requires two operands, [base, comparison]." };
    const [first, second] = operands;
    let result: number;
    switch (operation) {
      case "difference": case "percentage_point_difference": result = second.value - first.value; break;
      case "percent_change": if (first.value <= 0) return { error: "Percentage growth from a zero or negative base is not supported; use an absolute difference." }; result = (second.value - first.value) / first.value * 100; break;
      case "ratio": case "percentage_of": if (first.value === 0) return { error: "Division by zero is undefined." }; result = second.value / first.value * (operation === "percentage_of" ? 100 : 1); break;
      case "sum": result = operands.reduce((sum, item) => sum + item.value, 0); break;
      case "scale": if (operands.length !== 1 || ![0.001, 0.00001, 0.000001, 1000, 100000, 1000000].includes(Number(args.scale_factor))) return { error: "Use one cell and an allowed unit-conversion factor." }; result = first.value * Number(args.scale_factor); break;
      default: return { error: "Unknown calculation." };
    }
    if (!Number.isFinite(result)) return { error: "Calculation did not produce a finite number." };
    return { operation, operands, scale_factor: operation === "scale" ? args.scale_factor : null, result: Math.round(result * 1e6) / 1e6, reminder: "Retain source reference periods, units and denominators. Percentage-point difference is not percentage change. A computed sum does not replace a published rounded total." };
  }
  return { error: "Unknown tool. Only dashboard/publication retrieval and source-based calculation tools are available." };
}
