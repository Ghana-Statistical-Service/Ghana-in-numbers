import DashboardShell from "@/components/layout/DashboardShell";
import AgriculturePanel from "@/components/youth/AgriculturePanel";

export default function AgricultureForestryFishingPage() {
  return (
    <DashboardShell>
      <main className="flex-1 overflow-y-auto" style={{ background: "#EEF1F6" }}>

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <div
          className="relative px-8 py-14 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #052e16 0%, #14532d 50%, #15803D 100%)",
          }}
        >
          {/* Background icon grid */}
          <div
            className="absolute right-6 top-1/2 -translate-y-1/2 hidden lg:grid select-none"
            style={{ gridTemplateColumns: "repeat(5, 1fr)", gap: "8px", opacity: 0.35 }}
          >
            {Array.from({ length: 20 }).map((_, i) => (
              <span key={i} className="text-3xl leading-none">🌾</span>
            ))}
          </div>
          <div
            className="absolute right-6 bottom-6 hidden lg:block text-[11px] font-bold"
            style={{ color: "#86efac", background: "rgba(255,255,255,0.08)", padding: "4px 10px", borderRadius: 99 }}
          >
            Youth disengagement from agriculture accelerating
          </div>

          {/* Badge */}
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold mb-6"
            style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.85)" }}
          >
            🌱 Thematic Deep Dive · Agriculture
          </span>

          <h1
            className="font-black uppercase leading-none mb-3"
            style={{ fontSize: "clamp(2.2rem, 5.5vw, 3.8rem)", color: "#ffffff" }}
          >
            Agriculture,<br />
            <span style={{ color: "#86efac" }}>Forestry &amp; Fishing</span>
          </h1>

          <p
            className="text-base font-semibold max-w-lg mb-5"
            style={{ color: "rgba(255,255,255,0.80)" }}
          >
            A sector in retreat — youth are leaving, and the numbers show why that matters.
          </p>

          <p
            className="text-sm leading-relaxed max-w-2xl mb-10"
            style={{ color: "rgba(255,255,255,0.60)" }}
          >
            Agriculture, forestry and fishing have historically anchored Ghana&apos;s rural economy and
            provided a first foothold for millions of young workers. But between 2010 and 2021, youth
            participation collapsed — with those aged 15–24 falling by more than half. Two chapters
            trace what happened and what it means.
          </p>

          {/* Chapter strip */}
          <div className="flex flex-wrap items-center gap-4">
            {[
              { num: "01", label: "The Decline",      color: "#4ade80" },
              { num: "02", label: "The Gender Divide", color: "#a3e635" },
            ].map(({ num, label, color }, i) => (
              <div key={num} className="flex items-center gap-2">
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black"
                  style={{ background: color, color: "#052e16" }}
                >
                  {num}
                </span>
                <span className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.75)" }}>
                  {label}
                </span>
                {i < 1 && (
                  <div className="w-8 h-px ml-2" style={{ background: "rgba(255,255,255,0.18)" }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── FRAMING ───────────────────────────────────────────────────── */}
        <div className="px-6 py-10" style={{ background: "#ffffff" }}>
          <p className="text-base leading-relaxed max-w-3xl mb-8" style={{ color: "#374151" }}>
            Agriculture, forestry and fishing remain important sources of employment for young people
            in Ghana — but recent census data reveal a noticeable and accelerating decline in youth
            participation. The sector that once absorbed the majority of the rural working-age
            population is losing its appeal among the young at a pace that carries structural
            consequences for food security, rural employment, and long-term economic development.
          </p>

          {/* Two key fact cards */}
          <div className="grid md:grid-cols-2 gap-4">
            <div
              className="rounded-2xl p-5"
              style={{ background: "#F0FDF4", border: "1px solid #BBF7D0" }}
            >
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#15803D" }}>
                2010 Population &amp; Housing Census
              </p>
              <div className="space-y-3">
                {[
                  { group: "Ages 15–24", n: "865,855", label: "youth in agriculture" },
                  { group: "Ages 15–35", n: "2,025,551", label: "youth in agriculture" },
                ].map(({ group, n, label }) => (
                  <div key={group} className="flex items-baseline gap-2">
                    <span className="text-lg font-black" style={{ color: "#15803D" }}>{n}</span>
                    <span className="text-xs font-semibold" style={{ color: "#6B7280" }}>{group} · {label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div
              className="rounded-2xl p-5"
              style={{ background: "#FFF7ED", border: "1px solid #FED7AA" }}
            >
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#C2410C" }}>
                2021 Population &amp; Housing Census
              </p>
              <div className="space-y-3">
                {[
                  { group: "Ages 15–24", n: "381,476", label: "youth in agriculture", drop: "−56%" },
                  { group: "Ages 15–35", n: "1,222,885", label: "youth in agriculture", drop: "−40%" },
                ].map(({ group, n, label, drop }) => (
                  <div key={group} className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-lg font-black" style={{ color: "#C2410C" }}>{n}</span>
                    <span className="text-xs font-semibold" style={{ color: "#6B7280" }}>{group} · {label}</span>
                    <span
                      className="text-xs font-black px-2 py-0.5 rounded-full"
                      style={{ background: "#FEE2E2", color: "#DC2626" }}
                    >{drop}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-0">

          {/* ── CH 01 — THE DECLINE ─────────────────────────────────────── */}
          <section id="ch01" style={{ background: "#F0FDF4" }} className="px-6 py-10">
            <div className="flex items-center gap-3 mb-8">
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                style={{ background: "#15803D", color: "#fff" }}
              >01</span>
              <span className="text-xl">📉</span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#15803D" }}>
                  Chapter One
                </p>
                <p className="text-xl font-black" style={{ color: "#052e16" }}>The Decline</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8 items-start">
              <div>
                <p
                  className="font-black leading-none mb-2"
                  style={{ fontSize: "clamp(4rem, 10vw, 6rem)", color: "#15803D", lineHeight: 1 }}
                >
                  −56%
                </p>
                <p className="text-lg font-bold mb-4" style={{ color: "#052e16" }}>
                  fewer youth aged 15–24 in agriculture between 2010 and 2021
                </p>
                <p className="text-sm leading-relaxed mb-3" style={{ color: "#374151" }}>
                  In 2010, <strong>865,855 young Ghanaians aged 15–24</strong> worked in agriculture,
                  forestry and fishing. By the 2021 census, that figure had fallen to{" "}
                  <strong>381,476</strong> — a drop of more than half in a single decade. Among the
                  broader 15–35 age group, the decline was from <strong>2,025,551 to 1,222,885</strong>,
                  a 40 percent contraction.
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
                  This represents a <strong>structural shift</strong>, not a cyclical dip. Urbanisation,
                  out-migration, changing career perceptions, and limited mechanisation are all
                  pulling youth away from farming — and few are returning.
                </p>
              </div>

              {/* Pull-quote + drop visual */}
              <div className="flex flex-col gap-4">
                <div
                  className="rounded-2xl p-6 flex flex-col gap-4"
                  style={{ background: "#dcfce7", border: "1px solid #BBF7D0" }}
                >
                  <span className="text-4xl">🚜</span>
                  <p className="text-2xl font-black leading-snug" style={{ color: "#052e16" }}>
                    &ldquo;A decade of structural disengagement from the land.&rdquo;
                  </p>
                  <p className="text-xs font-semibold" style={{ color: "#15803D" }}>
                    — 2010 &amp; 2021 Population and Housing Census · Ghana Statistical Service
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["PHC 2021", "Urbanisation", "Youth migration"].map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                        style={{ background: "rgba(21,128,61,0.08)", color: "#15803D", border: "1px solid #BBF7D0" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Before / After stat */}
                <div
                  className="rounded-xl p-4 flex items-center justify-around"
                  style={{ background: "#fff", border: "1px solid #BBF7D0" }}
                >
                  <div className="text-center">
                    <p className="text-2xl font-black" style={{ color: "#15803D" }}>865k</p>
                    <p className="text-xs font-semibold mt-0.5" style={{ color: "#6B7280" }}>2010</p>
                    <p className="text-[10px]" style={{ color: "#9CA3AF" }}>Ages 15–24</p>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="text-lg" style={{ color: "#DC2626" }}>↓</div>
                    <span
                      className="text-sm font-black px-2 py-0.5 rounded-full"
                      style={{ background: "#FEE2E2", color: "#DC2626" }}
                    >−56%</span>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-black" style={{ color: "#C2410C" }}>381k</p>
                    <p className="text-xs font-semibold mt-0.5" style={{ color: "#6B7280" }}>2021</p>
                    <p className="text-[10px]" style={{ color: "#9CA3AF" }}>Ages 15–24</p>
                  </div>
                </div>
              </div>
            </div>

            <AgriculturePanel />
          </section>

          {/* ── CH 02 — THE GENDER DIVIDE ───────────────────────────────── */}
          <section id="ch02" style={{ background: "#FEFCE8" }} className="px-6 py-10">
            <div className="flex items-center gap-3 mb-8">
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                style={{ background: "#a3e635", color: "#365314" }}
              >02</span>
              <span className="text-xl">⚖️</span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#65a30d" }}>
                  Chapter Two
                </p>
                <p className="text-xl font-black" style={{ color: "#365314" }}>The Gender Divide</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8 items-start">
              <div>
                <p
                  className="font-black leading-none mb-2"
                  style={{ fontSize: "clamp(4rem, 10vw, 6rem)", color: "#65a30d", lineHeight: 1 }}
                >
                  −64%
                </p>
                <p className="text-lg font-bold mb-4" style={{ color: "#365314" }}>
                  female youth (15–24) left agriculture between 2010 and 2021
                </p>
                <p className="text-sm leading-relaxed mb-3" style={{ color: "#374151" }}>
                  The decline was not gender-neutral. Among youth aged <strong>15–24</strong>, the
                  female count fell from <strong>387,293 (2010)</strong> to{" "}
                  <strong>138,112 (2021)</strong> — a 64 percent drop, sharper than the 49 percent
                  decline seen among males (478,562 → 243,364).
                </p>
                <p className="text-sm leading-relaxed mb-3" style={{ color: "#374151" }}>
                  Among <strong>15–35</strong> youth, males fell from 1,069,672 to 764,212 (−29%),
                  while females dropped from 955,879 to 458,673 (−52%). The gender gap in
                  agricultural participation widened substantially across all age groups.
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
                  This reflects a combination of urbanisation pull, expanding female access to other
                  sectors, and persisting barriers — including land access, mechanisation gaps,
                  and social norms — that made agriculture relatively less attractive for young women.
                </p>
              </div>

              {/* Gender breakdown visual */}
              <div className="flex flex-col gap-4">
                {/* 2010 */}
                <div
                  className="rounded-2xl p-5"
                  style={{ background: "#f7fee7", border: "1px solid #d9f99d" }}
                >
                  <p className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: "#65a30d" }}>
                    2010 · Youth in Agriculture
                  </p>
                  <div className="space-y-3">
                    {[
                      { label: "Male 15–24",   n: 478_562, pct: 55, total: 865_855 },
                      { label: "Female 15–24", n: 387_293, pct: 45, total: 865_855 },
                      { label: "Male 15–35",   n: 1_069_672, pct: 53, total: 2_025_551 },
                      { label: "Female 15–35", n: 955_879, pct: 47, total: 2_025_551 },
                    ].map(({ label, n, pct }) => (
                      <div key={label}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold" style={{ color: "#365314" }}>
                            {label.startsWith("Male") ? "👨" : "👩"} {label}
                          </span>
                          <span className="text-xs font-black" style={{ color: "#15803D" }}>
                            {n.toLocaleString()}
                          </span>
                        </div>
                        <div className="h-2 rounded-full" style={{ background: "#d9f99d" }}>
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${pct}%`,
                              background: label.startsWith("Male") ? "#15803D" : "#65a30d",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2021 */}
                <div
                  className="rounded-2xl p-5"
                  style={{ background: "#FFF7ED", border: "1px solid #FED7AA" }}
                >
                  <p className="text-xs font-black uppercase tracking-widest mb-4" style={{ color: "#C2410C" }}>
                    2021 · Youth in Agriculture
                  </p>
                  <div className="space-y-3">
                    {[
                      { label: "Male 15–24",   n: 243_364, pct: 64, drop: "−49%" },
                      { label: "Female 15–24", n: 138_112, pct: 36, drop: "−64%" },
                      { label: "Male 15–35",   n: 764_212, pct: 62, drop: "−29%" },
                      { label: "Female 15–35", n: 458_673, pct: 38, drop: "−52%" },
                    ].map(({ label, n, pct, drop }) => (
                      <div key={label}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold" style={{ color: "#7C2D12" }}>
                            {label.startsWith("Male") ? "👨" : "👩"} {label}
                          </span>
                          <div className="flex items-center gap-2">
                            <span
                              className="text-[10px] font-black px-1.5 py-0.5 rounded"
                              style={{ background: "#FEE2E2", color: "#DC2626" }}
                            >{drop}</span>
                            <span className="text-xs font-black" style={{ color: "#C2410C" }}>
                              {n.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="h-2 rounded-full" style={{ background: "#FED7AA" }}>
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${pct}%`,
                              background: label.startsWith("Male") ? "#EA580C" : "#FB923C",
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Key insight box */}
            <div
              className="rounded-xl p-4 flex flex-wrap gap-4 items-start"
              style={{ background: "#fff", border: "1px solid #d9f99d" }}
            >
              <span className="text-2xl flex-shrink-0">💡</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black uppercase tracking-widest mb-1" style={{ color: "#65a30d" }}>
                  Widening gender gap
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "#365314" }}>
                  In 2010, males accounted for roughly <strong>55%</strong> of youth agricultural
                  workers (15–24). By 2021, that share rose to <strong>64%</strong> — not because
                  male participation held steady, but because female participation collapsed faster.
                  Without targeted interventions (land rights, mechanisation support, agribusiness
                  training for women), the sector risks becoming increasingly male-dominated and
                  less productive.
                </p>
              </div>
            </div>
          </section>

          {/* ── CONCLUSION ────────────────────────────────────────────────── */}
          <div className="px-6 py-10" style={{ background: "#EEF1F6" }}>
            <div
              className="rounded-2xl p-8"
              style={{ background: "linear-gradient(135deg, #052e16 0%, #14532d 100%)" }}
            >
              <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "#86efac" }}>
                🌱 The path forward
              </p>
              <p className="text-2xl font-black text-white mb-5 max-w-2xl leading-snug">
                A declining sector is not an inevitable one.
              </p>

              <div className="mb-6 space-y-2">
                {[
                  "Youth aged 15–24 in agriculture fell by over 50% — from 865,855 (2010) to 381,476 (2021)",
                  "The broader 15–35 cohort declined by 40%, from over 2 million to under 1.3 million",
                  "Female participation dropped faster than male, widening the gender gap in the sector",
                  "The structural shift reflects urbanisation, migration, and limited modernisation",
                ].map((pt) => (
                  <div key={pt} className="flex items-start gap-2">
                    <span className="mt-0.5 flex-shrink-0" style={{ color: "#86efac" }}>▸</span>
                    <p className="text-sm" style={{ color: "rgba(255,255,255,0.80)" }}>{pt}</p>
                  </div>
                ))}
              </div>

              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#4ade80" }}>
                Policy levers
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {[
                  "⚙️ Mechanisation",
                  "🏦 Access to finance",
                  "📦 Agribusiness development",
                  "🔗 Value-chain opportunities",
                  "👩‍🌾 Women in agriculture",
                  "🎓 Agricultural TVET",
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

              <div
                className="rounded-xl px-5 py-4"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
              >
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.80)" }}>
                  Strengthening youth engagement in agriculture — through mechanisation, agribusiness
                  development, and access to finance — will be critical for ensuring long-term food
                  security, rural employment, and sustainable economic development in Ghana.
                </p>
              </div>
            </div>

            <p className="text-xs text-right mt-4" style={{ color: "#94A3B8" }}>
              Source: Ghana Statistical Service — 2010 &amp; 2021 Population and Housing Census
            </p>
          </div>

        </div>
      </main>
    </DashboardShell>
  );
}
