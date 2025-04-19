
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ExpertiseSection } from "@/components/ExpertiseSection";
import { ParticleBackground } from "@/components/ParticleBackground";

const Index = () => {
  return (
    <div className="min-h-screen">
      <ParticleBackground />
      <Navbar />
      <main>
        <HeroSection />
        <ExpertiseSection />
      </main>
    </div>
  );
};

export default Index;
