import Link from "next/link";
import { ArrowRight } from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";
import { Card, ChartCard, Stat } from "@/components/ui/Card";
import { DataDisclosure, DataTable } from "@/components/ui/Data";
import { Grid, PageBody, PageHeader, Section } from "@/components/ui/Page";

// Chapter 10, pp. 117–122. Survey results describe respondents in the covered districts, not national prevalence.
const dacf = [
  ["Knew about the DACF allocation for persons with disabilities", 55],
  ["Had received support", 54],
  ["Took part in discussions on how the fund is allocated and spent", 30],
  ["Had no formal education", 37.5],
  ["Had reached higher education", 4.3],
] as [string, number][];
const supportTypes = [["Economic empowerment", 47], ["Education", 24], ["Health", 22]] as [string, number][];

function Bars({ rows, color, max = 100 }: { rows: [string, number][]; color: string; max?: number }) {
  return (
    <ul className="space-y-2.5">
      {rows.map(([label, v]) => (
        <li key={label}>
          <div className="mb-1 flex justify-between gap-3 text-[13px]"><span className="text-body">{label}</span><span className="tabular font-semibold text-ink">{v}%</span></div>
          <div className="h-2.5 rounded-sm bg-surface-muted"><div className="h-full rounded-sm" style={{ width: `${(v / max) * 100}%`, background: color }} /></div>
        </li>
      ))}
    </ul>
  );
}

function Story({ children }: { children: React.ReactNode }) {
  return <div className="space-y-3 text-[14.5px] leading-7 text-body">{children}</div>;
}

export default function DataStoriesPage() {
  return (
    <DashboardShell>
      <PageBody>
        <PageHeader
          eyebrow="Chapter 10"
          title="Data Stories: from evidence to action"
          description="Four accounts of official statistics being used in districts and communities to direct support, teach data skills and shape policy."
          meta={[{ label: "Source", value: "Ghana in Numbers 2025, pp. 117–122" }]}
        />

        <Section id="water" title="Clean water was 59 minutes away" description="Mangoase School, Ada West District, Greater Accra Region." source="§10.1 · p. 117">
          <Grid cols="2-1">
            <ChartCard title="From a district statistic to a borehole" subtitle="Water and Sanitation Report, October 2023" period="2023–2024" source="p. 117">
              <Story>
                <p>The GSS Water and Sanitation Report found that residents of Ada West spent an average of 59 minutes a day collecting water, among the worst-served districts in the country. Stand-In-the-Gap, an NGO looking for a community to serve, used the report to choose Ada West and then Mangoase School.</p>
                <p>A January 2024 scouting visit found children learning under a shed without walls and walking to an untreated stream. The response was a borehole, storage tanks and pipes, a proper classroom and waste bins.</p>
              </Story>
            </ChartCard>
            <div className="grid content-start gap-3">
              <Stat tone="brand" label="Average daily time collecting water, Ada West" value="59" unit="minutes" context="District average, October 2023 report" />
              <Stat label="Walk to the stream from the school" value="15" unit="minutes each way" context="Before the borehole; the 59-minute figure is not the school’s own measurement" />
            </div>
          </Grid>
        </Section>

        <Section id="hackathon" title="Inspiring a new generation of data users" description="The StatsBank Hackathon, run by GSS and Statistics Denmark." source="§10.2 · p. 118">
          <Grid cols="2-1">
            <ChartCard title="Students using official statistics" subtitle="Two editions of the StatsBank Hackathon" period="2023 onwards" source="p. 118">
              <Story>
                <p>Students worked on youth unemployment, gaps in education and health care, water and sanitation, gender inequality and regional differences. In the 2023 edition, one team built a dashboard showing which districts had enough health and education facilities and which had the deepest shortfalls.</p>
              </Story>
            </ChartCard>
            <div className="grid content-start gap-3">
              <Stat tone="brand" label="Official data points used" value="350+" unit="million" context="2021 PHC and other datasets" />
              <Stat label="Tertiary institutions taking part" value="11" />
              <Stat label="People aged 15–35, 2021" value="11.7" unit="million" context="38.2% of the population (2021 census definition used in this story)" />
            </div>
          </Grid>
        </Section>

        <Section id="disability" title="How citizen data helped shape disability policy" description="The DACF Support Survey: 7,361 persons with disabilities in 10 districts across 3 ecological zones." source="§10.3 · pp. 119–120">
          <Grid cols={2}>
            <ChartCard title="What survey respondents reported" subtitle="% of respondents" period="2023 survey"
              notes="Respondents in the 10 covered districts, not a nationally representative sample. More than 60% asked for the allocation to rise from 3% to 5%, and 30% for faster release of funds."
              source="DACF Support Survey (GSS, MLGDRD, GFD, GIZ) · pp. 119–120"
              footer={<DataDisclosure><DataTable caption="DACF Support Survey results" headings={["Finding", "% of respondents"]} rows={[...dacf, ...supportTypes.map(([l, v]) => [`Support received as ${l.toLowerCase()}`, v] as [string, number])]} decimals={1} minWidth={420} unitNote="Support types are shares reported in the text; respondents could receive more than one type, so they need not sum to the 54% who received support." /></DataDisclosure>}>
              <Bars rows={dacf} color="#3C2FA3" />
              <p className="mb-2 mt-5 text-[13px] font-semibold text-ink">Main forms of support received</p>
              <Bars rows={supportTypes} color="#0E8A7E" max={100} />
            </ChartCard>
            <ChartCard title="From findings to reform" subtitle="Government announcement" period="October 2025" source="p. 119">
              <Story>
                <p>Disability advocates used the findings in engagements with Parliament, the Office of the President and the National Council for Persons with Disabilities; the Ghana Federation of Disability Organisations called the survey “a turning point in our advocacy”.</p>
                <p>In 2025 the share of the District Assemblies Common Fund set aside for persons with disabilities rose from 3% to 5%, Disability Desks were introduced in every assembly, and greater involvement of persons with disabilities in managing the fund became part of the agenda.</p>
              </Story>
              <div className="mt-4 grid grid-cols-2 gap-3"><Stat label="DACF allocation before" value="3" unit="%" /><Stat tone="brand" label="DACF allocation from 2025" value="5" unit="%" /></div>
            </ChartCard>
          </Grid>
        </Section>

        <Section id="afigya" title="The story of Afigya Kwabre North" description="A dataset, a district and a community finally covered." source="§10.4 · pp. 121–122">
          <Grid cols="2-1">
            <ChartCard title="Making one deprivation visible" subtitle="District Multidimensional Poverty Index" period="June 2024" source="pp. 121–122">
              <Story>
                <p>The first district-level Multidimensional Poverty Index covered all 261 districts, measuring what people go without rather than what they earn. In Afigya Kwabre North, Ashanti Region, nearly 23% of measured multidimensional poverty traced back to residents not being enrolled in the National Health Insurance Scheme.</p>
                <p>The district sent mobile NHIS registration teams into markets and community centres, removing the barrier of distance and time.</p>
              </Story>
            </ChartCard>
            <div className="grid content-start gap-3">
              <Stat tone="brand" label="Share of the district’s multidimensional poverty linked to no health insurance" value="≈23" unit="%" context="A contribution to the poverty measure, not the share of people uninsured" />
              <Stat label="Districts with a poverty measure" value="261" context="All districts, June 2024 release" />
            </div>
          </Grid>
        </Section>

        <Card className="on-dark mt-12 flex flex-col gap-4 bg-nav p-6 text-white md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Explore the youth bulge</h2>
            <p className="mt-1 text-[14px] text-white/85">Youth population, unemployment, NEET, skills and young people in agriculture.</p>
          </div>
          <Link href="/youth-bulge" className="inline-flex h-11 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-white px-5 text-sm font-semibold text-nav hover:bg-brand-soft">Read the deep dive <ArrowRight size={16} aria-hidden /></Link>
        </Card>
      </PageBody>
    </DashboardShell>
  );
}
