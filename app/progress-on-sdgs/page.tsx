import DashboardShell from "@/components/layout/DashboardShell";
import { ChildMortalityCard, FoodInsecurityCard, InfantCard, MaternalCard, NeonatalCard, PlasticCard, PlasticHeadlineCard, PovertyCard, SdgSummary, SlumsCard, UnderFiveCard } from "@/components/sdg/SdgSections";
import { GiftsGivenCard, NoInfluenceCard, NoSayCard } from "@/components/governance/GovernanceSections";
import OverviewTopBar from "@/components/home/OverviewTopBar";
import { KpiCard, KpiGrid } from "@/components/ui/Card";
import { Grid, PageBody, PageHeader, Section, SectionNav } from "@/components/ui/Page";

export default function ProgressOnSDGsPage() {
  return (
    <DashboardShell>
      <OverviewTopBar page="Progress on SDGs" />
      <PageBody>
        <PageHeader
          aside={<a href="#sdg-summary" className="inline-flex h-9 items-center gap-1.5 rounded-full bg-brand-soft px-3.5 text-[13px] font-semibold text-brand hover:bg-brand-line/40">SDG Dashboard</a>}
          eyebrow="Chapter 8"
          title="Progress on the SDGs"
          description="Selected Sustainable Development Goal indicators: poverty, hunger, maternal and child survival, urban slums, coastal plastics and bribery."
          meta={[{ label: "Sources", value: "GSS MPI, FIES, GDHS, PHC, SDG Indicator Database" }, { label: "Latest", value: "Q1–Q3 2025 (poverty, food insecurity)" }]}
        />

        <KpiGrid>
          <KpiCard label="Multidimensionally poor" value="23.0" unit="%" period="Q1–Q3 2025 average" explain={{ indicator: "poverty" }} note="31.2% in 2022" />
          <KpiCard label="Food insecurity" value="39.8" unit="%" period="Q1–Q3 2025 average" explain={{ indicator: "food" }} note="About 13.0 million people" />
          <KpiCard label="Maternal mortality ratio" value="301" unit="per 100,000 live births" period="2021 census" explain={{ indicator: "maternal" }} />
          <KpiCard label="Under-five mortality" value="40" unit="per 1,000 live births" period="2022 GDHS" explain={{ indicator: "underFive" }} note="80 in 2008" />
          <KpiCard label="Urban residents in slums" value="30.8" unit="%" period="2021 census" explain={{ indicator: "slums" }} />
        </KpiGrid>

        <SdgSummary />

        <SectionNav items={[{ id: "poverty-food", label: "Poverty and hunger" }, { id: "mortality", label: "Maternal and child health" }, { id: "cities", label: "Cities and coasts" }, { id: "institutions", label: "Institutions" }]} />

        <Section id="poverty-food" title="Human development and basic needs" description="Poverty fell steadily; hunger rose again in 2025 after three years of decline; mothers and young children are far more likely to survive than two decades ago." source="§8.1 · pp. 101–103">
          <Grid cols={2}><PovertyCard /><FoodInsecurityCard /></Grid>
          <div id="mortality" className="scroll-mt-16">
            <h3 className="mb-3 mt-8 text-[15px] font-semibold text-ink">Maternal health and child survival</h3>
            <Grid cols={2}><MaternalCard /><UnderFiveCard /></Grid>
            <Grid cols={2} className="mt-4 lg:mt-5"><InfantCard /><NeonatalCard /></Grid>
            <div className="mt-4 lg:mt-5"><ChildMortalityCard /></div>
          </div>
        </Section>

        <Section id="cities" title="Cities, environment and sustainability" description="Almost a third of urban residents live in slums or informal settlements; coastal plastic remains far above 2016 levels." source="§8.2 · pp. 103–105">
          <SlumsCard />
          <Grid cols="1-2" className="mt-4 lg:mt-5"><PlasticHeadlineCard /><PlasticCard /></Grid>
        </Section>

        <Section id="institutions" title="Institutions and inclusive decision-making" description="Bribery incidence fell, and more people feel heard by government. The two perception measures are governance context, not SDG indicators." source="Table 2.1, p. 10; pp. 92–93">
          <Grid cols={3}><GiftsGivenCard /><NoSayCard /><NoInfluenceCard /></Grid>
        </Section>
      </PageBody>
    </DashboardShell>
  );
}
