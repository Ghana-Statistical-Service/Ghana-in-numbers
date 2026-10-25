"use client";

import CardExplanation from "@/components/shared/CardExplanation";


import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BookOpen, X } from "lucide-react";
import { neetRegionalData, type NeetDim } from "@/data/youthBulgeData";

const DIMS: { key: NeetDim; label: string }[] = [
  { key: "regional", label: "Regional" },
  { key: "urban",    label: "Urban" },
  { key: "rural",    label: "Rural" },
  { key: "male",     label: "Male" },
  { key: "female",   label: "Female" },
];

const GOLD      = "#F59E0B";
const DARK_AMBER = "#92400E";

const WRITEUPS: Record<NeetDim, string> = {
  "regional": "Q3 2025: 21.5% of all people aged 15–24 and 19.5% aged 15–35 were neither employed nor enrolled in education or training. For ages 15–24, Western recorded 29.3%, Central 26.6% and Ashanti 24.8%; Oti recorded 11.1%. NEET and unemployment have different denominators and should not be equated.",
  "urban": "Q3 2025: urban NEET rates were 21.8% for ages 15–24 and 20.6% for ages 15–35. Among urban people aged 15–24, Western recorded 28.4%, Central 25.5% and Greater Accra 23.0%. These regional comparisons do not establish the reasons for disengagement.",
  "rural": "Q3 2025: rural NEET rates were 21.1% for ages 15–24 and 18.0% for ages 15–35. Western recorded the highest rural rate for ages 15–24 at 30.3%, followed by Central at 28.2% and Volta at 27.0%. Rates describe the whole age group, including people outside the labour force.",
  "male": "Q3 2025: male NEET rates were 19.2% for ages 15–24 and 16.5% for ages 15–35. For ages 15–24, Western recorded 25.2%, Central 22.4% and Oti 9.5%. These data describe sex and regional differences without isolating their causes.",
  "female": "Q3 2025: female NEET rates were 23.7% for ages 15–24 and 21.9% for ages 15–35. For ages 15–24, Western recorded 33.2% and Central 30.7%, compared with 25.2% and 22.4% among males in those regions. The publication reports that women made up more than 60% of NEET people aged 15–35."
};

export default function NeetRegionalPanel() {
  const [dim, setDim]           = useState<NeetDim>("regional");

  const data = neetRegionalData[dim].map((d) => ({
    ...d,
    isNational: d.region === "National",
  }));

  return (
    <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-sm font-bold" style={{ color: "#1B2A4A" }}>
            NEET Rate by Region
          </p>
          <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
            Youth Not in Education, Employment or Training — 2021 PHC ·{" "}
            <span style={{ color: GOLD }}>■</span> 15–35 (AU){" "}
            <span style={{ color: DARK_AMBER }}>■</span> 15–24 (Intl)
          </p>
        </div>
        <CardExplanation indicator="neet" />
      </div>




      {/* Dimension tabs */}
      <div className="flex flex-wrap gap-2 mb-5">
        {DIMS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setDim(key)}
            className="text-xs font-bold px-3 py-1 rounded-full transition-colors"
            style={{
              background: dim === key ? GOLD : "#FEF3C7",
              color:      dim === key ? "#fff" : "#92400E",
              border: `1px solid ${dim === key ? GOLD : "#FDE68A"}`,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div style={{ height: 580 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 4, right: 52, left: 80, bottom: 4 }}
            barCategoryGap="28%"
            barGap={3}
          >
            <CartesianGrid stroke="#FEF3C7" strokeDasharray="3 3" horizontal={false} />
            <XAxis
              type="number"
              domain={[0, 40]}
              tick={{ fontSize: 10, fill: "#94A3B8" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <YAxis
              type="category"
              dataKey="region"
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            tick={(props: any) => {
                const { x, y, payload } = props as { x: number; y: number; payload: { value: string } };
                const isNat = payload.value === "National";
                return (
                  <text
                    x={x - 4}
                    y={y}
                    textAnchor="end"
                    dominantBaseline="middle"
                    fontSize={isNat ? 11 : 10}
                    fontWeight={isNat ? 800 : 500}
                    fill={isNat ? "#92400E" : "#374151"}
                  >
                    {payload.value}
                  </text>
                );
              }}
              width={76}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #FDE68A" }}
              formatter={(v: unknown, name) => [`${String(v)}%`, String(name ?? "")]}
            />
            <Bar dataKey="r1535" name="15–35 (AU)" fill={GOLD} radius={[0, 3, 3, 0]}>
              <LabelList
                dataKey="r1535"
                position="right"
                formatter={(v: unknown) => `${String(v)}%`}
                style={{ fontSize: 10, fill: GOLD, fontWeight: 700 }}
              />
            </Bar>
            <Bar dataKey="r1524" name="15–24 (Intl)" fill={DARK_AMBER} radius={[0, 3, 3, 0]}>
              <LabelList
                dataKey="r1524"
                position="right"
                formatter={(v: unknown) => `${String(v)}%`}
                style={{ fontSize: 10, fill: DARK_AMBER, fontWeight: 700 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
