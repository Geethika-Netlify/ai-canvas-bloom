import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { ParticleBackground } from "@/components/ParticleBackground";

const Index = () => {
  return (
    <div className="min-h-screen">
      <ParticleBackground />
      <Navbar />
      <main>
        <HeroSection />
        {/* Other sections will go here */}
      </main>
    </div>
  );
};

export default Index;
