import Link from "next/link";
import DashboardShell from "@/components/layout/DashboardShell";
import { CropsCard, FishQuantityCard, FishValueCard, LivestockCard, SpendingCard, TilapiaCard, YouthAgricultureCard } from "@/components/agriculture/AgricultureSections";
import { KpiCard, KpiGrid } from "@/components/ui/Card";
import { Grid, PageBody, PageHeader, Section, SectionNav } from "@/components/ui/Page";
import { getGroupExplanation } from "@/data/cardExplanationContent";

export default function AgricultureForestryFishingPage() {
  return (
    <DashboardShell>
      <PageBody>
        <PageHeader
          eyebrow="Thematic deep dive · §5.2 and Chapter 9"
          title="Agriculture, Forestry and Fishing"
          description="Farming feeds the country and keeps growing, yet receives little public spending, and fewer young people are working in it. Forest reserves are covered under Environment and Climate."
          meta={[{ label: "Sources", value: "CAGD, SRID/MoFA, Ministry of Fisheries, PHC 2010 and 2021" }, { label: "Latest", value: "2025 (fish); 2024 (crops, livestock)" }]}
        />

        <KpiGrid>
          <KpiCard label="Agriculture’s share of GDP" value="22.8" unit="%" period="2025" explain={{ indicator: "sector" }} />
          <KpiCard label="Agriculture Orientation Index" value="0.02" period="2022–2024" explain={getGroupExplanation("agriculture", "Agriculture Orientation Index", [3])} note="1.0 = spending proportionate to GDP share" />
          <KpiCard label="Cassava output" value="28.5" unit="million tonnes" period="2024" qualifier="Provisional" explain={{ indicator: "crops" }} note="16.0 million in 2013" />
          <KpiCard label="Fish production" value="722,648" unit="tonnes" period="2025" explain={{ indicator: "fish" }} note="Value GH¢20.44 billion" />
          <KpiCard label="Youth aged 15–35 in agriculture" value="1.22" unit="million" period="2021 census" explain={{ indicator: "youthAgriculture" }} note="2.03 million in 2010" />
        </KpiGrid>

        <SectionNav items={[{ id: "spending", label: "Public spending" }, { id: "crops", label: "Crops" }, { id: "livestock", label: "Livestock" }, { id: "fish", label: "Fisheries" }, { id: "youth-agriculture", label: "Young farm workers" }]} />

        <Section id="spending" title="Government spending on agriculture" description="Less than one cedi in every hundred government spends goes to a sector producing about a fifth of GDP." source="§5.2 · pp. 40–41">
          <SpendingCard />
        </Section>

        <Section id="crops" title="Crop production" description="Output of every major crop grew between 2013 and 2024." source="§5.2 · p. 44">
          <CropsCard />
        </Section>

        <Section id="livestock" title="Livestock" description="Livestock numbers have grown across the board since 1990." source="§5.2 · pp. 44–45">
          <LivestockCard />
        </Section>

        <Section id="fish" title="Fisheries and aquaculture" description="The sea is still the largest source, but fish farming is growing fastest." source="§5.2 · pp. 42–43">
          <FishValueCard />
          <Grid cols={2} className="mt-4 lg:mt-5"><FishQuantityCard /><TilapiaCard /></Grid>
        </Section>

        <Section id="youth-agriculture" title="Young people in agriculture" description="Fewer young people farm, and those who do are increasingly male." source="Chapter 9 · pp. 114–115">
          <YouthAgricultureCard />
        </Section>

        <p className="mt-10 text-xs text-subtle">Forest reserves and carbon stocks: <Link href="/environment-and-climate-change#forests" className="font-medium text-brand underline-offset-2 hover:underline">Environment and Climate</Link>. Food insecurity: <Link href="/progress-on-sdgs#poverty-food" className="font-medium text-brand underline-offset-2 hover:underline">Progress on the SDGs</Link>.</p>
      </PageBody>
    </DashboardShell>
  );
}
