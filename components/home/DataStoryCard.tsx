"use client";

import { ChevronDown } from "lucide-react";

export default function DataStoryCard() {
  return (
    <div
      className="rounded-xl overflow-hidden relative flex flex-col justify-end"
      style={{
        background: "linear-gradient(135deg, #1B2A4A 0%, #382873 60%, #261B4D 100%)",
        minHeight: "140px",
      }}
    >
      {/* Decorative Ghana flag color waves */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Silhouette figures (CSS representation) */}
        <div className="absolute right-0 bottom-0 flex items-end gap-0.5 pr-3 pb-0 opacity-30">
          {[28, 36, 32, 40, 35].map((h, i) => (
            <div
              key={i}
              className="rounded-t-full"
              style={{
                width: "16px",
                height: `${h}px`,
                background: "rgba(255,255,255,0.6)",
                borderRadius: "50% 50% 0 0",
              }}
            />
          ))}
        </div>
        {/* Flag-colored accent strip */}
        <div className="absolute top-0 right-0 w-32 h-full opacity-20" style={{
          background: "linear-gradient(to bottom, #CC0001 0%, #FFCD00 50%, #006B3F 100%)"
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 p-4">
        <p className="text-white font-bold text-sm leading-tight mb-1">
          Ghana&apos;s Youth Dividend
        </p>
        <p className="text-white/70 text-xs leading-relaxed mb-3">
          <span className="text-white font-semibold">37%</span> of Ghana&apos;s 34.4 million
          citizens are aged 15–35 — a demographic powerhouse driving growth,
          innovation, and national transformation.
        </p>
        <button
          className="flex items-center gap-1.5 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
          style={{ background: "var(--primary)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "var(--primary-400)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "var(--primary)";
          }}
        >
          Explore Data Story
          <ChevronDown size={12} />
        </button>
      </div>
    </div>
  );
}
