
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { CoreCompetenciesSection } from "@/components/CoreCompetenciesSection";
import { ParticleBackground } from "@/components/ParticleBackground";

const Index = () => {
  return (
    <div className="min-h-screen">
      <ParticleBackground />
      <Navbar />
      <main>
        <HeroSection />
        <CoreCompetenciesSection />
      </main>
    </div>
  );
};

export default Index;
