import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Games — IMPerfect Esports",
  description:
    "Competing at the highest level in Overwatch 2 and Marvel Rivals. Three active rosters.",
  openGraph: {
    title: "Our Games — IMPerfect Esports",
    description:
      "Competing at the highest level in Overwatch 2 and Marvel Rivals. Three active rosters.",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
