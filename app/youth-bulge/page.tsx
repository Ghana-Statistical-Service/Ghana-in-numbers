import DashboardShell from "@/components/layout/DashboardShell";
import NeetPanel from "@/components/youth/NeetPanel";
import NeetRegionalPanel from "@/components/youth/NeetRegionalPanel";
import PopulationSharePanel from "@/components/youth/PopulationSharePanel";
import SectionNav from "@/components/youth/SectionNav";
import UnemploymentPanel from "@/components/youth/UnemploymentPanel";
import { skillsAlignment } from "@/data/youthBulgeData";

export default function YouthBulgePage() {
  return (
    <DashboardShell>
      <main className="flex-1 overflow-y-auto" style={{ background: "#EEF1F6" }}>
        <SectionNav />

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <div
          className="relative px-8 py-14 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #1B2A4A 0%, #6B1544 55%, #DB2988 100%)",
          }}
        >
          {/* Emoji figure grid */}
          <div
            className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:grid select-none"
            style={{ gridTemplateColumns: "repeat(5, 1fr)", gap: "6px", opacity: 0.9 }}
            aria-label="1 in 3 youth unemployed"
          >
            {Array.from({ length: 20 }).map((_, i) => (
              <span
                key={i}
                className="text-3xl leading-none"
                style={{ opacity: i % 3 === 0 ? 1 : 0.18 }}
              >
                🧑
              </span>
            ))}
          </div>
          <div
            className="absolute right-6 bottom-6 hidden lg:block text-[11px] font-bold"
            style={{ color: "#DB2988", background: "rgba(255,255,255,0.10)", padding: "4px 10px", borderRadius: 99 }}
          >
            1 in 3 young Ghanaians is unemployed
          </div>

          {/* Badge */}
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold mb-6"
            style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.85)" }}
          >
            ✦ Thematic Deep Dive · Youth Bulge
          </span>

          <h1
            className="font-black uppercase leading-none mb-3"
            style={{ fontSize: "clamp(2.4rem, 6vw, 4rem)", color: "#ffffff" }}
          >
            Ghana&apos;s<br />
            <span style={{ color: "#F9A8D4" }}>Youth Bulge</span>
          </h1>

          <p
            className="text-base font-semibold max-w-lg mb-5"
            style={{ color: "rgba(255,255,255,0.80)" }}
          >
            A generation that can power the next chapter — or be left behind.
          </p>

          <p
            className="text-sm leading-relaxed max-w-2xl mb-10"
            style={{ color: "rgba(255,255,255,0.60)" }}
          >
            Ghana has the youngest working-age population in its recorded history. That is a structural
            advantage — but only if it is matched by jobs, skills, and investment. Four chapters
            tell the story through data.
          </p>

          {/* Chapter progress strip */}
          <div className="flex flex-wrap items-center gap-4">
            {[
              { num: "01", label: "The Bulge",          color: "#DB2988" },
              { num: "02", label: "The Crisis",          color: "#F87171" },
              { num: "03", label: "The Excluded",        color: "#C4B5FD" },
              { num: "04", label: "The Deeper Picture",  color: "#FCD34D" },
            ].map(({ num, label, color }, i) => (
              <div key={num} className="flex items-center gap-2">
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black"
                  style={{ background: color, color: i === 3 ? "#78350F" : "#fff" }}
                >
                  {num}
                </span>
                <span className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.75)" }}>
                  {label}
                </span>
                {i < 3 && (
                  <div className="w-8 h-px ml-2" style={{ background: "rgba(255,255,255,0.18)" }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── FRAMING SECTION ───────────────────────────────────────────── */}
        <div className="px-6 py-10" style={{ background: "#ffffff" }}>

          {/* Intro */}
          <p className="text-base leading-relaxed max-w-3xl mb-8" style={{ color: "#374151" }}>
            Ghana&apos;s population pyramid has been climbing a staircase for decades — fewer children at the
            base, a swelling body of working-age youth, and a slowly ageing top. That shift defines the
            country&apos;s economic moment. Whether it becomes a ladder or a cliff depends on policy.
          </p>

          {/* Children share stat strip */}
          <div
            className="rounded-2xl p-6 mb-8 flex flex-wrap items-center gap-6"
            style={{ background: "#FDF2F8", border: "1px solid #FBCFE8" }}
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "#DB2988" }}>
                Share of children (0–14) — declining
              </p>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-3xl font-black" style={{ color: "#9D174D" }}>41.8%</p>
                  <p className="text-xs font-semibold mt-1" style={{ color: "#DB2988" }}>2000</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="w-3 h-1 rounded-full" style={{ background: i < 4 ? "#DB2988" : "#FDE8F3" }} />
                    ))}
                  </div>
                  <p className="text-[10px] font-bold mt-1" style={{ color: "#94A3B8" }}>→</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-black" style={{ color: "#DB2988" }}>33.2%</p>
                  <p className="text-xs font-semibold mt-1" style={{ color: "#DB2988" }}>2025</p>
                </div>
              </div>
            </div>
            <div className="h-12 w-px hidden md:block" style={{ background: "#FBCFE8" }} />
            <div>
              <span
                className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold"
                style={{ background: "#DB2988", color: "#fff" }}
              >
                📐 Youth Bulge Hypothesis
              </span>
              <p className="text-xs mt-2 max-w-xs leading-relaxed" style={{ color: "#9D174D" }}>
                As fertility falls and child shares decline, the working-age youth cohort temporarily
                swells — creating a one-time window for accelerated growth.
              </p>
            </div>
          </div>

          {/* Who is a youth? */}
          <p
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: "#64748B" }}
          >
            Who counts as a youth?
          </p>
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div
              className="rounded-2xl p-5"
              style={{ background: "#EFF6FF", border: "1px solid #BFDBFE" }}
            >
              <p className="text-sm font-black mb-1" style={{ color: "#1E40AF" }}>
                🌐 15–24 · International definition
              </p>
              <p className="text-xs leading-relaxed mb-3" style={{ color: "#1D4ED8" }}>
                Used by the UN, ILO, and most global labour-force surveys. Ghana&apos;s 15–24 cohort
                has remained remarkably stable at <strong>~18%</strong> of the population —
                peaking at 18.9% in 2008, settling at 17.8% in 2025.
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-black" style={{ color: "#2563EB" }}>~18%</p>
                <p className="text-xs font-semibold" style={{ color: "#93C5FD" }}>share in 2025</p>
              </div>
            </div>
            <div
              className="rounded-2xl p-5"
              style={{ background: "#ECFDF5", border: "1px solid #A7F3D0" }}
            >
              <p className="text-sm font-black mb-1" style={{ color: "#065F46" }}>
                🌍 15–35 · African Union definition
              </p>
              <p className="text-xs leading-relaxed mb-3" style={{ color: "#047857" }}>
                Adopted by Ghana&apos;s National Youth Policy and African statistical bodies. This broader
                band averaged <strong>31.9%</strong> over the last two decades — it peaked at
                34.6% in 2000 and is now at 30.0% in 2025.
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-black" style={{ color: "#059669" }}>~30%</p>
                <p className="text-xs font-semibold" style={{ color: "#6EE7B7" }}>share in 2025</p>
              </div>
            </div>
          </div>

          {/* Two Futures */}
          <p
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: "#64748B" }}
          >
            Two futures — one decision
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div
              className="rounded-2xl p-5"
              style={{ background: "#ECFDF5", border: "1px solid #6EE7B7" }}
            >
              <p className="text-base font-black mb-2" style={{ color: "#065F46" }}>
                ✅ Demographic Dividend
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "#047857" }}>
                Expand education and vocational training. Create labour-intensive industries. Match
                skills to the economy&apos;s needs. The result: a youthful, productive workforce becomes
                an <strong>engine of economic growth</strong> — higher savings, investment, and
                per-capita income as the dependency ratio falls.
              </p>
            </div>
            <div
              className="rounded-2xl p-5"
              style={{ background: "#FFF1F2", border: "1px solid #FECDD3" }}
            >
              <p className="text-base font-black mb-2" style={{ color: "#9F1239" }}>
                ⚠️ Demographic Bomb
              </p>
              <p className="text-xs leading-relaxed" style={{ color: "#BE123C" }}>
                Fail to absorb youth into productive employment. The result: rising unemployment,
                irregular migration, social instability, and lost human capital. A bulge that should
                have been an <strong>asset becomes a liability</strong> — compounding inequality
                and slowing growth for a generation.
              </p>
            </div>
          </div>
        </div>

        {/* ── CONTENT ───────────────────────────────────────────────────── */}
        <div className="space-y-0">

          {/* ── CH 01 — THE BULGE ───────────────────────────────────────── */}
          <section id="ch01" style={{ background: "#FDF2F8" }} className="px-6 py-10">
            <div className="flex items-center gap-3 mb-8">
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                style={{ background: "#DB2988" }}
              >01</span>
              <span className="text-xl">🌱</span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#DB2988" }}>
                  Chapter One
                </p>
                <p className="text-xl font-black" style={{ color: "#831843" }}>The Bulge</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8 items-start">
              <div>
                <p
                  className="font-black leading-none mb-2"
                  style={{ fontSize: "clamp(4rem, 10vw, 6rem)", color: "#DB2988", lineHeight: 1 }}
                >
                  ~30%
                </p>
                <p className="text-lg font-bold mb-4" style={{ color: "#9D174D" }}>
                  of all Ghanaians are aged 15–35
                </p>
                <p className="text-sm leading-relaxed mb-3" style={{ color: "#374151" }}>
                  Ghana&apos;s youth (15–35) make up nearly <strong>30% of the population</strong> — the
                  largest youth generation ever recorded, according to the{" "}
                  <strong>2021 Population and Housing Census</strong>. The share of children (0–14) is
                  falling as this bulge of working-age youth expands.
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
                  It is a structural shift that carries both opportunity and urgency. A growing
                  working-age population is only an asset if it finds productive work. If it does not,
                  the dividend becomes a deficit.
                </p>
              </div>

              <div
                className="rounded-2xl p-6 flex flex-col gap-4 h-full justify-center"
                style={{ background: "#FCE7F3", border: "1px solid #FBCFE8" }}
              >
                <span className="text-4xl">📊</span>
                <p className="text-2xl font-black leading-snug" style={{ color: "#831843" }}>
                  &ldquo;The largest youth cohort in Ghana&apos;s recorded history.&rdquo;
                </p>
                <p className="text-xs font-semibold" style={{ color: "#DB2988" }}>
                  — 2021 Population and Housing Census · Ghana Statistical Service
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["38.2% aged 15–35 (AU def.)", "Fertility declining", "PHC 2021"].map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                      style={{ background: "#DB29880F", color: "#9D174D", border: "1px solid #FBCFE8" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Post-bulge inset */}
            <div
              className="rounded-xl p-4 mb-6 flex flex-wrap items-start gap-4"
              style={{ background: "#FFF7ED", border: "1px solid #FED7AA" }}
            >
              <div className="flex-shrink-0">
                <span className="text-2xl">📉</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: "#B45309" }}>
                  Early Post-Bulge Transition
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "#78350F" }}>
                  Since 2019, youth proportions have started a gradual decline (now ~30%). But{" "}
                  <strong>absolute numbers remain large</strong> — the cohort is still growing in
                  headcount even as its population share falls. The{" "}
                  <strong>pressure ratio</strong> (youth 15–35 / children 0–14) stands at{" "}
                  <strong>~0.83</strong> — structurally high, meaning the economy must absorb far
                  more working-age entrants than new dependants each year.
                </p>
              </div>
            </div>

            <PopulationSharePanel />
          </section>

          {/* ── CH 02 — THE CRISIS ──────────────────────────────────────── */}
          <section id="ch02" style={{ background: "#FEF2F2" }} className="px-6 py-10">
            <div className="flex items-center gap-3 mb-8">
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                style={{ background: "#DC2626" }}
              >02</span>
              <span className="text-xl">💼</span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#DC2626" }}>
                  Chapter Two
                </p>
                <p className="text-xl font-black" style={{ color: "#7F1D1D" }}>The Crisis</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8 items-start">
              <div>
                <div className="flex items-baseline gap-3 mb-1">
                  <p
                    className="font-black leading-none"
                    style={{ fontSize: "clamp(4rem, 10vw, 6rem)", color: "#DC2626", lineHeight: 1 }}
                  >
                    30.5%
                  </p>
                  <span className="text-sm font-bold" style={{ color: "#94A3B8" }}>Q2 2025</span>
                </div>
                <div className="flex items-baseline gap-3 mb-4">
                  <p
                    className="font-black leading-none"
                    style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "#EF4444", lineHeight: 1 }}
                  >
                    34.4%
                  </p>
                  <span className="text-sm font-bold" style={{ color: "#94A3B8" }}>Q3 2025</span>
                </div>
                <p className="text-lg font-bold mb-4" style={{ color: "#7F1D1D" }}>
                  Youth unemployment (ages 15–24) · National
                </p>
                <p className="text-sm leading-relaxed mb-3" style={{ color: "#374151" }}>
                  Nearly <strong>1 in 3 young Ghanaians aged 15–24</strong> is unemployed. The burden
                  falls heaviest on urbanised southern regions — <strong>Greater Accra hit 49.3%</strong>{" "}
                  in Q3 2025, followed by Western (46.8%) and Ashanti (41.2%).
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
                  Northern regions show lower measured unemployment, partly because subsistence
                  agriculture counts as employment. Use the toggles below to explore by quarter and
                  age bracket.
                </p>
              </div>

              <div className="flex flex-col items-center gap-4">
                <div
                  className="grid gap-2 w-full max-w-xs mx-auto"
                  style={{ gridTemplateColumns: "repeat(5, 1fr)" }}
                  aria-label="1 in 3 youth unemployed"
                >
                  {Array.from({ length: 15 }).map((_, i) => (
                    <span
                      key={i}
                      className="text-3xl text-center"
                      style={{ opacity: i % 3 === 0 ? 1 : 0.15 }}
                    >
                      🧑
                    </span>
                  ))}
                </div>
                <p className="text-xs font-bold text-center" style={{ color: "#DC2626" }}>
                  1 in 3 youth aged 15–24 is unemployed
                </p>
                <div
                  className="rounded-xl p-4 w-full"
                  style={{ background: "#FEE2E2", border: "1px solid #FECACA" }}
                >
                  <p className="text-xs font-black text-center mb-1" style={{ color: "#991B1B" }}>
                    Peak: Greater Accra Q3 2025
                  </p>
                  <p className="text-3xl font-black text-center" style={{ color: "#DC2626" }}>49.3%</p>
                  <p className="text-[10px] text-center mt-1" style={{ color: "#B91C1C" }}>
                    Youth aged 15–24 unemployed
                  </p>
                </div>
              </div>
            </div>

            <UnemploymentPanel />
          </section>

          {/* ── CH 03 — THE EXCLUDED ────────────────────────────────────── */}
          <section id="ch03" style={{ background: "#F5F3FF" }} className="px-6 py-10">
            <div className="flex items-center gap-3 mb-8">
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                style={{ background: "#7C3AED" }}
              >03</span>
              <span className="text-xl">⚠️</span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#7C3AED" }}>
                  Chapter Three
                </p>
                <p className="text-xl font-black" style={{ color: "#4C1D95" }}>The Excluded</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8 items-start">
              <div>
                <p
                  className="font-black leading-none mb-2"
                  style={{ fontSize: "clamp(4rem, 10vw, 6rem)", color: "#7C3AED", lineHeight: 1 }}
                >
                  21.5%
                </p>
                <p className="text-lg font-bold mb-4" style={{ color: "#4C1D95" }}>
                  of youth aged 15–24 are NEET
                </p>
                <p className="text-sm leading-relaxed mb-3" style={{ color: "#374151" }}>
                  Beyond unemployment lies a deeper form of exclusion. <strong>NEET</strong> — Not in
                  Education, Employment or Training — captures those most at risk of long-term
                  economic marginalisation.
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
                  Young women (23.7%) face significantly higher NEET rates than young men (19.2%),
                  reflecting barriers to both labour participation and continued education. Surprisingly,
                  urban youth (21.8%) are marginally more NEET than rural peers (21.1%), pointing to
                  failed urban transitions for migrant youth.
                </p>
              </div>

              <div
                className="rounded-2xl p-6 flex flex-col gap-4"
                style={{ background: "#EDE9FE", border: "1px solid #DDD6FE" }}
              >
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#7C3AED" }}>
                  NEET rate breakdown (ages 15–24)
                </p>
                {[
                  { label: "Female",   pct: 23.7, icon: "👩" },
                  { label: "Urban",    pct: 21.8, icon: "🏙️" },
                  { label: "National", pct: 21.5, icon: "🇬🇭" },
                  { label: "Rural",    pct: 21.1, icon: "🌾" },
                  { label: "Male",     pct: 19.2, icon: "👨" },
                ].map(({ label, pct, icon }) => (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold flex items-center gap-1.5" style={{ color: "#4C1D95" }}>
                        {icon} {label}
                      </span>
                      <span className="text-xs font-black" style={{ color: "#7C3AED" }}>{pct}%</span>
                    </div>
                    <div className="h-2 rounded-full" style={{ background: "#C4B5FD" }}>
                      <div
                        className="h-2 rounded-full"
                        style={{ width: `${(pct / 30) * 100}%`, background: "#7C3AED" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <NeetPanel />
          </section>

          {/* ── CH 04 — THE DEEPER PICTURE ──────────────────────────────── */}
          <section id="ch04" style={{ background: "#FFF7ED" }} className="px-6 py-10">
            <div className="flex items-center gap-3 mb-8">
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                style={{ background: "#F59E0B", color: "#78350F" }}
              >04</span>
              <span className="text-xl">📋</span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#B45309" }}>
                  Chapter Four
                </p>
                <p className="text-xl font-black" style={{ color: "#78350F" }}>The Deeper Picture</p>
              </div>
            </div>

            {/* Three summary stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                {
                  stat: ">70%",
                  label: "of employed youth work informally",
                  sub: "No contract, no social protection, no stability",
                  color: "#B45309",
                  bg: "#FEF3C7",
                  border: "#FDE68A",
                },
                {
                  stat: "~2M",
                  label: "youth aged 15–35 classified as NEET",
                  sub: "Absolute number — invisible in the unemployment rate",
                  color: "#92400E",
                  bg: "#FFF7ED",
                  border: "#FED7AA",
                },
                {
                  stat: "~30%",
                  label: "structural unemployment risk",
                  sub: "Persistent across quarters and age groups",
                  color: "#B45309",
                  bg: "#FEF3C7",
                  border: "#FDE68A",
                },
              ].map(({ stat, label, sub, color, bg, border }) => (
                <div
                  key={stat}
                  className="rounded-2xl p-5 flex flex-col gap-2"
                  style={{ background: bg, border: `1px solid ${border}` }}
                >
                  <p
                    className="font-black leading-none"
                    style={{ fontSize: "clamp(2.5rem, 6vw, 3.5rem)", color, lineHeight: 1 }}
                  >
                    {stat}
                  </p>
                  <p className="text-sm font-bold leading-snug" style={{ color: "#78350F" }}>
                    {label}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: "#92400E" }}>
                    {sub}
                  </p>
                </div>
              ))}
            </div>

            {/* NEET Regional Panel */}
            <div className="mb-8">
              <NeetRegionalPanel />
            </div>

            {/* Skills alignment */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#B45309" }}>
                Skills &amp; Labour Market Alignment
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { value: `${skillsAlignment.wellMatched}%`,      label: "Well-matched to jobs",       color: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0" },
                  { value: `${skillsAlignment.overqualified}%`,     label: "Overqualified",              color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE" },
                  { value: `${skillsAlignment.underqualified}%`,    label: "Underqualified",             color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
                  { value: `${skillsAlignment.educationAligned}%`,  label: "Education–industry aligned", color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE" },
                ].map(({ value, label, color, bg, border }) => (
                  <div
                    key={label}
                    className="rounded-xl p-4 text-center"
                    style={{ background: bg, border: `1px solid ${border}` }}
                  >
                    <p className="text-2xl font-black mb-1" style={{ color }}>{value}</p>
                    <p className="text-[11px] font-semibold leading-snug" style={{ color }}>{label}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-3 leading-relaxed" style={{ color: "#78350F" }}>
                <strong>{skillsAlignment.informalShare}%</strong> of employed youth are in the informal
                sector — where skills mismatch is harder to measure and even harder to address.
                Expanding TVET, strengthening education–industry linkages, and formalising
                informal apprenticeships are the levers most directly in policy reach.
              </p>
            </div>
          </section>

          {/* ── CONCLUSION ────────────────────────────────────────────────── */}
          <div className="px-6 py-10" style={{ background: "#EEF1F6" }}>
            <div
              className="rounded-2xl p-8"
              style={{ background: "linear-gradient(135deg, #1B2A4A 0%, #3B1259 100%)" }}
            >
              <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "#F9A8D4" }}>
                ✦ The question before Ghana
              </p>
              <p className="text-2xl font-black text-white mb-5 max-w-2xl leading-snug">
                Demographic Dividend — or Demographic Bomb?
              </p>

              {/* Big picture bullets */}
              <div className="mb-6 space-y-2">
                {[
                  "Fertility has declined significantly — child share fell from 41.8% (2000) to 33.2% (2025)",
                  "Youth aged 15–35 have dominated the population for over two decades",
                  "The window for a demographic dividend is open — but it is narrowing",
                  "Inaction now means the bulge ages into a structurally fragile workforce",
                ].map((pt) => (
                  <div key={pt} className="flex items-start gap-2">
                    <span className="mt-0.5 flex-shrink-0 text-amber-300">▸</span>
                    <p className="text-sm" style={{ color: "rgba(255,255,255,0.80)" }}>{pt}</p>
                  </div>
                ))}
              </div>

              {/* Core challenges */}
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#FCD34D" }}>
                Core policy challenges
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {[
                  "🏭 Labour-intensive industrial growth",
                  "🌾 Agricultural modernisation",
                  "🎓 TVET expansion",
                  "🔗 Education–industry linkages",
                  "🚀 Youth entrepreneurship",
                  "📊 Effective labour-market institutions",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ background: "rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.80)" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Binary */}
              <div
                className="rounded-xl px-5 py-4 flex flex-wrap gap-6 items-center"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
              >
                <div>
                  <p className="text-xs font-bold mb-1" style={{ color: "#6EE7B7" }}>With investment</p>
                  <p className="text-sm font-black" style={{ color: "#34D399" }}>→ Demographic Dividend</p>
                </div>
                <div className="h-8 w-px hidden sm:block" style={{ background: "rgba(255,255,255,0.18)" }} />
                <div>
                  <p className="text-xs font-bold mb-1" style={{ color: "#FCA5A5" }}>Without investment</p>
                  <p className="text-sm font-black" style={{ color: "#F87171" }}>→ Demographic Bomb</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-right mt-4" style={{ color: "#94A3B8" }}>
              Source: Ghana Statistical Service — Labour Force Survey Q2/Q3 2025 · PHC 2021 · Ghana in Numbers 2025
            </p>
          </div>

        </div>
      </main>
    </DashboardShell>
  );
}
