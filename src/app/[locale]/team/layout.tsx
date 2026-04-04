import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Roster — IMPerfect Esports",
  description:
    "Meet Puerto Rico's top competitive hero shooter roster. Overwatch 2 and Marvel Rivals players.",
  openGraph: {
    title: "The Roster — IMPerfect Esports",
    description:
      "Meet Puerto Rico's top competitive hero shooter roster. Overwatch 2 and Marvel Rivals players.",
    type: "website",
  },
  alternates: {
    canonical: "https://imperfect-sage.vercel.app/en/team",
    languages: {
      en: "https://imperfect-sage.vercel.app/en/team",
      es: "https://imperfect-sage.vercel.app/es/team",
    },
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
