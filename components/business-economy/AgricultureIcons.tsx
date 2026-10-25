import { Carrot, Fish, Leaf, Sprout, Wheat, type LucideIcon } from "lucide-react";
import { ChartCard, Qualifier } from "@/components/ui/Card";
import { DataDisclosure, DataTable } from "@/components/ui/Data";
import { BeforeAfter, type Tone } from "@/components/ui/Infographic";
import { cropProductionData } from "@/data/businessEconomyData";
import { fishQuantity } from "@/data/publicationAdditions";

const thousand = (t: number) => `${(t / 1000).toLocaleString("en-GB", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}k`;
const pctChange = (a: number, b: number) => ((b - a) / a) * 100;
const signedPct = (v: number) => `${v >= 0 ? "+" : "−"}${Math.abs(v).toLocaleString("en-GB", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`;

/** Fish production by source, 2010 and 2025, in thousand tonnes (the two years printed as quantities). */
export function FishProductionCard() {
  const [a, b] = [fishQuantity[0], fishQuantity.at(-1)!];
  const sources: { key: "aquaculture" | "inland" | "marine"; label: string; tone: Tone }[] = [
    { key: "aquaculture", label: "Aquaculture", tone: "amber" }, { key: "inland", label: "Inland", tone: "teal" }, { key: "marine", label: "Marine", tone: "blue" },
  ];
  return (
    <ChartCard title="Fish production" subtitle="Thousand tonnes, by source" period={`${a.year} and ${b.year}`} explain={{ indicator: "fish" }}
      notes={`Only these two years are printed as quantities. Components sum to ${(a.marine + a.inland + a.aquaculture).toLocaleString("en-GB")} and ${(b.marine + b.inland + b.aquaculture).toLocaleString("en-GB")} tonnes against published totals of ${a.total.toLocaleString("en-GB")} and ${b.total.toLocaleString("en-GB")} (rounding); the published totals are kept.`}
      source="Ministry of Fisheries and Aquaculture Development · p. 42"
      footer={<DataDisclosure><DataTable caption="Fish production by source, tonnes" headings={["Source", `${a.year} (tonnes)`, `${b.year} (tonnes)`, "Change (%)"]} rows={[...sources.map(s => [s.label, a[s.key], b[s.key], +pctChange(a[s.key], b[s.key]).toFixed(1)]), ["Total", a.total, b.total, +pctChange(a.total, b.total).toFixed(1)]]} decimals={[undefined, 0, 0, 1]} minWidth={420} /></DataDisclosure>}>
      <div className="grid gap-x-8 gap-y-5 md:grid-cols-2 min-[1440px]:grid-cols-4">
        {sources.map(s => (
          <BeforeAfter key={s.key} label={s.label} icon={Fish} tone={s.tone} before={{ value: a[s.key], label: a.year }} after={{ value: b[s.key], label: b.year }}
            format={thousand} change={signedPct(pctChange(a[s.key], b[s.key]))} lowerIsBetter={false} changeLabel={`${s.label.toLowerCase()} output`} />
        ))}
        <BeforeAfter label="Total" icon={Fish} tone="purple" before={{ value: a.total, label: a.year }} after={{ value: b.total, label: b.year }}
          format={thousand} change={signedPct(pctChange(a.total, b.total))} lowerIsBetter={false} changeLabel="all fish" />
      </div>
      <p className="mt-4 text-xs text-muted">k = thousand tonnes.</p>
    </ChartCard>
  );
}

const crops: { key: "cassava" | "maize" | "plantain" | "rice" | "yam"; label: string; icon: LucideIcon; tone: Tone }[] = [
  { key: "cassava", label: "Cassava", icon: Carrot, tone: "amber" }, { key: "maize", label: "Maize", icon: Wheat, tone: "amber" },
  { key: "plantain", label: "Plantain", icon: Leaf, tone: "teal" }, { key: "rice", label: "Rice", icon: Sprout, tone: "teal" }, { key: "yam", label: "Yam", icon: Carrot, tone: "purple" },
];

/** Major crop production, 2013 and 2024 (2024 provisional), million tonnes. */
export function CropProductionCard() {
  const [a, b] = [cropProductionData[0], cropProductionData.at(-1)!];
  const by = a.year, ey = b.year.replace("*", "");
  return (
    <ChartCard title="Major crop production" subtitle="Million tonnes" period={`${by} and ${ey}`} qualifier={<Qualifier tone="caution">{ey} provisional</Qualifier>} explain={{ indicator: "crops" }}
      notes="Quantities harvested, not yields or value. Each crop has its own scale; the full annual series is in the Agriculture, Forestry and Fishing deep dive."
      source="SRID, Ministry of Food and Agriculture (March 2024) · Figure 5.7, p. 44"
      footer={<DataDisclosure><DataTable caption="Major crop production, million tonnes" headings={["Crop", `${by}`, `${ey} (provisional)`, "Change (%)"]} rows={crops.map(c => [c.label, a[c.key], b[c.key], +pctChange(a[c.key], b[c.key]).toFixed(1)])} decimals={[undefined, 1, 1, 1]} minWidth={380} /></DataDisclosure>}>
      <ul className="grid gap-x-5 gap-y-5 sm:grid-cols-2 xl:grid-cols-3">
        {crops.map(c => (
          <li key={c.key}>
            <BeforeAfter label={c.label} icon={c.icon} tone={c.tone} before={{ value: a[c.key], label: by }} after={{ value: b[c.key], label: ey }}
              format={v => v.toFixed(1)} change={signedPct(pctChange(a[c.key], b[c.key]))} lowerIsBetter={false} changeLabel="million tonnes" />
          </li>
        ))}
      </ul>
    </ChartCard>
  );
}
