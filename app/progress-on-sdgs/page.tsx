import DashboardShell from "@/components/layout/DashboardShell";
import { ChildMortalityCard, FoodInsecurityCard, InstitutionsCard, MaternalCard, PlasticCard, PovertyCard, SlumsCard } from "@/components/sdg/SdgSections";
import { KpiCard, KpiGrid } from "@/components/ui/Card";
import { Grid, PageBody, PageHeader, Section, SectionNav } from "@/components/ui/Page";

export default function ProgressOnSDGsPage() {
  return (
    <DashboardShell>
      <PageBody>
        <PageHeader
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

        <SectionNav items={[{ id: "poverty-food", label: "Poverty and hunger" }, { id: "mortality", label: "Maternal and child health" }, { id: "cities", label: "Cities and coasts" }, { id: "institutions", label: "Institutions" }]} />

        <Section id="poverty-food" title="Poverty and food insecurity" description="Poverty fell steadily; hunger rose again in 2025 after three years of decline." source="§8.1 · pp. 101–102">
          <Grid cols={2}><PovertyCard /><FoodInsecurityCard /></Grid>
        </Section>

        <Section id="mortality" title="Maternal and child mortality" description="Mothers and young children are far more likely to survive than two decades ago." source="§8.1 · pp. 102–103">
          <Grid cols={2}><MaternalCard /><ChildMortalityCard /></Grid>
        </Section>

        <Section id="cities" title="Sustainable cities and coasts" description="Almost a third of urban residents live in slums or informal settlements; coastal plastic remains far above 2016 levels." source="§8.2 · pp. 103–105">
          <Grid cols="3-2"><SlumsCard /><PlasticCard /></Grid>
        </Section>

        <Section id="institutions" title="Institutions and inclusive decision-making" description="Bribery incidence fell between 2024 and 2025." source="Table 2.1, p. 10; pp. 92–93">
          <InstitutionsCard />
        </Section>
      </PageBody>
    </DashboardShell>
  );
}
