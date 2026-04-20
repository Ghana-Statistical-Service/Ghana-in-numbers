"use client";

import { Home, Search, Share2, HelpCircle, ChevronDown } from "lucide-react";

export default function TopBar() {
  return (
    <header className="bg-white border-b border-gray-200 h-12 flex items-center px-5 gap-3 flex-shrink-0">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 flex-1">
        <Home size={15} className="text-gray-400" />
        <span className="text-gray-300">/</span>
        <span className="text-gray-500">Home</span>
        <span className="text-gray-300">&gt;</span>
        <span className="text-gray-700 font-medium">Overview</span>
      </nav>

      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Ghana selector */}
        <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          <span className="text-base">🇬🇭</span>
          <span>Ghana</span>
          <ChevronDown size={14} className="text-gray-400" />
        </button>

        {/* National selector */}
        <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          <span
            className="w-4 h-4 rounded-sm flex-shrink-0 inline-block"
            style={{ background: "#17B8A6" }}
          />
          <span>National</span>
          <ChevronDown size={14} className="text-gray-400" />
        </button>

        {/* Icon buttons */}
        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
          <Search size={15} />
        </button>
        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
          <Share2 size={15} />
        </button>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white transition-colors"
          style={{ background: "var(--primary)" }}
        >
          <HelpCircle size={14} />
          Help
        </button>
      </div>
    </header>
  );
}
