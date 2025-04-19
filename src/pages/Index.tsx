
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { CoreCompetenciesSection } from "@/components/CoreCompetenciesSection";
import { ExpertiseSection } from "@/components/ExpertiseSection";
import { ParticleBackground } from "@/components/ParticleBackground";

const Index = () => {
  return (
    <div className="min-h-screen">
      <ParticleBackground />
      <Navbar />
      <main>
        <HeroSection />
        <CoreCompetenciesSection />
        <ExpertiseSection />
      </main>
    </div>
  );
};

export default Index;
