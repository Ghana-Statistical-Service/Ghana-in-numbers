import DashboardShell from "@/components/layout/DashboardShell";
import { CarbonCard, CarbonChangeCard, ForestCard, ForestShareCard, RainfallCard, TemperatureCard } from "@/components/environment/EnvironmentSections";
import { KpiCard, KpiGrid } from "@/components/ui/Card";
import { Grid, PageBody, PageHeader, Section, SectionNav } from "@/components/ui/Page";

export default function EnvironmentAndClimateChangePage() {
  return (
    <DashboardShell>
      <PageBody>
        <PageHeader
          eyebrow="Chapter 7"
          title="Environment and Climate Change"
          description="Where Ghana’s forest reserves are, how much carbon its land stores and how that stock changed, and the 2025 pattern of rainfall and temperature."
          meta={[{ label: "Sources", value: "Forestry Commission, EPA–GSS–FC ecosystem accounts, GMet" }, { label: "Latest", value: "December 2025 (forests); 2021 (carbon)" }]}
        />

        <KpiGrid>
          <KpiCard label="Reported forest reserve area" value="24,133.53" unit="km²" period="Dec 2025, 12 regions" explain={{ label: "Forest Reserve Area" }} />
          <KpiCard label="Total carbon stock" value="1,147.6" unit="Mt C" period="2021" explain={{ indicator: "carbon" }} note="1,367.5 Mt C in 2015" />
          <KpiCard label="Grassland carbon" value="344.0" unit="Mt C" period="2021" explain={{ label: "Grassland Carbon" }} note="Largest store of any land cover" />
          <KpiCard label="Wettest month" value="216.7" unit="mm" period="June 2025" explain={{ label: "Peak Rainfall" }} note="Monthly average 99.3 mm" />
          <KpiCard label="Warmest month" value="30.4" unit="°C" period="March 2025" explain={{ label: "Peak Temperature" }} note="Monthly average 28.2°C" />
        </KpiGrid>

        <SectionNav items={[{ id: "forests", label: "Forest reserves" }, { id: "carbon", label: "Carbon" }, { id: "climate", label: "Rainfall and temperature" }]} />

        <Section id="forests" title="Forest reserves" description="Three regions hold about 60% of the reported reserve area." source="§7.1 · p. 96">
          <Grid cols="2-1"><ForestCard /><ForestShareCard /></Grid>
        </Section>

        <Section id="carbon" title="Carbon retention" description="Vegetation and soils hold carbon that would otherwise reach the atmosphere; the stock fell between 2015 and 2021." source="§7.2 · p. 97">
          <Grid cols={2}><CarbonCard /><CarbonChangeCard /></Grid>
        </Section>

        <Section id="climate" title="Rainfall and temperature" description="Two rainfall peaks and a narrow temperature range shape the farming calendar." source="§7.3–7.4 · pp. 98–99">
          <Grid cols={2}><RainfallCard /><TemperatureCard /></Grid>
        </Section>
      </PageBody>
    </DashboardShell>
  );
}
