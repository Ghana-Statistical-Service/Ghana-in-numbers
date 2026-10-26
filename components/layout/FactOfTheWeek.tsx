"use client";

import { useId, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowRight, Baby, Bird, Building2, ChevronLeft, ChevronRight, Fish, Gem, HandCoins, HeartPulse, Hourglass, Plane, Scale, ShieldPlus, Sparkles, Store, TrendingDown, TrendingUp, Users, Zap, type LucideIcon } from "lucide-react";
import { factOfTheWeek, weeklyFacts, type WeeklyFact } from "@/data/weeklyFacts";

const icons: Record<WeeklyFact["icon"], LucideIcon> = { heart: HeartPulse, baby: Baby, zap: Zap, shield: ShieldPlus, hourglass: Hourglass, bird: Bird, gem: Gem, scale: Scale, users: Users, fish: Fish, store: Store, plane: Plane, building: Building2, coins: HandCoins };
const subscribe = () => () => {};
// Written out in full so Tailwind finds them: below 860 px of height the card drops its comparison line.
const tallOnly = "[@media(max-height:859px)]:hidden";
const shortOnly = "hidden [@media(max-height:859px)]:inline";
const source = "rounded text-xs font-medium text-white/80 underline-offset-2 hover:text-white hover:underline";

/** A floating "Did you know?" card: one publication figure per week, with arrows to browse the rest. */
export default function FactOfTheWeek({ onNavigate }: { onNavigate?: () => void }) {
  const titleId = useId();
  // The week is read in the browser only, so a page rendered in an earlier week still hydrates cleanly.
  const week = useSyncExternalStore(subscribe, () => factOfTheWeek(), () => null);
  const [step, setStep] = useState(0);
  const count = weeklyFacts.length;
  const fact = weeklyFacts[((((week ?? 0) + step) % count) + count) % count];
  const Icon = icons[fact.icon];
  const falling = fact.change?.text.startsWith("−");
  const Trend = falling ? TrendingDown : TrendingUp;
  const arrow = "flex h-6 w-6 items-center justify-center rounded-md text-white/70 transition-colors hover:bg-white/12 hover:text-white";

  return (
    <section
      aria-labelledby={titleId}
      className={`group/fact relative isolate overflow-hidden rounded-[var(--radius-xl)] bg-[linear-gradient(150deg,#5040C9_0%,#3C2FA3_46%,#291E7C_100%)] p-3 text-white shadow-[0_16px_32px_-14px_rgba(6,3,28,0.85),0_2px_8px_rgba(6,3,28,0.35)] ring-1 ring-white/15 transition-[translate] duration-300 ease-[var(--ease)] hover:-translate-y-0.5 motion-safe:animate-[fact-float_7s_ease-in-out_infinite] hover:[animation-play-state:paused] ${week === null ? "invisible" : ""}`}
    >
      <span aria-hidden className="pointer-events-none absolute -right-12 -top-14 -z-10 h-36 w-36 rounded-full bg-[#F5C451]/25 blur-2xl" />
      <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
      <Icon aria-hidden size={92} strokeWidth={1.25} className="pointer-events-none absolute -bottom-5 -right-4 -z-10 rotate-[-12deg] text-white/[0.09] transition-transform duration-500 group-hover/fact:rotate-[-4deg] group-hover/fact:scale-105" />

      <div className="flex items-center justify-between gap-2">
        <p id={titleId} className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-[#F5C451]">
          <Sparkles size={14} aria-hidden />Did you know?
        </p>
        <div className="-my-1 -mr-1.5 flex items-center">
          <button type="button" onClick={() => setStep(s => s - 1)} aria-label="Previous fact" className={arrow}><ChevronLeft size={16} aria-hidden /></button>
          <button type="button" onClick={() => setStep(s => s + 1)} aria-label="Next fact" className={arrow}><ChevronRight size={16} aria-hidden /></button>
        </div>
      </div>

      {/* Announced only after the reader browses, not on page load. */}
      <div aria-live={step ? "polite" : "off"}>
        <div key={fact.id} className="motion-safe:animate-[fact-in_360ms_var(--ease)]">
          <p className="mt-2 flex items-end justify-between gap-2">
            <span className="flex min-w-0 items-baseline gap-1">
              <span className="tabular text-[30px] font-bold leading-none tracking-tight">{fact.value}</span>
              {fact.suffix && <span className="text-sm font-semibold text-white/80">{fact.suffix}</span>}
            </span>
            {fact.change && (
              <span className={`mb-0.5 inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold tabular ring-1 ring-inset ${fact.change.trend === "better" ? "bg-[#34D399]/15 text-[#A7F3D0] ring-[#A7F3D0]/25" : "bg-white/12 text-white/90 ring-white/20"}`}>
                <Trend size={13} aria-hidden /><span aria-hidden>{fact.change.text}</span><span className="sr-only">{fact.change.spoken}</span>
              </span>
            )}
          </p>
          {/* Short screens keep the figure, its unit and the page reference; taller ones add the comparison and the full source line. */}
          <p className="mt-1 min-h-8 text-xs font-medium leading-4 text-white/80">
            {fact.label}
            <span className={shortOnly}> · <Link href={fact.href} onClick={onNavigate} className={source}>p. {fact.page}<ArrowRight size={12} aria-hidden className="ml-0.5 inline" /></Link></span>
          </p>
          <p className={`mt-1.5 min-h-9 text-[13px] leading-[18px] text-white/90 ${tallOnly}`}>{fact.statement}</p>
          <Link href={fact.href} onClick={onNavigate} className={`mt-2 inline-flex items-center gap-1 ${source} ${tallOnly}`}>
            Ghana in Numbers 2025, p. {fact.page}<ArrowRight size={12} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
