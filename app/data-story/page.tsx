import Link from "next/link";
import { Accessibility, ArrowRight, Droplets, GraduationCap, HeartPulse, MapPinned, Quote, School, Sparkles, type LucideIcon } from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";
import OverviewTopBar from "@/components/home/OverviewTopBar";
import { DataDisclosure, DataTable } from "@/components/ui/Data";

// Chapter 10, pp. 117–122. Survey results describe respondents in the covered districts, not national prevalence.
const dacf = [
  ["Knew about the DACF allocation for persons with disabilities", 55],
  ["Had received support", 54],
  ["Took part in discussions on how the fund is allocated and spent", 30],
  ["Had no formal education", 37.5],
  ["Had reached higher education", 4.3],
] as [string, number][];
const supportTypes = [["Economic empowerment", 47], ["Education", 24], ["Health", 22]] as [string, number][];

/** Colour sets for the four chapters, in the style of the Youth Bulge and Agriculture deep dives (text shades pass WCAG AA on their tints). */
const themes = {
  water: { bg: "#F0F9FF", badge: "#38BDF8", badgeText: "#082F49", eyebrow: "#0369A1", title: "#0C4A6E", big: "#0369A1", card: "#E0F2FE", line: "#BAE6FD" },
  hack: { bg: "#F5F3FF", badge: "#A78BFA", badgeText: "#2E1065", eyebrow: "#6D28D9", title: "#3B0764", big: "#6D28D9", card: "#EDE9FE", line: "#DDD6FE" },
  dacf: { bg: "#FFFBEB", badge: "#FBBF24", badgeText: "#451A03", eyebrow: "#B45309", title: "#78350F", big: "#B45309", card: "#FEF3C7", line: "#FDE68A" },
  mpi: { bg: "#ECFDF5", badge: "#34D399", badgeText: "#022C22", eyebrow: "#047857", title: "#064E3B", big: "#047857", card: "#D1FAE5", line: "#A7F3D0" },
} as const;
type Theme = (typeof themes)[keyof typeof themes];

const chapters = [
  { num: "01", label: "Clean Water", id: "water", color: themes.water.badge },
  { num: "02", label: "New Data Users", id: "hackathon", color: themes.hack.badge },
  { num: "03", label: "Disability Policy", id: "disability", color: themes.dacf.badge },
  { num: "04", label: "A District Responds", id: "afigya", color: themes.mpi.badge },
];

function ChapterHeader({ id, num, word, title, icon: Icon, t }: { id: string; num: string; word: string; title: string; icon: LucideIcon; t: Theme }) {
  return (
    <div className="mb-8 flex items-center gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-black" style={{ background: t.badge, color: t.badgeText }}>{num}</span>
      <Icon size={22} aria-hidden="true" style={{ color: t.eyebrow }} />
      <div>
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: t.eyebrow }}>Chapter {word}</p>
        <h2 id={id} className="text-xl font-black" style={{ color: t.title }}>{title}</h2>
      </div>
    </div>
  );
}

function BigFigure({ value, unit, caption, t }: { value: string; unit?: string; caption: string; t: Theme }) {
  return (
    <>
      <p className="font-black leading-none" style={{ fontSize: "clamp(3.5rem, 9vw, 5.5rem)", color: t.big }}>
        {value}{unit && <span className="ml-2 align-baseline text-2xl font-black">{unit}</span>}
      </p>
      <p className="mb-4 mt-2 text-lg font-bold" style={{ color: t.title }}>{caption}</p>
    </>
  );
}

function FactBox({ label, value, unit, note, t, strong = false }: { label: string; value: string; unit?: string; note?: string; t: Theme; strong?: boolean }) {
  return (
    <div className="rounded-xl border p-4" style={{ background: strong ? t.card : "#FFFFFF", borderColor: t.line }}>
      <p className="text-xs font-bold uppercase tracking-wide" style={{ color: t.eyebrow }}>{label}</p>
      <p className="tabular mt-1 text-3xl font-black leading-none" style={{ color: t.title }}>{value}{unit && <span className="ml-1.5 text-sm font-bold">{unit}</span>}</p>
      {note && <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{note}</p>}
    </div>
  );
}

function QuoteCard({ quote, cite, tags, t, icon: Icon }: { quote: string; cite: string; tags: string[]; t: Theme; icon: LucideIcon }) {
  return (
    <div className="rounded-2xl border p-6" style={{ background: t.card, borderColor: t.line }}>
      <Icon size={30} aria-hidden="true" style={{ color: t.eyebrow }} />
      <p className="mt-3 text-xl font-black leading-snug" style={{ color: t.title }}>{quote}</p>
      <p className="mt-3 text-xs font-semibold" style={{ color: t.eyebrow }}>{cite}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map(tag => <span key={tag} className="rounded-full bg-white px-3 py-1 text-xs font-semibold" style={{ color: t.title }}>{tag}</span>)}
      </div>
    </div>
  );
}

function Bars({ rows, color, t }: { rows: [string, number][]; color: string; t: Theme }) {
  return (
    <ul className="space-y-3">
      {rows.map(([label, v]) => (
        <li key={label}>
          <div className="mb-1 flex justify-between gap-3 text-[13px]"><span className="text-slate-700">{label}</span><span className="tabular font-bold" style={{ color: t.title }}>{v}%</span></div>
          <div className="h-2.5 rounded-full bg-white" aria-hidden="true"><div className="h-full rounded-full" style={{ width: `${v}%`, background: color }} /></div>
        </li>
      ))}
    </ul>
  );
}

const body = "text-sm leading-relaxed text-slate-700";

export default function DataStoriesPage() {
  const t = themes;
  return (
    <DashboardShell>
      <OverviewTopBar page="Data Stories" />
      <div className="min-h-full" style={{ background: "#EEF1F6" }}>

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <div className="relative overflow-hidden px-6 py-14 sm:px-8" style={{ backgroundColor: "#0C1F4A", backgroundImage: "linear-gradient(135deg, #0C1F4A 0%, #155E75 55%, #0F766E 100%)" }}>
          <div aria-hidden="true" className="absolute right-8 top-1/2 hidden -translate-y-1/2 grid-cols-4 gap-3 opacity-90 lg:grid">
            {[Droplets, GraduationCap, Accessibility, HeartPulse, School, MapPinned, Sparkles, Droplets, Accessibility, HeartPulse, GraduationCap, MapPinned].map((Icon, i) => (
              <Icon key={i} size={34} className="text-white" style={{ opacity: i % 3 === 0 ? 0.95 : 0.25 }} />
            ))}
          </div>
          <span className="mb-6 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold" style={{ background: "rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.92)" }}>
            <Sparkles size={13} aria-hidden="true" /> Chapter 10 · Data Stories
          </span>
          <h1 className="mb-3 font-black uppercase leading-none text-white" style={{ fontSize: "clamp(2.4rem, 6vw, 4rem)" }}>
            From evidence<br /><span style={{ color: "#5EEAD4" }}>to action</span>
          </h1>
          <p className="mb-2 max-w-xl text-lg font-semibold text-white">Four times official statistics changed what happened next.</p>
          <p className="mb-8 max-w-2xl text-sm leading-relaxed text-white/85">
            A borehole for a school, a dashboard built by students, a bigger disability fund and health insurance teams in the market:
            each began with a number published by the Ghana Statistical Service.
          </p>
          <nav aria-label="Chapters" className="flex flex-wrap items-center gap-4">
            {chapters.map((c, i) => (
              <a key={c.num} href={`#${c.id}`} className="flex items-center gap-2 rounded-full">
                <span className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-black" style={{ background: c.color, color: "#0C1F4A" }}>{c.num}</span>
                <span className="text-sm font-semibold text-white/90">{c.label}</span>
                {i < chapters.length - 1 && <span aria-hidden="true" className="ml-2 hidden h-px w-8 sm:block" style={{ background: "rgba(255,255,255,0.25)" }} />}
              </a>
            ))}
          </nav>
        </div>

        {/* ── FRAMING ───────────────────────────────────────────────────── */}
        <div className="bg-white px-6 py-10 sm:px-8">
          <p className="max-w-3xl text-base leading-relaxed text-slate-700">
            Statistics matter when someone uses them. These four accounts from Ghana in Numbers 2025 (pp. 117–122) show district figures,
            census data, a citizen survey and a new poverty index being used to direct support, teach data skills and shape policy.
          </p>
        </div>

        {/* ── CH 01 — CLEAN WATER ───────────────────────────────────────── */}
        <section id="water" aria-labelledby="water-h" className="scroll-mt-16 px-6 py-10 sm:px-8" style={{ background: t.water.bg }}>
          <ChapterHeader id="water-h" num="01" word="One" title="Clean Water Was 59 Minutes Away" icon={Droplets} t={t.water} />
          <div className="grid items-start gap-8 md:grid-cols-2">
            <div>
              <BigFigure value="59" unit="minutes" caption="a day spent collecting water in Ada West, Greater Accra" t={t.water} />
              <div className={`${body} space-y-3`}>
                <p>The GSS Water and Sanitation Report (October 2023) found that residents of Ada West spent an average of <strong>59 minutes a day</strong> collecting water, among the worst-served districts in the country. Stand-In-the-Gap, an NGO looking for a community to serve, used the report to choose Ada West and then Mangoase School.</p>
                <p>A January 2024 scouting visit found children learning under a shed without walls and walking to an untreated stream. The response was a <strong>borehole, storage tanks and pipes, a proper classroom and waste bins</strong>.</p>
              </div>
            </div>
            <div className="space-y-4">
              <QuoteCard icon={Quote} t={t.water} quote="From a district statistic to a borehole." cite="Water and Sanitation Report, October 2023 · p. 117" tags={["Ada West", "Mangoase School", "2023 to 2024"]} />
              <div className="grid gap-3 sm:grid-cols-2">
                <FactBox t={t.water} strong label="District average" value="59" unit="minutes" note="Daily time collecting water, October 2023 report" />
                <FactBox t={t.water} label="School to stream" value="15" unit="min each way" note="Before the borehole; the 59-minute figure is not the school’s own measurement" />
              </div>
            </div>
          </div>
        </section>

        {/* ── CH 02 — HACKATHON ─────────────────────────────────────────── */}
        <section id="hackathon" aria-labelledby="hack-h" className="scroll-mt-16 px-6 py-10 sm:px-8" style={{ background: t.hack.bg }}>
          <ChapterHeader id="hack-h" num="02" word="Two" title="Inspiring a New Generation of Data Users" icon={GraduationCap} t={t.hack} />
          <div className="grid items-start gap-8 md:grid-cols-2">
            <div>
              <BigFigure value="350+" unit="million" caption="official data points used by students in two StatsBank Hackathons" t={t.hack} />
              <div className={`${body} space-y-3`}>
                <p>Run by GSS and Statistics Denmark, the hackathon had students work on youth unemployment, gaps in education and health care, water and sanitation, gender inequality and regional differences.</p>
                <p>In the 2023 edition, one team built a <strong>dashboard showing which districts had enough health and education facilities</strong> and which had the deepest shortfalls.</p>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <FactBox t={t.hack} strong label="Official data points" value="350+" unit="million" note="2021 PHC and other datasets" />
              <FactBox t={t.hack} label="Tertiary institutions" value="11" note="Taking part across two editions" />
              <div className="sm:col-span-2"><FactBox t={t.hack} label="People aged 15–35, 2021" value="11.7" unit="million" note="38.2% of the population (the 2021 census definition used in this story) · p. 118" /></div>
            </div>
          </div>
        </section>

        {/* ── CH 03 — DISABILITY POLICY ─────────────────────────────────── */}
        <section id="disability" aria-labelledby="dacf-h" className="scroll-mt-16 px-6 py-10 sm:px-8" style={{ background: t.dacf.bg }}>
          <ChapterHeader id="dacf-h" num="03" word="Three" title="How Citizen Data Helped Shape Disability Policy" icon={Accessibility} t={t.dacf} />
          <div className="grid items-start gap-8 md:grid-cols-2">
            <div>
              <BigFigure value="3% → 5%" caption="share of the District Assemblies Common Fund for persons with disabilities, from 2025" t={t.dacf} />
              <div className={`${body} space-y-3`}>
                <p>The DACF Support Survey reached <strong>7,361 persons with disabilities in 10 districts across 3 ecological zones</strong>. Disability advocates used the findings in engagements with Parliament, the Office of the President and the National Council for Persons with Disabilities; the Ghana Federation of Disability Organisations called it “a turning point in our advocacy”.</p>
                <p>In October 2025 the allocation rose from 3% to 5%, Disability Desks were introduced in every assembly, and greater involvement of persons with disabilities in managing the fund became part of the agenda.</p>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <FactBox t={t.dacf} label="Allocation before" value="3" unit="%" />
                <FactBox t={t.dacf} strong label="Allocation from 2025" value="5" unit="%" />
              </div>
            </div>
            <div className="rounded-2xl border p-5" style={{ background: t.dacf.card, borderColor: t.dacf.line }}>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: t.dacf.eyebrow }}>What survey respondents reported</p>
              <p className="mb-4 mt-1 text-xs text-slate-600">% of respondents, 2023 survey; bars on a 0–100% scale</p>
              <Bars rows={dacf} color="#D97706" t={t.dacf} />
              <p className="mb-2 mt-5 text-[13px] font-bold" style={{ color: t.dacf.title }}>Main forms of support received</p>
              <Bars rows={supportTypes} color="#B45309" t={t.dacf} />
              <p className="mt-4 text-xs leading-relaxed text-slate-600">Respondents in the 10 covered districts, not a nationally representative sample. More than 60% asked for the allocation to rise from 3% to 5%, and 30% for faster release of funds. Source: DACF Support Survey (GSS, MLGDRD, GFD, GIZ) · pp. 119–120.</p>
              <div className="mt-4">
                <DataDisclosure><DataTable caption="DACF Support Survey results" headings={["Finding", "% of respondents"]} rows={[...dacf, ...supportTypes.map(([l, v]) => [`Support received as ${l.toLowerCase()}`, v] as [string, number])]} decimals={1} minWidth={420} unitNote="Support types are shares reported in the text; respondents could receive more than one type, so they need not sum to the 54% who received support." /></DataDisclosure>
              </div>
            </div>
          </div>
        </section>

        {/* ── CH 04 — AFIGYA KWABRE NORTH ───────────────────────────────── */}
        <section id="afigya" aria-labelledby="mpi-h" className="scroll-mt-16 px-6 py-10 sm:px-8" style={{ background: t.mpi.bg }}>
          <ChapterHeader id="mpi-h" num="04" word="Four" title="The Story of Afigya Kwabre North" icon={HeartPulse} t={t.mpi} />
          <div className="grid items-start gap-8 md:grid-cols-2">
            <div>
              <BigFigure value="23%" caption="of the district’s measured multidimensional poverty linked to residents without health insurance (nearly)" t={t.mpi} />
              <div className={`${body} space-y-3`}>
                <p>The first district-level Multidimensional Poverty Index (June 2024) covered <strong>all 261 districts</strong>, measuring what people go without rather than what they earn. In Afigya Kwabre North, Ashanti Region, nearly 23% of measured multidimensional poverty traced back to residents not being enrolled in the National Health Insurance Scheme.</p>
                <p>The district sent <strong>mobile NHIS registration teams into markets and community centres</strong>, removing the barrier of distance and time.</p>
              </div>
            </div>
            <div className="space-y-4">
              <QuoteCard icon={MapPinned} t={t.mpi} quote="Making one deprivation visible." cite="District Multidimensional Poverty Index, June 2024 · pp. 121–122" tags={["261 districts", "NHIS", "Ashanti Region"]} />
              <div className="grid gap-3 sm:grid-cols-2">
                <FactBox t={t.mpi} strong label="Linked to no health insurance" value="23" unit="% (nearly)" note="A contribution to the poverty measure, not the share of people uninsured" />
                <FactBox t={t.mpi} label="Districts measured" value="261" note="All districts, June 2024 release" />
              </div>
            </div>
          </div>
        </section>

        {/* ── CONCLUSION ────────────────────────────────────────────────── */}
        <div className="px-6 py-10 sm:px-8">
          <div className="rounded-2xl p-8" style={{ backgroundColor: "#0C1F4A", backgroundImage: "linear-gradient(135deg, #0C1F4A 0%, #134E4A 100%)" }}>
            <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest" style={{ color: "#5EEAD4" }}><Sparkles size={13} aria-hidden="true" /> What the stories share</p>
            <p className="mb-5 max-w-2xl text-2xl font-black leading-snug text-white">A published number is the start of a decision, not the end of a report.</p>
            <ul className="mb-6 space-y-2 text-sm text-white/90">
              {["District-level figures let an NGO choose one school out of many.", "Open data turned students into analysts of their own districts.", "A citizen survey gave advocates evidence that moved a national fund.", "A poverty index showed one district exactly which deprivation to tackle."].map(x => (
                <li key={x} className="flex gap-2"><span aria-hidden="true" style={{ color: "#FBBF24" }}>▸</span>{x}</li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3">
              <Link href="/youth-bulge" className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-sm font-bold" style={{ color: "#0C1F4A" }}>Read the Youth Bulge deep dive <ArrowRight size={16} aria-hidden="true" /></Link>
              <Link href="/agriculture-forestry-fishing" className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/40 px-5 text-sm font-bold text-white hover:bg-white/10">Agriculture deep dive <ArrowRight size={16} aria-hidden="true" /></Link>
            </div>
          </div>
          <p className="mt-4 text-right text-xs text-slate-600">Source: Ghana Statistical Service · Ghana in Numbers 2025, Chapter 10, pp. 117–122</p>
        </div>
      </div>
    </DashboardShell>
  );
}
