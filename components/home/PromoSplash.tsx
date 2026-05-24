"use client";

import { useState, useEffect, useCallback } from "react";

export default function PromoSplash() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("gin-promo-seen");
    if (!seen) setVisible(true);
  }, []);

  const dismiss = useCallback(() => {
    setVisible(false);
    sessionStorage.setItem("gin-promo-seen", "1");
  }, []);

  useEffect(() => {
    if (!visible) return;
    const handler = (e: MessageEvent) => {
      if (e.origin === window.location.origin && e.data?.type === "gin-promo-done") {
        dismiss();
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [visible, dismiss]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[60]" style={{ background: "#000" }}>
      <iframe
        src="/promo.html"
        className="w-full h-full border-0"
        title="Ghana in Numbers — Introduction"
        allow="autoplay"
      />
      <button
        onClick={dismiss}
        className="absolute top-4 right-4 z-10 px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-90"
        style={{
          background: "rgba(255,255,255,0.12)",
          color: "#ffffff",
          backdropFilter: "blur(4px)",
          border: "1px solid rgba(255,255,255,0.25)",
        }}
      >
        Skip intro →
      </button>
    </div>
  );
}
