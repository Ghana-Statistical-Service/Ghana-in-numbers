import DashboardShell from "@/components/layout/DashboardShell";
import OverviewTopBar from "@/components/home/OverviewTopBar";
import LifeExpectancyChart from "@/components/population/LifeExpectancyChart";
import {
  AgeGroupCard, EmigrantDestinationsCard, EmigrantsAbroadCard, EmigrationReasonsCard, FertilityCard, HouseholdCard, ImmigrantsCard, IntercensalCard,
  InternalMigrationCard, LifeByAgeCard, MigrationFlowsCard, MigrationStats, NetMigrationCard, PopulationSizeCard, PyramidCard, RegionalCard, SexSplitCard, UrbanRuralCard,
} from "@/components/population/PopulationSections";
import { KpiCard, KpiGrid } from "@/components/ui/Card";
import { Grid, PageBody, PageHeader, Section, SectionNav } from "@/components/ui/Page";

const stack = "flex min-w-0 flex-col gap-4 lg:gap-5";

export default function PopulationAndSociety() {
  return (
    <DashboardShell>
      <OverviewTopBar page="Population and Society" regionalTarget="regional" />
      <PageBody>
        <PageHeader
          eyebrow="Chapter 3"
          title="Population and Society"
          description="How many people live in Ghana, how the population is changing in age, place and household, how long people live, and how they move between regions and abroad."
          meta={[{ label: "Sources", value: "2010 and 2021 PHC, 2021–2050 projections, GDHS" }, { label: "Latest", value: "2025 projection" }]}
        />

        <KpiGrid>
          <KpiCard label="Total population" value="33.7" unit="million" period="2025" qualifier="Projection" explain={{ label: "Total Population" }} note="30.8 million at the 2021 census" />
          <KpiCard label="Growth rate" value="2.1" unit="% a year" period="2010–2021" explain={{ label: "Growth Rate" }} note="2.7% in 1984–2000" />
          <KpiCard label="Life expectancy" value="65.1" unit="years" period="At birth, 2021" explain={{ label: "Life Expectancy" }} note="Women 66.8, men 63.3 years" />
          <KpiCard label="Urban population" value="58.7" unit="%" period="2025" qualifier="Projection" explain={{ label: "Urban Population" }} note="19.8 million people" />
          <KpiCard label="Fertility rate" value="3.9" unit="children per woman" period="2022 GDHS" explain={{ label: "Fertility Rate" }} note="6.4 in 1988" />
        </KpiGrid>

        <SectionNav items={[
          { id: "population-size", label: "Size and growth" }, { id: "composition", label: "Age and sex" }, { id: "urbanisation", label: "Urbanisation" },
          { id: "fertility-households", label: "Fertility and households" }, { id: "life-expectancy", label: "Life expectancy" }, { id: "migration", label: "Regions and migration" },
        ]} />

        <Section id="population-size" title="A growing population" description="Ghana adds between half a million and 700,000 people a year, though the growth rate has slowed." source="§3.1 · pp. 12–13">
          <Grid cols="3-2">
            <PopulationSizeCard />
            <IntercensalCard />
          </Grid>
        </Section>

        <Section id="composition" title="Population composition" description="A youthful population with a small female majority." source="§3.2 · pp. 14–15">
          <Grid cols={2}>
            <PyramidCard />
            <div className={stack}>
              <SexSplitCard />
              <AgeGroupCard />
            </div>
          </Grid>
        </Section>

        <Section id="urbanisation" title="Ghana is becoming more urbanised" description="Close to six in ten people are projected to live in towns and cities in 2025." source="§3.3 · pp. 16–17">
          <UrbanRuralCard />
        </Section>

        <Section id="fertility-households" title="Fertility and household size" description="Women are having fewer children, and households are getting smaller." source="§3.4–3.5 · pp. 19–20">
          <Grid cols={2}>
            <FertilityCard />
            <HouseholdCard />
          </Grid>
        </Section>

        <Section id="life-expectancy" title="Life expectancy" description="Ghanaians are living far longer than in 1960; women outlive men." source="§3.6 · pp. 21–22">
          <Grid cols={2}>
            <LifeExpectancyChart />
            <LifeByAgeCard />
          </Grid>
        </Section>

        <Section id="migration" title="Migration and population distribution" description="Where people live, which regions gain population through migration, and why Ghanaians move abroad. Migration compares region of birth with region of enumeration at each census." source="§3.3–3.4, §3.7–3.8 · pp. 16–26">
          <div id="regional" className="mb-4 scroll-mt-16 lg:mb-5"><RegionalCard /></div>
          <MigrationStats />
          <Grid cols={2}>
            <NetMigrationCard />
            <div className={stack}>
              <InternalMigrationCard />
              <EmigrantsAbroadCard />
            </div>
          </Grid>
          <Grid cols={2} className="mt-4 lg:mt-5">
            <div className={stack}>
              <ImmigrantsCard />
              <EmigrationReasonsCard />
            </div>
            <MigrationFlowsCard />
          </Grid>
          <div className="mt-4 lg:mt-5"><EmigrantDestinationsCard /></div>
        </Section>
      </PageBody>
    </DashboardShell>
  );
}
