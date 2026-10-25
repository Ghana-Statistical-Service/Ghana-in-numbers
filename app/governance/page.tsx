import DashboardShell from "@/components/layout/DashboardShell";
import { GiftsCard, JudgesCard, ParliamentCard, VoiceCard, VoteKnowledge, VotingCard } from "@/components/governance/GovernanceSections";
import { KpiCard, KpiGrid } from "@/components/ui/Card";
import { Grid, PageBody, PageHeader, Section, SectionNav } from "@/components/ui/Page";

export default function GovernancePage() {
  return (
    <DashboardShell>
      <PageBody>
        <PageHeader
          eyebrow="Chapter 6"
          title="Governance"
          description="Women in Parliament and the courts, everyday experiences of corruption, whether citizens feel heard, and participation in elections."
          meta={[{ label: "Sources", value: "Parliamentary Service, Judicial Service, GSS Governance Series" }, { label: "Latest", value: "2025" }]}
        />

        <KpiGrid>
          <KpiCard label="Women in Parliament" value="14.9" unit="%" period="2025, 9th Parliament" explain={{ label: "Women in Parliament" }} />
          <KpiCard label="Women High Court judges" value="48.6" unit="%" period="2025" explain={{ label: "Women High Court Judges" }} note="Supreme Court 25.0%" />
          <KpiCard label="Gave a gift to an official" value="16.8" unit="%" period="2025" explain={{ label: "Gifts to Public Officials" }} note="18.4% in 2024" />
          <KpiCard label="Feel they have no say" value="29.7" unit="%" period="2025" explain={{ label: "No Say" }} note="42.4% in 2024" />
          <KpiCard label="Know voting is a right" value="98.1" unit="%" period="2024, adults 18+" explain={{ label: "Right to Vote Knowledge" }} />
        </KpiGrid>

        <SectionNav items={[{ id: "women-leadership", label: "Women in leadership" }, { id: "accountability", label: "Accountability and trust" }, { id: "voting", label: "Voting" }]} />

        <Section id="women-leadership" title="Women in leadership" description="Gradual gains in Parliament; strong representation in the lower courts, weakest at the top." source="§6.1 · pp. 90–91">
          <Grid cols={2}><ParliamentCard /><JudgesCard /></Grid>
        </Section>

        <Section id="accountability" title="Accountability and public trust" description="Fewer people report giving gifts to officials, and more feel heard, though requests for gifts rose in late 2025." source="§6.2 · pp. 92–93">
          <Grid cols="3-2"><GiftsCard /><VoiceCard /></Grid>
        </Section>

        <Section id="voting" title="Right to vote" description="Knowing the right and using it are separate measures." source="§6.2 · pp. 93–94">
          <Grid cols="1-2"><VoteKnowledge /><VotingCard /></Grid>
        </Section>
      </PageBody>
    </DashboardShell>
  );
}
