import GDPExpenditureVisual from "./GDPExpenditureVisual";
import { ReferenceSection } from "@/components/shared/ReferenceSection";
import { EnterpriseVisual, FiscalVisual } from "./EnterpriseFiscalVisuals";
import FinanceVisual from "./FinanceVisual";
import { InformalTradeVisual, AgricultureReferenceVisual } from "./TradeAgricultureVisuals";

export default function ReportAdditions() {
  return <div className="space-y-5">
    <ReferenceSection guide="expenditure" id="expenditure" title="GDP by Expenditure, 2025" source="Table 5.1, p. 39">
      <p className="text-sm text-slate-600">Domestic demand grew 8.9%, led by household consumption. Imports grew faster than exports in volume terms. Nominal spending and real output measure different things; real values use 2013 prices.</p>
      <GDPExpenditureVisual />
      <p className="text-xs text-slate-500">Consumption and investment are components of domestic demand; the indented concepts in the publication overlap and should not be added again. NPISH means non-profit institutions serving households.</p>
    </ReferenceSection>
    <ReferenceSection guide="enterprises" id="enterprises" title="Enterprises in Ghana, 2024" source="IBES I, Tables 5.4–5.7, pp. 46–50">
      <EnterpriseVisual />
      <p className="text-sm text-slate-600">Establishments engaged 6.90 million people. Only 7.7% were formal and 37.2% used digital finance. Women held 50.9% of positions; 64.0% of persons engaged were paid. Establishment counts rose from 638,235 in 2014 to 1,867,690 in 2024, with wider coverage in the later census.</p>
      <p className="text-sm text-slate-600">Women owned 84.0% of open-space businesses and operated 77.5% of mobile businesses. The census counted 2,087 mobile traders aged 10–14. Mobile businesses were counted on one day and may be understated; persons engaged include unpaid workers.</p>
    </ReferenceSection>
    <ReferenceSection guide="fiscal" id="fiscal" title="Government Fiscal Operations" source="Ministry of Finance, Tables 5.9a–b, pp. 72–76">
      <p className="text-sm text-slate-600">The commitment-basis overall deficit narrowed from 6.9% of GDP in 2024 to 1.0% in 2025. The primary balance moved from a 2.9% deficit to a 2.5% surplus. Capital expenditure fell to 1.4% of GDP.</p>
      <FiscalVisual />
      <p className="text-xs text-slate-500">Commitment spending records obligations incurred; cash spending records payments made, including settlement of earlier arrears. Primary balances exclude interest. Negative balances are deficits. Published totals may differ from arithmetic on rounded components.</p>
    </ReferenceSection>
    <ReferenceSection guide="finance" id="finance" title="Monetary and Financial Indicators" source="Bank of Ghana, Table 5.10, pp. 77–79">
      <p className="text-sm text-slate-600">Real credit expanded by 13.1% in 2025, but private-sector credit remained 7.4% of GDP. Non-performing loans fell to 18.9% of loans. Stronger bank balance sheets and lower interest rates should be read alongside these remaining constraints.</p>
      <FinanceVisual />
    </ReferenceSection>
    <ReferenceSection guide="informalTrade" id="informal-trade" title="Informal Cross-Border Trade" source="ICBT Survey, Table 5.11, pp. 84–88">
      <p className="text-sm text-slate-600">Informal trade with Togo, Burkina Faso and Côte d’Ivoire totalled GH¢38.40 billion from October 2024 to September 2025, with a GH¢1.72 billion surplus. It represented 5.6% of combined formal and informal trade, and exceeded formal trade with those three neighbours.</p>
      <InformalTradeVisual />
      <p className="text-xs text-slate-500">The survey covered 321 border points and observed daytime crossings. Night trade, hawked food and illegal goods were excluded. Published rounded quarterly components may not reconcile exactly; this period differs from calendar-year 2025 merchandise trade.</p>
    </ReferenceSection>
    <ReferenceSection guide="agriculture" id="agriculture-reference" title="Agriculture: Investment, Production and Livestock" source="Table 5.2 and Figures 5.6–5.8, pp. 40–45">
      <AgricultureReferenceVisual />
      <p className="text-xs text-slate-500">The Agriculture Orientation Index divides agriculture’s share of government expenditure by its share of GDP. It is not agriculture’s spending as a share of GDP. Fish production series contain small revisions: the reported aquaculture total (124,161 tonnes) differs from the tilapia/catfish species total (124,428 tonnes).</p>
    </ReferenceSection>
  </div>;
}
