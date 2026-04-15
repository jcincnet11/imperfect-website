import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partner With Us — IMPerfect Esports",
  description:
    "Sponsor Puerto Rico's #1 hero shooter org. Partnership tiers and opportunities.",
  openGraph: {
    title: "Partner With Us — IMPerfect Esports",
    description:
      "Sponsor Puerto Rico's #1 hero shooter org. Partnership tiers and opportunities.",
    type: "website",
  },
  alternates: {
    canonical: "https://imperfectgg.com/en/sponsorship",
    languages: {
      en: "https://imperfectgg.com/en/sponsorship",
      es: "https://imperfectgg.com/es/sponsorship",
    },
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
