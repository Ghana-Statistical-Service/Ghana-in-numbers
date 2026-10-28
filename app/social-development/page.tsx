import { BookOpen, House, Lightbulb, School, ShieldPlus } from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";
import OverviewTopBar from "@/components/home/OverviewTopBar";
import {
  ChildMarriageCard, ChildMarriageRegionsCard, CompletionCard, ElectricityCard, EnrolmentCard, HealthInsuranceCard, HousingCard, LearningGlanceCard, NhisHeadlineCard, TeachersCard,
  TeenageMotherhoodCard, ToiletCard, ViolenceCard, WaterCard,
} from "@/components/social-development/SocialSections";
import { KpiCard, KpiGrid } from "@/components/ui/Card";
import { Grid, PageBody, PageHeader, Section, SectionNav } from "@/components/ui/Page";
import { enrolmentRateData, healthInsuranceCoverageData, housingDeficitData, electricityAccessData } from "@/data/socialDevelopmentData";

export default function SocialDevelopmentPage() {
  const enrol = enrolmentRateData.at(-1)!, prevEnrol = enrolmentRateData.at(-2)!;
  const nhis = healthInsuranceCoverageData.at(-1)!, housing = housingDeficitData.at(-1)!, power = electricityAccessData.at(-1)!;
  return (
    <DashboardShell>
      <OverviewTopBar page="Social Development" />
      <PageBody>
        <PageHeader
          eyebrow="Chapter 4"
          title="Social Development"
          description="Schooling, health insurance and adolescent health, housing and basic services, and protection from violence and child marriage."
          meta={[{ label: "Sources", value: "EMIS, NHIA, GDHS, PHC 2010 and 2021" }, { label: "Latest", value: "2025 (NHIS); 2023/24 (education)" }]}
        />

        <KpiGrid>
          <KpiCard icon={BookOpen} label="Primary NER" value={enrol.primaryNet.toFixed(1)} unit="%" period={enrol.year} explain={{ label: "Primary NER" }} note={`Net enrolment; ${prevEnrol.primaryNet.toFixed(1)}% in ${prevEnrol.year}`} />
          <KpiCard icon={School} label="JHS GER" value={enrol.jhsGross.toFixed(1)} unit="%" period={enrol.year} explain={{ label: "JHS GER" }} note={`Gross enrolment; ${prevEnrol.jhsGross.toFixed(1)}% in ${prevEnrol.year}`} />
          <KpiCard icon={ShieldPlus} label="Health insurance" value={nhis.value.toFixed(1)} unit="%" period={nhis.year} explain={{ label: "Health Insurance" }} note="Active NHIS membership" />
          <KpiCard icon={House} label="Housing deficit" value={housing.deficit.toFixed(2)} unit="million units" period={housing.year} qualifier="Estimate" explain={{ label: "Housing Deficit" }} note="2.8 million in 2010" />
          <KpiCard icon={Lightbulb} label="Electricity access" value={power.value.toFixed(1)} unit="%" period={`${power.year} census`} explain={{ label: "Electricity Access" }} note="Households with access" />
        </KpiGrid>

        <SectionNav items={[{ id: "learning", label: "Learning" }, { id: "health", label: "Health" }, { id: "living-conditions", label: "Living conditions" }, { id: "protection", label: "Inclusion and protection" }]} />

        <Section id="learning" accent="green" title="Learning and opportunity" description="Getting children into primary school is no longer the main difficulty; keeping them in school afterwards is." source="§4.1 · pp. 29–30">
          <LearningGlanceCard />
          <Grid cols={2} className="mt-4 lg:mt-5">
            <EnrolmentCard />
            <CompletionCard />
          </Grid>
          <div className="mt-4 lg:mt-5"><TeachersCard /></div>
        </Section>

        <Section id="health" accent="green" title="Health and well-being" description="Insurance coverage more than doubled since 2010; teenage motherhood remains far higher in rural areas." source="§4.2 · pp. 31–33">
          <Grid cols="1-2">
            <NhisHeadlineCard />
            <HealthInsuranceCard />
          </Grid>
          <div className="mt-4 lg:mt-5"><TeenageMotherhoodCard /></div>
        </Section>

        <Section id="living-conditions" accent="green" title="Living conditions" description="More homes and better basic services, with remaining gaps in electricity and sanitation." source="§4.3 · pp. 34–35">
          <Grid cols={2}>
            <HousingCard />
            <ElectricityCard />
          </Grid>
          <Grid cols={2} className="mt-4 lg:mt-5">
            <WaterCard />
            <ToiletCard />
          </Grid>
        </Section>

        <Section id="protection" accent="green" title="Inclusion and protection" description="Reported violence and child marriage fell, but neither has ended." source="§4.2.1, §4.4 · pp. 33, 36">
          <Grid cols="3-2">
            <ViolenceCard />
            <ChildMarriageCard />
          </Grid>
          <div className="mt-4 lg:mt-5"><ChildMarriageRegionsCard /></div>
        </Section>
      </PageBody>
    </DashboardShell>
  );
}
