"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BriefcaseBusiness, Home, MapPin, Plane, UsersRound, WalletCards } from "lucide-react";
import {
  cropProductionData,
  fishProductionData,
  labourParticipationData,
  neetData,
  tourismFlowData,
  tourismPurposeData,
  unemploymentData,
} from "@/data/businessEconomyData";

export function LabourPanel() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="space-y-4">
      <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr", height: "340px" }}>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col">
          <p className="text-gray-800 font-bold text-sm">Labour Market Participation</p>
          <div className="flex-1 min-h-0">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={labourParticipationData} margin={{ top: 20, right: 14, left: -16, bottom: 0 }}>
                  <CartesianGrid stroke="#EEF2F7" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#64748B", fontWeight: 700 }} tickLine={false} axisLine={false} />
                  <YAxis domain={[55, 78]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #E5E7EB" }} />
                  <Legend verticalAlign="top" height={24} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="labourForce" name="Labour Force Participation" stroke="#C69200" strokeWidth={4} strokeDasharray="8 6" dot={{ r: 5, fill: "#C69200", stroke: "#C69200" }} />
                  <Line type="monotone" dataKey="employmentPopulation" name="Employment-to-Population" stroke="#3DD3D1" strokeWidth={4} strokeDasharray="2 7" dot={{ r: 5, fill: "#3DD3D1", stroke: "#3DD3D1" }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col">
          <p className="text-gray-800 font-bold text-sm">Unemployment Rate</p>
          <div className="flex-1 min-h-0">
            {mounted && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={unemploymentData} margin={{ top: 20, right: 14, left: -16, bottom: 0 }}>
                  <CartesianGrid stroke="#EEF2F7" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#64748B", fontWeight: 700 }} tickLine={false} axisLine={false} />
                  <YAxis domain={[6, 35]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #E5E7EB" }} />
                  <Legend verticalAlign="top" height={24} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="youth1524" name="Youth 15-24" stroke="#F47B2A" strokeWidth={4} dot={{ r: 5, fill: "#F47B2A", stroke: "#F47B2A" }} />
                  <Line type="monotone" dataKey="youth1535" name="Youth 15-35" stroke="#FFC107" strokeWidth={4} dot={{ r: 5, fill: "#FFC107", stroke: "#FFC107" }} />
                  <Line type="monotone" dataKey="national" name="National" stroke="#D40000" strokeWidth={4} dot={{ r: 5, fill: "#D40000", stroke: "#D40000" }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4" style={{ height: "310px" }}>
        <p className="text-gray-800 font-bold text-sm">Youth Not in Education, Employment and Training (NEET)</p>
        <div className="h-[250px]">
          {mounted && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={neetData} margin={{ top: 18, right: 14, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="#EEF2F7" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#64748B", fontWeight: 700 }} tickLine={false} axisLine={false} />
                <YAxis domain={[16, 24]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #E5E7EB" }} />
                <Legend verticalAlign="top" height={24} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="youth1524" name="Youth 15-24" stroke="#F9B17E" strokeWidth={4} dot={{ r: 5, fill: "#F9B17E", stroke: "#F9B17E" }} />
                <Line type="monotone" dataKey="youth1535" name="Youth 15-35" stroke="#8B3A0A" strokeWidth={4} dot={{ r: 5, fill: "#8B3A0A", stroke: "#8B3A0A" }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

export function AgriculturePanel() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 1fr", height: "430px" }}>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col">
        <p className="text-gray-800 font-bold text-sm">Annual Fish Production</p>
        <div className="flex-1 min-h-0">
          {mounted && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={fishProductionData} margin={{ top: 18, right: 14, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="#EEF2F7" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 9, fill: "#64748B" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #E5E7EB" }} />
                <Legend verticalAlign="top" height={24} iconType="square" wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="marine" name="Marine" stackId="a" stroke="#082B73" fill="#082B73" />
                <Area type="monotone" dataKey="inland" name="Inland" stackId="a" stroke="#1178BA" fill="#1178BA" />
                <Area type="monotone" dataKey="aquaculture" name="Aquaculture" stackId="a" stroke="#12AEE3" fill="#12AEE3" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col">
        <p className="text-gray-800 font-bold text-sm">Crop Production</p>
        <div className="flex-1 min-h-0">
          {mounted && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cropProductionData} margin={{ top: 18, right: 14, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="#EEF2F7" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 9, fill: "#64748B" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ fontSize: "11px", borderRadius: "8px", border: "1px solid #E5E7EB" }} />
                <Legend verticalAlign="top" height={24} iconType="square" wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="maize" name="Maize" stackId="a" fill="#F97316" />
                <Bar dataKey="cassava" name="Cassava" stackId="a" fill="#0F6B80" />
                <Bar dataKey="yam" name="Yam" stackId="a" fill="#2E6B1F" />
                <Bar dataKey="cocoyam" name="Cocoyam" stackId="a" fill="#F28C5B" />
                <Bar dataKey="plantain" name="Plantain" stackId="a" fill="#35BCE8" />
                <Bar dataKey="other" name="Other crops" stackId="a" fill="#8BC34A" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

export function TourismPanel() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <div className="rounded-xl border border-slate-100 p-4 flex items-center gap-4" style={{ background: "#FBFCFE" }}>
          <UsersRound size={42} style={{ color: "#6B3FA0" }} />
          <div>
            <p className="text-sm font-bold" style={{ color: "#111827" }}>Same-day & Overnight visitors</p>
            <p className="text-4xl font-black" style={{ color: "#7A2E0A" }}>16.76 Million</p>
          </div>
        </div>
        <div className="rounded-xl border border-slate-100 p-4 flex items-center gap-4" style={{ background: "#FBFCFE" }}>
          <WalletCards size={42} style={{ color: "#00A651" }} />
          <div>
            <p className="text-sm font-bold" style={{ color: "#111827" }}>Total expenditure</p>
            <p className="text-4xl font-black" style={{ color: "#00A651" }}>GHC 22.01 Billion</p>
          </div>
        </div>
      </div>

      <p className="text-center mt-5 mb-3 text-gray-800 font-bold text-sm">Main purpose of visit</p>
      <div className="grid grid-cols-3 gap-3">
        {tourismPurposeData.map((item) => (
          <div key={item.purpose} className="rounded-xl border border-slate-100 p-3 text-center" style={{ background: "#FBFCFE" }}>
            <p className="text-2xl font-black" style={{ color: item.color }}>{item.share}%</p>
            <p className="text-xs font-bold" style={{ color: "#111827" }}>{item.purpose}</p>
          </div>
        ))}
      </div>

      <p className="text-center mt-5 mb-3 text-gray-800 font-bold text-sm">Tourism flow</p>
      <div className="grid grid-cols-3 gap-4">
        {tourismFlowData.map((item) => {
          const Icon = item.type === "Domestic" ? Home : item.type === "Outbound" ? Plane : MapPin;
          return (
            <div key={item.type} className="rounded-xl border border-slate-100 p-4" style={{ background: "#FBFCFE" }}>
              <div className="flex items-center justify-between">
                <p className="text-lg font-black" style={{ color: "#111827" }}>{item.type}</p>
                <Icon size={28} style={{ color: item.type === "Domestic" ? "#7A2E0A" : item.type === "Outbound" ? "#EF4444" : "#00A651" }} />
              </div>
              <p className="mt-3 text-xl font-black" style={{ color: "#111827" }}>{item.visitors}</p>
              <p className="text-sm" style={{ color: "#64748B" }}>visitors</p>
              <p className="mt-2 text-lg font-black" style={{ color: "#111827" }}>{item.expenditure}</p>
              <p className="text-sm" style={{ color: "#64748B" }}>spent</p>
              <div className="mt-3 border-t border-dashed border-slate-300 pt-3">
                {item.purposes.map((purpose) => <p key={purpose} className="text-xs leading-relaxed" style={{ color: "#111827" }}>{purpose}</p>)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
