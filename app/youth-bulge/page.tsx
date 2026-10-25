import DashboardShell from "@/components/layout/DashboardShell";
import { DefinitionsCard, NeetBreakdownCard, NeetRegionalCard, RegionalUnemploymentCard, ShareEndpointsCard, SkillsCard } from "@/components/youth/YouthSections";
import { Card, KpiCard, KpiGrid } from "@/components/ui/Card";
import { Grid, PageBody, PageHeader, Section, SectionNav } from "@/components/ui/Page";

export default function YouthBulgePage() {
  return (
    <DashboardShell>
      <PageBody>
        <PageHeader
          eyebrow="Chapter 9 · Thematic deep dive"
          title="The youth bulge: a window of opportunity or a growing pressure"
          description="Families are having fewer children, so the widest part of Ghana’s population has moved into the youth ages. Whether that becomes a demographic dividend depends on schooling, skills and productive jobs."
          meta={[{ label: "Sources", value: "2021 PHC, 2022 AHIES, 2025 QLFS, population projections" }, { label: "Latest", value: "Q3 2025" }]}
        />

        <KpiGrid>
          <KpiCard label="Population aged 15–35" value="≈30" unit="%" period="2025" qualifier="Approximate" explain={{ indicator: "youth" }} note="More than 11 million people" />
          <KpiCard label="Children aged 0–14" value="33.2" unit="%" period="2025" explain={{ indicator: "youth" }} note="41.8% in 2000" />
          <KpiCard label="Unemployment, ages 15–24" value="32.4" unit="%" period="Q1–Q3 2025 average" explain={{ indicator: "unemployment" }} note="Share of the labour force aged 15–24" />
          <KpiCard label="NEET, ages 15–35" value="19.5" unit="%" period="Q3 2025" explain={{ indicator: "neet" }} note="Close to 2 million; over 60% women" />
          <KpiCard label="Education matches the job" value="58" unit="%" period="Employed youth" explain={{ indicator: "skills" }} />
        </KpiGrid>

        <SectionNav items={[{ id: "bulge", label: "The bulge" }, { id: "unemployment", label: "Unemployment" }, { id: "neet", label: "NEET" }, { id: "skills", label: "Skills and informal work" }]} />

        <Section id="bulge" title="Fewer children, more youth" description="The child share fell from 41.8% in 2000 to 33.2% in 2025; the youth share has eased since 2019 but remains large." source="pp. 108–110">
          <Grid cols={2}><DefinitionsCard /><ShareEndpointsCard /></Grid>
          <Card className="mt-4 grid gap-4 p-5 md:grid-cols-2 lg:mt-5">
            <div><p className="text-[14px] font-semibold text-ink">Demographic dividend</p><p className="mt-1 text-[13.5px] leading-relaxed text-body">If schooling, technical skills, jobs and support for young entrepreneurs expand together, a large young population can power faster growth, with fewer dependants for every worker.</p></div>
            <div><p className="text-[14px] font-semibold text-ink">Demographic pressure</p><p className="mt-1 text-[13.5px] leading-relaxed text-body">If jobs do not keep pace, the publication describes rising unemployment and underemployment, informal and risky work and more migration. It presents these as risks, not measured outcomes.</p></div>
          </Card>
        </Section>

        <Section id="unemployment" title="Youth unemployment by region" description="Youth unemployment in 2025 was above 30% for ages 15–24 and above 20% for ages 15–35, highest in the southern regions." source="Figure 9.1, p. 111">
          <RegionalUnemploymentCard />
        </Section>

        <Section id="neet" title="Not in employment, education or training" description="NEET counts everyone in the age group, including young people who are not looking for work." source="Figure 9.2, pp. 111–112">
          <Grid cols="1-2"><NeetBreakdownCard /><NeetRegionalCard /></Grid>
        </Section>

        <Section id="skills" title="Skills and informal work" description="The kind of work matters as much as the amount." source="pp. 112–113">
          <SkillsCard />
        </Section>

        <p className="mt-10 text-xs text-subtle">Young people in agriculture are covered in the <a href="/agriculture-forestry-fishing#youth-agriculture" className="font-medium text-brand underline-offset-2 hover:underline">Agriculture, Forestry and Fishing</a> deep dive.</p>
      </PageBody>
    </DashboardShell>
  );
}
