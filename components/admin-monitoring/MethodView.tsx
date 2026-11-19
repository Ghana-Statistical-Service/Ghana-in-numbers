"use client";

import { Copy, PieChart, Ruler, ScanSearch, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Grid } from "@/components/ui/Page";
import { IconTile, type Tone } from "@/components/ui/Infographic";
import { Caveat, Lead, SectionHead } from "@/components/mpi/parts";
import { checks, int, longDate, pct, statusOrder, statuses, type Scope } from "@/lib/adminMonitoring";
import { StatusPill } from "./parts";

const dimensions: { icon: LucideIcon; tone: Tone; name: string; question: string; how: string }[] = [
  { icon: PieChart, tone: "purple", name: "Completeness", question: "Were all expected data points submitted?", how: "Two measures. Data points received compares the records submitted with the records the reporting template expects for the same years. Years with data (overall completion) is the share of 2015 to 2025 with at least one reported value." },
  { icon: Copy, tone: "blue", name: "Uniqueness", question: checks.repeats.question, how: checks.repeats.rule },
  { icon: Ruler, tone: "amber", name: "Validity", question: checks.invalid.question, how: checks.invalid.rule },
  { icon: ScanSearch, tone: "rose", name: "Accuracy", question: checks.outliers.question, how: `${checks.outliers.rule} ${checks.outliers.reading}` },
];

const terms: [string, string][] = [
  ["MMDA", "Metropolitan, Municipal and District Assembly. Ghana has 261, called districts on this page."],
  ["Record", "One value reported for one indicator, breakdown and year between 2015 and 2025. Repeat submissions of the same data point are counted as reported."],
  ["Thematic area", "One of the 15 groups of indicators in the reporting template, from Agriculture to SDGs Budget."],
  ["Reporting year", "The year the data describes, not the year it was sent."],
  ["Submission", "A distinct submission time attached to a district’s workbooks. Records with no matched submission time are counted as records but not as a submission."],
  ["Conflicting figures", "Data points where repeat submissions reported different values for the same indicator and year. This is for information and does not change completion."],
  ["2026 to 2030 data found", "Values already entered for future planning years. They are left out of the completion score."],
];

const actions: [string, string][] = [
  ["Start where the data is generated", "MMDAs and their decentralised departments should assign clear responsibility for administrative data and run regular reviews and quality checks before submission."],
  ["Strengthen oversight", "Regional and national institutions should reinforce accountability for reporting."],
  ["Automate and standardise", "Ghana Statistical Service should introduce automated validation, keep indicator definitions and reporting guidance consistent, and set up feedback and correction mechanisms."],
  ["Target support", "Direct technical support to the districts and thematic areas with the largest gaps, and keep assessing quality periodically."],
  ["Modernise", "Development partners can support progressive modernisation and integration of administrative data systems."],
];

export default function MethodView({ national, compiled }: { national: Scope; compiled: string }) {
  return (
    <div>
      <Lead kicker="How is it assessed?">
        Administrative data from all 261 districts for 2015 to 2025 is put through four checks. The checks point to where follow-up is needed; they do not prove that a figure is wrong.
      </Lead>

      <SectionHead step={1} title="The four checks" />
      <ul className="grid gap-4 md:grid-cols-2 lg:gap-5">
        {dimensions.map(d => (
          <li key={d.name}>
            <Card className="flex h-full gap-4 p-4 sm:p-5">
              <IconTile icon={d.icon} tone={d.tone} size="lg" />
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted">{d.name}</p>
                <h3 className="mt-1 text-[15px] font-semibold leading-snug text-ink">{d.question}</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-body">{d.how}</p>
              </div>
            </Card>
          </li>
        ))}
      </ul>

      <SectionHead step={2} title="How completion is scored" />
      <Grid cols="3-2">
        <Card as="section" className="p-4 sm:p-5">
          <h3 className="text-[15px] font-semibold text-ink">From a year to a district score</h3>
          <ol className="mt-3 space-y-3 text-[13px] leading-relaxed text-body">
            {[
              ["Year", "For a thematic area, a year counts as covered when the district reported at least one value for it, across all of its submissions."],
              ["Thematic area", "The area’s score is the share of the years 2015 to 2025 that are covered. SDGs Budget is scored over 2019 to 2025 because its template starts in 2019."],
              ["District", "A district’s overall completion is the average of its 15 thematic area scores."],
              ["Region and Ghana", "The plain average of the overall completion of the districts, with every district counting equally."],
            ].map(([k, v], i) => (
              <li key={k} className="flex gap-3"><span aria-hidden="true" className="mpi-step">{i + 1}</span><span><b className="font-semibold text-ink">{k}. </b>{v}</span></li>
            ))}
          </ol>
          <p className="mt-4 rounded-[var(--radius-md)] bg-surface-muted px-3.5 py-3 text-[13px] leading-relaxed text-body">
            <b className="font-semibold text-ink">Why the two completeness figures differ. </b>
            Across Ghana, districts have data for {pct(national.completion)} of years on average, but sent {pct(national.pctExpected)} of the expected data points ({int(national.rec)} of {int(national.exp)}). A year counts as covered with a single value, while data points received counts every cell of the template: each district is expected to send {int(national.exp / national.districts.length)} records.
          </p>
        </Card>
        <Card as="section" className="p-4 sm:p-5">
          <h3 className="text-[15px] font-semibold text-ink">Status labels</h3>
          <p className="mt-1 text-[13px] leading-relaxed text-muted">Applied to overall completion and to each thematic area, as in the district factsheet summary.</p>
          <ul className="mt-4 space-y-2.5">
            {statusOrder.map(id => (
              <li key={id} className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-line px-3.5 py-2.5 text-[13px]">
                <StatusPill status={id} /><span className="text-body">{statuses[id].range}</span><span className="tabular font-semibold text-ink">{national.byStatus[id]} districts</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-subtle">Status is always shown as a word with its colour, never by colour alone. The printed factsheets shade completion in five 20-point bands; this page uses the three status levels throughout.</p>
        </Card>
      </Grid>

      <SectionHead step={3} title="Words used on this page" />
      <Card as="section" className="p-4 sm:p-5">
        <dl className="grid gap-x-8 gap-y-4 md:grid-cols-2">
          {terms.map(([term, meaning]) => <div key={term}><dt className="text-[13px] font-semibold text-ink">{term}</dt><dd className="mt-0.5 text-[13px] leading-relaxed text-body">{meaning}</dd></div>)}
        </dl>
      </Card>

      <SectionHead step={4} title="What the findings mean, and what to do" />
      <Grid cols="2-1">
        <Card as="section" className="p-4 sm:p-5">
          <h3 className="text-[15px] font-semibold text-ink">Priorities for action</h3>
          <ol className="mt-3 space-y-3">
            {actions.map(([k, v], i) => <li key={k} className="flex gap-3 text-[13px] leading-relaxed text-body"><span aria-hidden="true" className="mpi-step">{i + 1}</span><span><b className="font-semibold text-ink">{k}. </b>{v}</span></li>)}
          </ol>
        </Card>
        <div className="space-y-4">
          <Card as="section" className="border-brand-line bg-[linear-gradient(160deg,#FBFAFF,#EEECFA)] p-4 sm:p-5">
            <h3 className="text-[15px] font-semibold text-ink">What the findings mean</h3>
            <p className="mt-2 text-[13px] leading-relaxed text-body">Missing data is the main challenge: well under half of the expected records were submitted, so many MMDAs may lack the information needed to understand local conditions, plan services and make informed decisions. Repeated records were not a significant problem. Some submitted values fail validity rules, and some are unusual enough to need verification.</p>
          </Card>
          <Caveat title="Limitations">
            Decentralised departments mainly collect data for day-to-day operations rather than for statistics, so the checks point to potential problems rather than prove errors. MMDAs may also use different methods to collect and report data. Comparability and coherence across districts and indicators were not assessed.
          </Caveat>
        </div>
      </Grid>

      <p className="mt-6 text-xs leading-relaxed text-subtle">Sources: Ghana Statistical Service, MMDAs Administrative Data Quality Assessment Report and District Completion Factsheets. Built from {int(national.rec)} records in the compiled MMDA administrative dataset, compiled {longDate(compiled)}. A few districts exceed 100% of expected data points because repeat submissions are counted as reported.</p>
    </div>
  );
}
