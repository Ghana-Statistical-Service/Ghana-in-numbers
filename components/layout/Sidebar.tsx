"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Users2,
  GraduationCap,
  TrendingUp,
  Landmark,
  Leaf,
  Target,
  BookOpen,
  Wheat,
  Sparkles,
  Star,
  FileText,
  Download,
  Search,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { statOfDay } from "@/data/dummy";

const navItems = [
  {
    label: "Ghana at a Glance",
    icon: LayoutDashboard,
    href: "/",
    children: [
      { label: "Population and society",         icon: Users,        href: "/population-and-society" },
      { label: "Social Development",             icon: GraduationCap,href: "/social-development" },
      { label: "Business & Economy",             icon: TrendingUp,   href: "/business-and-economy" },
      { label: "Governance",                     icon: Landmark,     href: "/governance" },
      { label: "Environment and Climate change", icon: Leaf,         href: "/environment-and-climate-change" },
      { label: "Progress on SDGs",              icon: Target,       href: "/progress-on-sdgs" },
    ],
  },
  {
    label: "Thematic Deep Dives",
    icon: BookOpen,
    href: "#",
    children: [
      { label: "Youth bulge",                    icon: Users2, href: "/youth-bulge" },
      { label: "Agriculture, Forestry & Fishing", icon: Wheat,     href: "/agriculture-forestry-fishing" },
      { label: "The Next Ghana is Young",         icon: Sparkles,  href: "/data-story" },
    ],
  },
];

const bottomItems = [
  { label: "KPI Watchlist", icon: Star },
  { label: "Reports", icon: FileText },
  { label: "Data Downloads", icon: Download },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["Ghana at a Glance"]));

  function toggleExpand(label: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });
  }

  return (
    <aside
      className="flex flex-col h-screen w-64 flex-shrink-0 overflow-hidden"
      style={{ background: "var(--sidebar-bg)" }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 px-4 py-4 border-b border-white/10 hover:opacity-90 transition-opacity">
        <div className="w-10 h-10 flex-shrink-0">
          <Image
            src="/logo.svg"
            alt="GSS Logo"
            width={40}
            height={40}
            className="rounded"
          />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight">Ghana in Numbers</p>
          <p className="text-white/50 text-xs leading-tight">Official Statistics at Glance</p>
        </div>
      </Link>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin px-2 py-3">
        {navItems.map((parent) => {
          const ParentIcon = parent.icon;
          const isOpen = expanded.has(parent.label);
          return (
            <div key={parent.label}>
              <button
                onClick={() => toggleExpand(parent.label)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg mb-0.5 text-left transition-colors"
                style={{ color: "rgba(255,255,255,0.65)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "var(--sidebar-hover)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                }}
              >
                <ParentIcon size={16} className="flex-shrink-0" />
                <span className="flex-1 text-base font-medium">{parent.label}</span>
                {isOpen
                  ? <ChevronDown size={14} className="opacity-50" />
                  : <ChevronRight size={14} className="opacity-50" />}
              </button>

              {isOpen && parent.children.map((child) => {
                const ChildIcon = child.icon;
                const isActive = pathname === child.href && child.href !== "#";
                return (
                  <Link
                    key={child.label}
                    href={child.href}
                    className="w-full flex items-center gap-3 pl-8 pr-3 py-1.5 rounded-lg mb-0.5 text-left transition-colors"
                    style={{
                      background: isActive ? "var(--sidebar-active)" : "transparent",
                      color: isActive ? "#ffffff" : "rgba(255,255,255,0.55)",
                      display: "flex",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) (e.currentTarget as HTMLAnchorElement).style.background = "var(--sidebar-hover)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                    }}
                  >
                    <ChildIcon size={14} className="flex-shrink-0" />
                    <span className="text-base font-medium">{child.label}</span>
                  </Link>
                );
              })}
            </div>
          );
        })}

        <div className="my-3 border-t border-white/10" />

        {/* Search */}
        <div className="px-2 mb-3">
          <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
            <Search size={14} className="text-white/40 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search indicators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-white/70 text-xs w-full outline-none placeholder-white/30"
            />
          </div>
        </div>

        <div className="my-2 border-t border-white/10" />

        {/* Bottom items */}
        {bottomItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg mb-0.5 text-left transition-colors"
              style={{ color: "rgba(255,255,255,0.65)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "var(--sidebar-hover)";
                (e.currentTarget as HTMLButtonElement).style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.65)";
              }}
            >
              <Icon size={16} className="flex-shrink-0" />
              <span className="flex-1 text-base font-medium">{item.label}</span>
              <ChevronRight size={14} className="opacity-50" />
            </button>
          );
        })}
      </nav>

      {/* Stat of the Day */}
      <div
        className="mx-3 mb-3 p-3 rounded-xl"
        style={{ background: "rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">🍜</span>
          <p className="text-white font-semibold text-sm">Stat of the Day</p>
        </div>
        <p className="text-white font-bold text-base">
          {statOfDay.value}{" "}
          <span className="text-white/70 font-normal text-xs">{statOfDay.label}</span>
        </p>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-white/10">
        <p className="text-white/30 text-xs text-center">
          Powered by StatsBank | © GSS
        </p>
      </div>
    </aside>
  );
}
