import DashboardShell from "@/components/layout/DashboardShell";
import GovStatMessageModal from "@/components/home/GovStatMessageModal";
import OverviewTopBar from "@/components/home/OverviewTopBar";
import AtAGlance from "@/components/home/AtAGlance";
import ChoroplethMap from "@/components/home/ChoroplethMap";
import InflationSparkline from "@/components/home/InflationSparkline";
import GDPGrowthChart from "@/components/home/GDPGrowthChart";
import SectorBreakdown from "@/components/home/SectorBreakdown";
import WhatsChangedCard from "@/components/home/WhatsChangedCard";
import DataStoryCard from "@/components/home/DataStoryCard";
import TopicGrid from "@/components/home/TopicGrid";
import { Grid, Section } from "@/components/ui/Page";

export default function Home() {
  return (
    <>
      <GovStatMessageModal />
      <DashboardShell>
        <OverviewTopBar />

        {/* First screen: the original dense overview (commit 2593469 layout) with the redesign's content. */}
        <AtAGlance />

        {/* Below the fold: the detailed views added in the redesign. */}
        <div className="mx-auto w-full max-w-[1400px] border-t border-line px-4 pb-28 pt-10 sm:px-6 lg:px-8">
          <Section id="snapshot" title="National snapshot" description="The detailed views behind the overview: regional rankings, longer trends and the publication’s key findings.">
            <div id="regional-picture" className="scroll-mt-16"><ChoroplethMap /></div>
            <Grid cols={3} className="mt-4 lg:mt-5">
              <GDPGrowthChart />
              <InflationSparkline />
              <SectorBreakdown />
            </Grid>
            <Grid cols="2-1" className="mt-4 lg:mt-5">
              <WhatsChangedCard />
              <DataStoryCard />
            </Grid>
          </Section>

          <Section id="topics" title="Explore the statistics" description="Each topic follows a chapter of the publication.">
            <TopicGrid />
          </Section>
        </div>
      </DashboardShell>
    </>
  );
}
