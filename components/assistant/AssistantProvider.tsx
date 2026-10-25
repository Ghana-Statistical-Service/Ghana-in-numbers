"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import AssistantPanel from "./AssistantPanel";

const AssistantContext = createContext<{ open: () => void } | null>(null);
export function useAssistant() {
  const context = useContext(AssistantContext);
  if (!context) throw new Error("AssistantProvider is required");
  return context;
}
export default function AssistantProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  return <AssistantContext.Provider value={{ open: () => setOpen(true) }}>{children}<AssistantPanel open={isOpen} onClose={() => setOpen(false)} /></AssistantContext.Provider>;
}
