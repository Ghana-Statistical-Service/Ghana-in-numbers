import { createHash } from "node:crypto";

// Per-process protections for the initial deployment, not a billing-account spending cap.
// Configure durable shared rate limiting before scaling across server instances.
const usage = new Map<string, { minute: number; day: number; minuteCount: number; dayCount: number; active: boolean }>();
let dayTotal = 0;
let currentDay = -1;
let concurrent = 0;
export function reserveAssistantRequest(ip: string) {
  const now = Date.now();
  const day = Math.floor(now / 86400000);
  const minute = Math.floor(now / 60000);
  const key = createHash("sha256").update(ip).digest("hex").slice(0, 24);
  if (day !== currentDay) { currentDay = day; dayTotal = 0; usage.clear(); }
  const entry = usage.get(key) ?? { minute, day, minuteCount: 0, dayCount: 0, active: false };
  if (entry.minute !== minute) { entry.minute = minute; entry.minuteCount = 0; }
  const configured = Number(process.env.AI_DAILY_REQUEST_LIMIT ?? 80);
  const dailyLimit = Number.isInteger(configured) ? Math.max(1, Math.min(500, configured)) : 80;
  if (entry.active || entry.minuteCount >= 5 || entry.dayCount >= 30 || dayTotal >= dailyLimit || concurrent >= 4 || usage.size >= 2000) return null;
  entry.active = true; entry.minuteCount++; entry.dayCount++; dayTotal++; concurrent++;
  usage.set(key, entry);
  let released = false;
  return () => { if (released) return; released = true; entry.active = false; concurrent = Math.max(0, concurrent - 1); };
}
