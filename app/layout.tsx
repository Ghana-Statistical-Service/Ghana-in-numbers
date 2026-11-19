import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AssistantProvider from "@/components/assistant/AssistantProvider";

// Inter is the closest open font to the statsghana.gov.gh stack ("Segoe UI", Inter, "Helvetica Neue").
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ghana in Numbers | Ghana Statistical Service",
  description: "Official statistics from Ghana in Numbers 2025: population, social development, the economy, governance, environment and the SDGs.",
  // Icons and the link-preview image come from app/favicon.ico, app/icon.png, app/apple-icon.png and
  // app/opengraph-image.png (the GSS seal). metadataBase makes their addresses absolute for link previews.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "https://ghana-in-numbers.vercel.app")),
  applicationName: "Ghana in Numbers",
  openGraph: { siteName: "Ghana in Numbers", type: "website", locale: "en_GB" },
  twitter: { card: "summary_large_image" },
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
