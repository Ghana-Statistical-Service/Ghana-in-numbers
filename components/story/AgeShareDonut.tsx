"use client";

import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Youth 15–35", value: 38.2 },
  { name: "Others",       value: 61.8 },
];

const COLORS = ["#15803D", "#DCFCE7"];

export default function AgeShareDonut() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div style={{ height: 220 }} />;

  return (
    <div style={{ height: 220, position: "relative" }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={68}
            outerRadius={96}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(v: unknown) => [`${v}%`, ""]}
            contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #E5E7EB" }}
          />
        </PieChart>
      </ResponsiveContainer>
      {/* Centre label */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <p style={{ fontSize: "1.75rem", fontWeight: 900, color: "#15803D", lineHeight: 1 }}>
          38.2%
        </p>
        <p style={{ fontSize: "0.6rem", color: "#6B7280", marginTop: 2, fontWeight: 600 }}>
          of population
        </p>
      </div>
    </div>
  );
}
