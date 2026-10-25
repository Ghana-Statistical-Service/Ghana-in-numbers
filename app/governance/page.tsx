import { Gavel, Gift, Landmark, Megaphone, Vote } from "lucide-react";
import DashboardShell from "@/components/layout/DashboardShell";
import OverviewTopBar from "@/components/home/OverviewTopBar";
import { GiftRequestsCard, GiftsGivenCard, JudgesCard, NoInfluenceCard, NoSayCard, ParliamentCard, VoteKnowledge, VotingCard } from "@/components/governance/GovernanceSections";
import { KpiCard, KpiGrid } from "@/components/ui/Card";
import { Grid, PageBody, PageHeader, Section, SectionNav } from "@/components/ui/Page";

export default function GovernancePage() {
  return (
    <DashboardShell>
      <OverviewTopBar page="Governance" />
      <PageBody>
        <PageHeader
          eyebrow="Chapter 6"
          title="Governance"
          description="Women in Parliament and the courts, everyday experiences of corruption, whether citizens feel heard, and participation in elections."
          meta={[{ label: "Sources", value: "Parliamentary Service, Judicial Service, GSS Governance Series" }, { label: "Latest", value: "2025" }]}
        />

        <KpiGrid>
          <KpiCard icon={Landmark} label="Women in Parliament" value="14.9" unit="%" period="2025, 9th Parliament" explain={{ label: "Women in Parliament" }} note="8.5% in 1993 (1st Parliament)" />
          <KpiCard icon={Gavel} label="Women High Court judges" value="48.6" unit="%" period="2025" explain={{ label: "Women High Court Judges" }} note="Supreme Court 25.0%" />
          <KpiCard icon={Gift} label="Gifts to public officials" value="16.8" unit="%" period="2025" explain={{ label: "Gifts to Public Officials" }} note="18.4% in 2024" />
          <KpiCard icon={Vote} label="Right to vote knowledge" value="98.1" unit="%" period="2024, adults 18+" explain={{ label: "Right to Vote Knowledge" }} note="Know voting is a basic right" />
          <KpiCard icon={Megaphone} label="No say" value="29.7" unit="%" period="2025" explain={{ label: "No Say" }} note="42.4% in 2024" />
        </KpiGrid>

        <SectionNav items={[{ id: "women-leadership", label: "Women in leadership" }, { id: "accountability", label: "Accountability and trust" }, { id: "voice", label: "Inclusive decision-making" }, { id: "voting", label: "Voting" }]} />

        <Section id="women-leadership" accent="green" title="Women in leadership" description="Gradual gains in Parliament; strong representation in the lower courts, weakest at the top." source="§6.1 · pp. 90–91">
          <Grid cols={2}><ParliamentCard /><JudgesCard /></Grid>
        </Section>

        <Section id="accountability" accent="green" title="Accountability and public trust" description="Fewer people report giving gifts to officials, though requests for gifts rose in late 2025." source="§6.2 · p. 92">
          <Grid cols={2}><GiftRequestsCard /><GiftsGivenCard /></Grid>
        </Section>

        <Section id="voice" accent="green" title="Public perception on inclusive and responsive decision-making" description="More people feel heard: both measures fell by about 10 percentage points in a year." source="§6.2 · p. 93">
          <Grid cols={2}><NoSayCard /><NoInfluenceCard /></Grid>
        </Section>

        <Section id="voting" accent="green" title="Right to vote" description="Knowing the right and using it are separate measures." source="§6.2 · pp. 93–94">
          <Grid cols="1-2"><VoteKnowledge /><VotingCard /></Grid>
        </Section>
      </PageBody>
    </DashboardShell>
  );
}
