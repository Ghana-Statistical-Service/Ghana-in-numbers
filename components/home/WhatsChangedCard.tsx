import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";

// Dated findings stated in the Executive Summary and chapters of Ghana in Numbers 2025 (pp. xv–xviii).
const findings = [
  { figure: "54.1% → 5.4%", text: "Year-on-year inflation, December 2022 to December 2025. Prices kept rising, but more slowly.", href: "/business-and-economy#prices", topic: "Prices" },
  { figure: "−6.9 → −1.0% of GDP", text: "Overall fiscal balance (commitment basis), 2024 to 2025; the primary balance moved to a 2.5% surplus.", href: "/business-and-economy#fiscal", topic: "Public finance" },
  { figure: "Close to 2 million", text: "People aged 15–35 neither employed nor in education or training in Q3 2025 (19.5% of the age group).", href: "/youth-bulge#neet", topic: "Youth" },
  { figure: "39.8%", text: "Food insecurity prevalence, Q1–Q3 2025 average (about 13.0 million people), up from 37.7% in 2024.", href: "/progress-on-sdgs#poverty-food", topic: "SDGs" },
];

export default function WhatsChangedCard() {
  return (
    <Card className="p-5">
      <h3 className="text-[15px] font-semibold text-ink">Key findings from the publication</h3>
      <p className="mt-1 text-[13px] text-muted">Each figure keeps its own reference period.</p>
      <ul className="mt-4 grid gap-x-8 gap-y-1 md:grid-cols-2">
        {findings.map(f => (
          <li key={f.figure}>
            <Link href={f.href} className="group grid h-full grid-cols-[minmax(0,1fr)_auto] items-start gap-3 border-t border-line py-3">
              <span>
                <span className="tabular block text-[17px] font-semibold tracking-tight text-ink">{f.figure}</span>
                <span className="mt-0.5 block text-[13px] leading-relaxed text-body">{f.text}</span>
              </span>
              <span className="flex items-center gap-1 text-xs font-medium text-brand">{f.topic}<ArrowRight size={14} aria-hidden className="transition-transform group-hover:translate-x-0.5" /></span>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}
