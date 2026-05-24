"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X } from "lucide-react";

export default function GovStatMessageModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("gin-gs-message");
    if (!seen) setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    sessionStorage.setItem("gin-gs-message", "1");
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15, 23, 42, 0.65)", backdropFilter: "blur(5px)" }}
      onClick={close}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full overflow-hidden relative flex flex-col"
        style={{ maxWidth: "680px", maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ghana flag stripe */}
        <div className="flex h-1.5 flex-shrink-0">
          <div className="flex-1" style={{ background: "#CE1126" }} />
          <div className="flex-1" style={{ background: "#FCD116" }} />
          <div className="flex-1" style={{ background: "#006B3F" }} />
        </div>

        {/* Close button */}
        <button
          onClick={close}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          style={{ background: "#F1F5F9", color: "#64748B" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#E2E8F0";
            (e.currentTarget as HTMLButtonElement).style.color = "#1B2A4A";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#F1F5F9";
            (e.currentTarget as HTMLButtonElement).style.color = "#64748B";
          }}
          aria-label="Close message"
        >
          <X size={16} />
        </button>

        {/* Scrollable body */}
        <div className="overflow-y-auto px-8 pt-7 pb-8 scrollbar-thin" style={{ scrollbarColor: "#CBD5E1 transparent" }}>

          {/* Title */}
          <h2
            className="font-bold leading-tight mb-1"
            style={{ fontSize: "1.75rem", color: "#382873" }}
          >
            Message from
          </h2>
          <h2
            className="font-bold leading-tight mb-3"
            style={{ fontSize: "1.75rem", color: "#382873" }}
          >
            the Government Statistician
          </h2>

          <hr className="mb-5" style={{ borderColor: "#E2E8F0" }} />

          {/* Photo + first paragraphs */}
          <div className="flex gap-5 mb-4">
            <div className="flex-shrink-0">
              <Image
                src="/gs.jpg"
                alt="Dr. Alhassan Iddrisu, Government Statistician"
                width={210}
                height={260}
                className="rounded-lg object-cover"
                style={{ objectPosition: "center top", width: 210, height: 260 }}
              />
            </div>
            <div className="space-y-3 text-sm leading-relaxed" style={{ color: "#374151" }}>
              <p>
                Ghana&apos;s development story is becoming more complex, and the demand for clear,
                reliable, and timely data has never been greater.
              </p>
              <p>
                At the Ghana Statistical Service, we recognise that producing data is no longer
                enough. The real value of statistics lies in how well they are used, how clearly
                they are understood, how quickly they are available, and how effectively they
                inform decisions.
              </p>
              <p>
                This understanding is shaping how the Service operates. We are repositioning the
                Ghana Statistical Service to become a world class, more agile, more responsive,
                and more innovative in the way we produce and communicate data. This includes
                strengthening our systems, improving timeliness, and making data more accessible
                to all users.
              </p>
            </div>
          </div>

          {/* Remaining paragraphs */}
          <div className="space-y-3 text-sm leading-relaxed" style={{ color: "#374151" }}>
            <p>
              Ghana in Numbers is part of this shift. It reflects a new approach, one that brings
              together key national data and presents it in a way that is straightforward,
              connected, and relevant. The aim is not simply to present information, but to make
              it easier to see patterns, understand change, and support action.
            </p>
            <p>
              The data presented in this publication points to a country that is moving, but not
              always in a balanced way. Population growth, urbanisation, and a large youth
              population are reshaping demand across the economy. At the same time, the pace at
              which opportunities are expanding does not fully match these changes.
            </p>
            <p>
              This is where data becomes critical. Clear evidence allows us to see where progress
              is taking place, where gaps remain, and where attention is needed most. It enables
              better planning, more targeted interventions, and stronger accountability.
            </p>
            <p>
              For this reason, strengthening the role of data in decision-making remains a central
              priority for the Ghana Statistical Service. We will continue to invest in systems
              that improve data quality and timeliness. We will deepen collaboration across the
              National Statistical System and we will leverage technology to ensure that data is
              not only available, but also usable.
            </p>
            <p>
              Ghana in Numbers represents one step in that broader transformation. It provides a
              reference point for understanding Ghana&apos;s development and supports a more informed
              national conversation about the choices ahead.
            </p>
          </div>

          {/* Signatory */}
          <div className="mt-6 pt-5 border-t" style={{ borderColor: "#E2E8F0" }}>
            <p className="font-bold text-sm tracking-wide" style={{ color: "#1B2A4A" }}>
              DR ALHASSAN IDDRISU
            </p>
            <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
              Government Statistician, Ghana Statistical Service
            </p>
          </div>

          {/* Footer action */}
          <div className="mt-5 flex justify-end">
            <button
              onClick={close}
              className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: "var(--primary)" }}
            >
              Enter Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
