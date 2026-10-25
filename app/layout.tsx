import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AssistantProvider from "@/components/assistant/AssistantProvider";

// Inter is the closest open font to the statsghana.gov.gh stack ("Segoe UI", Inter, "Helvetica Neue").
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ghana in Numbers | Ghana Statistical Service",
  description: "Official statistics from Ghana in Numbers 2025: population, social development, the economy, governance, environment and the SDGs.",
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#241B5A",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" className={`${inter.variable} h-full antialiased`}>
      <body className="h-full overflow-hidden" suppressHydrationWarning>
        <AssistantProvider>{children}</AssistantProvider>
      </body>
    </html>
  );
}
