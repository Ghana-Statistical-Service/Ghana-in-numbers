"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowUp, ArrowUpRight, ChevronDown, LoaderCircle, MessageSquareText, RotateCcw, Square, SquarePen, X } from "lucide-react";
import type { AssistantAnswer, AssistantSource } from "@/lib/assistant/service";

type Message = { id: number; role: "user" | "assistant"; content: string; sources?: AssistantSource[]; suggestions?: string[] };

function emphasis(text: string): ReactNode {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => part.startsWith("**") && part.endsWith("**") ? <strong key={i} className="font-semibold text-ink">{part.slice(2, -2)}</strong> : part);
}

function starters(path: string) {
  if (path.includes("business")) return ["What drove GDP expenditure in 2025?", "Compare cash and commitment spending in 2025.", "How did inflation change between 2022 and 2025?"];
  if (path.includes("youth")) return ["Compare youth unemployment age groups in 2025.", "What does NEET measure?", "Which region had the highest youth NEET rate in Q3 2025?"];
  if (path.includes("social")) return ["How has active health insurance coverage changed?", "Explain net versus gross school enrolment.", "How many households had access to electricity in 2021?"];
  if (path.includes("environment")) return ["What were the wettest months of 2025?", "How is carbon retention measured?", "Which regions hold the largest reported forest reserves?"];
  if (path.includes("governance")) return ["How has women’s representation in Parliament changed?", "Compare women judges across courts in 2025.", "What share of citizens felt they had no say in 2025?"];
  if (path.includes("sdg")) return ["How has multidimensional poverty changed since 2022?", "What does food insecurity measure?", "How has child mortality changed?"];
  if (path.includes("agriculture")) return ["How has cassava production changed since 2013?", "What is the Agriculture Orientation Index?", "How many young people worked in agriculture in 2021?"];
  return ["How has Ghana’s population changed since 2010?", "What was Ghana’s inflation rate in December 2025?", "Compare unemployment among the two youth age groups in 2025."];
}

export default function AssistantPanel({ open, onOpen, onMinimise }: { open: boolean; onOpen: () => void; onMinimise: () => void }) {
  const path = usePathname();
  const titleId = useId();
  const inputId = useId();
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const windowRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const transcript = useRef<HTMLDivElement>(null);
  const controller = useRef<AbortController | null>(null);
  const sequence = useRef(0);
  const nextId = useRef(0);
  const wasOpen = useRef(false);
  const last = messages.at(-1);
  const suggestions = last?.role === "assistant" ? last.suggestions ?? [] : [];

  // Focus moves into the window when it opens and back to the launcher when it is minimised.
  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      inputRef.current?.focus({ preventScroll: true });
      // On phones the window is a full-screen sheet, so the page behind it should not scroll.
      if (window.matchMedia("(max-width: 639px)").matches) {
        const previous = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = previous; };
      }
    } else if (wasOpen.current) {
      launcherRef.current?.focus({ preventScroll: true });
    }
  }, [open]);

  useEffect(() => { if (open && transcript.current) transcript.current.scrollTop = messages.length > 0 || busy || error ? transcript.current.scrollHeight : 0; }, [messages, busy, error, open]);
  useEffect(() => () => controller.current?.abort(), []);

  // While the reader is scrolling, the closed launcher steps aside so it never sits over a value; it returns when scrolling stops.
  const [scrolling, setScrolling] = useState(false);
  useEffect(() => {
    const main = document.getElementById("main");
    if (!main) return;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => { setScrolling(true); clearTimeout(timer); timer = setTimeout(() => setScrolling(false), 700); };
    main.addEventListener("scroll", onScroll, { passive: true });
    return () => { main.removeEventListener("scroll", onScroll); clearTimeout(timer); };
  }, [path]);

  function stop() { sequence.current++; controller.current?.abort(); controller.current = null; setBusy(false); }
  function clear() { stop(); setMessages([]); setError(""); setQuestion(""); inputRef.current?.focus(); }

  async function requestAnswer(history: Message[]) {
    const requestSequence = ++sequence.current;
    const abort = new AbortController(); controller.current = abort;
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/assistant", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: history.slice(-7).map(message => ({ role: message.role, content: message.content.slice(0, 2000) })) }), signal: abort.signal });
      const data: AssistantAnswer & { error?: string } = await response.json();
      if (requestSequence !== sequence.current) return;
      if (!response.ok) throw new Error(data.error || "The assistant could not complete this request.");
      if (typeof data.answer !== "string" || !Array.isArray(data.sources)) throw new Error("The assistant returned an incomplete answer. Please try again.");
      const sources = data.sources.filter(source => typeof source.href === "string" && source.href.startsWith("/") && !source.href.startsWith("//"));
      setMessages(current => [...current, { id: ++nextId.current, role: "assistant", content: data.answer, sources, suggestions: Array.isArray(data.suggestions) ? data.suggestions.slice(0, 3) : [] }]);
    } catch (cause) {
      if (requestSequence === sequence.current && !abort.signal.aborted) setError(cause instanceof Error ? cause.message : "Could not connect. Please try again.");
    } finally { if (requestSequence === sequence.current) { controller.current = null; setBusy(false); } }
  }

  function ask(text: string) {
    if (busy || !text.trim()) return;
    const history: Message[] = [...messages, { id: ++nextId.current, role: "user", content: text.trim().slice(0, 2000) }];
    setMessages(history); setQuestion(""); void requestAnswer(history);
  }
  function submit(event: FormEvent) { event.preventDefault(); ask(question); }

  return (
    <>
      <div
        ref={windowRef}
        role="dialog"
        aria-modal="false"
        aria-labelledby={titleId}
        hidden={!open}
        onKeyDown={event => { if (event.key === "Escape") { event.stopPropagation(); onMinimise(); } }}
        className="fixed inset-0 z-[45] flex flex-col overflow-hidden bg-surface text-body sm:inset-auto sm:bottom-[88px] sm:right-5 sm:h-[min(640px,calc(100dvh-112px))] sm:w-[400px] sm:rounded-[var(--radius-xl)] sm:border sm:border-line sm:shadow-pop motion-safe:sm:animate-[assistant-in_160ms_var(--ease)]"
      >
        <header className="on-dark flex shrink-0 items-center gap-3 bg-nav px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] text-white">
          <span aria-hidden className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/12 ring-1 ring-white/20"><MessageSquareText size={18} /></span>
          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="text-[15px] font-semibold leading-tight text-white">Ask StatsChat</h2>
            <p className="text-xs text-white/75">Answers from the dashboard’s published data</p>
          </div>
          {messages.length > 0 && (
            <button type="button" onClick={clear} aria-label="Start a new conversation" title="New conversation" className="flex h-10 w-10 items-center justify-center rounded-lg text-white/85 hover:bg-white/10 hover:text-white"><SquarePen size={18} /></button>
          )}
          <button type="button" onClick={onMinimise} aria-label="Minimise assistant (your conversation is kept)" title="Minimise" className="hidden h-10 w-10 items-center justify-center rounded-lg text-white/85 hover:bg-white/10 hover:text-white sm:flex"><ChevronDown size={20} /></button>
          <button type="button" onClick={onMinimise} aria-label="Close assistant (your conversation is kept)" className="flex h-11 w-11 items-center justify-center rounded-lg text-white/85 hover:bg-white/10 hover:text-white sm:hidden"><X size={22} /></button>
        </header>

        <div ref={transcript} role="log" aria-label="Conversation" aria-busy={busy} aria-live="polite" tabIndex={0} className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-4 py-5">
          {messages.length === 0 && (
            <div>
              <p className="text-[15px] font-semibold leading-relaxed text-ink">I am StatsChat, an AI model for official statistics developed by Ghana Statistical Service.</p>
              <p className="mt-3 text-[13px] leading-relaxed text-muted">I help you explore Ghana’s statistics, understand indicators, and interpret the stories behind the numbers.</p>
              <p className="mt-3 text-[13px] leading-relaxed text-muted">I answer questions using Ghana in Numbers and its supporting official data, with references you can check. If the available sources cannot answer your question, I will let you know.</p>
              <p className="mt-3 text-[13px] font-medium leading-relaxed text-ink">What would you like to know about Ghana?</p>
              <p className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wider text-subtle">Suggested for this page</p>
              <ul className="space-y-2">
                {starters(path).map(text => (
                  <li key={text}><button type="button" onClick={() => ask(text)} className="flex w-full items-center justify-between gap-3 rounded-[var(--radius-md)] border border-line px-3.5 py-3 text-left text-[13px] leading-snug text-body hover:border-brand-line hover:bg-brand-soft"><span>{text}</span><ArrowUpRight size={15} aria-hidden className="shrink-0 text-brand" /></button></li>
                ))}
              </ul>
            </div>
          )}

          {messages.map(message => message.role === "user" ? (
            <article key={message.id} aria-label="Your question" className="ml-10 rounded-2xl rounded-br-md bg-brand px-3.5 py-2.5 text-[14px] leading-relaxed text-white">{message.content}</article>
          ) : (
            <article key={message.id} aria-label="Assistant answer" className="space-y-3">
              <div className="space-y-3 break-words text-[14px] leading-relaxed text-body">{message.content.split(/\n\s*\n/).map((paragraph, index) => <p key={index} className="whitespace-pre-line">{emphasis(paragraph)}</p>)}</div>
              {message.sources && message.sources.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-subtle">Sources</p>
                  {message.sources.map(source => (
                    <Link key={source.id} href={source.href} onClick={source.href.startsWith("/publication#") ? onMinimise : undefined} className="block rounded-[var(--radius-md)] border border-line bg-surface-muted px-3 py-2 hover:border-brand-line hover:bg-brand-soft">
                      <span className="flex items-start justify-between gap-2 text-[13px] font-medium text-ink">{source.title}<ArrowUpRight size={14} aria-hidden className="mt-0.5 shrink-0 text-brand" /></span>
                      <span className="mt-0.5 block break-words text-xs leading-relaxed text-muted">{source.period} · {source.reference}</span>
                    </Link>
                  ))}
                </div>
              )}
            </article>
          ))}

          {busy && <div role="status" className="flex items-center gap-2 text-[13px] text-muted"><LoaderCircle size={16} aria-hidden className="animate-spin text-brand" />Reading the relevant data…</div>}
          {error && (
            <div role="alert" className="rounded-[var(--radius-md)] border border-[#F3D9A4] bg-caution-bg px-3.5 py-3 text-[13px] leading-relaxed text-caution">
              <p>{error}</p>
              {last?.role === "user" && !busy && <button type="button" onClick={() => void requestAnswer(messages)} className="mt-2 inline-flex items-center gap-1.5 font-semibold underline underline-offset-2"><RotateCcw size={13} aria-hidden />Retry question</button>}
            </div>
          )}
          {!busy && !error && suggestions.length > 0 && (
            <div>
              <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-subtle">Explore further</p>
              <ul className="space-y-1.5">{suggestions.map(text => <li key={text}><button type="button" onClick={() => ask(text)} className="w-full rounded-[var(--radius-md)] border border-line px-3 py-2 text-left text-[13px] leading-snug text-body hover:border-brand-line hover:bg-brand-soft">{text}</button></li>)}</ul>
            </div>
          )}
        </div>

        <form onSubmit={submit} className="shrink-0 border-t border-line bg-surface px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
          <label htmlFor={inputId} className="sr-only">Ask a question about Ghana’s data</label>
          <div className="flex items-end gap-2 rounded-[var(--radius-lg)] border border-line-strong bg-surface px-2 py-1.5 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/15">
            <textarea
              ref={inputRef}
              id={inputId}
              value={question}
              maxLength={2000}
              rows={1}
              onChange={event => { setQuestion(event.target.value); const el = event.target; el.style.height = "auto"; el.style.height = `${Math.min(el.scrollHeight, 120)}px`; }}
              onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); if (!busy) ask(question); } }}
              placeholder="Ask about Ghana’s data…"
              className="max-h-[120px] min-h-10 flex-1 resize-none bg-transparent px-1.5 py-2 text-[15px] text-ink outline-none placeholder:text-subtle focus-visible:outline-none sm:text-[14px]"
            />
            {busy
              ? <button type="button" onClick={() => { stop(); setError("Request stopped. You can retry your last question."); }} aria-label="Stop generating the answer" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-surface-muted text-ink ring-1 ring-line hover:bg-line"><Square size={14} fill="currentColor" /></button>
              : <button type="submit" disabled={!question.trim()} aria-label="Send question" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-brand text-white hover:bg-brand-hover disabled:cursor-not-allowed disabled:bg-line disabled:text-subtle"><ArrowUp size={18} /></button>}
          </div>
          <p className="mt-2 px-1 text-xs leading-relaxed text-subtle">AI-assisted answers can be wrong. Check the cited source, unit and reference period.{question.length > 1600 && <span className="tabular"> · {question.length}/2,000</span>}</p>
        </form>
      </div>

      <button
        ref={launcherRef}
        type="button"
        onClick={open ? onMinimise : onOpen}
        aria-expanded={open}
        aria-label={open ? "Minimise Ask StatsChat" : "Ask StatsChat"}
        className={`group fixed bottom-[max(16px,env(safe-area-inset-bottom))] right-4 z-40 flex h-14 items-center justify-center gap-2 rounded-full bg-brand text-white shadow-pop ring-1 ring-white/20 transition-[opacity,transform,background-color] duration-200 hover:bg-brand-hover focus-visible:translate-y-0 focus-visible:opacity-100 sm:bottom-5 sm:right-5 sm:h-12 ${open ? "hidden w-12 sm:flex" : "w-14 whitespace-nowrap sm:w-12 min-[1760px]:w-auto! min-[1760px]:px-5"} ${!open && scrolling ? "pointer-events-none translate-y-3 opacity-0" : ""}`}
      >
        {open ? <ChevronDown size={22} aria-hidden /> : <MessageSquareText size={22} aria-hidden className="shrink-0 sm:h-5 sm:w-5" />}
        {!open && <span className="hidden text-sm font-semibold min-[1760px]:inline">Ask StatsChat</span>}
        {!open && <span role="tooltip" className="pointer-events-none absolute bottom-full right-0 mb-2 hidden whitespace-nowrap rounded-md bg-ink px-2.5 py-1.5 text-xs font-medium text-white shadow-pop group-hover:block group-focus-visible:block min-[1760px]:!hidden">Ask StatsChat</span>}
        {!open && busy && <span aria-hidden className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-[#F5C451] ring-2 ring-brand" />}
      </button>
    </>
  );
}
