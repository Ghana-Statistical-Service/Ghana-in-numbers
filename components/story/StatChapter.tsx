import { ReactNode } from "react";

interface Props {
  num: string;          // "01" – "05"
  stat: string;         // "38.2%"
  emoji: string;
  color: string;        // hex — used for badge + stat
  bg: string;           // section background tint
  title: string;
  children: ReactNode;  // narrative text
  visual?: ReactNode;   // chart / comparison element
  flip?: boolean;       // visual on left, stat on right
}

export default function StatChapter({
  num, stat, emoji, color, bg, title, children, visual, flip,
}: Props) {
  const hasVisual = Boolean(visual);

  return (
    <section style={{ background: bg }} className="rounded-2xl overflow-hidden mb-0">
      <div className={`grid gap-0 ${hasVisual ? "md:grid-cols-2" : "grid-cols-1"}`}>

        {/* Stat side */}
        <div
          className={`p-8 flex flex-col justify-center gap-4 ${flip && hasVisual ? "md:order-2" : ""}`}
        >
          {/* Chapter badge */}
          <div className="flex items-center gap-3">
            <span
              className="inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-black text-white"
              style={{ background: color }}
            >
              {num}
            </span>
            <span className="text-2xl">{emoji}</span>
          </div>

          {/* Big stat */}
          <p
            className="font-black leading-none"
            style={{ fontSize: "clamp(3rem, 8vw, 5rem)", color, lineHeight: 1 }}
          >
            {stat}
          </p>

          {/* Title */}
          <p className="text-base font-bold" style={{ color }}>
            {title}
          </p>

          {/* Narrative */}
          <div className="text-sm leading-relaxed space-y-3" style={{ color: "#374151" }}>
            {children}
          </div>
        </div>

        {/* Visual side */}
        {hasVisual && (
          <div
            className={`flex items-center justify-center p-6 ${flip ? "md:order-1" : ""}`}
            style={{ background: `color-mix(in srgb, ${bg} 60%, white)` }}
          >
            {visual}
          </div>
        )}
      </div>
    </section>
  );
}
