import Hero from "@/components/sections/Hero";
import MarqueeTicker from "@/components/sections/MarqueeTicker";
import StatsBar from "@/components/sections/StatsBar";
import GamesSection from "@/components/sections/GamesSection";
import AboutSection from "@/components/sections/AboutSection";
import RosterTeaser from "@/components/sections/RosterTeaser";
import CommunitySection from "@/components/sections/CommunitySection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <MarqueeTicker />
      <StatsBar />
      <GamesSection />
      <AboutSection />
      <RosterTeaser />
      <CommunitySection />
    </>
  );
}
