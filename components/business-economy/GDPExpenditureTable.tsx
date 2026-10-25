import { gdpExpenditure2025 } from "@/data/reportAdditions";

// Row order and nesting follow Table 5.1, printed page 39 of the publication.
const hierarchy = [
  { number: "1.", depth: 0, label: "Domestic demand" },
  { number: "1.1", depth: 1, label: "Consumption" },
  { depth: 2, label: "Household final consumption" },
  { depth: 2, label: "General government final consumption" },
  { depth: 2, label: "NPISH final consumption" },
  { number: "1.2", depth: 1, label: "Investment (gross capital formation)" },
  { number: "2.", depth: 0, label: "Net exports of goods and services" },
  { depth: 1, label: "Exports of goods and services" },
  { depth: 1, label: "Imports of goods and services" },
  { number: "3.", depth: 0, label: "GDP at market prices" },
];
const numberFormat = new Intl.NumberFormat("en-GB", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export default function GDPExpenditureTable() {
  const renderRow = (index: number) => {
    const item = hierarchy[index];
    const values = gdpExpenditure2025[index].slice(1);
    const total = index === hierarchy.length - 1;
    const group = item.depth === 0;
    const subtotal = index === 1 || index === 5;
    return <tr key={item.label} data-depth={item.depth} className={total ? "bg-nav text-white" : group ? "border-t border-slate-200 bg-slate-100/80 text-slate-800" : "border-t border-slate-100 text-slate-700 hover:bg-slate-50"}>
      <th scope="row" className={`py-3 pr-4 text-left ${group || subtotal ? "font-semibold" : "font-normal"} ${item.depth === 2 ? "pl-12" : item.depth === 1 ? "pl-8" : "pl-4"}`}>
        <span className="flex items-start gap-2">
          {item.number ? <span className={`shrink-0 tabular-nums ${total ? "text-white/85" : "text-muted"}`}>{item.number}</span> : <span className="mt-0.5 shrink-0 text-xs font-medium uppercase tracking-wide text-muted">of which</span>}
          <span>{item.label}</span>
        </span>
      </th>
      {values.map((value, column) => <td key={column} className={`whitespace-nowrap px-4 py-3 text-right tabular-nums ${group || subtotal ? "font-semibold" : ""}`}>{numberFormat.format(Number(value))}{column === 2 ? "%" : ""}</td>)}
    </tr>;
  };
  return <div className="space-y-3">
    <div className="overflow-x-auto rounded-[var(--radius-sm)] border border-line">
      <table className="w-full min-w-[680px] text-sm">
        <caption className="sr-only">GDP by expenditure, 2025. Consumption and investment are nested under domestic demand. Household, government and NPISH spending are nested under consumption. Exports and imports are shown under net exports.</caption>
        <thead className="bg-slate-50 text-xs text-slate-600">
          <tr>
            <th scope="col" className="px-4 py-3 text-left font-semibold">Expenditure item</th>
            <th scope="col" className="px-4 py-3 text-right font-semibold">Nominal<span className="block mt-1 font-normal">GH¢ billion · current prices</span></th>
            <th scope="col" className="px-4 py-3 text-right font-semibold">Real<span className="block mt-1 font-normal">GH¢ billion · 2013 prices</span></th>
            <th scope="col" className="px-4 py-3 text-right font-semibold">Real growth<span className="block mt-1 font-normal">2025 (%)</span></th>
          </tr>
        </thead>
        <tbody>{hierarchy.slice(0, -1).map((_, index) => renderRow(index))}</tbody>
        <tfoot>{renderRow(hierarchy.length - 1)}</tfoot>
      </table>
    </div>
    <div className="text-xs leading-relaxed text-subtle">Indented “of which” rows break down their parent; do not add them again. Net exports = exports − imports. GDP = domestic demand + net exports. NPISH: non-profit institutions serving households. Published rounded components may not sum exactly to totals.</div>
  </div>;
}
