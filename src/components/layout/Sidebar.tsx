"use client";

import { useState } from "react";
import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  TrendingUp,
  Landmark,
  Leaf,
  Target,
  BookOpen,
  Star,
  FileText,
  Download,
  Search,
  ChevronRight,
  ChevronDown,
  Bookmark,
  Calendar,
} from "lucide-react";
import { statOfDay } from "@/data/dummy";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, active: true, hasChildren: false },
  { label: "Population", icon: Users, active: false, hasChildren: false },
  { label: "Social Development", icon: GraduationCap, active: false, hasChildren: true },
  { label: "Economy", icon: TrendingUp, active: false, hasChildren: false },
  { label: "Governance", icon: Landmark, active: false, hasChildren: false },
  { label: "Environment & Climate", icon: Leaf, active: false, hasChildren: false },
  { label: "SDGs", icon: Target, active: false, hasChildren: true },
  { label: "Thematic Deep Dives", icon: BookOpen, active: false, hasChildren: true },
];

const bottomItems = [
  { label: "KPI Watchlist", icon: Star },
  { label: "Reports", icon: FileText },
  { label: "Data Downloads", icon: Download },
];

export default function Sidebar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNav, setActiveNav] = useState("Overview");
  const [iMenuteOpen, setIMenuteOpen] = useState(false);

  return (
    <aside
      className="flex flex-col h-screen w-64 flex-shrink-0 overflow-hidden"
      style={{ background: "var(--sidebar-bg)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
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
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin px-2 py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.label;
          return (
            <button
              key={item.label}
              onClick={() => setActiveNav(item.label)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg mb-0.5 text-left transition-colors"
              style={{
                background: isActive ? "var(--sidebar-active)" : "transparent",
                color: isActive ? "#ffffff" : "rgba(255,255,255,0.65)",
              }}
              onMouseEnter={(e) => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "var(--sidebar-hover)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              <Icon size={16} className="flex-shrink-0" />
              <span className="flex-1 text-sm font-medium">{item.label}</span>
              {item.hasChildren && <ChevronRight size={14} className="opacity-50" />}
            </button>
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
              <span className="flex-1 text-sm font-medium">{item.label}</span>
              <ChevronRight size={14} className="opacity-50" />
            </button>
          );
        })}

        <div className="my-2 border-t border-white/10" />

        {/* iMenute section */}
        <button
          onClick={() => setIMenuteOpen(!iMenuteOpen)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors"
          style={{ color: "rgba(255,255,255,0.65)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "var(--sidebar-hover)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          }}
        >
          <Calendar size={16} className="flex-shrink-0" />
          <span className="flex-1 text-sm font-medium">iMenute 4</span>
          {iMenuteOpen ? <ChevronDown size={14} className="opacity-50" /> : <ChevronRight size={14} className="opacity-50" />}
        </button>
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
