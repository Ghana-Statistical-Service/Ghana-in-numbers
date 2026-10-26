"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, Search, X } from "lucide-react";
import { navGroups } from "@/lib/navigation";
import FactOfTheWeek from "./FactOfTheWeek";

type Props = { onSearch: () => void; onNavigate?: () => void; onClose?: () => void; idPrefix?: string };

export function GssLockup({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex min-w-0 items-center gap-3">
      {/* The seal is drawn in navy line-work, so it sits on a white disc to keep its contrast on the purple sidebar. */}
      <span className={`flex shrink-0 items-center justify-center rounded-full bg-white ring-1 ring-white/30 ${compact ? "h-9 w-9 p-[3px]" : "h-11 w-11 p-1"}`}>
        <Image src="/logo.svg" alt="" width={44} height={43} className="h-full w-full object-contain" priority />
      </span>
      <span className="min-w-0 leading-tight">
        <span className={`block font-semibold tracking-tight text-white ${compact ? "text-[15px]" : "text-base"}`}>Ghana in Numbers</span>
        <span className="block text-xs text-white/75">Ghana Statistical Service</span>
      </span>
    </span>
  );
}

export default function Sidebar({ onSearch, onNavigate, onClose, idPrefix = "nav" }: Props) {
  const pathname = usePathname();
  // Detected after hydration so server and client markup match.
  const [isMac, setIsMac] = useState(false);
  useEffect(() => setIsMac(/Mac|iPhone|iPad/.test(navigator.platform)), []);

  return (
    <aside aria-label="Site" className="on-dark flex h-full w-[272px] shrink-0 flex-col bg-nav text-white">
      <div className="flex items-center justify-between gap-2 px-4 pb-4 pt-5">
        <Link href="/" onClick={onNavigate} aria-label="Ghana in Numbers, overview" className="rounded-lg">
          <GssLockup />
        </Link>
        {onClose && (
          <button type="button" onClick={onClose} aria-label="Close navigation" className="flex h-10 w-10 items-center justify-center rounded-lg text-white/80 hover:bg-white/10 hover:text-white">
            <X size={20} />
          </button>
        )}
      </div>

      <div className="px-3 pb-3">
        <button
          type="button"
          onClick={onSearch}
          className="flex h-10 w-full items-center gap-2.5 rounded-lg bg-white/10 px-3 text-left text-sm text-white/80 ring-1 ring-inset ring-white/15 transition-colors hover:bg-white/15 hover:text-white"
        >
          <Search size={16} aria-hidden className="shrink-0" />
          <span className="flex-1">Search indicators</span>
          <kbd className="hidden rounded border border-white/20 px-1.5 py-0.5 font-sans text-xs text-white/70 lg:inline">{isMac ? "⌘K" : "Ctrl K"}</kbd>
        </button>
      </div>

      <nav aria-label="Main" className="scrollbar-thin flex-1 overflow-y-auto px-3 pb-4">
        {navGroups.map((group, index) => (
          <div key={group.label ?? index} className={index ? "mt-5" : ""}>
            {group.label && <p id={`${idPrefix}-group-${index}`} className="mb-1.5 px-3 text-xs font-semibold uppercase tracking-[0.08em] text-white/60">{group.label}</p>}
            <ul aria-labelledby={group.label ? `${idPrefix}-group-${index}` : undefined} className="space-y-0.5">
              {group.items.map(item => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={`group relative flex min-h-10 items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${active ? "bg-white text-nav font-semibold shadow-sm" : "text-white/85 hover:bg-white/10 hover:text-white"}`}
                    >
                      <Icon size={18} aria-hidden className={`shrink-0 ${active ? "text-brand" : "text-white/70 group-hover:text-white"}`} />
                      <span className="leading-snug">{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="px-3 pb-3 pt-1 text-xs leading-relaxed text-white/70">
        <FactOfTheWeek onNavigate={onNavigate} />
        <a href="https://statsghana.gov.gh/" target="_blank" rel="noreferrer" className="ml-2 mt-2 inline-flex items-center gap-1.5 rounded text-white/85 underline-offset-2 hover:text-white hover:underline [@media(max-height:859px)]:hidden">
          statsghana.gov.gh <ExternalLink size={12} aria-hidden /><span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>
    </aside>
  );
}
