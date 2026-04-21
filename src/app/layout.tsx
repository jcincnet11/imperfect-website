import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "IMPerfect — Puerto Rico's Premier Hero Shooter Team",
  description:
    "IMPerfect is Puerto Rico's top competitive hero shooter team competing in Overwatch 2 and Marvel Rivals. Join the community.",
  keywords: ["IMPerfect", "Puerto Rico esports", "PR gaming", "Overwatch 2", "Marvel Rivals", "hero shooter"],
  openGraph: {
    title: "IMPerfect Esports",
    description: "Puerto Rico's Premier Hero Shooter Team",
    type: "website",
    siteName: "IMPerfect Esports",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "IMPerfect Esports",
    description: "Puerto Rico's Premier Hero Shooter Team",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${barlow.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-dark text-white">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
