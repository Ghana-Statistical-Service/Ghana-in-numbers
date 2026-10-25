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
        <div className="overflow-y-auto px-5 sm:px-8 pt-7 pb-8 scrollbar-thin" style={{ scrollbarColor: "#CBD5E1 transparent" }}>

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

          {/* Let the message flow into the space below the portrait. */}
          <div className="flow-root space-y-3 text-sm leading-relaxed" style={{ color: "#374151" }}>
            <div className="mb-4 flex justify-center sm:float-left sm:mr-6 sm:mb-3 sm:block">
              <Image
                src="/gs.jpg"
                alt="Dr. Alhassan Iddrisu, Government Statistician"
                width={210}
                height={260}
                className="rounded-lg object-cover w-[160px] sm:w-[210px] h-auto"
                style={{ objectPosition: "center top" }}
              />
            </div>
            <p>
              Ghana in Numbers presents official statistics to advance understanding of Ghana&apos;s
              development and support informed decision-making. This dashboard brings the
              publication&apos;s evidence into an accessible format, enabling policymakers,
              businesses, researchers, students, and the wider public to examine key national
              indicators, understand trends, and assess their implications.
            </p>
            <p>
              The evidence records important gains in health, economic activity, and
              macroeconomic stability. It also highlights persistent challenges, including
              youth disengagement from employment, education and training, widespread informal
              employment, and food insecurity. Presenting these developments together supports
              a balanced assessment of national progress and the areas requiring sustained
              attention.
            </p>
            <p>
              Our objective is to make statistics useful to every reader. By bringing together
              the figures, their trends, and their significance, Ghana in Numbers provides a
              common basis for public discussion, policy formulation, planning, and accountability.
            </p>
            <p>
              This initiative reflects the Ghana Statistical Service&apos;s commitment to more
              timely publication, wider access to official data through StatsBank and other
              digital platforms, and a stronger National Statistical System. The value of our
              work lies in the extent to which reliable evidence informs decisions and action.
            </p>
            <p>
              As this first edition develops, we will continue to acknowledge limitations in
              the available evidence and welcome feedback to guide future improvements.
              I invite all users to engage critically with the statistics and apply them
              responsibly. The enduring contribution of Ghana in Numbers will be measured
              by the decisions it improves and the development outcomes it supports.
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
