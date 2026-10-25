import Link from "next/link";
import { ArrowRight } from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";
import GDPExpenditureVisual from "@/components/business-economy/GDPExpenditureVisual";
import { NominalGdpCard, OutputStats, PerCapitaCard, RealGdpCard } from "@/components/business-economy/OutputSections";
import { CpiCard, FoodLocalCard, IipCard, PbciCard, PpiCard } from "@/components/business-economy/PricesSections";
import { LabourStats, NeetCard, ParticipationCard, TourismCard, UnemploymentCard } from "@/components/business-economy/LabourTourismSections";
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
      <PageBody>
        <PageHeader
          eyebrow="Chapter 5"
          title="Business and Economy"
          description="The size and structure of the economy, prices, jobs, businesses, tourism, public finances, money and banking, and trade with the world and with Ghana’s neighbours."
          meta={[{ label: "Sources", value: "GSS national accounts, CPI, PPI, QLFS, IBES I, ICBT; MoF; Bank of Ghana" }, { label: "Latest", value: "2025 (GDP provisional)" }]}
        />

        <KpiGrid>
          <KpiCard label="Nominal GDP" value="1,434.1" unit="GH¢ billion" period="2025" qualifier="Provisional" explain={{ label: "Overall GDP" }} note="About GH¢1.4 trillion" />
          <KpiCard label="Real GDP growth" value="6.0" unit="%" period="2025" qualifier="Provisional" explain={{ label: "GDP Growth" }} />
          <KpiCard label="Consumer inflation" value="5.4" unit="%" period="Dec 2025, year on year" explain={{ label: "Consumer Inflation" }} note="Annual average 14.6%" />
          <KpiCard label="Overall fiscal balance" value="−1.0" unit="% of GDP" period="2025, commitment basis" explain={getGroupExplanation("fiscal", "Overall fiscal balance", [3])} note="−3.0% on the cash basis" />
          <KpiCard label="Goods trade balance" value="+148.3" unit="GH¢ billion" period="2025, current prices" explain={{ label: "Trade Surplus" }} note="Real (price-adjusted) balance −GH¢3.4bn" />
        </KpiGrid>

        <SectionNav items={[
          { id: "output", label: "Output" }, { id: "prices", label: "Prices" }, { id: "labour", label: "Labour" }, { id: "enterprises", label: "Enterprises" },
          { id: "tourism", label: "Tourism" }, { id: "fiscal", label: "Public finance" }, { id: "finance", label: "Money and banking" }, { id: "trade", label: "Trade" },
          { id: "informal-trade", label: "Informal trade" }, { id: "agriculture", label: "Agriculture" },
        ]} />

        <Section id="output" title="Size and structure of the economy" description="Nominal GDP measures value at today’s prices; real GDP removes price changes to show how much more was produced." source="§5.1 · pp. 36–39">
          <OutputStats />
          <Grid cols={2} className="mt-4 lg:mt-5"><NominalGdpCard /><RealGdpCard /></Grid>
          <Grid cols="3-2" className="mt-4 lg:mt-5"><PerCapitaCard /><SectorBreakdown withEstablishments /></Grid>
          <div className="mt-4 lg:mt-5"><GDPExpenditureVisual /></div>
        </Section>

        <Section id="prices" title="Prices and inflation" description="Consumer prices, building costs and producer prices are rising far more slowly than in 2022–2024." source="§5.4 · pp. 51–57">
          <CpiCard />
          <Grid cols={2} className="mt-4 lg:mt-5"><FoodLocalCard /><PbciCard /></Grid>
          <Grid cols={2} className="mt-4 lg:mt-5"><PpiCard /><IipCard /></Grid>
        </Section>

        <Section id="labour" title="Labour market" description="More people are working or looking for work, but youth unemployment remains high and most jobs are informal." source="§5.5 · pp. 58–59">
          <LabourStats />
          <Grid cols={3} className="mt-4 lg:mt-5"><ParticipationCard /><UnemploymentCard /><NeetCard /></Grid>
        </Section>

        <Section id="enterprises" title="Enterprises in Ghana" description="The first Integrated Business Establishment Survey counted businesses inside buildings, in open spaces and on the move." source="§5.3 · pp. 46–50">
          <EnterpriseGrid />
        </Section>

        <Section id="tourism" title="Tourism flow and expenditure" description="Most trips are domestic, but fewer than a million inbound visitors spent more than all domestic travellers." source="§5.6 · pp. 60, 70">
          <TourismCard />
        </Section>

        <Section id="fiscal" title="Government fiscal operations" description="The deficit narrowed sharply in 2025 and the primary balance turned to surplus, while capital spending fell." source="§5.7 · pp. 72–77">
          <FiscalSection />
        </Section>

        <Section id="finance" title="Monetary and financial sector" description="Inflation fell, interest rates followed, lending revived and reserves rose; credit stayed low relative to GDP and one in five cedis lent was not being repaid." source="§5.8 · pp. 77–80">
          <FinanceSection />
        </Section>

        <Section id="trade" title="Ghana in the global market" description="A record current-price goods surplus in 2025, built on gold." source="§5.9 · pp. 80–84">
          <MerchandiseTradeCard />
          <Grid cols={2} className="mt-4 lg:mt-5"><CommoditiesCard /><PartnersCard /></Grid>
        </Section>

        <Section id="informal-trade" title="Informal cross-border trade" description="Goods crossing land borders with Togo, Burkina Faso and Côte d’Ivoire without customs records." source="§5.10 · pp. 84–88">
          <InformalTradeSection />
        </Section>

        <Section id="agriculture" title="Agriculture" description="Spending, crops, livestock and fish are presented in full in the Agriculture, Forestry and Fishing deep dive." source="§5.2 · pp. 40–45">
          <Card className="grid gap-4 p-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
            <div className="grid gap-3 sm:grid-cols-3">
              <Stat label="Agriculture’s share of GDP" value="22.8" unit="%" context="2025, nominal" />
              <Stat label="Public spending on agriculture" value="≈0.2" unit="% of GDP" context="2024" />
              <Stat label="Agriculture Orientation Index" value="0.02" context="2022–2024 (below 1 = under-funded relative to GDP share)" />
            </div>
            <Link href="/agriculture-forestry-fishing" className="inline-flex h-11 items-center justify-center gap-2 rounded-[var(--radius-md)] bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-hover">Explore agriculture <ArrowRight size={16} aria-hidden /></Link>
          </Card>
        </Section>
      </PageBody>
    </DashboardShell>
  );
}
