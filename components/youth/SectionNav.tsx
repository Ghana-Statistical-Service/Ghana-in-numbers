"use client";

import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "ch01", label: "The Bulge",         color: "#DB2988" },
  { id: "ch02", label: "The Crisis",        color: "#DC2626" },
  { id: "ch03", label: "The Excluded",      color: "#7C3AED" },
  { id: "ch04", label: "The Deeper Picture", color: "#B45309" },
];

export default function SectionNav() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id); },
        { threshold: 0.35 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div
      className="fixed right-5 z-50 flex flex-col gap-3 hidden md:flex"
      style={{ top: "50%", transform: "translateY(-50%)" }}
    >
      {SECTIONS.map(({ id, label, color }) => {
        const isActive = active === id;
        return (
          <div key={id} className="relative group flex items-center justify-end">
            {/* Tooltip */}
            <span
              className="absolute right-6 whitespace-nowrap text-[11px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{ background: color, color: "#fff" }}
            >
              {label}
            </span>
            {/* Dot */}
            <button
              onClick={() => scrollTo(id)}
              aria-label={`Jump to ${label}`}
              className="rounded-full transition-all duration-300"
              style={{
                width: isActive ? 14 : 10,
                height: isActive ? 14 : 10,
                background: isActive ? color : "#CBD5E1",
                boxShadow: isActive ? `0 0 0 3px ${color}33` : "none",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
