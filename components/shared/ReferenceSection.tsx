import { Children, isValidElement, type ReactNode } from "react";
import CardExplanation from "./CardExplanation";
import { indicatorExplanations } from "@/data/indicatorExplanations";

function textContent(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(textContent).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) return textContent(node.props.children);
  return "";
}

export function ReferenceSection({ id, title, source, guide, children }: { id?: string; title: string; source: string; guide?: string; children: ReactNode }) {
  const entries = guide ? indicatorExplanations[guide] ?? [] : [];
  const childNodes = Children.toArray(children);
  const paragraphs = guide ? childNodes.filter(child => isValidElement(child) && child.type === "p") : [];
  const data = guide ? childNodes.filter(child => !(isValidElement(child) && child.type === "p")) : childNodes;
  return <section id={id} className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm space-y-4">
    <div className="flex items-start justify-between gap-4">
      <div><h2 className="text-lg font-bold text-slate-800">{title}</h2><p className="text-xs text-slate-500 mt-1">Source: Ghana in Numbers 2025 · {source}</p></div>
      {entries.length > 0 && <CardExplanation title={title} meaning={entries.map(entry => `${entry.name}\n${entry.meaning}`).join("\n\n")} story={paragraphs.length ? paragraphs.map(textContent).join("\n\n") : entries.map(entry => entry.reading).join("\n\n")} why={entries.map(entry => `${entry.name}\n${entry.why}`).join("\n\n")} source={source} />}
    </div>
    {data}
  </section>;
}

export function ReferenceTable({ headings, rows }: { headings: string[]; rows: (string | number)[][] }) {
  return <div className="overflow-x-auto"><table className="w-full text-sm text-left">
    <thead className="bg-slate-50 text-slate-600"><tr>{headings.map(h => <th key={h} className="px-3 py-2 font-semibold">{h}</th>)}</tr></thead>
    <tbody>{rows.map((row, i) => <tr key={i} className="border-b border-slate-100 last:border-0">{row.map((cell,j) => <td key={j} className="px-3 py-2 text-slate-700 tabular-nums">{cell}</td>)}</tr>)}</tbody>
  </table></div>;
}
