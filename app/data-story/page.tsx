import DashboardShell from "@/components/layout/DashboardShell";
import StatChapter from "@/components/story/StatChapter";
import AgeShareDonut from "@/components/story/AgeShareDonut";
import YouthProjectionChart from "@/components/story/YouthProjectionChart";

export default function DataStoryPage() {
  return (
    <DashboardShell>
      <main className="flex-1 overflow-y-auto" style={{ background: "#EEF1F6" }}>

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <div
          className="relative px-8 py-14 overflow-hidden"
          style={{ background: "linear-gradient(135deg, #1B3A2D 0%, #14532D 60%, #166534 100%)" }}
        >
          {/* Background emoji cluster */}
          <div
            className="absolute right-8 top-1/2 -translate-y-1/2 text-7xl leading-snug opacity-20 select-none hidden md:block"
            aria-hidden
          >
            🌍<br />👩‍🎓👨‍💼<br />🏗️📱
          </div>

          {/* Thematic badge */}
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold mb-6"
            style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.85)" }}
          >
            ✦ Data Story · Thematic Deep Dive
          </span>

          <h1
            className="font-black uppercase leading-none mb-4"
            style={{ fontSize: "clamp(2.4rem, 6vw, 4rem)", color: "#ffffff" }}
          >
            The Next Ghana<br />
            <span style={{ color: "#4ADE80" }}>Is Young</span>
          </h1>

          <p
            className="text-base font-medium max-w-xl mb-6"
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            Five numbers that tell the story of a generation
          </p>

          <p
            className="text-sm leading-relaxed max-w-2xl"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            Ghana&apos;s future is young, bold, energetic and full of possibility. Walk through any
            market, school, office or construction site, and you&apos;ll feel it immediately: the
            heartbeat of the country is youthful, and this visible energy is backed by data. A closer
            look at the numbers reveals a powerful demographic shift unfolding — one that carries both
            promise and urgency. Here is the journey of Ghana&apos;s youth, told through five striking
            numbers.
          </p>

          {/* Divider */}
          <div className="mt-10 flex items-center gap-3">
            {["01","02","03","04","05"].map((n, i) => (
              <div
                key={n}
                className="flex items-center gap-1"
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black"
                  style={{
                    background: ["#15803D","#7C3AED","#0369A1","#DC2626","#B45309"][i],
                    color: "#fff",
                  }}
                >
                  {n}
                </span>
                {i < 4 && <div className="w-6 h-px" style={{ background: "rgba(255,255,255,0.2)" }} />}
              </div>
            ))}
          </div>
        </div>

        {/* ── CHAPTERS ──────────────────────────────────────────────────── */}
        <div className="px-5 py-6 space-y-4">

          {/* 01 — 38.2% */}
          <StatChapter
            num="01"
            stat="38.2%"
            emoji="👥"
            color="#15803D"
            bg="#F0FDF4"
            title="The largest youth generation Ghana has ever recorded"
            visual={<AgeShareDonut />}
          >
            <p>
              Today, young people aged <strong>15–35</strong> make up <strong>38.2 percent</strong> of
              Ghana&apos;s population — the largest youth generation ever recorded, according to the{" "}
              <strong>2021 Population and Housing Census</strong>. It is a generation shaping culture,
              creativity, technology, entrepreneurship, and public life.
            </p>
            <p>
              Their ambitions and struggles will influence everything: the workforce, the economy, and
              the nation&apos;s direction.
            </p>
          </StatChapter>

          {/* 02 — 35.3% */}
          <StatChapter
            num="02"
            stat="35.3%"
            emoji="👶"
            color="#7C3AED"
            bg="#F5F3FF"
            title="Children's share is falling — a sign of deep transition"
            visual={
              <div className="flex flex-col items-center gap-4 py-4 w-full">
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "#7C3AED" }}>
                  Share of children aged 0–14
                </p>
                <div className="flex items-center gap-6 w-full justify-center flex-wrap">
                  <div className="text-center">
                    <p className="text-xs font-medium mb-1" style={{ color: "#94A3B8" }}>Two decades ago</p>
                    <p className="font-black" style={{ fontSize: "3rem", color: "#A78BFA", lineHeight: 1 }}>41.3%</p>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-12 h-px" style={{ background: "#7C3AED" }} />
                    <span className="text-xl">→</span>
                    <p className="text-[10px] font-semibold" style={{ color: "#7C3AED" }}>declining</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-medium mb-1" style={{ color: "#94A3B8" }}>Today (2021)</p>
                    <p className="font-black" style={{ fontSize: "3rem", color: "#7C3AED", lineHeight: 1 }}>35.3%</p>
                  </div>
                </div>
                <p className="text-xs text-center max-w-xs" style={{ color: "#6B7280" }}>
                  Falling fertility + rising life expectancy = classic demographic transition
                </p>
              </div>
            }
            flip
          >
            <p>
              At the same time, the share of children aged <strong>0–14</strong> has declined to{" "}
              <strong>35.3 percent</strong>, down from <strong>41.3 percent</strong> two decades ago.
              This steady shift shows that Ghana is gradually transitioning from a population dominated
              by young children to one driven by adolescents and young adults.
            </p>
            <p>
              A growing working-age population, ready to drive development. With fewer dependants and
              more workers, Ghana has a unique window for faster growth.
            </p>
          </StatChapter>

          {/* 03 — 17.7M */}
          <StatChapter
            num="03"
            stat="17.7M"
            emoji="📈"
            color="#0369A1"
            bg="#F0F9FF"
            title="Youth population projected to grow to 17.7 million by 2050"
            visual={
              <div className="w-full">
                <p className="text-xs font-bold text-center mb-2" style={{ color: "#0369A1" }}>
                  Youth population (15–35), millions
                </p>
                <YouthProjectionChart />
                <p className="text-[10px] text-center mt-1" style={{ color: "#94A3B8" }}>
                  Source: PHC 2021 · GSS projections
                </p>
              </div>
            }
          >
            <p>
              Projections show that Ghana&apos;s youth population will grow from{" "}
              <strong>11.7 million in 2021</strong> to <strong>17.7 million by 2050</strong>, adding
              momentum to the country&apos;s demographic wave.
            </p>
            <p>
              This growth presents an extraordinary opportunity — more innovators, more skilled workers,
              more entrepreneurs, more leaders. But it also signals rising demand for <strong>jobs,
              housing, digital access,</strong> and social support systems.
            </p>
            <p>
              The next Ghana will depend heavily on how well the country prepares for this wave.
            </p>
          </StatChapter>

          {/* 04 — 22.5% */}
          <section className="rounded-2xl p-8" style={{ background: "#FEF2F2" }}>
            <div className="flex items-center gap-3 mb-4">
              <span
                className="inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-black text-white"
                style={{ background: "#DC2626" }}
              >
                04
              </span>
              <span className="text-2xl">💼</span>
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p
                  className="font-black leading-none mb-2"
                  style={{ fontSize: "clamp(3rem, 8vw, 5rem)", color: "#DC2626", lineHeight: 1 }}
                >
                  22.5%
                </p>
                <p className="text-base font-bold mb-4" style={{ color: "#DC2626" }}>
                  Average youth unemployment rate (ages 15–35, 2024)
                </p>
                <p className="text-sm leading-relaxed mb-3" style={{ color: "#374151" }}>
                  Average unemployment rate among young people aged <strong>15–35</strong> as of 2024
                  stood at <strong>22.5 percent</strong>, meaning that more than one in five young
                  Ghanaians in this age group is looking for work without success.
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
                  Many leave school with strong ambitions but face limited opportunities that match their
                  skills. The transition from school to the labour market is not straightforward — limited
                  job openings, skills gaps, and competition make the journey difficult.
                </p>
              </div>
              {/* "1 in 5" visual */}
              <div className="flex flex-col items-center gap-3">
                <div className="flex flex-wrap justify-center gap-1.5" aria-label="1 in 5 representation">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <span
                      key={i}
                      className="text-2xl"
                      style={{ opacity: i % 5 === 0 ? 1 : 0.2 }}
                    >
                      🧑
                    </span>
                  ))}
                </div>
                <p className="text-xs font-bold text-center" style={{ color: "#DC2626" }}>
                  1 in every 5 young Ghanaians is unemployed
                </p>
                <p className="text-[10px] text-center" style={{ color: "#94A3B8" }}>
                  Each figure represents a youth aged 15–35
                </p>
              </div>
            </div>
          </section>

          {/* 05 — 3.1M */}
          <section className="rounded-2xl p-8" style={{ background: "#FFFBEB" }}>
            <div className="flex items-center gap-3 mb-4">
              <span
                className="inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-black text-white"
                style={{ background: "#B45309" }}
              >
                05
              </span>
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p
                  className="font-black leading-none mb-2"
                  style={{ fontSize: "clamp(3rem, 8vw, 5rem)", color: "#B45309", lineHeight: 1 }}
                >
                  3.1M
                </p>
                <p className="text-base font-bold mb-4" style={{ color: "#B45309" }}>
                  Young people in vulnerable forms of work (2023)
                </p>
                <p className="text-sm leading-relaxed mb-3" style={{ color: "#374151" }}>
                  Beyond unemployment, in 2023 an estimated <strong>3.1 million</strong> young people
                  are engaged in vulnerable forms of work — mostly informal, unstable, and without
                  social protection.
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>
                  They keep households, markets and services running, yet often without steady income
                  or long-term security. This reminds us that employment is not just about having a
                  job — it is about having a <strong>decent</strong> one.
                </p>
              </div>
              {/* Vulnerable work visual */}
              <div
                className="rounded-xl p-5 flex flex-col gap-3"
                style={{ background: "#FEF3C7", border: "1px dashed #F59E0B" }}
              >
                {[
                  { label: "Informal sector",           pct: 72, icon: "🏪" },
                  { label: "No social protection",      pct: 68, icon: "🛡️" },
                  { label: "Irregular income",          pct: 61, icon: "💸" },
                ].map(({ label, pct, icon }) => (
                  <div key={label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold flex items-center gap-1.5" style={{ color: "#92400E" }}>
                        {icon} {label}
                      </span>
                      <span className="text-xs font-black" style={{ color: "#B45309" }}>{pct}%</span>
                    </div>
                    <div className="h-2 rounded-full" style={{ background: "#FDE68A" }}>
                      <div
                        className="h-2 rounded-full"
                        style={{ width: `${pct}%`, background: "#B45309" }}
                      />
                    </div>
                  </div>
                ))}
                <p className="text-[10px] mt-1" style={{ color: "#92400E" }}>
                  Illustrative estimates — characteristics of vulnerable youth employment
                </p>
              </div>
            </div>
          </section>

          {/* ── CONCLUSION ────────────────────────────────────────────────── */}
          <div
            className="rounded-2xl p-8"
            style={{ background: "linear-gradient(135deg, #14532D 0%, #166534 100%)" }}
          >
            <p className="text-2xl font-black text-white mb-4">
              The opportunity is time-bound.
            </p>
            <p className="text-sm leading-relaxed mb-6 max-w-2xl" style={{ color: "rgba(255,255,255,0.80)" }}>
              Together, these five numbers tell a vivid story: Ghana is young, dynamic, and full of
              momentum. The demographic transition is already underway, and the youth are positioned to
              drive the country&apos;s next chapter — but the opportunity is time-bound.
            </p>
            <p className="text-sm leading-relaxed max-w-2xl" style={{ color: "rgba(255,255,255,0.80)" }}>
              To fully benefit, Ghana must invest boldly in <strong className="text-white">education,
              technical and digital skills, decent jobs, entrepreneurship,</strong> and inclusive growth.
              The next Ghana is not just young in age — it is young in energy, in possibility, and in
              vision. With the right decisions today, the future can be bright, not just for the young
              people of Ghana, but for the entire nation.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["🎓 Education","💡 Skills","🏭 Jobs","🚀 Entrepreneurship","🤝 Inclusion"].map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.85)" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <p className="text-xs text-right pb-2" style={{ color: "#94A3B8" }}>
            Source: Ghana Statistical Service — 2021 Population and Housing Census · Ghana in Numbers 2025
          </p>
        </div>
      </main>
    </DashboardShell>
  );
}
