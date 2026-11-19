"use client";

import { ChartCard } from "@/components/ui/Card";
import { DataDisclosure, DataTable } from "@/components/ui/Data";
import { Grid } from "@/components/ui/Page";
import { householdGroups, mpiSources, national2021 } from "@/data/mpiData";
import { BarList, Caveat, Lead, pct, people } from "./parts";

export default function GroupsView() {
  const edu = householdGroups[0].rows;
  const n = national2021;
  return (
    <div>
      <Lead kicker="Who?">
        Multidimensional poverty is much more common in some kinds of household. In the 2021 census it affected {pct(edu[0].value)} of people in households whose head had no education, against {pct(edu.at(-1)!.value)} where the head had tertiary education.
      </Lead>

      <div className="mb-5">
        <Caveat title="How to read this tab">
          Each bar is the share of people living in that kind of household who were multidimensionally poor in the 2021 Population and Housing Census. Households are grouped by a characteristic of the household or its head. The figures describe groups; they do not show that one thing causes another. These breakdowns are published for 2021 only.
        </Caveat>
      </div>

      <Grid cols={2}>
        {householdGroups.map(g => (
          <ChartCard key={g.key} className="mpi-lift" title={g.title} subtitle="% of people in each kind of household who were multidimensionally poor (incidence)" period="2021 census" notes={g.note} source={`${mpiSources.census} · ${g.figure}`}
            footer={<DataDisclosure><DataTable caption={`${g.title}: incidence, 2021`} headings={["Group", "Incidence (%)"]} decimals={1} minWidth={300}
              rows={[...g.rows.map(r => [r.label, r.value]), { cells: ["Ghana", n.incidence], emphasis: "total" as const }]} /></DataDisclosure>}>
            <BarList caption={`${g.title}: incidence in 2021`} max={60} labelWidth="10.5rem" reference={{ value: n.incidence, label: `Ghana: ${pct(n.incidence)}` }}
              rows={(g.ordered ? g.rows : [...g.rows].sort((a, b) => b.value - a.value)).map(r => ({ label: r.label, value: r.value, emphasis: r.value === Math.max(...g.rows.map(x => x.value)) }))} />
          </ChartCard>
        ))}

        <ChartCard className="mpi-lift" title="Women and men" subtitle="People who were multidimensionally poor, by sex of the person" period="2021 census"
          notes="This card counts people by their own sex. The “Sex of the household head” card groups everyone in a household by the sex of its head, so the two are different measures."
          source={`${mpiSources.census} · Figure 5.1, p. 11`}>
          <div className="grid grid-cols-2 gap-3">
            {([["Female", n.sex.female], ["Male", n.sex.male]] as const).map(([label, v]) => (
              <div key={label} className="rounded-[var(--radius-lg)] border border-line bg-surface-muted p-4">
                <p className="text-[13px] font-semibold text-ink">{label}</p>
                <p className="mt-2 text-[30px] font-extrabold leading-none tracking-tight text-ink">{pct(v.incidence)}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">were multidimensionally poor</p>
                <p className="mt-3 border-t border-line pt-2 text-xs leading-relaxed text-body"><span className="font-semibold text-ink">{people(v.people)}</span> people · intensity {pct(v.intensity)}</p>
              </div>
            ))}
          </div>
        </ChartCard>
      </Grid>
    </div>
  );
}
