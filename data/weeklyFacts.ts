// "Did you know?" facts for the sidebar, one per week. Each figure is printed on the given page of
// Ghana in Numbers 2025 (printed pages) and scripts/check-report-data.mjs checks it against the chart data.
// `trend` says whether the change is progress ("better") or simply a change ("neutral"); it only sets the badge colour.
// Keep `label` under about 50 characters and `statement` under about 62 so each fits two lines of the 248 px card.

export type WeeklyFact = {
  id: string;
  icon: "heart" | "baby" | "zap" | "shield" | "hourglass" | "bird" | "gem" | "scale" | "users" | "fish" | "store" | "plane" | "building" | "coins";
  value: string;
  suffix?: string;
  label: string;
  change?: { text: string; spoken: string; trend: "better" | "neutral" };
  statement: string;
  page: string;
  href: string;
};

export const weeklyFacts: WeeklyFact[] = [
  { id: "maternal-mortality", icon: "heart", value: "301", label: "maternal deaths per 100,000 live births, 2021", change: { text: "−37.9%", spoken: "down 37.9% since 2010", trend: "better" },
    statement: "Down from 485 in 2010. Both figures are census counts.", page: "102", href: "/progress-on-sdgs" },
  { id: "under-five-mortality", icon: "baby", value: "40", label: "under-five deaths per 1,000 live births, 2022", change: { text: "−50.0%", spoken: "down 50.0% since 2008", trend: "better" },
    statement: "Halved from 80 per 1,000 in 2008.", page: "102", href: "/progress-on-sdgs" },
  { id: "electricity", icon: "zap", value: "86.3", suffix: "%", label: "of households had electricity in 2021", change: { text: "+42.5 pts", spoken: "up 42.5 percentage points since 2000", trend: "better" },
    statement: "Up from 43.8% in 2000 and 65.1% in 2010.", page: "35", href: "/social-development" },
  { id: "health-insurance", icon: "shield", value: "66.2", suffix: "%", label: "of the population had active NHIS cover, 2025", change: { text: "+36.2 pts", spoken: "up 36.2 percentage points since 2010", trend: "better" },
    statement: "More than double the 30.0% covered in 2010.", page: "31", href: "/social-development" },
  { id: "life-expectancy", icon: "hourglass", value: "65.1", suffix: "years", label: "life expectancy at birth, 2021", change: { text: "+24.8 yrs", spoken: "up 24.8 years since 1960", trend: "better" },
    statement: "A baby born in 1960 could expect 40.3 years.", page: "21", href: "/population-and-society" },
  { id: "poultry", icon: "bird", value: "90.8", suffix: "million", label: "poultry birds in Ghana, 2024", change: { text: "9.1×", spoken: "9.1 times the 1990 flock", trend: "neutral" },
    statement: "Up from 10.0 million in 1990, nine times more.", page: "48", href: "/agriculture-forestry-fishing" },
  { id: "gold-exports", icon: "gem", value: "62.9", suffix: "%", label: "of export earnings came from gold bullion, 2025",
    statement: "Cocoa beans add 8.6% and crude petroleum 8.3%.", page: "76", href: "/business-and-economy" },
  { id: "women-judges", icon: "scale", value: "48.8", suffix: "%", label: "of High Court judges were women, 2025", change: { text: "+28.8 pts", spoken: "up 28.8 percentage points since 2008", trend: "better" },
    statement: "Up from 20.0% in 2008. Court of Appeal: 39.0%.", page: "86", href: "/governance" },
  { id: "fertility", icon: "users", value: "3.9", suffix: "children", label: "born per woman over her lifetime, 2022", change: { text: "−39.1%", spoken: "down 39.1% since 1988", trend: "neutral" },
    statement: "Down from 6.4 children in 1988 and 4.2 in 2014.", page: "19", href: "/population-and-society" },
  { id: "fish-farming", icon: "fish", value: "124,428", suffix: "tonnes", label: "of tilapia and catfish farmed, 2025", change: { text: "3.8×", spoken: "3.8 times the 2013 harvest", trend: "better" },
    statement: "Up from 32,512 tonnes in 2013.", page: "46", href: "/agriculture-forestry-fishing" },
  { id: "businesses", icon: "store", value: "2.6", suffix: "million", label: "businesses counted in 2024 (IBES I)",
    statement: "2,644,363 in all; nine in ten establishments are micro.", page: "49", href: "/business-and-economy#enterprises" },
  { id: "emigrant-destinations", icon: "plane", value: "37.6", suffix: "%", label: "of Ghanaian emigrants live in Europe, 2021",
    statement: "Then the Americas (23.7%) and ECOWAS countries (23.3%).", page: "26", href: "/population-and-society" },
  { id: "accra-density", icon: "building", value: "1,681", label: "people per km² in Greater Accra, 2021", change: { text: "+36.1%", spoken: "up 36.1% since 2010", trend: "neutral" },
    statement: "Up from about 1,236 in 2010. Central is next at 291.", page: "16", href: "/population-and-society" },
  { id: "poverty", icon: "coins", value: "23.0", suffix: "%", label: "of people were multidimensionally poor in 2025", change: { text: "−8.2 pts", spoken: "down 8.2 percentage points since 2022", trend: "better" },
    statement: "Down from 31.2% in 2022. 2025 is the Q1 to Q3 average.", page: "97", href: "/progress-on-sdgs" },
];

/** Weeks start on Monday (UTC, which is Ghana time); the first fact ran in the week of 5 January 2026. */
export function factOfTheWeek(now = Date.now()) {
  const week = Math.floor((now - Date.UTC(2026, 0, 5)) / (7 * 24 * 60 * 60 * 1000));
  return ((week % weeklyFacts.length) + weeklyFacts.length) % weeklyFacts.length;
}
