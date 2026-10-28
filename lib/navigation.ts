import {
  BookOpen,
  GraduationCap,
  Landmark,
  LayoutDashboard,
  Leaf,
  Target,
  TrendingUp,
  Users,
  Users2,
  Wheat,
  type LucideIcon,
} from "lucide-react";

export type NavItem = { label: string; href: string; icon: LucideIcon; description: string };
export type NavGroup = { label?: string; items: NavItem[] };

// Labels follow the publication's chapter titles (Ghana in Numbers 2025, Table of Contents).
export const navGroups: NavGroup[] = [
  {
    items: [
      { label: "Overview", href: "/", icon: LayoutDashboard, description: "Ghana at a glance, 2025" },
    ],
  },
  {
    label: "Statistical topics",
    items: [
      { label: "Population and Society", href: "/population-and-society", icon: Users, description: "Size, composition, urbanisation, fertility, life expectancy and migration" },
      { label: "Social Development", href: "/social-development", icon: GraduationCap, description: "Learning, health, living conditions and protection" },
      { label: "Business and Economy", href: "/business-and-economy", icon: TrendingUp, description: "Output, prices, labour, enterprises, public finance, money and trade" },
      { label: "Governance", href: "/governance", icon: Landmark, description: "Women in leadership, accountability and public trust" },
      { label: "Environment and Climate", href: "/environment-and-climate-change", icon: Leaf, description: "Forest reserves, carbon, rainfall and temperature" },
      { label: "Progress on the SDGs", href: "/progress-on-sdgs", icon: Target, description: "Poverty, food security, mortality, slums and coastal plastics" },
    ],
  },
  {
    label: "Deep dives and impact stories",
    items: [
      { label: "Youth Bulge", href: "/youth-bulge", icon: Users2, description: "Youth population, unemployment, NEET and skills" },
      { label: "Agriculture, Forestry and Fishing", href: "/agriculture-forestry-fishing", icon: Wheat, description: "Public spending, crops, livestock, fish and young farm workers" },
      { label: "Data Impact Stories", href: "/data-story", icon: BookOpen, description: "Official statistics in use in districts and communities" },
    ],
  },
];

export const allNavItems = navGroups.flatMap(group => group.items);
