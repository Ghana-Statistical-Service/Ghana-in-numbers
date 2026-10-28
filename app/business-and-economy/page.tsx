import Link from "next/link";
import { ArrowRight, Building, Landmark, Percent, Ship, Store } from "lucide-react";
import OverviewTopBar from "@/components/home/OverviewTopBar";
import { CropProductionCard, FishProductionCard } from "@/components/business-economy/AgricultureIcons";
import DashboardShell from "@/components/layout/DashboardShell";
import GDPExpenditureVisual from "@/components/business-economy/GDPExpenditureVisual";
import { EconomyGlanceCard, NominalGdpCard, OutputStats, PerCapitaCard, RealGdpCard } from "@/components/business-economy/OutputSections";
import { CpiCard, FoodLocalCard, IipCard, PbciCard, PpiCard } from "@/components/business-economy/PricesSections";
import { LabourGlance, LabourStats, NeetCard, ParticipationCard, TourismCard, UnemploymentCard } from "@/components/business-economy/LabourTourismSections";
import { EnterpriseGrid } from "@/components/business-economy/EnterpriseSections";
import { FinanceSection, FiscalSection } from "@/components/business-economy/FiscalFinanceSections";
import { CommoditiesCard, InformalTradeSection, MerchandiseTradeCard, PartnersCard } from "@/components/business-economy/TradeSections";
import SectorBreakdown from "@/components/home/SectorBreakdown";
import { Card, KpiCard, KpiGrid, Stat } from "@/components/ui/Card";
import { Grid, PageBody, PageHeader, Section, SectionNav } from "@/components/ui/Page";
import { getGroupExplanation } from "@/data/cardExplanationContent";

export default function BusinessAndEconomyPage() {
  return (
    <DashboardShell>
      <OverviewTopBar page="Business and Economy" />
      <PageBody>
        <PageHeader
          eyebrow="Chapter 5"
          title="Business and Economy"
          description="The size and structure of the economy, prices, jobs, businesses, tourism, public finances, money and banking, and trade with the world and with Ghana’s neighbours."
          meta={[{ label: "Sources", value: "GSS national accounts, CPI, PPI, QLFS, IBES I, ICBT; MoF; Bank of Ghana" }, { label: "Latest", value: "2025 (GDP provisional)" }]}
        />

        <KpiGrid>
          <KpiCard icon={Landmark} label="Overall GDP" value="1,434.1" unit="GH¢ billion" period="2025, nominal" qualifier="Provisional" explain={{ label: "Overall GDP" }} note="About GH¢1.4 trillion" />
          <KpiCard icon={Building} label="Real GDP" value="209.6" unit="GH¢ billion" period="2025, 2013 prices" qualifier="Provisional" explain={{ label: "Real GDP" }} note="Growth 6.0% (provisional)" />
          <KpiCard icon={Ship} label="Trade surplus" value="+148.3" unit="GH¢ billion" period="2025, goods, current prices" explain={{ label: "Trade Surplus" }} note="Real (price-adjusted) balance −GH¢3.4bn" />
          <KpiCard icon={Percent} label="Inflation" value="14.6" unit="%" period="2025 annual average" explain={{ label: "Consumer Inflation" }} note="December 2025, year on year: 5.4% (the overview figure)" />
          <KpiCard icon={Store} label="Businesses" value="2.64" unit="million" period="2024 IBES I census" explain={{ label: "Businesses" }} note="2,644,363 counted" />
        </KpiGrid>

        <div className="-mt-6 mb-10"><EconomyGlanceCard /></div>

        <SectionNav items={[
          { id: "output", label: "Output" }, { id: "prices", label: "Prices" }, { id: "labour", label: "Labour" }, { id: "enterprises", label: "Enterprises" },
          { id: "tourism", label: "Tourism" }, { id: "fiscal", label: "Public finance" }, { id: "finance", label: "Money and banking" }, { id: "trade", label: "Trade" },
          { id: "informal-trade", label: "Informal trade" }, { id: "agriculture", label: "Agriculture" },
        ]} />

        <Section id="output" accent="green" title="Size and structure of the economy" description="Nominal GDP measures value at today’s prices; real GDP removes price changes to show how much more was produced." source="§5.1 · pp. 40–43">
          <OutputStats />
          <Grid cols={2} className="mt-4 lg:mt-5"><NominalGdpCard /><RealGdpCard /></Grid>
          <Grid cols="3-2" className="mt-4 lg:mt-5"><PerCapitaCard /><SectorBreakdown withEstablishments /></Grid>
          <div className="mt-4 lg:mt-5"><GDPExpenditureVisual /></div>
        </Section>

        <Section id="prices" accent="green" title="Prices and inflation" description="Consumer prices, building costs and producer prices are rising far more slowly than in 2022–2024." source="§5.4 · pp. 54–59">
          <CpiCard />
          <Grid cols={2} className="mt-4 lg:mt-5"><FoodLocalCard /><PbciCard /></Grid>
          <div className="mt-4 lg:mt-5"><PpiCard /></div>
          <div className="mt-4 lg:mt-5"><IipCard /></div>
        </Section>

        <Section id="labour" accent="green" title="Labour market" description="More people are working or looking for work, but youth unemployment remains high and most jobs are informal." source="§5.5 · pp. 60–61">
          <LabourGlance />
          <LabourStats />
          <Grid cols={2} className="mt-4 lg:mt-5"><ParticipationCard /><NeetCard /></Grid>
          <div className="mt-4 lg:mt-5"><UnemploymentCard /></div>
        </Section>

        <Section id="enterprises" accent="green" title="Enterprises in Ghana" description="The first Integrated Business Establishment Survey counted businesses inside buildings, in open spaces and on the move." source="§5.3 · pp. 49–53">
          <EnterpriseGrid />
        </Section>

        <Section id="tourism" accent="green" title="Tourism flow and expenditure" description="Most trips are domestic, but fewer than a million inbound visitors spent more than all domestic travellers." source="§5.6 · pp. 62–63">
          <TourismCard />
        </Section>

        <Section id="fiscal" accent="green" title="Government fiscal operations" description="The deficit narrowed sharply in 2025 and the primary balance turned to surplus, while capital spending fell." source="§5.7 · pp. 64–70">
          <FiscalSection />
        </Section>

        <Section id="finance" accent="green" title="Monetary and financial sector" description="Inflation fell, interest rates followed, lending revived and reserves rose; credit stayed low relative to GDP and one in five cedis lent was not being repaid." source="§5.8 · pp. 70–73">
          <FinanceSection />
        </Section>

        <Section id="trade" accent="green" title="Ghana in the global market" description="A record current-price goods surplus in 2025, built on gold." source="§5.9 · pp. 73–78">
          <MerchandiseTradeCard />
          <Grid cols={2} className="mt-4 lg:mt-5"><CommoditiesCard /><PartnersCard /></Grid>
        </Section>

        <Section id="informal-trade" accent="green" title="Informal cross-border trade" description="Goods crossing land borders with Togo, Burkina Faso and Côte d’Ivoire without customs records." source="§5.10 · pp. 78–83">
          <InformalTradeSection />
        </Section>

        <Section id="agriculture" accent="green" title="Agriculture" description="Fish and crop output grew strongly; spending, livestock and the full crop series are in the Agriculture, Forestry and Fishing deep dive." source="§5.2 · pp. 44–48">
          <div className="mb-4 lg:mb-5"><FishProductionCard /></div>
          <div className="mb-4 lg:mb-5"><CropProductionCard /></div>
          <Card className="grid gap-4 p-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
            <div className="grid gap-3 sm:grid-cols-3">
              <Stat label="Agriculture’s share of GDP" value="22.8" unit="%" context="2025, nominal" />
              <Stat label="Public spending on agriculture" value="0.2" unit="% of GDP" context="2024, approximate" />
              <Stat label="Agriculture Orientation Index" value="0.02" context="2022–2024 (below 1 = under-funded relative to GDP share)" />
            </div>
            <Link href="/agriculture-forestry-fishing" className="inline-flex h-11 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-hover">Explore agriculture <ArrowRight size={16} aria-hidden /></Link>
          </Card>
        </Section>
      </PageBody>
    </DashboardShell>
  );
}
