"use client";

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
  regional:
    "Nationally, 21.5% of youth aged 15–24 and 19.5% aged 15–35 are NEET. Western Region leads with 29.3% (15–24), followed by Central (26.6%) and Ashanti (24.8%). Oti records the lowest at 11.1%, suggesting that measured NEET does not always map onto actual wellbeing — informal or subsistence activity may absorb youth below measurement thresholds in some regions.",
  urban:
    "Urban youth face higher NEET than might be expected: 21.8% nationally for the 15–24 group. Western urban youth (28.4%) and Central (25.5%) top the list. Greater Accra's 23.0% reflects the paradox of migration — youth moving to cities in search of work but failing to find formal employment or training.",
  rural:
    "Rural 15–24 NEET stands at 21.1% nationally, with Western rural youth at 30.3% — the highest in any rural–dimension combination. This likely reflects limited secondary and vocational schooling outside urban centres, compounding limited formal job opportunities in rural areas.",
  male:
    "Male youth are less likely to be NEET (19.2% nationally for 15–24) than their female counterparts. However, regional variation is wide: Western males (25.2%) are nearly three times more NEET than Oti males (9.5%). The pattern suggests geography and agricultural opportunities play a larger role than gender alone for male youth.",
  female:
    "Female youth face the steepest exclusion: 23.7% nationally (15–24). The gender gap is most pronounced in Western Region (33.2% female vs 25.2% male) and Central (30.7% female vs 22.4% male). Early marriage, childcare responsibilities, and cultural barriers to female education and labour-force participation all contribute.",
};

export default function NeetRegionalPanel() {
  const [dim, setDim]           = useState<NeetDim>("regional");
  const [showWriteUp, setShowWriteUp] = useState(false);

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
        <button
          onClick={() => setShowWriteUp((v) => !v)}
          className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full transition-colors flex-shrink-0"
          style={{
            background: showWriteUp ? "#FEF3C7" : "#FFFBEB",
            color: "#92400E",
            border: "1px solid #FDE68A",
          }}
        >
          {showWriteUp ? <X size={12} /> : <BookOpen size={12} />}
          {showWriteUp ? "Close" : "Analysis"}
        </button>
      </div>

      {showWriteUp && (
        <div
          className="mb-4 rounded-xl p-4 text-sm leading-relaxed"
          style={{ background: "#FFFBEB", border: "1px solid #FDE68A", color: "#78350F" }}
        >
          {WRITEUPS[dim]}
        </div>
      )}

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
