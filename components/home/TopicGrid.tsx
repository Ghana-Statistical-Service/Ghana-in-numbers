import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { navGroups } from "@/lib/navigation";

// One or two anchor figures per topic, each with its reference period (Table 2.1, Ghana in Numbers 2025).
const anchors: Record<string, [string, string][]> = {
  "/population-and-society": [["58.7%", "urban, 2025 (projection)"], ["3.9", "children per woman, 2022"]],
  "/social-development": [["66.2%", "active NHIS coverage, 2025"], ["88.4%", "JHS completion, 2023/24"]],
  "/business-and-economy": [["GH¢1,434.1bn", "nominal GDP, 2025 (provisional)"], ["+GH¢148.3bn", "goods trade surplus, 2025"]],
  "/governance": [["14.9%", "women in Parliament, 2025"], ["16.8%", "gave a gift to an official, 2025"]],
  "/environment-and-climate-change": [["24,133.53 km²", "reported forest reserves, Dec 2025"], ["216.7 mm", "wettest month (June), 2025"]],
  "/progress-on-sdgs": [["23.0%", "multidimensionally poor, Q1–Q3 2025"], ["301", "maternal deaths per 100,000 live births, 2021"]],
  "/youth-bulge": [["21.9%", "unemployment, ages 15–35, Q1–Q3 2025"]],
  "/agriculture-forestry-fishing": [["0.02", "Agriculture Orientation Index, 2024"]],
  "/data-story": [["4", "stories of statistics in use"]],
};

export default function TopicGrid() {
  const items = navGroups.flatMap(g => g.items).filter(i => i.href !== "/");
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {items.map(item => (
        <li key={item.href}>
          <Link href={item.href} className="group flex h-full flex-col rounded-[var(--radius-lg)] border border-line bg-surface p-4 shadow-card transition-colors hover:border-brand-line">
            <span className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-soft text-brand"><item.icon size={17} aria-hidden /></span>
              <span className="flex-1 text-[15px] font-semibold text-ink">{item.label}</span>
              <ArrowRight size={16} aria-hidden className="text-subtle transition-transform group-hover:translate-x-0.5 group-hover:text-brand" />
            </span>
            <span className="mt-2 text-[13px] leading-relaxed text-muted">{item.description}</span>
            <span className="mt-3 flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-3">
              {(anchors[item.href] ?? []).map(([value, label]) => (
                <span key={label} className="min-w-0"><span className="tabular block text-[15px] font-semibold text-ink">{value}</span><span className="block text-xs text-subtle">{label}</span></span>
              ))}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
