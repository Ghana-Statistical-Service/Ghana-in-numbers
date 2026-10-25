import Link from "next/link";
import DashboardShell from "@/components/layout/DashboardShell";
import { ReferenceSection, ReferenceTable } from "@/components/shared/ReferenceSection";

export default function DataStoriesPage() {
  return <DashboardShell><main className="flex-1 overflow-y-auto p-5 space-y-5" style={{ background: "#EEF1F6" }}>
    <div><h1 className="text-3xl font-bold text-slate-800">Data Stories: From Evidence to Action</h1><p className="text-sm text-slate-500 mt-1">Four accounts from Ghana in Numbers 2025, Chapter 10.</p></div>
    <ReferenceSection title="Clean Water Was 59 Minutes Away" source="Mangoase School, Ada West, p. 117">
      <p className="text-sm leading-relaxed text-slate-700">The October 2023 Water and Sanitation Report found that Ada West residents spent an average of 59 minutes a day collecting water. Stand-In-the-Gap used the findings to identify a community for support, followed by a January 2024 visit to Mangoase School. The response included a borehole, storage tanks and pipes, a classroom and waste bins. The 59-minute figure describes the district average, not the school’s measured collection time.</p>
    </ReferenceSection>
    <ReferenceSection title="Inspiring a New Generation of Data Users" source="StatsBank Hackathon, p. 118">
      <p className="text-sm leading-relaxed text-slate-700">Across two editions, students from 11 tertiary institutions used more than 350 million official data points. The initiative, organised by GSS and Statistics Denmark, encouraged practical analysis of employment, education, health and basic services. In 2023, one team created a dashboard to help identify district-level gaps in health and education facilities.</p>
    </ReferenceSection>
    <ReferenceSection title="Citizen Data and Disability Policy" source="DACF Support Survey, pp. 119–120">
      <p className="text-sm leading-relaxed text-slate-700">A citizen data survey gathered 7,361 valid responses across 10 districts in three ecological zones. Disability advocates used the findings in engagements on access to public support. The publication reports that the allocation for persons with disabilities rose from 3% to 5% in 2025, alongside plans for Disability Desks and greater participation.</p>
      <ReferenceTable headings={["Among survey respondents", "Share"]} rows={[["Aware of the DACF allocation", "55%"],["Had received support", "54%"],["Participated in allocation/spending discussions", "30%"],["Had no formal education", "37.5%"]]} />
      <p className="text-xs text-slate-500">These findings describe survey respondents in the covered districts; they are not national prevalence estimates.</p>
    </ReferenceSection>
    <ReferenceSection title="Afigya Kwabre North: Making Deprivation Visible" source="District MPI, pp. 121–122">
      <p className="text-sm leading-relaxed text-slate-700">The district Multidimensional Poverty Index released in June 2024 covered all 261 districts. In Afigya Kwabre North, lack of health insurance contributed nearly 23% of measured multidimensional poverty. The district responded with mobile NHIS registration teams in markets and community centres. The 23% is a contribution to the poverty measure, not the district’s poverty incidence or uninsured population share.</p>
    </ReferenceSection>
    <div className="rounded-xl bg-slate-800 text-white p-5"><h2 className="font-bold">Explore the Youth Bulge</h2><p className="text-sm text-slate-200 mt-2">The separate thematic deep dive examines youth population, unemployment, NEET, skills and participation in agriculture.</p><Link href="/youth-bulge" className="inline-block mt-3 underline text-sm">Read the youth deep dive →</Link></div>
  </main></DashboardShell>;
}
