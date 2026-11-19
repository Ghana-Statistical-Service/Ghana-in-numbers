"use client";

import { ChartCard } from "@/components/ui/Card";
import { DataDisclosure, DataTable } from "@/components/ui/Data";
import { Grid } from "@/components/ui/Page";
import { burdens, difficultyQ3, headshipDimensionsQ3, householdGroupsQuarterly as householdGroups, latest, otherGroupRows, quarterlySources } from "@/data/mpiQuarterlyData";
import { BarList, Caveat, DimensionLegend, Lead, ShareBar, pct, people } from "./parts";

const src = (ref: string) => `${quarterlySources.report} · ${ref}`;

export default function GroupsQuarterlyView() {
  const edu = householdGroups[0].rows;
  const poorRows = burdens.rows.filter(r => r.kind === "triple" || r.kind === "double" || r.kind === "single");
  const triple = burdens.rows[0];
  return (
    <div>
      <Lead kicker="Who?">
        Multidimensional poverty is much more common in some kinds of household. In 2025 Q3 it affected {pct(edu[0].q3)} of people in households whose head has no education, against {pct(edu.at(-1)!.q3)} where the head has tertiary education.
      </Lead>

      <div className="mb-5">
        <Caveat title="How to read this tab">
          Each bar is the share of people living in that kind of household who are multidimensionally poor. Households are grouped by a characteristic of the household head. The figures describe groups; they do not show that one thing causes another. Margins of error are not published for groups, so small gaps should not be read as real differences.
        </Caveat>
      </div>

      <Grid cols={2}>
        {householdGroups.map(g => (
          <ChartCard key={g.key} className="mpi-lift" title={g.title} subtitle="% of people in each kind of household who are multidimensionally poor (incidence)" period="2025 Q3" notes={g.note} source={src(g.table)}
            footer={<DataDisclosure><DataTable caption={`${g.title}: incidence, 2025 Q2 and Q3`} headings={["Group", "2025 Q2 (%)", "2025 Q3 (%)"]} decimals={1} minWidth={320}
              rows={[...g.rows.map(r => [r.label, r.q2, r.q3]), ...otherGroupRows.filter(o => o.group === g.title).map(o => [o.label, o.q2, o.q3]), { cells: ["All households", 23.1, latest.incidence], emphasis: "total" as const }]} /></DataDisclosure>}>
            <BarList caption={`${g.title}: incidence in 2025 Q3`} max={45} labelWidth="10.5rem" reference={{ value: latest.incidence, label: `All households: ${pct(latest.incidence)}` }}
              rows={[...g.rows].sort((a, b) => b.q3 - a.q3).map((r, i) => ({ label: r.label, value: r.q3, emphasis: i === 0 && g.key !== "sex" }))} />
          </ChartCard>
        ))}

        <ChartCard className="mpi-lift" title="Different drivers for female-headed and male-headed households" subtitle="% of each group’s MPI score that comes from each area of life (percentage contribution)" period="2025 Q3"
          notes={`The share of people affected is almost the same (${pct(22.0)} female-headed, ${pct(21.9)} male-headed), but the make-up differs: employment is ${pct(headshipDimensionsQ3.female.employment)} of measured poverty in female-headed households and ${pct(headshipDimensionsQ3.male.employment)} in male-headed households.`}
          source={src("Table 6.10, p. 38")}
          footer={<DataDisclosure><DataTable caption="Contribution of each dimension by sex of household head, 2025 Q3" headings={["Household head", "Health", "Living conditions", "Education", "Employment"]} decimals={1} minWidth={460} rows={[["Female", headshipDimensionsQ3.female.health, headshipDimensionsQ3.female.living, headshipDimensionsQ3.female.education, headshipDimensionsQ3.female.employment], ["Male", headshipDimensionsQ3.male.health, headshipDimensionsQ3.male.living, headshipDimensionsQ3.male.education, headshipDimensionsQ3.male.employment]]} /></DataDisclosure>}>
          <DimensionLegend className="mb-4" />
          <ul className="space-y-3">
            {([["Female-headed", headshipDimensionsQ3.female], ["Male-headed", headshipDimensionsQ3.male]] as const).map(([label, v]) => (
              <li key={label}><p className="mb-1 text-[13px] font-medium text-body">{label}</p><ShareBar values={v} label={`${label} households`} height={30} /></li>
            ))}
          </ul>
        </ChartCard>
      </Grid>

      <Grid cols={2} className="mt-4 lg:mt-5">
        <ChartCard title="Functional difficulty of the household head" subtitle="% of people in each kind of household who are multidimensionally poor (incidence)" period="2025 Q3"
          notes="Few household heads report a lot of difficulty, so these figures rest on small samples and move a great deal between quarters. For example, the published figure for a lot of difficulty with speech was 43.5% in 2025 Q2 and 23.8% in Q3. Read the general pattern, not the single values."
          source={src("Tables 6.29 to 6.34, pp. 59 to 60")}>
          <DataTable caption="Incidence by functional difficulty of the household head, 2025 Q3" headings={["Type of difficulty", "No difficulty (%)", "Some difficulty (%)", "A lot of difficulty (%)"]} decimals={1} minWidth={460} rows={difficultyQ3.map(d => [d.domain, d.none, d.some, d.aLot])} />
          <p className="mt-3 text-[13px] leading-relaxed text-body">In every type of difficulty, incidence is higher where the head reports some or a lot of difficulty than where the head reports none (21.4% to 21.9%).</p>
        </ChartCard>

        <ChartCard title="When hardships overlap" subtitle="People aged 15 and older who are multidimensionally poor, by whether they are also food insecure or unemployed" period="2025 Q3"
          notes={`Of ${people(burdens.population15Plus.q3)} people aged 15 and older. Percentages are of that population. In 2025 Q2 the figure for all three at once was ${people(triple.q2.people)} (${pct(triple.q2.pct)}).`}
          source={src("Table 6.35, p. 61")}
          footer={<DataDisclosure><DataTable caption="Population aged 15 and older by combination of multidimensional poverty, food insecurity and unemployment" headings={["Group", "2025 Q2, people", "2025 Q2 (%)", "2025 Q3, people", "2025 Q3 (%)"]} decimals={[undefined, 0, 1, 0, 1]} minWidth={640}
            rows={[...burdens.rows.map(r => [r.label, r.q2.people, r.q2.pct, r.q3.people, r.q3.pct]), { cells: ["Total aged 15 and older", burdens.population15Plus.q2, 100, burdens.population15Plus.q3, 100], emphasis: "total" as const }]} /></DataDisclosure>}>
          <div className="mb-4 rounded-[var(--radius-md)] bg-surface-muted p-4">
            <p className="text-[13px] font-medium text-body">Multidimensionally poor, food insecure and unemployed at the same time</p>
            <p className="mt-1 flex flex-wrap items-baseline gap-x-2"><span className="text-[30px] font-semibold leading-none tracking-tight text-ink">{people(triple.q3.people)}</span><span className="text-[13px] text-muted">people, {pct(triple.q3.pct)} of those aged 15 and older</span></p>
          </div>
          <BarList caption="Multidimensionally poor people aged 15 and older by overlapping hardship, 2025 Q3" max={1.4e6} labelWidth="11rem" format={v => people(v)}
            rows={poorRows.map(r => ({ label: r.short, sub: `${pct(r.q3.pct)} of people aged 15+`, value: r.q3.people, emphasis: r.kind === "triple" }))} />
        </ChartCard>
      </Grid>
    </div>
  );
}
