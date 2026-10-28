import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function DataStoryCard() {
  return (
    <Link href="/youth-bulge" className="on-dark group flex h-full flex-col justify-between rounded-[var(--radius-lg)] bg-nav p-5 text-white shadow-card transition-colors hover:bg-[#2C2270]">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-white/70">Thematic deep dive</p>
        <h3 className="mt-2 text-lg font-semibold leading-snug text-white">The youth bulge: a window that is narrowing</h3>
        <p className="mt-2 text-[13.5px] leading-relaxed text-white/85">About 35% of Ghana’s projected 33.7 million people, roughly 12 million, were aged 15–35 in 2025. Youth unemployment averaged 32.4% for ages 15–24 across Q1–Q3 2025.</p>
      </div>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-white">Explore the youth deep dive <ArrowRight size={16} aria-hidden className="transition-transform group-hover:translate-x-0.5" /></span>
    </Link>
  );
}
