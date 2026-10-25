"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import AssistantPanel from "./AssistantPanel";

type AssistantContextValue = { open: () => void; minimise: () => void; isOpen: boolean };
const AssistantContext = createContext<AssistantContextValue | null>(null);

export function useAssistant() {
  const context = useContext(AssistantContext);
  if (!context) throw new Error("AssistantProvider is required");
  return context;
}

/** The panel stays mounted while minimised so the conversation, and any request in progress, are kept. */
export default function AssistantProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const open = useCallback(() => setOpen(true), []);
  const minimise = useCallback(() => setOpen(false), []);
  const value = useMemo(() => ({ open, minimise, isOpen }), [open, minimise, isOpen]);
  return (
    <AssistantContext.Provider value={value}>
      {children}
      <AssistantPanel open={isOpen} onOpen={open} onMinimise={minimise} />
    </AssistantContext.Provider>
  );
}
