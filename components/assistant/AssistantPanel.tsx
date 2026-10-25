"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, BookOpen, LoaderCircle, Send, Sparkles, Square, Trash2, X } from "lucide-react";
import type { AssistantAnswer, AssistantSource } from "@/lib/assistant/service";

type Message = { id: number; role: "user" | "assistant"; content: string; sources?: AssistantSource[]; suggestions?: string[] };
function emphasis(text: string): ReactNode {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => part.startsWith("**") && part.endsWith("**") ? <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong> : part);
}
function starters(path: string) {
  if (path.includes("business")) return ["What drove GDP expenditure in 2025?", "Compare cash and commitment spending in 2025.", "How did inflation change between 2022 and 2025?"];
  if (path.includes("youth")) return ["Compare youth unemployment age groups in 2025.", "What does NEET measure?", "Which region had the highest youth NEET rate in Q3 2025?"];
  if (path.includes("social")) return ["How has active health insurance coverage changed?", "Explain net versus gross school enrolment.", "How many households had access to electricity in 2021?"];
  if (path.includes("environment")) return ["What were the wettest months of 2025?", "How is carbon retention measured?", "Which regions hold the largest reported forest reserves?"];
  if (path.includes("governance")) return ["How has women’s representation in Parliament changed?", "Compare women judges across courts in 2025.", "What share of citizens felt they had no say in 2025?"];
  if (path.includes("sdg")) return ["How has multidimensional poverty changed since 2022?", "What does food insecurity measure?", "How has child mortality changed?"];
  return ["How has Ghana’s population changed since 2010?", "What was Ghana’s inflation rate in December 2025?", "Compare unemployment among the two youth age groups in 2025."];
}

export default function AssistantPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const path = usePathname();
  const titleId = useId();
  const inputId = useId();
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const transcript = useRef<HTMLDivElement>(null);
  const controller = useRef<AbortController | null>(null);
  const sequence = useRef(0);
  const nextId = useRef(0);
  const suggestions = messages.at(-1)?.role === "assistant" ? messages.at(-1)?.suggestions ?? [] : [];

  useEffect(() => {
    if (!open || !dialog.current) return;
    const element = dialog.current;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    element.showModal();
    return () => {
      element.close(); document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [open]);
  useEffect(() => { if (open && transcript.current) transcript.current.scrollTop = transcript.current.scrollHeight; }, [messages, busy, error, open]);
  useEffect(() => () => controller.current?.abort(), []);

  function stop() { sequence.current++; controller.current?.abort(); controller.current = null; setBusy(false); }
  function close() { if (busy) { stop(); setError("Request stopped. You can retry your last question."); } onClose(); }
  function clear() { stop(); setMessages([]); setError(""); setQuestion(""); }

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

  if (!open) return null;
  return createPortal(<dialog ref={dialog} aria-modal="true" aria-labelledby={titleId} onCancel={event => { event.preventDefault(); close(); }} onClose={onClose}
    onKeyDown={event => {
      if (event.key !== "Tab") return;
      const elements = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), textarea, a[href], [tabindex="0"]'));
      const first = elements[0]; const last = elements.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }}
    onClick={event => { if (event.target !== event.currentTarget) return; const box = event.currentTarget.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) close(); }}
    className="fixed inset-y-0 left-auto right-0 m-0 flex h-dvh max-h-dvh w-full max-w-full flex-col overflow-hidden border-0 bg-white p-0 text-slate-700 shadow-2xl backdrop:bg-slate-950/20 sm:w-[540px]">
    <div className="shrink-0 border-b border-slate-100 bg-slate-50 p-5">
      <div className="flex items-start justify-between gap-3"><div className="flex gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#26345A] text-white"><Sparkles size={19} /></span><div><h2 id={titleId} className="text-base font-bold text-slate-800">Ask Ghana in Numbers</h2><p className="mt-1 text-[11px] text-slate-500">Explore the data. Understand the figures.</p></div></div><button type="button" onClick={close} aria-label="Close data assistant" className="rounded-full bg-white p-2 text-slate-500 hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-blue-600"><X size={18} /></button></div>
      <div className="mt-4 flex items-center justify-between gap-3"><span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-teal-700"><BookOpen size={12} />Dashboard data & publication explanations</span>{messages.length > 0 && <button type="button" onClick={clear} className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-slate-800"><Trash2 size={12} />New conversation</button>}</div>
    </div>
    <div ref={transcript} role="region" aria-label="Assistant conversation" tabIndex={0} aria-busy={busy} className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-blue-600">
      {messages.length === 0 && <div className="pt-5"><p className="text-[10px] font-semibold uppercase tracking-widest text-teal-700">Start with a question</p><h3 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-slate-800">Ghana’s numbers,<br />explained clearly.</h3><p className="mt-3 text-sm leading-relaxed text-slate-500">Ask about an indicator, compare years or regions, or explore what a chart means. Answers include the reference periods and sources used.</p><div className="mt-6 space-y-3">{starters(path).map(text => <button key={text} type="button" onClick={() => ask(text)} className="flex w-full items-center justify-between gap-4 rounded-xl border border-slate-200 p-4 text-left text-xs font-medium leading-relaxed text-slate-600 hover:border-teal-200 hover:bg-teal-50/50 focus-visible:outline-2 focus-visible:outline-blue-600">{text}<ArrowUpRight size={15} className="shrink-0 text-teal-600" /></button>)}</div></div>}
      {messages.map(message => <article key={message.id} aria-label={message.role === "user" ? "Your question" : "Assistant answer"} className={message.role === "user" ? "ml-8 rounded-2xl rounded-br-md bg-[#26345A] px-4 py-3 text-sm leading-relaxed text-white" : "space-y-3"}>
        {message.role === "assistant" && <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-teal-700"><Sparkles size={12} />Ghana in Numbers</p>}
        <div className="space-y-3 text-sm leading-7 break-words">{message.content.split(/\n\s*\n/).map((paragraph, index) => <p key={index} className="whitespace-pre-line">{emphasis(paragraph)}</p>)}</div>
        {message.sources && message.sources.length > 0 && <div className="space-y-2 border-t border-slate-100 pt-3"><p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Sources used</p>{message.sources.map(source => <Link key={source.id} href={source.href} onClick={close} className="block rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 hover:border-teal-200"><span className="flex items-start justify-between gap-2 text-xs font-medium text-slate-700">{source.title}<ArrowUpRight size={13} className="shrink-0 text-slate-400" /></span><span className="mt-1 block break-words text-[10px] leading-relaxed text-slate-500">{source.period} · {source.reference}</span></Link>)}</div>}
      </article>)}
      {busy && <div role="status" className="flex items-center gap-2 rounded-xl bg-slate-50 p-4 text-xs text-slate-500"><LoaderCircle size={16} className="animate-spin text-teal-600" />Reading the relevant data…</div>}
      {error && <div role="alert" className="rounded-xl border border-amber-100 bg-amber-50 p-4"><p className="text-xs leading-relaxed text-amber-900">{error}</p>{messages.at(-1)?.role === "user" && !busy && <button type="button" onClick={() => void requestAnswer(messages)} className="mt-3 text-xs font-semibold text-amber-900 underline underline-offset-2">Retry question</button>}</div>}
      {!busy && !error && suggestions.length > 0 && <div className="space-y-2"><p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Explore further</p>{suggestions.map(text => <button key={text} type="button" onClick={() => ask(text)} className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-left text-xs leading-relaxed text-slate-600 hover:bg-slate-50">{text}</button>)}</div>}
    </div>
    <form onSubmit={submit} className="shrink-0 border-t border-slate-100 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <label htmlFor={inputId} className="sr-only">Ask a question about Ghana’s data</label>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-2 focus-within:border-teal-400 focus-within:ring-1 focus-within:ring-teal-400"><textarea id={inputId} value={question} maxLength={2000} rows={2} onChange={event => setQuestion(event.target.value)} onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); if (!busy) ask(question); } }} placeholder="Ask about Ghana’s data…" className="w-full resize-none bg-transparent px-2 py-1 text-sm text-slate-700 outline-none placeholder:text-slate-400" /><div className="flex items-center justify-between px-1"><span className="text-[10px] text-slate-400">{question.length}/2,000</span>{busy ? <button type="button" onClick={() => { stop(); setError("Request stopped. You can retry your last question."); }} className="flex items-center gap-1.5 rounded-lg bg-slate-200 px-3 py-2 text-xs font-semibold text-slate-700"><Square size={12} />Stop</button> : <button type="submit" disabled={!question.trim()} className="flex items-center gap-1.5 rounded-lg bg-[#26345A] px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"><Send size={13} />Ask</button>}</div></div>
      <p className="mt-2 text-center text-[10px] leading-relaxed text-slate-400">AI-assisted answers · Check the cited source, units and reference period.</p>
    </form>
  </dialog>, document.body);
}
