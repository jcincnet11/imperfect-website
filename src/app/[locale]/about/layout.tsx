import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — IMPerfect Esports",
  description:
    "Built in Puerto Rico. IMPerfect's story, values, and 6-month roadmap.",
  openGraph: {
    title: "About — IMPerfect Esports",
    description:
      "Built in Puerto Rico. IMPerfect's story, values, and 6-month roadmap.",
    type: "website",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
